const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.page.findUnique({ where: { slug: 'termos-e-condicoes' } });
  console.log('=== FULL TERMOS ===\n', p1?.desktopContent);
  const p2 = await prisma.page.findUnique({ where: { slug: 'privacidade' } });
  console.log('=== FULL PRIVACIDADE ===\n', p2?.desktopContent);
}

main().catch(console.error).finally(() => prisma.$disconnect());

