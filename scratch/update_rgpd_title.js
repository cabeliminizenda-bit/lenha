const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update privacidade pages
  const privSlugs = ['privacidade', 'politica-de-privacidade'];
  for (const slug of privSlugs) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (page) {
      const newTitle = 'Política de Privacidade e Proteção de Dados';
      const newContent = page.desktopContent.replace('(RGPD)', '').replace('(RGPD - Regulamento UE 2016/679)', '(Regulamento UE 2016/679)');
      await prisma.page.update({
        where: { slug },
        data: {
          title: newTitle,
          desktopContent: newContent,
          mobileContent: newContent
        }
      });
      console.log(`Updated title and content for ${slug}`);
    }
  }

  // Update faturação pages
  const fatPage = await prisma.page.findUnique({ where: { slug: 'politica-de-faturacao' } });
  if (fatPage) {
    await prisma.page.update({
      where: { slug: 'politica-de-faturacao' },
      data: {
        title: 'Política de Faturação'
      }
    });
    console.log(`Updated title for politica-de-faturacao`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

