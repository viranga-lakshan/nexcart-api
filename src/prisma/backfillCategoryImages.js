require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { categories } = require('./seedData');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function backfillCategoryImages() {
  let updated = 0;

  for (const category of categories) {
    const result = await prisma.category.updateMany({
      where: { name: category.name },
      data: { imageUrl: category.imageUrl ?? null },
    });

    updated += result.count;
  }

  console.log(`Updated imageUrl for ${updated} categories.`);
}

backfillCategoryImages()
  .catch((error) => {
    console.error('Category image backfill failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
