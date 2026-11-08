const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCopyright() {
  const updated = await prisma.setting.upsert({
    where: { key: 'FOOTER_COPYRIGHT' },
    update: { value: '© 2026 Lenha & Carvão Silva Dias. Todos os direitos reservados.' },
    create: {
      key: 'FOOTER_COPYRIGHT',
      value: '© 2026 Lenha & Carvão Silva Dias. Todos os direitos reservados.'
    }
  });
  console.log('Updated FOOTER_COPYRIGHT in DB:', updated);
}

updateCopyright().catch(console.error).finally(() => prisma.$disconnect());

