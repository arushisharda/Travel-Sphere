import { z } from 'zod';

export const plannerInputSchema = z.object({
  // Either a known destination slug OR a free-text city+country
  destinationSlug: z.string().min(1).max(100).optional(),
  city: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(100).optional(),
  durationDays: z.number().int().min(1).max(14),
  startDate: z.coerce.date().optional(),
  interests: z
    .array(z.enum(['culture', 'food', 'adventure', 'relaxation', 'nightlife', 'nature', 'shopping', 'history']))
    .max(8)
    .default([]),
  pace: z.enum(['relaxed', 'balanced', 'packed']).default('balanced'),
  budgetLevel: z.number().int().min(1).max(5).optional(),
  budgetCurrency: z.enum(['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']).default('USD'),
  dietaryPreferences: z.array(z.string().trim().max(40)).max(5).default([]),
  notes: z.string().trim().max(300).optional(),
});

export const activitySchema = z.object({
  timeBlock: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  title: z.string().min(1).max(200),
  description: z.string().max(600).default(''),
  category: z.enum(['food', 'sight', 'culture', 'transport', 'rest', 'activity']).default('activity'),
  estimatedCost: z.number().min(0).max(1000000).nullable().default(null),
  currencyCode: z.string().max(5).nullable().default(null),
  caveat: z.string().max(400).nullable().default(null),
});

export const itineraryDraftSchema = z.object({
  summary: z.string().max(1000).default(''),
  days: z
    .array(
      z.object({
        dayNumber: z.number().int().min(1),
        theme: z.string().max(200).default(''),
        activities: z.array(activitySchema).min(1).max(10),
      }),
    )
    .min(1)
    .max(14),
  foodSuggestions: z.array(z.string().max(300)).max(15).default([]),
  culturalTips: z.array(z.string().max(400)).max(12).default([]),
  assumptions: z.array(z.string().max(400)).max(10).default([]),
});

export type PlannerInput = z.infer<typeof plannerInputSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type ItineraryDraft = z.infer<typeof itineraryDraftSchema>;
