import { z } from 'zod';

export const tripCreateSchema = z.object({
  destinationSlug: z.string().min(1).max(100),
  title: z.string().trim().min(1).max(100),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  durationDays: z.number().int().min(1).max(60),
  preferences: z.record(z.unknown()).optional(),
});

export const tripUpdateSchema = z.object({
  title: z.string().trim().min(1).max(100).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(['DRAFT', 'PLANNED', 'COMPLETED']).optional(),
});

export type TripCreateInput = z.infer<typeof tripCreateSchema>;
export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
