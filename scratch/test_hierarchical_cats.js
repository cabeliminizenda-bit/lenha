const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCategoriesWithProducts() {
  // Fetch all categories with product count
  const allCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
      _count: {
        select: { products: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Filter only categories with at least 1 product
  const withProducts = allCategories.filter(c => c._count.products > 0);

  // Organize hierarchically: roots first, then their direct or indirect children with products
  const result = [];
  const roots = withProducts.filter(c => !c.parentId);
  const children = withProducts.filter(c => c.parentId);

  // Group children by parent
  const childrenByParent = new Map();
  for (const child of children) {
    if (!childrenByParent.has(child.parentId)) {
      childrenByParent.set(child.parentId, []);
    }
    childrenByParent.get(child.parentId).push(child);
  }

  function addChildren(parentId) {
    const directChildren = childrenByParent.get(parentId) || [];
    for (const ch of directChildren) {
      result.push({
        id: ch.id,
        name: ch.name,
        slug: ch.slug,
        parentId: ch.parentId,
        productCount: ch._count.products
      });
      addChildren(ch.id);
    }
  }

  for (const root of roots) {
    result.push({
      id: root.id,
      name: root.name,
      slug: root.slug,
      parentId: null,
      productCount: root._count.products
    });
    addChildren(root.id);
  }

  // Also include any child whose root had 0 products (if any)
  for (const ch of children) {
    if (!result.find(r => r.id === ch.id)) {
      result.push({
        id: ch.id,
        name: ch.name,
        slug: ch.slug,
        parentId: ch.parentId,
        productCount: ch._count.products
      });
    }
  }

  return result;
}

async function run() {
  const cats = await getCategoriesWithProducts();
  console.log(`Generated ${cats.length} categories with products:`);
  for (const c of cats) {
    const prefix = c.parentId ? '   ↳ ' : '📦 ';
    console.log(`${prefix}${c.name} (${c.slug}) — ${c.productCount} produtos`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

