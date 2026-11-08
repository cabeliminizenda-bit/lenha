const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const topBar = await prisma.setting.findUnique({
    where: { key: 'TOP_BAR_LINKS' }
  });
  console.log('TOP_BAR_LINKS:', topBar);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

