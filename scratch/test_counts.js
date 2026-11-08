const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const allCats = await prisma.category.findMany({
    include: {
      products: { select: { id: true } },
      children: {
        include: {
          products: { select: { id: true } },
          children: {
            include: {
              products: { select: { id: true } }
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  const withProducts = [];
  for (const cat of allCats) {
    const directCount = cat.products.length;
    let childCount = 0;
    for (const ch of cat.children) {
      childCount += ch.products.length;
      for (const gch of ch.children) {
        childCount += gch.products.length;
      }
    }
    const totalCount = directCount + childCount;
    if (totalCount > 0) {
      withProducts.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parentId: cat.parentId,
        directCount,
        totalCount
      });
    }
  }

  console.log(`Categories with >0 products (${withProducts.length}):`);
  console.log(JSON.stringify(withProducts, null, 2));
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

