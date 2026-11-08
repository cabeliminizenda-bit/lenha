const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const setting = await prisma.setting.findUnique({
    where: { key: 'FOOTER_COPYRIGHT' }
  });
  console.log('FOOTER_COPYRIGHT in DB:', setting);
}

check().catch(console.error).finally(() => prisma.$disconnect());

