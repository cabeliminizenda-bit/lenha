const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function classifyForTab(p) {
  const title = (p.title || '').toLowerCase();
  const categoryNames = (p.categories || []).map(c => c.name.toLowerCase()).join(' ');
  const categorySlugs = (p.categories || []).map(c => c.slug.toLowerCase()).join(' ');
  const allText = `${title} ${categoryNames} ${categorySlugs}`;

  // 1. CLIMATIZAÇÃO:
  // Ar condicionado, splits, desumidificadores, ventiladores, bombas de calor, termoacumuladores, radiadores elétricos
  // But NOT wood/pellet heating stoves/inserts
  const isClimateText = 
    title.includes('ar condicionado') ||
    title.includes('split') ||
    title.includes('desumidificador') ||
    title.includes('ventilador') ||
    title.includes('bomba calor') ||
    title.includes('bomba de calor') ||
    title.includes('termoacumulador') ||
    title.includes('climatizador') ||
    title.includes('btu') ||
    categorySlugs.includes('ar-condicionado') ||
    categorySlugs.includes('desumidificador') ||
    categorySlugs.includes('ventilador') ||
    categorySlugs.includes('termoacumulador') ||
    (categorySlugs.includes('climatizacao') && !title.includes('lenha') && !title.includes('pellet'));

  if (isClimateText) {
    return 'climatizacao';
  }

  // 2. PELLETS & LENHA (Combustíveis / Biomassa / Sacos / Paletes)
  // Must be combustible fuels only, NEVER appliances/stoves/fireplaces
  const isCombustible = 
    title.includes('palete') ||
    title.includes('saco') ||
    title.includes('sacos') ||
    title.includes('big bag') ||
    title.includes('aparas') ||
    title.includes('sobro') ||
    title.includes('azinho') ||
    title.includes('carvão') ||
    title.includes('carvao') ||
    title.includes('briquette') ||
    title.includes('bioetanol') ||
    title.includes('combust') ||
    categorySlugs.includes('combustiveis') ||
    categorySlugs.includes('pellets-e-lenha') ||
    categorySlugs.includes('lenha-e-pellets') ||
    categorySlugs.includes('pellets');

  const isHeatingAppliance = 
    title.includes('salamandra') ||
    title.includes('fogão') ||
    title.includes('fogao') ||
    title.includes('recuperador') ||
    title.includes('lareira') ||
    title.includes('forno') ||
    title.includes('insert') ||
    title.includes('caldeira') ||
    title.includes('cozinha') ||
    title.includes('estufa') ||
    categorySlugs.includes('fogoes') ||
    categorySlugs.includes('salamandras') ||
    categorySlugs.includes('recuperadores') ||
    categorySlugs.includes('fornos') ||
    categorySlugs.includes('lareira');

  if (isCombustible && !isHeatingAppliance) {
    return 'pellets';
  }

  // 3. SALAMANDRAS & FOGÕES:
  // Salamandras a pellets, salamandras a lenha, fogões a lenha, fogões a pellets, estufas, cozinhas a lenha
  if (
    title.includes('salamandra') ||
    title.includes('fogão') ||
    title.includes('fogao') ||
    title.includes('estufa') ||
    title.includes('cozinha') ||
    categorySlugs.includes('salamandras') ||
    categorySlugs.includes('fogoes') ||
    categorySlugs.includes('cozinha-com-forno')
  ) {
    return 'salamandras';
  }

  // 4. RECUPERADORES & LAREIRAS:
  // Recuperadores de calor, lareiras, fornos a lenha, inserts, caldeiras
  if (
    title.includes('recuperador') ||
    title.includes('lareira') ||
    title.includes('forno') ||
    title.includes('insert') ||
    title.includes('caldeira') ||
    categorySlugs.includes('recuperadores') ||
    categorySlugs.includes('lareira') ||
    categorySlugs.includes('fornos') ||
    categorySlugs.includes('caldeiras')
  ) {
    return 'recuperadores';
  }

  // Fallback check
  if (allText.includes('clima') || allText.includes('radiador')) return 'climatizacao';
  if (allText.includes('recuperador') || allText.includes('lareira')) return 'recuperadores';
  if (allText.includes('salamandra') || allText.includes('fog')) return 'salamandras';

  return 'recuperadores';
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

  const tabCounts = { pellets: 0, salamandras: 0, recuperadores: 0, climatizacao: 0 };
  const promoCounts = { pellets: 0, salamandras: 0, recuperadores: 0, climatizacao: 0 };

  prods.forEach(p => {
    const tab = classifyForTab(p);
    tabCounts[tab]++;
    const isPromo = (p.compareAtPrice && p.compareAtPrice > p.price) || (p.discountLabel && p.discountLabel.trim() !== '');
    if (isPromo) promoCounts[tab]++;
  });

  console.log('Total Products in DB:', prods.length);
  console.log('Classification across ALL 271 products:');
  console.log(tabCounts);
  console.log('\nClassification of PROMO products currently:');
  console.log(promoCounts);
}

main().catch(console.error).finally(() => prisma.$disconnect());

