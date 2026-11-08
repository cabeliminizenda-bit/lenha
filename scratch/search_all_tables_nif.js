const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function searchAllTablesForNif() {
  const pages = await prisma.page.findMany();
  for (const p of pages) {
    for (const [k, v] of Object.entries(p)) {
      if (typeof v === 'string' && (v.includes('Faturação & NIF') || v.includes('Faturação &amp; NIF') || v.includes('Faturacao & NIF'))) {
        console.log(`Page ${p.slug} column ${k} contains:`, v);
      }
    }
  }

  const settings = await prisma.setting.findMany();
  for (const s of settings) {
    if (s.value && (s.value.includes('Faturação & NIF') || s.value.includes('Faturação &amp; NIF'))) {
      console.log(`Setting ${s.key} contains:`, s.value);
    }
  }
}

searchAllTablesForNif().catch(console.error).finally(() => prisma.$disconnect());
