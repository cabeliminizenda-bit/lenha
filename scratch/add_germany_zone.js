const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('--- Configuring Germany (Alemanha) Shipping Zone ---');
  let germanyZone = await prisma.shippingZone.findUnique({
    where: { name: 'Alemanha' },
    include: { methods: true }
  });

  if (!germanyZone) {
    germanyZone = await prisma.shippingZone.create({
      data: {
        name: 'Alemanha',
        isActive: true
      },
      include: { methods: true }
    });
    console.log('Created ShippingZone: Alemanha with id', germanyZone.id);
  } else {
    console.log('Existing ShippingZone: Alemanha with id', germanyZone.id);
  }

  const desiredMethods = [
    {
      type: 'Envio Internacional Alemanha (Palete de Biomassa Especializada)',
      rate: 75.0,
      minOrderAmount: null,
      isActive: true
    },
    {
      type: 'Envio Equipamento Térmico Alemanha',
      rate: 45.0,
      minOrderAmount: null,
      isActive: true
    },
    {
      type: 'Envio Climatizador Alemanha',
      rate: 35.0,
      minOrderAmount: null,
      isActive: true
    },
    {
      type: 'Envio Expresso Alemanha (72h)',
      rate: 65.0,
      minOrderAmount: null,
      isActive: true
    },
    {
      type: 'Portes Grátis Alemanha (Grandes Volumes > 2500€)',
      rate: 0.0,
      minOrderAmount: 2500.0,
      isActive: true
    }
  ];

  for (const m of desiredMethods) {
    const existing = germanyZone.methods.find(em => em.type === m.type);
    if (!existing) {
      const created = await prisma.shippingMethod.create({
        data: {
          zoneId: germanyZone.id,
          type: m.type,
          rate: m.rate,
          minOrderAmount: m.minOrderAmount,
          isActive: m.isActive
        }
      });
      console.log(`Created method "${m.type}" with id ${created.id}`);
    } else {
      console.log(`Method "${m.type}" already exists: id ${existing.id}`);
    }
  }

  const finalZone = await prisma.shippingZone.findUnique({
    where: { name: 'Alemanha' },
    include: { methods: true }
  });
  console.log('Final Germany Zone methods:', JSON.stringify(finalZone.methods, null, 2));
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

