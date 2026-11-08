const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const pages = await prisma.page.findMany({
    where: {
      slug: {
        in: [
          'politica-de-devolucao-e-reembolso',
          'devolucoes',
          'termos-e-condicoes',
          'condicoes-gerais-de-venda',
          'politica-de-privacidade',
          'privacidade',
          'politica-de-garantia',
          'politica-de-faturacao'
        ]
      }
    },
    select: { id: true, slug: true, title: true, isPublished: true, desktopContent: true }
  });

  for (const p of pages) {
    console.log(`\n========================================`);
    console.log(`SLUG: ${p.slug} | TITLE: ${p.title}`);
    console.log(`CONTENT LENGTH: ${p.desktopContent?.length || 0}`);
    console.log(`PREVIEW: ${p.desktopContent?.slice(0, 300)}...`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

