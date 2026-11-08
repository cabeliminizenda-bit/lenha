const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log('--- Checking Page titles and contents ---');
  const pages = await prisma.page.findMany();
  for (const p of pages) {
    if (p.title.includes('Faturação') || p.title.includes('NIF') || (p.desktopContent && (p.desktopContent.includes('Faturação & NIF') || p.desktopContent.includes('Faturação &amp; NIF')))) {
      console.log('Page found:', p.slug, 'Title:', p.title);
      if (p.desktopContent && p.desktopContent.includes('Faturação & NIF')) {
        console.log('  Found "Faturação & NIF" in desktopContent of', p.slug);
      }
      if (p.desktopContent && p.desktopContent.includes('Faturação &amp; NIF')) {
        console.log('  Found "Faturação &amp; NIF" in desktopContent of', p.slug);
      }
    }
  }

  console.log('--- Checking Settings ---');
  const settings = await prisma.setting.findMany();
  for (const s of settings) {
    if (s.value && (s.value.includes('Faturação') || s.value.includes('NIF'))) {
      console.log('Setting:', s.key, s.value);
    }
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
