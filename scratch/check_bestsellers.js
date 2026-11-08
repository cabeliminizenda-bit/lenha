const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bestSellers = await prisma.product.findMany({
    where: { isDeleted: false, isBestSeller: true },
    select: { id: true, title: true, price: true, compareAtPrice: true, images: true }
  });
  console.log('isBestSeller count:', bestSellers.length);
  if (bestSellers.length > 0) {
    console.log('Sample best sellers:', bestSellers.slice(0, 5));
  }

  // Also check top discounted or featured products
  const promoProds = await prisma.product.findMany({
    where: { isDeleted: false, compareAtPrice: { gt: 0 } },
    select: { id: true, title: true, price: true, compareAtPrice: true, images: true },
    take: 10
  });
  console.log('Promo count:', promoProds.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());

