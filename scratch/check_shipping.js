const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const zones = await prisma.shippingZone.findMany({
    include: { methods: true }
  });
  console.log(JSON.stringify(zones, null, 2));
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

