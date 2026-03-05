import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

const dropsDataPath = join(__dirname, 'data', 'drops.json');
const sneakerDrops = JSON.parse(readFileSync(dropsDataPath, 'utf-8'));

async function main() {
  console.log('🌱 Starting seed...');

  await prisma.drop.deleteMany({});
  console.log('✨ Cleared existing drops');

  for (const drop of sneakerDrops) {
    const created = await prisma.drop.create({
      data: {
        ...drop,
        availableStock: drop.totalStock,
        startTime: new Date(),
      },
    });
    console.log(`✅ Created: ${created.name}`);
  }

  const count = await prisma.drop.count();
  console.log(`\n🎉 Seed completed! Created ${count} drops`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
