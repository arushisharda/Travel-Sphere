import type { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

const tryParseJson = (s: string | null | undefined) => {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return s; }
};

const createSchema = z.object({
  destinationSlug: z.string().min(1).max(100).optional(), // optional — free-text cities won't match a DB record
  title: z.string().trim().min(1).max(100),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  durationDays: z.number().int().min(1).max(60),
  notes: z.string().max(500).optional(),
  preferences: z.record(z.unknown()).optional(),
  draft: z.unknown().optional(),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['DRAFT', 'PLANNED', 'COMPLETED']).optional(),
});

const itemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(400).optional(),
  timeBlock: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  dayNumber: z.number().int().min(1),
  orderIndex: z.number().int().min(0).optional(),
  category: z.enum(['food', 'sight', 'culture', 'transport', 'rest', 'activity']).optional(),
  estimatedCost: z.number().min(0).nullable().optional(),
  currencyCode: z.string().length(3).nullable().optional(),
  caveat: z.string().max(200).nullable().optional(),
});

export const listTrips: RequestHandler = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.userId! },
      include: { destination: { select: { slug: true, name: true, country: true, imageThumbUrl: true } } },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(trips.map((t) => ({ ...t, preferences: tryParseJson(t.preferences), draft: t.draft ? tryParseJson(t.draft as string) : null })));
  } catch (e) { next(e); }
};

export const createTrip: RequestHandler = async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);

    // Try to find destination by slug — if not found, pick any fallback destination
    let destinationId: string;
    if (body.destinationSlug) {
      const dest = await prisma.destination.findUnique({
        where: { slug: body.destinationSlug },
        select: { id: true },
      });
      if (dest) {
        destinationId = dest.id;
      } else {
        // Slug doesn't match (free-text city) — use first destination as placeholder
        const fallback = await prisma.destination.findFirst({ select: { id: true } });
        if (!fallback) throw new AppError(500, 'NO_DESTINATIONS', 'No destinations available');
        destinationId = fallback.id;
      }
    } else {
      // No slug — use first destination as placeholder
      const fallback = await prisma.destination.findFirst({ select: { id: true } });
      if (!fallback) throw new AppError(500, 'NO_DESTINATIONS', 'No destinations available');
      destinationId = fallback.id;
    }

    const trip = await prisma.trip.create({
      data: {
        userId: req.userId!,
        destinationId,
        title: body.title,
        startDate: body.startDate ?? null,
        endDate: body.endDate ?? null,
        durationDays: body.durationDays,
        notes: body.notes ?? null,
        preferences: JSON.stringify(body.preferences ?? {}),
        draft: body.draft ? JSON.stringify(body.draft) : null,
      },
      include: { destination: true, items: true },
    });
    res.status(201).json(trip);
  } catch (e) { next(e); }
};

export const getTrip: RequestHandler = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: { id: String(req.params['id']), userId: req.userId! },
      include: {
        destination: true,
        items: { orderBy: [{ dayNumber: 'asc' }, { orderIndex: 'asc' }] },
      },
    });
    if (!trip) throw new AppError(404, 'NOT_FOUND', 'Trip not found');
    // Parse JSON fields
    const parsed = {
      ...trip,
      preferences: tryParseJson(trip.preferences),
      draft: trip.draft ? tryParseJson(trip.draft as string) : null,
    };
    res.json(parsed);
  } catch (e) { next(e); }
};

export const updateTrip: RequestHandler = async (req, res, next) => {
  try {
    const body = updateSchema.parse(req.body);
    const existing = await prisma.trip.findFirst({ where: { id: String(req.params['id']), userId: req.userId! } });
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Trip not found');
    const trip = await prisma.trip.update({ where: { id: String(req.params['id']) }, data: body });
    res.json(trip);
  } catch (e) { next(e); }
};

export const deleteTrip: RequestHandler = async (req, res, next) => {
  try {
    const existing = await prisma.trip.findFirst({ where: { id: String(req.params['id']), userId: req.userId! } });
    if (!existing) throw new AppError(404, 'NOT_FOUND', 'Trip not found');
    await prisma.trip.delete({ where: { id: String(req.params['id']) } });
    res.status(204).end();
  } catch (e) { next(e); }
};

export const addItem: RequestHandler = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: String(req.params['id']), userId: req.userId! } });
    if (!trip) throw new AppError(404, 'NOT_FOUND', 'Trip not found');
    const body = itemSchema.parse(req.body);
    const item = await prisma.itineraryItem.create({ data: { tripId: trip.id, ...body, orderIndex: body.orderIndex ?? 0 } });
    res.status(201).json(item);
  } catch (e) { next(e); }
};

export const updateItem: RequestHandler = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: String(req.params['id']), userId: req.userId! } });
    if (!trip) throw new AppError(404, 'NOT_FOUND', 'Trip not found');
    const item = await prisma.itineraryItem.findFirst({ where: { id: String(req.params['itemId']), tripId: trip.id } });
    if (!item) throw new AppError(404, 'NOT_FOUND', 'Item not found');
    const body = itemSchema.partial().parse(req.body);
    const updated = await prisma.itineraryItem.update({ where: { id: item.id }, data: { ...body, isUserEdited: true } });
    res.json(updated);
  } catch (e) { next(e); }
};

export const deleteItem: RequestHandler = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findFirst({ where: { id: String(req.params['id']), userId: req.userId! } });
    if (!trip) throw new AppError(404, 'NOT_FOUND', 'Trip not found');
    const item = await prisma.itineraryItem.findFirst({ where: { id: String(req.params['itemId']), tripId: trip.id } });
    if (!item) throw new AppError(404, 'NOT_FOUND', 'Item not found');
    await prisma.itineraryItem.delete({ where: { id: item.id } });
    res.status(204).end();
  } catch (e) { next(e); }
};

export const regenerateDay: RequestHandler = async (req, res, next) => {
  try {
    // Placeholder — will wire to itinerary service after Nemotron integration
    res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Day regeneration coming soon' } });
  } catch (e) { next(e); }
};
