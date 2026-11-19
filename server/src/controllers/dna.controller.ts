import type { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const prefSchema = z.object({
  climate: z.enum(['temperate', 'tropical', 'arid', 'alpine', 'mediterranean']).optional().nullable(),
  budgetLevel: z.number().int().min(1).max(5).optional().nullable(),
  pace: z.enum(['relaxed', 'balanced', 'packed']).optional().nullable(),
  interests: z.array(z.string().trim().max(40)).max(10).default([]),
  foodPrefs: z.string().trim().max(200).optional().nullable(),
});

export const getPreferences: RequestHandler = async (req, res, next) => {
  try {
    const prefs = await prisma.travelPreference.findUnique({ where: { userId: req.userId! } });
    if (!prefs) return res.json(null);
    // Parse interests back to array for frontend
    res.json({
      ...prefs,
      interests: prefs.interests ? prefs.interests.split(',').filter(Boolean) : [],
    });
  } catch (e) { next(e); }
};

export const updatePreferences: RequestHandler = async (req, res, next) => {
  try {
    const body = prefSchema.parse(req.body);
    const data = {
      climate: body.climate ?? null,
      budgetLevel: body.budgetLevel ?? null,
      pace: body.pace ?? null,
      interests: (body.interests ?? []).join(','),
      foodPrefs: body.foodPrefs ?? null,
    };
    const prefs = await prisma.travelPreference.upsert({
      where: { userId: req.userId! },
      update: data,
      create: { userId: req.userId!, ...data },
    });
    res.json({
      ...prefs,
      interests: prefs.interests ? prefs.interests.split(',').filter(Boolean) : [],
    });
  } catch (e) { next(e); }
};

export const resetPreferences: RequestHandler = async (req, res, next) => {
  try {
    await prisma.travelPreference.deleteMany({ where: { userId: req.userId! } });
    res.status(204).end();
  } catch (e) { next(e); }
};

export const getSuggestions: RequestHandler = async (req, res, next) => {
  try {
    const prefs = await prisma.travelPreference.findUnique({ where: { userId: req.userId! } });
    const destinations = await prisma.destination.findMany({
      select: {
        id: true, slug: true, name: true, country: true, region: true,
        imageThumbUrl: true, imageUrl: true, imageAlt: true,
        climateType: true, budgetLevel: true, travelStyles: true,
        summary: true, bestSeason: true, currencyCode: true,
      },
    });
    const wishlist = await prisma.wishlistEntry.findMany({
      where: { userId: req.userId! },
      include: { destination: { select: { country: true } } },
    });
    const wishlistCountries = new Set(wishlist.map((w) => w.destination.country));

    const userInterests = new Set(
      (prefs?.interests ?? '').split(',').filter(Boolean).map((i) => i.toLowerCase())
    );

    const scored = destinations.map((d) => {
      let score = 0;
      const reasons: string[] = [];

      if (prefs?.climate && d.climateType) {
        const match = d.climateType.toLowerCase() === prefs.climate.toLowerCase();
        if (match) { score += 25; reasons.push(`${prefs.climate} climate`); }
      }
      if (prefs?.budgetLevel != null && d.budgetLevel != null) {
        const diff = Math.abs(d.budgetLevel - prefs.budgetLevel);
        const pts = diff === 0 ? 25 : diff === 1 ? 15 : diff === 2 ? 5 : 0;
        score += pts;
        if (diff <= 1) reasons.push('Fits your budget');
      }
      if (userInterests.size > 0) {
        const destStyles = new Set(
          d.travelStyles.split(',').filter(Boolean).map((s) => s.toLowerCase())
        );
        const overlap = [...userInterests].filter((x) => destStyles.has(x));
        const pts = Math.round((overlap.length / userInterests.size) * 35);
        score += pts;
        if (overlap.length > 0) reasons.push(`Good for ${overlap.slice(0, 2).join(', ')}`);
      }
      if (wishlistCountries.has(d.country)) { score += 15; reasons.push('Similar to your wishlist'); }

      return {
        destination: { ...d, travelStyles: d.travelStyles.split(',').filter(Boolean) },
        score,
        reasons,
      };
    });

    const limit = Math.min(parseInt((req.query['limit'] as string) ?? '8'), 20);
    const top = scored.sort((a, b) => b.score - a.score).slice(0, limit);
    res.json(top);
  } catch (e) { next(e); }
};
