const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getProductTab(product) {
  const title = (product.title || '').toLowerCase();
  const catNames = (product.categories || []).map(c => c.name.toLowerCase()).join(' ');
  const catSlugs = (product.categories || []).map(c => c.slug.toLowerCase()).join(' ');
  const text = `${title} ${catNames} ${catSlugs}`;

  // 1. Climatização (Air conditioning, heat pumps, fans, dehumidifiers, water heaters, radiators)
  if (
    text.includes('ar condicionado') ||
    text.includes('climatiz') ||
    text.includes('desumidificador') ||
    text.includes('ventilador') ||
    text.includes('termoacumulador') ||
    text.includes('split') ||
    text.includes('btu') ||
    catSlugs.includes('ar-condicionado') ||
    catSlugs.includes('climatizacao') ||
    catSlugs.includes('desumidificador') ||
    catSlugs.includes('ventilador') ||
    catSlugs.includes('termoacumulador')
  ) {
    return 'climatizacao';
  }

  // 2. Combustíveis: Pellets & Lenha (Biomass, Firewood, Wood Pellets, Wood shavings, Charcoal)
  // Must be actual fuel, NOT appliances like 'fogão a lenha', 'salamandra a pellets', 'lareira a lenha'
  const isHeatingAppliance = 
    title.includes('salamandra') ||
    title.includes('fogão') ||
    title.includes('fogao') ||
    title.includes('recuperador') ||
    title.includes('lareira') ||
    title.includes('forno') ||
    title.includes('insert') ||
    title.includes('caldeira') ||
    title.includes('estufa') ||
    catSlugs.includes('fogoes') ||
    catSlugs.includes('salamandras') ||
    catSlugs.includes('recuperadores') ||
    catSlugs.includes('fornos') ||
    catSlugs.includes('lareira');

  if (!isHeatingAppliance) {
    if (
      catSlugs.includes('combustiveis') ||
      catSlugs.includes('pellets') ||
      catSlugs.includes('lenha-e-pellets') ||
      catSlugs.includes('pellets-e-lenha') ||
      title.includes('palete') ||
      title.includes('saco') ||
      title.includes('sacos') ||
      title.includes('big bag') ||
      title.includes('aparas') ||
      title.includes('sobro') ||
      title.includes('azinho') ||
      title.includes('pinho') ||
      title.includes('carvão') ||
      title.includes('carvao') ||
      title.includes('briquette') ||
      title.includes('bioetanol') ||
      title.includes('combust')
    ) {
      return 'pellets';
    }
  }

  // 3. Salamandras (Salamandras a pellets, salamandras a lenha, fogões a lenha, fogões a pellets, estufas)
  if (
    title.includes('salamandra') ||
    title.includes('fogão') ||
    title.includes('fogao') ||
    title.includes('estufa') ||
    catSlugs.includes('salamandras') ||
    catSlugs.includes('fogoes')
  ) {
    return 'salamandras';
  }

  // 4. Recuperadores (Recuperadores de calor, lareiras, inserts, fornos de lenha, caldeiras)
  if (
    title.includes('recuperador') ||
    title.includes('lareira') ||
    title.includes('forno') ||
    title.includes('insert') ||
    title.includes('caldeira') ||
    catSlugs.includes('recuperadores') ||
    catSlugs.includes('lareira') ||
    catSlugs.includes('fornos') ||
    catSlugs.includes('caldeiras')
  ) {
    return 'recuperadores';
  }

  // Fallback for any other heating equipment
  if (text.includes('aquec') || text.includes('radiador')) {
    return 'climatizacao';
  }

  return 'other';
}

async function main() {
  const prods = await prisma.product.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      price: true,
      compareAtPrice: true,
      discountLabel: true,
      categories: { select: { id: true, name: true, slug: true } }
    }
  });

  const promoProds = prods.filter(p => (p.compareAtPrice && p.compareAtPrice > p.price) || (p.discountLabel && p.discountLabel.trim() !== ''));

  const grouped = {
    pellets: [],
    salamandras: [],
    recuperadores: [],
    climatizacao: [],
    other: []
  };

  promoProds.forEach(p => {
    const tab = getProductTab(p);
    grouped[tab].push(p);
  });

  console.log('--- PROMO PRODUCTS TAB DISTRIBUTION ---');
  console.log(`Total Promo: ${promoProds.length}`);
  console.log(`Pellets & Lenha: ${grouped.pellets.length}`);
  console.log(`Salamandras: ${grouped.salamandras.length}`);
  console.log(`Recuperadores: ${grouped.recuperadores.length}`);
  console.log(`Climatização: ${grouped.climatizacao.length}`);
  console.log(`Other: ${grouped.other.length}`);

  console.log('\nSample Pellets & Lenha:');
  grouped.pellets.slice(0, 5).forEach(p => console.log(`  - ${p.title} (${p.price}€)`));

  console.log('\nSample Salamandras:');
  grouped.salamandras.slice(0, 5).forEach(p => console.log(`  - ${p.title} (${p.price}€)`));

  console.log('\nSample Recuperadores:');
  grouped.recuperadores.slice(0, 5).forEach(p => console.log(`  - ${p.title} (${p.price}€)`));

  console.log('\nSample Climatização:');
  grouped.climatizacao.slice(0, 5).forEach(p => console.log(`  - ${p.title} (${p.price}€)`));
}

main().catch(console.error).finally(() => prisma.$disconnect());

