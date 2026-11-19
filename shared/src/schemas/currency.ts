import { z } from 'zod';

export const SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const convertQuerySchema = z.object({
  amount: z.coerce.number().finite().positive().max(1_000_000_000),
  from: z.enum(SUPPORTED_CURRENCIES),
  to: z.enum(SUPPORTED_CURRENCIES),
});

export type ConvertQuery = z.infer<typeof convertQuerySchema>;
