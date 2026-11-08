const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany({
    select: { id: true, title: true, slug: true, updatedAt: true }
  });
  console.log('--- PAGES ---');
  console.log(pages);

  const zones = await prisma.shippingZone.findMany({
    include: { methods: true }
  });
  console.log('--- SHIPPING ZONES & METHODS ---');
  for (const z of zones) {
    console.log(`Zone: ${z.name} (id: ${z.id})`);
    for (const m of z.methods) {
      console.log(`  - [${m.id}] ${m.title} | Type: ${m.type} | Cost: ${m.cost} | Requires: ${m.requires} | Min: ${m.minAmount}`);
    }
  }

  // Also check if there is an expedicao page content
  const expedicaoPage = await prisma.page.findFirst({
    where: { slug: { in: ['expedicao', 'politica-de-envio', 'envios', 'politica-de-expedicao'] } }
  });
  if (expedicaoPage) {
    console.log('--- EXPEDICAO PAGE CONTENT (first 500 chars) ---');
    console.log(expedicaoPage.content?.slice(0, 500));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

