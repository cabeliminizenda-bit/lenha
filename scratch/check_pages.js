const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const pages = await prisma.page.findMany({
    select: { id: true, slug: true, title: true, isPublished: true }
  });
  console.log(JSON.stringify(pages, null, 2));
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

