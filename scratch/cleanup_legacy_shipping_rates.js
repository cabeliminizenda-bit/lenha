const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update PORTUGAL zone methods
  await prisma.shippingMethod.updateMany({
    where: { type: 'Entrega padrão', rate: { gt: 100 } },
    data: { rate: 15.0 }
  });
  await prisma.shippingMethod.updateMany({
    where: { type: 'Entrega expresso', rate: { gt: 100 } },
    data: { rate: 25.0 }
  });
  await prisma.shippingMethod.updateMany({
    where: { type: 'Entrega gratuita', rate: { gt: 0 } },
    data: { rate: 0.0 }
  });

  // Update França
  await prisma.shippingMethod.updateMany({
    where: { type: 'Entrega expressa', rate: { gt: 100 } },
    data: { rate: 65.0 }
  });
  await prisma.shippingMethod.updateMany({
    where: { type: 'Entrega padrão', rate: { gt: 100 } },
    data: { rate: 45.0 }
  });

  console.log('Cleaned up legacy shipping method rates successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

