import { z } from 'zod';
import { getJson } from '../lib/httpClient.js';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';
import { SUPPORTED_CURRENCIES } from '@travelsphere/shared';
import type { RequestHandler } from 'express';
import type { Currency } from '@travelsphere/shared';

const frankfurterSchema = z.object({
  amount: z.number(),
  base: z.string(),
  date: z.string(),
  rates: z.record(z.number()),
});

const rateCache = new Map<string, { data: z.infer<typeof frankfurterSchema>; expiry: number }>();

function todayISO() { return new Date().toISOString().split('T')[0]!; }
function round2(n: number) { return Math.round(n * 100) / 100; }

async function convert(amount: number, from: Currency, to: Currency) {
  if (from === to) {
    return { amount, from, to, rate: 1, converted: amount, rateDate: todayISO(), source: 'direct', isEstimate: true };
  }
  const cacheKey = `${from}-${to}`;
  const cached = rateCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    const rate = cached.data.rates[to];
    if (!rate || !Number.isFinite(rate)) throw new AppError(502, 'UPSTREAM_BAD_DATA', 'Exchange rate unavailable');
    return { amount, from, to, rate, converted: round2(amount * rate), rateDate: cached.data.date, source: 'Frankfurter', isEstimate: true };
  }
  const url = `${env.EXCHANGE_RATE_BASE_URL}/latest?base=${from}&symbols=${to}`;
  const data = await getJson(url, frankfurterSchema);
  const rate = data.rates[to];
  if (!rate || !Number.isFinite(rate)) throw new AppError(502, 'UPSTREAM_BAD_DATA', 'Exchange rate unavailable');
  rateCache.set(cacheKey, { data, expiry: Date.now() + 60 * 60 * 1000 });
  return { amount, from, to, rate, converted: round2(amount * rate), rateDate: data.date, source: 'Frankfurter', isEstimate: true };
}

export const convertCurrency: RequestHandler = async (req, res, next) => {
  try {
    const q = (req as any).validatedQuery as { amount: number; from: Currency; to: Currency };
    const result = await convert(q.amount, q.from, q.to);
    res.json(result);
  } catch (e) { next(e); }
};

export const getSupportedCurrencies: RequestHandler = (_req, res) => {
  res.json([...SUPPORTED_CURRENCIES]);
};
