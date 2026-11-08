const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.page.findUnique({ where: { slug: 'expedicao' } });
  console.log('--- expedicao ---');
  console.log('desktopContent length:', p1?.desktopContent?.length);
  console.log(p1?.desktopContent?.slice(0, 500));

  const p2 = await prisma.page.findUnique({ where: { slug: 'politica-de-expedicao' } });
  console.log('--- politica-de-expedicao ---');
  console.log('desktopContent length:', p2?.desktopContent?.length);
  console.log(p2?.desktopContent?.slice(0, 500));
}

main().catch(console.error).finally(() => prisma.$disconnect());

