const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      discountLabel: true,
      categories: { select: { id: true, name: true, slug: true } }
    }
  });

  const promoProds = prods.filter(p => (p.compareAtPrice && p.compareAtPrice > p.price) || (p.discountLabel && p.discountLabel.trim() !== ''));
  console.log(`Total Promo products: ${promoProds.length}`);

  const counts = {
    pellets: 0,
    salamandras: 0,
    recuperadores: 0,
    climatizacao: 0,
    unmatched: []
  };

  // Check current regex matching in FeaturedProductTabs:
  promoProds.forEach(p => {
    const haystack = (
      (p.title || '') + ' ' +
      p.categories.map(c => `${c.name} ${c.slug}`).join(' ')
    ).toLowerCase();

    let matched = false;

    // Check Pellets & Lenha
    if (
      haystack.includes('pellet') ||
      haystack.includes('lenha') ||
      haystack.includes('combust') ||
      haystack.includes('sobro') ||
      haystack.includes('azinho') ||
      haystack.includes('pinho') ||
      haystack.includes('aparas') ||
      haystack.includes('parfer')
    ) {
      // WAIT! If it's a "Fogão a Lenha" or "Recuperador a Lenha" or "Lareira a lenha", does it match "lenha" here?!
      // YES! LOOK AT THAT!
      // If a stove or fireplace is called "Fogão a Lenha" or "Recuperador a Lenha", haystack.includes('lenha') matches it as 'Pellets & Lenha'!
      // THAT IS A HUGE BUG!
    }

    const isCombustible = 
      (haystack.includes('pellet') && !haystack.includes('salamandra') && !haystack.includes('fogão') && !haystack.includes('fogao') && !haystack.includes('caldeira')) ||
      (haystack.includes('lenha') && !haystack.includes('fogão') && !haystack.includes('fogao') && !haystack.includes('forno') && !haystack.includes('lareira') && !haystack.includes('recuperador') && !haystack.includes('salamandra')) ||
      haystack.includes('combust') ||
      haystack.includes('sobro') ||
      haystack.includes('azinho') ||
      haystack.includes('aparas') ||
      haystack.includes('briquette') ||
      haystack.includes('carvão') ||
      haystack.includes('carvao') ||
      haystack.includes('bioetanol');

    console.log(`[${p.id.slice(0, 6)}] "${p.title}" -> Categories: [${p.categories.map(c => c.name).join(', ')}]`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

