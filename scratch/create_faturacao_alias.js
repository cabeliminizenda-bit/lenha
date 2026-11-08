const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addAlias() {
  const p = await prisma.page.findUnique({ where: { slug: 'politica-de-faturacao' } });
  if (p) {
    const existing = await prisma.page.findUnique({ where: { slug: 'faturacao' } });
    if (!existing) {
      await prisma.page.create({
        data: {
          title: 'Política de Faturação',
          slug: 'faturacao',
          desktopContent: p.desktopContent,
          mobileContent: p.mobileContent,
          isPublished: true,
          metaTitle: 'Política de Faturação'
        }
      });
      console.log('Created alias page: faturacao');
    } else {
      await prisma.page.update({
        where: { slug: 'faturacao' },
        data: {
          title: 'Política de Faturação',
          desktopContent: p.desktopContent,
          mobileContent: p.mobileContent,
          isPublished: true
        }
      });
      console.log('Updated alias page: faturacao');
    }
  }
}

addAlias().catch(console.error).finally(() => prisma.$disconnect());
