const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const page = await prisma.page.findUnique({
    where: { slug: 'expedicao' },
    select: { title: true, desktopContent: true }
  });
  console.log('Title:', page?.title);
  console.log('Content preview (first 500 chars):', page?.desktopContent?.slice(0, 500));
}

main().catch(console.error).finally(() => prisma.$disconnect());

