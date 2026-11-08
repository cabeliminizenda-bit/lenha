const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const zones = await prisma.shippingZone.findMany({ include: { methods: true } });
  const ptCont = zones.find(z => z.name === 'Portugal Continental');
  if (ptCont) {
    const existingExpress = ptCont.methods.find(m => m.type.toLowerCase().includes('expresso'));
    if (!existingExpress) {
      const created = await prisma.shippingMethod.create({
        data: {
          zoneId: ptCont.id,
          type: 'Entrega Expresso Prioritária 24h/48h',
          rate: 25.0,
          isActive: true
        }
      });
      console.log('Created PT Continental Express Method:', created);
    } else {
      console.log('PT Continental Express already exists:', existingExpress);
    }
  }

  const esPen = zones.find(z => z.name === 'Espanha Peninsular');
  if (esPen) {
    const existingExpress = esPen.methods.find(m => m.type.toLowerCase().includes('expresso'));
    if (!existingExpress) {
      const created = await prisma.shippingMethod.create({
        data: {
          zoneId: esPen.id,
          type: 'Envio Expresso Ibérico 48h',
          rate: 45.0,
          isActive: true
        }
      });
      console.log('Created ES Express Method:', created);
    } else {
      console.log('ES Express already exists:', existingExpress);
    }
  }

  // Print all updated methods
  const updatedZones = await prisma.shippingZone.findMany({ include: { methods: true } });
  for (const z of updatedZones) {
    console.log(`\nZone: ${z.name}`);
    for (const m of z.methods) {
      console.log(`  - [${m.id}] ${m.type} (${m.rate}€)`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

