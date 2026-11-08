const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
      OR: [
        { products: { some: {} } },
        { children: { some: { products: { some: {} } } } }
      ]
    },
    include: {
      children: {
        where: { products: { some: {} } }
      },
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  });
  console.log(JSON.stringify(categories, null, 2));
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

