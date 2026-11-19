import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { routes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

// In production, serve the built React app from server
const isProd = env.NODE_ENV === 'production';
const clientDistPath = path.resolve(__dirname, '../../client/dist');

app.use(helmet({
  contentSecurityPolicy: isProd ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.open-meteo.com', 'https://geocoding-api.open-meteo.com', 'https://api.frankfurter.dev'],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  } : false,
}));

// CORS: allow any origin in dev, specific origin in prod
app.use(cors({
  origin: isProd ? env.CLIENT_ORIGIN : true,
  credentials: false,
}));
app.use(express.json({ limit: '50kb' }));
app.use((pinoHttp as unknown as (opts: object) => express.RequestHandler)({ logger, redact: ['req.headers.authorization'] }));
app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV });
});

app.use('/api', routes);

// Serve React SPA in production
if (isProd) {
  app.use(express.static(clientDistPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });
}

app.use(errorHandler);
