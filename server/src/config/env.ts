import 'dotenv/config';
import { z } from 'zod';

const defaultDbUrl = process.env['VERCEL'] ? 'file:/tmp/travelsphere.db' : 'file:./prisma/dev.db';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1).default(defaultDbUrl),
  JWT_SECRET: z.string().min(32).default('travelsphere-production-super-secret-key-32-chars-min'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_COST: z.coerce.number().min(10).max(15).default(12),
  NVIDIA_API_KEY: z.string().default('placeholder-api-key'),
  NVIDIA_BASE_URL: z.string().url().default('https://integrate.api.nvidia.com/v1'),
  NVIDIA_MODEL: z.string().default('nvidia/llama-3.1-nemotron-ultra-253b-v1'),
  AI_TIMEOUT_MS: z.coerce.number().default(45000),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().default(3500),
  OPEN_METEO_GEOCODING_URL: z.string().url().default('https://geocoding-api.open-meteo.com/v1/search'),
  OPEN_METEO_FORECAST_URL: z.string().url().default('https://api.open-meteo.com/v1/forecast'),
  EXCHANGE_RATE_BASE_URL: z.string().url().default('https://api.frankfurter.dev/v1'),
  EXTERNAL_TIMEOUT_MS: z.coerce.number().default(8000),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.warn('Warning: Environment variables validation warning:');
  console.warn(parsed.error.flatten().fieldErrors);
  if (!process.env['VERCEL']) {
    process.exit(1);
  }
}

export const env = parsed.success ? parsed.data : schema.parse({
  DATABASE_URL: defaultDbUrl,
  JWT_SECRET: 'travelsphere-production-super-secret-key-32-chars-min',
  NVIDIA_API_KEY: 'placeholder-api-key',
});
