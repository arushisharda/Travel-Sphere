import { z } from 'zod';

export const travelPreferenceSchema = z.object({
  climate: z.enum(['temperate', 'tropical', 'arid', 'alpine', 'mediterranean']).optional(),
  budgetLevel: z.number().int().min(1).max(5).optional(),
  pace: z.enum(['relaxed', 'balanced', 'packed']).optional(),
  interests: z.array(z.string().trim().max(40)).max(10).default([]),
  foodPrefs: z.string().trim().max(200).optional(),
});

export type TravelPreferenceInput = z.infer<typeof travelPreferenceSchema>;
