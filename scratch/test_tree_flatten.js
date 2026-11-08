const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // Option B: Build ordered list: parent categories with products, then children with products
  const rootCats = await prisma.category.findMany({
    where: {
      parentId: null,
      OR: [
        { products: { some: {} } },
        { children: { some: { products: { some: {} } } } }
      ]
    },
    include: {
      children: {
        where: {
          OR: [
            { products: { some: {} } },
            { children: { some: { products: { some: {} } } } }
          ]
        },
        include: {
          children: {
            where: { products: { some: {} } }
          },
          _count: { select: { products: true } }
        },
        orderBy: { name: 'asc' }
      },
      _count: { select: { products: true } }
    },
    orderBy: { name: 'asc' }
  });

  const list = [];
  for (const root of rootCats) {
    list.push({
      id: root.id,
      name: root.name,
      slug: root.slug,
      parentId: null,
      count: root._count.products
    });
    for (const child of root.children) {
      list.push({
        id: child.id,
        name: child.name,
        slug: child.slug,
        parentId: root.id,
        count: child._count.products
      });
      for (const gchild of child.children) {
        list.push({
          id: gchild.id,
          name: gchild.name,
          slug: gchild.slug,
          parentId: child.id,
          count: gchild._count?.products || 0
        });
      }
    }
  }

  console.log('Total categories in list:', list.length);
  for (const item of list) {
    const indent = item.parentId ? '  -> ' : '• ';
    console.log(`${indent}${item.name} (${item.slug}) [${item.count} prods]`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

