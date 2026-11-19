import type { RequestHandler } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

export const getCultureEntries: RequestHandler = async (req, res, next) => {
  try {
    const { destinationSlug } = req.params as { destinationSlug: string };
    const { topic } = (req as any).validatedQuery as { topic?: string };
    const dest = await prisma.destination.findUnique({ where: { slug: destinationSlug }, select: { id: true } });
    if (!dest) throw new AppError(404, 'NOT_FOUND', 'Destination not found');
    const entries = await prisma.cultureEntry.findMany({
      where: { destinationId: dest.id, ...(topic ? { topic: topic.toUpperCase() } : {}) },
      orderBy: { topic: 'asc' },
    });
    res.json(entries);
  } catch (e) { next(e); }
};
