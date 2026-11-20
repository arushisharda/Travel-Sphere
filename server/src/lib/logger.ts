import pino from 'pino';
import { env } from '../config/env.js';

// Never use pino-pretty in production — it hangs in non-TTY environments (Render, CI)
// In production: raw JSON logs, which Render reads natively
export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
});
