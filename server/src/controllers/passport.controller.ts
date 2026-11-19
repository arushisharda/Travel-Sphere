import type { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

const addSchema = z.object({
  // Accept both slug and direct id approaches
  destinationSlug: z.string().optional(),
  destinationId: z.string().optional(),
  // Accept both label formats
  stampLabel: z.string().min(1).max(100).optional(),
  // Accept both note field names
  note: z.string().max(300).optional(),
  notes: z.string().max(300).optional(),
  // Accept visitedAt (frontend) or stampedOn (direct)
  visitedAt: z.string().optional(),
  tripId: z.string().optional(),
});

export const getPassport: RequestHandler = async (req, res, next) => {
  try {
    const entries = await prisma.passportEntry.findMany({
      where: { userId: req.userId! },
      include: { destination: { select: { slug: true, name: true, country: true } } },
      orderBy: { stampedOn: 'desc' },
    });
    // Map stampedOn → visitedAt so frontend works with either field name
    res.json(entries.map((e) => ({
      ...e,
      visitedAt: e.stampedOn,
      destination: e.destination ?? null,
    })));
  } catch (e) { next(e); }
};

export const addStamp: RequestHandler = async (req, res, next) => {
  try {
    const body = addSchema.parse(req.body);

    let destinationId: string | null = null;
    let destName = '';

    // Resolve destination
    if (body.destinationId) {
      const dest = await prisma.destination.findUnique({
        where: { id: body.destinationId },
        select: { id: true, name: true },
      });
      if (dest) { destinationId = dest.id; destName = dest.name; }
    } else if (body.destinationSlug) {
      const dest = await prisma.destination.findUnique({
        where: { slug: body.destinationSlug },
        select: { id: true, name: true },
      });
      if (!dest) throw new AppError(404, 'NOT_FOUND', 'Destination not found');
      destinationId = dest.id;
      destName = dest.name;
    }

    // Auto-generate stamp label if not provided
    const stampLabel = body.stampLabel
      ?? (destName ? `Visited ${destName}` : 'Passport Stamp');

    // Handle visitedAt → stampedOn
    const stampedOn = body.visitedAt
      ? new Date(body.visitedAt)
      : new Date();

    // Handle both note field names
    const note = body.note ?? body.notes ?? null;

    const entry = await prisma.passportEntry.create({
      data: {
        userId: req.userId!,
        destinationId,
        tripId: body.tripId ?? null,
        stampLabel,
        stampedOn,
        note,
      },
      include: { destination: { select: { slug: true, name: true, country: true } } },
    });

    res.status(201).json({ ...entry, visitedAt: entry.stampedOn });
  } catch (e) { next(e); }
};

export const removeStamp: RequestHandler = async (req, res, next) => {
  try {
    const entry = await prisma.passportEntry.findFirst({
      where: { id: String(req.params['id']), userId: req.userId! },
    });
    if (!entry) throw new AppError(404, 'NOT_FOUND', 'Passport entry not found');
    await prisma.passportEntry.delete({ where: { id: entry.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};
