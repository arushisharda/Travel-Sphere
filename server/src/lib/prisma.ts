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
 * Ensures the database has tables AND seed data.
 * Runs on every request (cached after first success).
 */
export async function ensureDatabaseReady(): Promise<void> {
  if (globalForPrisma.dbReadyPromise) {
    return globalForPrisma.dbReadyPromise;
  }

  globalForPrisma.dbReadyPromise = (async () => {
    let tablesExist = false;

    // 1. Check if tables exist
    try {
      await prisma.$queryRawUnsafe('SELECT 1 FROM "User" LIMIT 1');
      tablesExist = true;
    } catch {
      // Tables don't exist — create them from migration SQL
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
          console.log('Schema tables created successfully.');
          tablesExist = true;
        }
      } catch (err) {
        console.error('Failed to run initial database schema:', err);
        return;
      }
    }

    // 2. Check if destinations are seeded — if not, seed from full-seed.sql
    if (tablesExist) {
      try {
        const count = await prisma.destination.count();
        if (count === 0) {
          console.log('Destination table is empty. Seeding data...');
          const seedSqlPath = path.resolve(__dirname, '../../prisma/full-seed.sql');
          if (fs.existsSync(seedSqlPath)) {
            const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
            const seedStmts = seedSql
              .split(';')
              .map((s) => s.trim())
              .filter((s) => s.length > 0 && !s.startsWith('--') && !s.startsWith('BEGIN') && !s.startsWith('COMMIT'));
            for (const s of seedStmts) {
              try {
                await prisma.$executeRawUnsafe(s);
              } catch (err: any) {
                // Skip duplicate entries silently
              }
            }
            const newCount = await prisma.destination.count();
            console.log(`Seeded ${newCount} destinations and culture entries.`);
          } else {
            console.warn('full-seed.sql not found at', seedSqlPath);
          }
        } else {
          console.log(`Database ready: ${count} destinations found.`);
        }
      } catch (err) {
        console.error('Error checking/seeding destinations:', err);
      }
    }
  })();

  return globalForPrisma.dbReadyPromise;
}
