const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.page.findUnique({ where: { slug: 'devolucoes' } });
  console.log('=== FULL DEVOLUCOES ===');
  console.log(p?.desktopContent);
}

main().catch(console.error).finally(() => prisma.$disconnect());

