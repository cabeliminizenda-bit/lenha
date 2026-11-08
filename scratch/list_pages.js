const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    select: { id: true, slug: true, title: true, isPublished: true }
  });
  console.log('Pages in database:');
  console.log(JSON.stringify(pages, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

