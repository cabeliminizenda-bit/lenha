const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.page.findUnique({ where: { slug: 'expedicao' } });
  console.log('--- expedicao ---');
  console.log('Title:', p1?.title);
  console.log('Content:\n', p1?.content);

  const p2 = await prisma.page.findUnique({ where: { slug: 'politica-de-expedicao' } });
  console.log('--- politica-de-expedicao ---');
  console.log('Title:', p2?.title);
  console.log('Content:\n', p2?.content);
}

main().catch(console.error).finally(() => prisma.$disconnect());

