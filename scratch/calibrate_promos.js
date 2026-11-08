const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Calibrating Promos for Fuels & Climatização ---');

  // 1. Pellets & Lenha fuels to put on promo
  const fuelPromos = [
    { titleIncludes: 'Palete de Lenha de Sobro +- 500 Kg', compareAtPrice: 240.00, discountLabel: '-17%' },
    { titleIncludes: 'Palete 65 sacos Pellets Rubro', compareAtPrice: 285.00, discountLabel: '-16%' },
    { titleIncludes: 'BIOHOT', compareAtPrice: 259.00, discountLabel: '-17%' },
    { titleIncludes: 'Steampower', compareAtPrice: 285.00, discountLabel: '-16%' },
    { titleIncludes: 'Palete 48 sacos Sobro Parfer', compareAtPrice: 245.00, discountLabel: '-18%' },
    { titleIncludes: 'Palete 48 sacos de lenha Popular Parfer', compareAtPrice: 185.00, discountLabel: '-19%' },
    { titleIncludes: 'Big Bag Lenha de Azinho 400 kg', compareAtPrice: 265.00, discountLabel: '-17%' },
    { titleIncludes: 'Pellets Para Estufa Palet 77 Sacos', compareAtPrice: 650.00, discountLabel: '-15%' },
    { titleIncludes: 'Aparas Madeira Extra 5,5 KG', compareAtPrice: 9.50, discountLabel: '-19%' },
    { titleIncludes: 'Aparas Pinho Natural Extra 650 L', compareAtPrice: 17.90, discountLabel: '-19%' },
    { titleIncludes: 'Aparas De Madeira 140 L 10 KG', compareAtPrice: 23.00, discountLabel: '-18%' }
  ];

  for (const item of fuelPromos) {
    const prods = await prisma.product.findMany({
      where: { title: { contains: item.titleIncludes, mode: 'insensitive' } }
    });
    for (const p of prods) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          compareAtPrice: item.compareAtPrice,
          discountLabel: item.discountLabel
        }
      });
      console.log(`Updated Fuel: ${p.title} -> ${p.price}€ (was ${item.compareAtPrice}€) ${item.discountLabel}`);
    }
  }

  // 2. Top Climatização products to put on promo
  const climatePromos = [
    { titleIncludes: 'Ar Condicionado Portátil Hisense APH12QC', compareAtPrice: 620.00, discountLabel: '-16%' },
    { titleIncludes: 'Ar condicionado portátil MEI AC 4021', compareAtPrice: 299.00, discountLabel: '-16%' },
    { titleIncludes: 'Ar condicionado Blizz900 Wëasy', compareAtPrice: 299.00, discountLabel: '-16%' },
    { titleIncludes: 'Ar Condicionado Daikin FTXF50E 5000W', compareAtPrice: 1850.00, discountLabel: '-19%' },
    { titleIncludes: 'Ar Condicionado Fujitsu Takao M1 5200W Reversível', compareAtPrice: 1950.00, discountLabel: '-18%' },
    { titleIncludes: 'Ar Condicionado Cisampo Bodner 12000 BTU', compareAtPrice: 259.00, discountLabel: '-19%' },
    { titleIncludes: 'Ar Condicionado PRO Wifi 12.000 BTU Emelson', compareAtPrice: 369.00, discountLabel: '-19%' },
    { titleIncludes: 'Ar Condicionado Portátil Daitsu APD12FCX', compareAtPrice: 599.00, discountLabel: '-17%' },
    { titleIncludes: 'Ar Condicionado INFINITON SPTBM12A3 12.000 BTU', compareAtPrice: 399.00, discountLabel: '-19%' },
    { titleIncludes: 'Ar Condicionado Portátil Delonghi PACEM90SILENT', compareAtPrice: 549.00, discountLabel: '-18%' },
    { titleIncludes: 'Ar Condicionado Portátil Orbegozo ADR128', compareAtPrice: 369.00, discountLabel: '-18%' },
    { titleIncludes: 'Whirlpool - Ar condicionado portátil SPICR-309-W', compareAtPrice: 359.00, discountLabel: '-19%' },
    { titleIncludes: 'Ar Condicionado INFINITON 24.000 BTU Inverter A++', compareAtPrice: 720.00, discountLabel: '-18%' },
    { titleIncludes: 'LG ARTCOOL AC09BK', compareAtPrice: 799.00, discountLabel: '-17%' },
    { titleIncludes: 'Ar Condicionado Split JOCEL 12.000 BTU', compareAtPrice: 299.00, discountLabel: '-16%' },
    { titleIncludes: 'Ar Condicionado Atlantic Takao M1 3500W Inversor', compareAtPrice: 980.00, discountLabel: '-18%' },
    { titleIncludes: 'Ar Condicionado Daikin 2500W A++ com Kit Completo', compareAtPrice: 1100.00, discountLabel: '-18%' },
    { titleIncludes: 'Ar condicionado 18.000 BTU Cisampo', compareAtPrice: 699.00, discountLabel: '-18%' }
  ];

  for (const item of climatePromos) {
    const prods = await prisma.product.findMany({
      where: { title: { contains: item.titleIncludes, mode: 'insensitive' } }
    });
    for (const p of prods) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          compareAtPrice: item.compareAtPrice,
          discountLabel: item.discountLabel
        }
      });
      console.log(`Updated Climate: ${p.title} -> ${p.price}€ (was ${item.compareAtPrice}€) ${item.discountLabel}`);
    }
  }

  console.log('\n--- Checking New Promo Counts ---');
  const allProds = await prisma.product.findMany({
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

  const promoProds = allProds.filter(p => (p.compareAtPrice && p.compareAtPrice > p.price) || (p.discountLabel && p.discountLabel.trim() !== ''));
  console.log(`Total Promo products in DB now: ${promoProds.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

