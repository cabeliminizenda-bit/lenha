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

  console.log('--- ALL COMBUSTIBLES / PELLETS & LENHA PRODUCTS ---');
  prods.forEach(p => {
    const t = p.title.toLowerCase();
    const isComb = 
      t.includes('pellet') ||
      t.includes('lenha') ||
      t.includes('aparas') ||
      t.includes('sobro') ||
      t.includes('carvão') ||
      t.includes('carvao') ||
      t.includes('combust');

    const isAppliance = 
      t.includes('fogão') ||
      t.includes('fogao') ||
      t.includes('salamandra') ||
      t.includes('recuperador') ||
      t.includes('lareira') ||
      t.includes('forno') ||
      t.includes('cozinha') ||
      t.includes('caldeira');

    if (isComb && !isAppliance) {
      console.log(`- ${p.title} | ${p.price}€ (compare: ${p.compareAtPrice}) discount: ${p.discountLabel || 'none'}`);
    }
  });

  console.log('\n--- ALL CLIMATIZACAO PRODUCTS ---');
  prods.forEach(p => {
    const t = p.title.toLowerCase();
    if (t.includes('ar condicionado') || t.includes('split') || t.includes('desumidificador') || t.includes('ventilador')) {
      console.log(`- ${p.title} | ${p.price}€ (compare: ${p.compareAtPrice}) discount: ${p.discountLabel || 'none'}`);
    }
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

