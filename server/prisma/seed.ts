import { PrismaClient } from '@prisma/client';
import { destinations } from './data/destinations.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  for (const d of destinations) {
    const { culture, ...dest } = d;
    await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: { ...dest, region: dest.region ?? null },
      create: {
        ...dest,
        region: dest.region ?? null,
        cultureEntries: {
          create: culture.map((c) => ({
            topic: c.topic,
            title: c.title,
            body: c.body,
            contextNote: c.contextNote ?? null,
            pronunciation: c.pronunciation ?? null,
            sourceNote: c.sourceNote ?? null,
            reviewedAt: c.reviewedAt ?? null,
          })),
        },
      },
    });
    console.log(`  Seeded: ${dest.name}`);
  }
  console.log(`\nDone. ${destinations.length} destinations seeded.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
