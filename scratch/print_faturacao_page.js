const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function printPage() {
  const p = await prisma.page.findUnique({
    where: { slug: 'politica-de-faturacao' }
  });
  console.log('Record for politica-de-faturacao:');
  console.log(JSON.stringify(p, null, 2));
}

printPage().catch(console.error).finally(() => prisma.$disconnect());
