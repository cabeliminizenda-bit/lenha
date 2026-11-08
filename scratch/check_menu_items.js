const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAll() {
  // Let's inspect all models in Prisma to see if any model has faturacao or NIF
  console.log('--- MenuItem / Navigation ---');
  try {
    const menus = await prisma.menuItem.findMany();
    console.log('MenuItems:', menus.filter(m => m.title?.includes('Fatur') || m.url?.includes('fatur')));
  } catch(e) {
    console.log('No MenuItem table or error:', e.message);
  }

  console.log('--- Pages ---');
  const pages = await prisma.page.findMany({
    select: { slug: true, title: true }
  });
  console.log('All pages:', pages.filter(p => p.slug.includes('fatur') || p.title.includes('Fatur')));
}

checkAll().catch(console.error).finally(() => prisma.$disconnect());
