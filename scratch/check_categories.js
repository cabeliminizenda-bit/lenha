const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
      _count: {
        select: {
          products: true,
          children: true
        }
      }
    }
  });
  console.log('Categories count:', categories.length);
  for (const c of categories) {
    console.log(`- ${c.name} (slug: ${c.slug}, parent: ${c.parentId}): ${c._count.products} products, ${c._count.children} children`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

