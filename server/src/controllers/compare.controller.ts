import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

export const compareDestinations: RequestHandler = async (req, res, next) => {
  try {
    const { slugs } = (req as any).validatedQuery as { slugs: string };
    const slugList = slugs.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4);
    if (slugList.length < 2) throw new AppError(400, 'VALIDATION_ERROR', 'At least 2 destinations required');
    const destinations = await prisma.destination.findMany({
      where: { slug: { in: slugList } },
      select: {
        slug: true, name: true, country: true, budgetLevel: true,
        climateType: true, foodScore: true, safetyNote: true, safetySource: true,
        travelStyles: true, bestSeason: true, currencyCode: true,
      },
    });
    res.json({ destinations, dimensions: ['budget', 'climate', 'food', 'safety', 'travelStyle', 'bestSeason', 'currency'] });
  } catch (e) { next(e); }
};
