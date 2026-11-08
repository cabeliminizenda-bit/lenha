const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p1 = await prisma.page.findUnique({ where: { slug: 'expedicao' } });
  console.log('=== /expedicao desktopContent ===\n', p1?.desktopContent);

  const p2 = await prisma.page.findUnique({ where: { slug: 'politica-de-expedicao' } });
  // Strip tags to read text
  const text = p2?.desktopContent?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ') || '';
  console.log('=== /politica-de-expedicao text ===\n', text);
}

main().catch(console.error).finally(() => prisma.$disconnect());

