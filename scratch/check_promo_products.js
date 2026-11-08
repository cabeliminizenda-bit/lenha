const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true,
      discountLabel: true,
      categories: { select: { id: true, name: true, slug: true } }
    }
  });

  console.log('Total active products in DB:', prods.length);

  const withPromo = prods.filter(p => (p.compareAtPrice && p.compareAtPrice > p.price) || (p.discountLabel && p.discountLabel.trim() !== ''));
  console.log('Products with promo (compareAtPrice > price or discountLabel):', withPromo.length);

  const cats = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, _count: { select: { products: true } } }
  });
  console.log('\nAll Categories in DB:');
  cats.forEach(c => console.log(`- ${c.name} (${c.slug}): ${c._count.products} products`));

  console.log('\nSample promo products:');
  withPromo.slice(0, 15).forEach(p => {
    console.log(`- [${p.categories.map(c => c.name).join(', ')}] ${p.title} | ${p.price}€ (was ${p.compareAtPrice}€) ${p.discountLabel || ''}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

