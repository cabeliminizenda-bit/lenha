const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findFirst({
    where: { isDeleted: false },
    select: { slug: true, title: true }
  });
  console.log('Sample product:', p);
  if (p) {
    const res = await fetch(`http://localhost:3000/product/${p.slug}`);
    const html = await res.text();
    console.log('Product page HTTP status:', res.status);
    const hasCountLiteral = html.includes('{count}');
    console.log('Contains literal {count}?:', hasCountLiteral);
    const avaliacoesIndex = html.indexOf('Avalia');
    if (avaliacoesIndex !== -1) {
      console.log('Snippet around Avaliações:', html.slice(avaliacoesIndex - 20, avaliacoesIndex + 60));
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

