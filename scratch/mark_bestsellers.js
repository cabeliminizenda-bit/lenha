const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find products matching titles or keywords
  const prods = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        { title: { contains: 'Pellets ENplus', mode: 'insensitive' } },
        { title: { contains: 'Salamandra a Pellets 9kW', mode: 'insensitive' } },
        { title: { contains: 'Recuperador de Calor a Lenha 14kW', mode: 'insensitive' } },
        { title: { contains: 'Ar Condicionado Split Inverter', mode: 'insensitive' } },
        { title: { contains: 'Palete de Lenha de Sobro', mode: 'insensitive' } },
        { title: { contains: 'Milão Lareira', mode: 'insensitive' } },
        { title: { contains: 'Lareira Elétrica', mode: 'insensitive' } }
      ]
    },
    select: { id: true, title: true, isBestSeller: true }
  });

  console.log('Matching products found:', prods.length);
  for (const p of prods) {
    await prisma.product.update({
      where: { id: p.id },
      data: { isBestSeller: true }
    });
    console.log(`Marked as best seller: ${p.title} (${p.id})`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

