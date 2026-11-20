// Simple startup shim — avoids pino-pretty TTY detection issues
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { createServer } = await import('./server/src/app.js').catch(async e => {
  console.error('Failed to import app:', e.message);
  process.exit(1);
});
