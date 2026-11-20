import pino from 'pino';
import { env } from '../config/env.js';

const isColorTTY = process.stdout.isTTY === true && env.NODE_ENV !== 'production';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: isColorTTY
    ? { target: 'pino-pretty', options: { colorize: true, sync: true } }
    : undefined,
});
