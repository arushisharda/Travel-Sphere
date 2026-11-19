import { AppError } from './errors.js';
import { env } from '../config/env.js';

export async function getJson<T>(
  url: string,
  schema: { parse: (v: unknown) => T },
  timeoutMs = env.EXTERNAL_TIMEOUT_MS,
): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) {
      throw new AppError(502, 'UPSTREAM_ERROR', 'A data provider is unavailable right now');
    }
    return schema.parse(await res.json());
  } catch (e: unknown) {
    if (e instanceof AppError) throw e;
    if ((e as { name?: string }).name === 'AbortError') {
      throw new AppError(504, 'UPSTREAM_TIMEOUT', 'The data provider took too long to respond');
    }
    throw new AppError(502, 'UPSTREAM_BAD_DATA', 'The data provider returned unexpected data');
  } finally {
    clearTimeout(t);
  }
}
