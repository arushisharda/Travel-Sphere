import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

type ListQuery = {
  q?: string; country?: string; style?: string;
  budget?: number; climate?: string; page: number; limit: number;
};

/** Convert comma-string travelStyles to string[] */
const parseStyles = (s: string | null | undefined): string[] =>
  s ? s.split(',').map((x) => x.trim()).filter(Boolean) : [];

/** Normalize a destination object for the API response */
const normalize = (d: any) => ({
  ...d,
  travelStyles: Array.isArray(d.travelStyles)
    ? d.travelStyles
    : parseStyles(d.travelStyles),
});

export const listDestinations: RequestHandler = async (req, res, next) => {
  try {
    const q = (req as any).validatedQuery as ListQuery;
    const where: any = {};
    if (q.q) where.OR = [{ name: { contains: q.q } }, { country: { contains: q.q } }];
    if (q.country) where.country = { contains: q.country };
    if (q.style) where.travelStyles = { contains: q.style };
    if (q.budget) where.budgetLevel = q.budget;
    if (q.climate) where.climateType = { contains: q.climate, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        select: {
          id: true, slug: true, name: true, country: true, region: true,
          summary: true, imageUrl: true, imageThumbUrl: true, imageAlt: true,
          imageCredit: true, currencyCode: true, bestSeason: true,
          budgetLevel: true, climateType: true, foodScore: true, travelStyles: true,
        },
        orderBy: { name: 'asc' },
        skip: (q.page - 1) * q.limit,
        take: q.limit,
      }),
      prisma.destination.count({ where }),
    ]);

    res.json({ items: items.map(normalize), page: q.page, limit: q.limit, total });
  } catch (e) { next(e); }
};

export const getDestination: RequestHandler = async (req, res, next) => {
  try {
    const dest = await prisma.destination.findUnique({
      where: { slug: String(req.params['slug']) },
      include: {
        cultureEntries: { orderBy: { topic: 'asc' } },
        _count: { select: { cultureEntries: true } },
      },
    });
    if (!dest) throw new AppError(404, 'NOT_FOUND', 'Destination not found');
    res.json(normalize(dest));
  } catch (e) { next(e); }
};

export const getMapDestinations: RequestHandler = async (_req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      select: { slug: true, name: true, country: true, latitude: true, longitude: true },
    });
    res.json(destinations);
  } catch (e) { next(e); }
};
