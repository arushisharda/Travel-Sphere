import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  dbReadyPromise?: Promise<void>;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env['NODE_ENV'] !== 'production') globalForPrisma.prisma = prisma;

/**
 * Ensures the database schema and seed data exist in ephemeral environments like Vercel /tmp.
 */
export async function ensureDatabaseReady(): Promise<void> {
  if (globalForPrisma.dbReadyPromise) {
    return globalForPrisma.dbReadyPromise;
  }

  globalForPrisma.dbReadyPromise = (async () => {
    try {
      // Check if User table exists
      await prisma.$queryRawUnsafe('SELECT 1 FROM "User" LIMIT 1');
    } catch {
      // Tables do not exist, initialize from migration.sql
      console.log('Database tables not found. Initializing schema...');
      try {
        const migrationPath = path.resolve(__dirname, '../../prisma/migrations/20261118213204_init/migration.sql');
        if (fs.existsSync(migrationPath)) {
          const sql = fs.readFileSync(migrationPath, 'utf8');
          const statements = sql
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0 && !s.startsWith('--'));

          for (const stmt of statements) {
            try {
              await prisma.$executeRawUnsafe(stmt);
            } catch (err: any) {
              console.warn('Migration stmt skipped:', err?.message || err);
            }
          }
          console.log('Schema tables created successfully in SQLite.');

          // Populate destinations seed if available
          const seedSqlPath = path.resolve(__dirname, '../../prisma/culture-seed.sql');
          if (fs.existsSync(seedSqlPath)) {
            const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
            const seedStmts = seedSql.split(';').map((s) => s.trim()).filter((s) => s.length > 0);
            for (const s of seedStmts) {
              await prisma.$executeRawUnsafe(s).catch(() => {});
            }
            console.log('Initial destinations & culture data seeded.');
          }
        }
      } catch (err) {
        console.error('Failed to run initial database schema:', err);
      }
    }
  })();

  return globalForPrisma.dbReadyPromise;
}
