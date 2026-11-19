import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const dbPath = path.resolve('/Users/aadarshparnar/Documents/antigravity/travelsphere/server/prisma/dev.db');
const rawDest = execSync(`sqlite3 "${dbPath}" "SELECT id, slug FROM Destination;"`, { encoding: 'utf8' });

const destMap = {};
for (const line of rawDest.trim().split('\n')) {
  if (!line) continue;
  const [id, slug] = line.split('|');
  destMap[slug] = id;
}

// Read culture-seed.ts content to extract cultureData
const seedContent = fs.readFileSync('/Users/aadarshparnar/Documents/antigravity/travelsphere/server/prisma/culture-seed.ts', 'utf8');

// Use a simple evaluator or extract the cultureData object
const startIdx = seedContent.indexOf('const cultureData:');
const endIdx = seedContent.indexOf('async function main()');
const dataBlock = seedContent.slice(startIdx, endIdx);

// Convert typescript type annotation if any
const cleaned = dataBlock
  .replace('const cultureData: Record<string, Array<{ topic: string; title: string; body: string; contextNote?: string }>> =', 'globalThis.cultureData =')
  .replace('const cultureData =', 'globalThis.cultureData =');

eval(cleaned);

const cultureData = globalThis.cultureData;
const now = new Date().toISOString();

let sqlStatements = ['BEGIN TRANSACTION;'];
sqlStatements.push('DELETE FROM "CultureEntry";');

let entryCount = 0;
let randIdCounter = 1000;

function escapeSql(str) {
  if (str == null) return 'NULL';
  return `'` + String(str).replace(/'/g, `''`) + `'`;
}

for (const [slug, entries] of Object.entries(cultureData)) {
  const destId = destMap[slug];
  if (!destId) {
    console.warn(`No destination found in DB for slug: ${slug}`);
    continue;
  }

  for (const entry of entries) {
    randIdCounter++;
    const id = `cult_${Date.now().toString(36)}_${randIdCounter}`;
    const topic = escapeSql(entry.topic.toUpperCase());
    const title = escapeSql(entry.title);
    const body = escapeSql(entry.body);
    const contextNote = escapeSql(entry.contextNote || null);
    const sourceNote = escapeSql('TravelSphere Editorial Team');
    
    sqlStatements.push(
      `INSERT INTO "CultureEntry" ("id", "destinationId", "topic", "title", "body", "contextNote", "sourceNote", "createdAt", "updatedAt") ` +
      `VALUES ('${id}', '${destId}', ${topic}, ${title}, ${body}, ${contextNote}, ${sourceNote}, '${now}', '${now}');`
    );
    entryCount++;
  }
}

sqlStatements.push('COMMIT;');

const sqlFile = path.resolve('/Users/aadarshparnar/Documents/antigravity/travelsphere/server/prisma/culture-seed.sql');
fs.writeFileSync(sqlFile, sqlStatements.join('\n'), 'utf8');
console.log(`Generated ${sqlStatements.length} SQL statements for ${entryCount} culture entries.`);
