import type { RequestHandler } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../lib/errors.js';

const addSchema = z.object({
  destinationSlug: z.string().min(1),
  note: z.string().max(300).optional(),
});

export const getWishlist: RequestHandler = async (req, res, next) => {
  try {
    const items = await prisma.wishlistEntry.findMany({
      where: { userId: req.userId! },
      include: {
        destination: {
          select: {
            slug: true, name: true, country: true,
            imageThumbUrl: true, imageAlt: true,
            region: true, budgetLevel: true, climateType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    // Return flat destination objects with entry id
    res.json(items.map((item) => ({
      entryId: item.id,
      ...item.destination,
      note: item.note,
      savedAt: item.createdAt,
    })));
  } catch (e) { next(e); }
};

// POST /wishlist — body { destinationSlug }
export const addToWishlist: RequestHandler = async (req, res, next) => {
  try {
    const { destinationSlug, note } = addSchema.parse(req.body);
    const dest = await prisma.destination.findUnique({
      where: { slug: destinationSlug },
      select: { id: true },
    });
    if (!dest) throw new AppError(404, 'NOT_FOUND', 'Destination not found');
    const existing = await prisma.wishlistEntry.findFirst({
      where: { userId: req.userId!, destinationId: dest.id },
    });
    if (existing) throw new AppError(409, 'ALREADY_SAVED', 'Already in your wishlist');
    const entry = await prisma.wishlistEntry.create({
      data: { userId: req.userId!, destinationId: dest.id, note: note ?? null },
    });
    res.status(201).json(entry);
  } catch (e) { next(e); }
};

// POST /wishlist/:destinationSlug — URL param (used by WishlistButton)
export const addToWishlistBySlug: RequestHandler = async (req, res, next) => {
  try {
    const { destinationSlug } = req.params as { destinationSlug: string };
    const dest = await prisma.destination.findUnique({
      where: { slug: destinationSlug },
      select: { id: true },
    });
    if (!dest) throw new AppError(404, 'NOT_FOUND', 'Destination not found');
    const existing = await prisma.wishlistEntry.findFirst({
      where: { userId: req.userId!, destinationId: dest.id },
    });
    if (existing) throw new AppError(409, 'ALREADY_SAVED', 'Already in your wishlist');
    const entry = await prisma.wishlistEntry.create({
      data: { userId: req.userId!, destinationId: dest.id, note: null },
    });
    res.status(201).json(entry);
  } catch (e) { next(e); }
};

export const removeFromWishlist: RequestHandler = async (req, res, next) => {
  try {
    const { destinationSlug } = req.params as { destinationSlug: string };
    const dest = await prisma.destination.findUnique({
      where: { slug: destinationSlug },
      select: { id: true },
    });
    if (!dest) throw new AppError(404, 'NOT_FOUND', 'Destination not found');
    const { count } = await prisma.wishlistEntry.deleteMany({
      where: { userId: req.userId!, destinationId: dest.id },
    });
    if (!count) throw new AppError(404, 'NOT_FOUND', 'Not in your wishlist');
    res.status(204).end();
  } catch (e) { next(e); }
};
