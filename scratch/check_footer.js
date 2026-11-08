const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const s = await prisma.setting.findUnique({ where: { key: 'FOOTER_COLUMNS' } });
  console.log('FOOTER_COLUMNS:', s ? s.value : 'null');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

