import type { RequestHandler } from 'express';
import OpenAI from 'openai';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
import { itineraryDraftSchema } from '@travelsphere/shared';
import type { PlannerInput } from '@travelsphere/shared';
import { prisma } from '../lib/prisma.js';

const nemotron = new OpenAI({
  apiKey: env.NVIDIA_API_KEY,
  baseURL: env.NVIDIA_BASE_URL,
  timeout: env.AI_TIMEOUT_MS,
  maxRetries: 0,
});

function stripReasoning(s: string) {
  return s.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

function extractJson(s: string): unknown {
  const cleaned = s.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { return null; }
}

/**
 * Resolve destination name & country.
 * Priority: DB lookup by slug → free-text city/country from request body.
 */
async function resolveDestination(input: PlannerInput): Promise<{ name: string; country: string }> {
  // Try DB lookup first if slug is given
  if (input.destinationSlug) {
    const dest = await prisma.destination.findUnique({
      where: { slug: input.destinationSlug },
      select: { name: true, country: true },
    });
    if (dest) return dest;
  }

  // Free-text city + country
  if (input.city) {
    return { name: input.city.trim(), country: (input.country ?? '').trim() || 'Unknown' };
  }

  // If slug was given but not found in DB, try to parse it into city/country
  if (input.destinationSlug) {
    const parts = input.destinationSlug.replace(/-/g, ' ').split(/\s+/);
    // e.g. "san-francisco-usa" → name: "san francisco", country: "usa"
    return { name: input.destinationSlug.replace(/-/g, ' '), country: '' };
  }

  throw new AppError(400, 'MISSING_DESTINATION', 'Provide either a destination slug, or a city and country name.');
}

function buildPrompt(input: PlannerInput, destName: string, destCountry: string) {
  const budgetLabel = ['', 'budget/backpacker', 'budget-moderate', 'moderate', 'moderate-luxury', 'luxury'][input.budgetLevel ?? 3];
  const locationStr = destCountry ? `${destName}, ${destCountry}` : destName;

  const system = `You are a travel itinerary writer. Output ONLY a valid JSON object — no commentary, no markdown fences, no extra text before or after.

The JSON must exactly match this TypeScript type:
{
  "summary": string,
  "days": Array<{
    "dayNumber": number,
    "theme": string,
    "activities": Array<{
      "timeBlock": "MORNING" | "AFTERNOON" | "EVENING",
      "title": string,
      "description": string,
      "category": "food" | "sight" | "culture" | "transport" | "rest" | "activity",
      "estimatedCost": number | null,
      "currencyCode": string | null,
      "caveat": string | null
    }>
  }>,
  "foodSuggestions": string[],
  "culturalTips": string[],
  "assumptions": string[]
}

Rules:
- Plan exactly ${input.durationDays} day(s) for ${locationStr}.
- Each day must have exactly 3 activities: one MORNING, one AFTERNOON, one EVENING.
- Budget: ${budgetLabel} (${input.budgetCurrency}).
- Pace: ${input.pace} (relaxed=fewer activities, packed=more).
- Costs are rough estimates in ${input.budgetCurrency}. Use null if unknown.
- Always add a caveat like "Verify opening hours before visiting" for attractions.
- Never fabricate specific prices as exact quotes.
- Use real places, real restaurants, real attractions that actually exist in ${locationStr}.
- Output only the JSON object. Start your response with { and end with }.`;

  const user = `Destination: ${locationStr}
Duration: ${input.durationDays} day(s)
Interests: ${input.interests.join(', ') || 'general sightseeing'}
Dietary preferences: ${input.dietaryPreferences?.join(', ') || 'none specified'}
Notes: ${input.notes?.slice(0, 200) || 'none'}

Write the itinerary JSON now:`;

  return { system, user };
}

export const draftItinerary: RequestHandler = async (req, res, next) => {
  try {
    const input = req.body as PlannerInput;

    // Resolve destination — works with DB slug OR free-text city/country
    const dest = await resolveDestination(input);

    const { system, user } = buildPrompt(input, dest.name, dest.country);

    let raw = '';
    try {
      const response = await nemotron.chat.completions.create({
        model: env.NVIDIA_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.5,
        top_p: 0.9,
        max_tokens: env.AI_MAX_OUTPUT_TOKENS,
        stream: false,
      });

      const msg = response.choices[0]?.message;
      raw = msg?.content
        ?? (msg as unknown as { reasoning_content?: string })?.reasoning_content
        ?? '';
    } catch (e: any) {
      if (e?.status === 429) {
        throw new AppError(429, 'RATE_LIMITED', 'The itinerary service is busy. Please try again in a minute.');
      }
      if (e?.name === 'APIConnectionTimeoutError' || e?.code === 'ETIMEDOUT' || e?.status === 408) {
        throw new AppError(504, 'UPSTREAM_TIMEOUT', 'The itinerary took too long to draft. Please try again.');
      }
      throw new AppError(502, 'UPSTREAM_ERROR', `Itinerary service unavailable: ${e?.message ?? 'unknown error'}. Please try again.`);
    }

    if (!raw || raw.trim().length < 20) {
      throw new AppError(502, 'UPSTREAM_EMPTY', 'The model returned an empty response. Please try again.');
    }

    const json = extractJson(stripReasoning(raw));
    if (!json) {
      throw new AppError(502, 'UPSTREAM_BAD_DATA', 'Could not parse the itinerary. Please try again.');
    }

    const parsed = itineraryDraftSchema.safeParse(json);
    if (!parsed.success) {
      console.error('Itinerary schema mismatch:', JSON.stringify(parsed.error.flatten().fieldErrors));
      throw new AppError(502, 'UPSTREAM_BAD_DATA', 'The draft came back in an unexpected form. Please try again.');
    }

    const draft = { ...parsed.data, days: parsed.data.days.slice(0, input.durationDays) };

    res.json({
      draft,
      meta: {
        destination: `${dest.name}${dest.country ? ', ' + dest.country : ''}`,
        model: env.NVIDIA_MODEL,
        draftedAt: new Date().toISOString(),
        isDrafted: true,
        disclaimer: 'Drafted automatically from your answers. Please confirm opening hours, prices and local rules before you rely on it.',
      },
    });
  } catch (e) { next(e); }
};
