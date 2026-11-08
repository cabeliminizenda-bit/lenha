const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slugs = ['devolucoes', 'termos-e-condicoes', 'privacidade', 'politica-de-garantia', 'politica-de-faturacao'];
  for (const slug of slugs) {
    const page = await prisma.page.findUnique({
      where: { slug },
      select: { slug: true, title: true, desktopContent: true }
    });
    console.log('=== SLUG:', slug, 'TITLE:', page?.title);
    console.log(page?.desktopContent?.slice(0, 300) || 'NO CONTENT');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

