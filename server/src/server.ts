import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

console.log(`[BOOT] Starting TravelSphere server on port ${env.PORT}...`);

const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`[BOOT] Server listening on http://localhost:${env.PORT}`);
  logger.info(`TravelSphere server running on http://localhost:${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${env.PORT} is already in use. Kill the existing process and retry.`);
  } else {
    logger.error({ err }, 'Server error');
  }
  process.exit(1);
});

// Allow long-running requests (itinerary drafting can take 60-90s)
server.keepAliveTimeout = 125000;
server.headersTimeout = 130000;
server.timeout = 130000;
