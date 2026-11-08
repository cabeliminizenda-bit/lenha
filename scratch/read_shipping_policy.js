const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const pages = await prisma.page.findMany({
    where: { slug: { in: ['politica-de-expedicao', 'expedicao'] } },
    select: { slug: true, title: true, desktopContent: true }
  });
  for (const p of pages) {
    console.log(`=== ${p.slug} (${p.title}) ===`);
    console.log(p.desktopContent);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

