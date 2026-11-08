const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const modernShippingPolicyHTML = `
<div class="space-y-8 text-stone-800 leading-relaxed font-sans max-w-4xl mx-auto py-2">
  
  {/* Intro Header */}
  <div class="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-stone-700">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider mb-3">
      <span>🚛</span>
      <span>Logística & Política de Expedição Oficial</span>
    </div>
    <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
      Condições de Envio, Prazos e Tarifas Calibradas Silva Dias
    </h2>
    <p class="text-stone-300 text-sm sm:text-base leading-relaxed">
      A <strong>Silva Dias – Lenha & Carvão</strong> garante uma rede logística especializada para transporte de biomassa em paletes pesadas (até 1050 kg) e equipamentos térmicos em todo o Portugal Continental, Ilhas e destinos internacionais selecionados.
    </p>
  </div>

  {/* Section 1: Modalidades */}
  <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
    <h3 class="text-xl font-bold text-stone-900 flex items-center gap-2 border-b pb-3">
      <span class="text-red-600">1.</span> Modalidades de Envio Disponíveis
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-stone-900 text-base">🚛 Envio Standard com Plataforma</span>
          <span class="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold text-xs">48h a 72h</span>
        </div>
        <p class="text-xs text-stone-600 leading-relaxed">
          Transporte rodoviário regular com camião equipado com plataforma elevatória traseira e porta-paletes. Ideal para paletes de pellets, lenha de sobro e grandes equipamentos térmicos.
        </p>
      </div>
      <div class="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-amber-900 text-base">⚡ Envio Expresso Prioritário</span>
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 font-bold text-xs">24h a 48h</span>
        </div>
        <p class="text-xs text-stone-600 leading-relaxed">
          Saída prioritária do nosso armazém central com agendamento telefónico preferencial e entrega acelerada em 24h na Zona Norte e 24h a 48h nas restantes regiões.
        </p>
      </div>
    </div>
  </div>

  {/* Section 2: Tabela de Tarifas */}
  <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
    <h3 class="text-xl font-bold text-stone-900 flex items-center gap-2 border-b pb-3">
      <span class="text-red-600">2.</span> Tabela de Tarifas Calibradas por Categoria
    </h3>

    {/* A. Paletes */}
    <div class="space-y-3">
      <h4 class="font-bold text-stone-900 text-base flex items-center gap-2">
        <span>🪵</span> Paletes de Biomassa (Pellets ENplus A1 e Lenha de Sobro / Azinho)
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-left border-collapse border border-stone-200">
          <thead>
            <tr class="bg-stone-100 text-stone-800 font-bold">
              <th class="p-3 border border-stone-200">Quantidade de Paletes</th>
              <th class="p-3 border border-stone-200">Zona de Entrega</th>
              <th class="p-3 border border-stone-200 text-center">Envio Standard</th>
              <th class="p-3 border border-stone-200 text-center">Envio Expresso (24h)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr>
              <td class="p-3 font-semibold border border-stone-200" rowspan="3">1 Palete</td>
              <td class="p-3 border border-stone-200">Braga (Sede & Entrega Direta)</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-600 font-bold">GRÁTIS (0,00 €)</td>
              <td class="p-3 border border-stone-200 text-center font-bold">10,00 €</td>
            </tr>
            <tr>
              <td class="p-3 border border-stone-200">Zona Norte (Porto, Viana do Castelo)</td>
              <td class="p-3 border border-stone-200 text-center font-bold">10,00 €</td>
              <td class="p-3 border border-stone-200 text-center font-bold">18,00 €</td>
            </tr>
            <tr>
              <td class="p-3 border border-stone-200">Outras Regiões PT Continental (Centro, Lisboa, Alentejo, Algarve)</td>
              <td class="p-3 border border-stone-200 text-center font-bold">Máx. 15,00 €</td>
              <td class="p-3 border border-stone-200 text-center font-bold">25,00 €</td>
            </tr>
            <tr class="bg-stone-50/50">
              <td class="p-3 font-semibold border border-stone-200" rowspan="2">2 Paletes</td>
              <td class="p-3 border border-stone-200">Zona Norte (Braga, Porto, Viana)</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-600 font-bold">100% GRÁTIS</td>
              <td class="p-3 border border-stone-200 text-center font-bold">15,00 € (Total)</td>
            </tr>
            <tr class="bg-stone-50/50">
              <td class="p-3 border border-stone-200">Outras Regiões PT Continental</td>
              <td class="p-3 border border-stone-200 text-center font-bold">16,00 € (8 € / palete)</td>
              <td class="p-3 border border-stone-200 text-center font-bold">25,00 € (Total)</td>
            </tr>
            <tr class="bg-emerald-50/50">
              <td class="p-3 font-extrabold text-emerald-800 border border-stone-200">A partir de 3 Paletes</td>
              <td class="p-3 font-bold border border-stone-200">Todo o Território Nacional Continental</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-700 font-black text-base">100% OFERECIDO</td>
              <td class="p-3 border border-stone-200 text-center font-bold">19,00 €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* B. Recuperadores e Fogões */}
    <div class="space-y-3 pt-3">
      <h4 class="font-bold text-stone-900 text-base flex items-center gap-2">
        <span>🔥</span> Recuperadores de Calor, Lareiras, Salamandras e Fogões
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-left border-collapse border border-stone-200">
          <thead>
            <tr class="bg-stone-100 text-stone-800 font-bold">
              <th class="p-3 border border-stone-200">Valor do Equipamento</th>
              <th class="p-3 border border-stone-200">Cobertura</th>
              <th class="p-3 border border-stone-200 text-center">Envio Standard</th>
              <th class="p-3 border border-stone-200 text-center">Envio Expresso (24h/48h)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr class="bg-emerald-50/50">
              <td class="p-3 font-extrabold text-emerald-800 border border-stone-200">Valor igual ou superior a 500 €</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-700 font-black">100% GRÁTIS</td>
              <td class="p-3 border border-stone-200 text-center font-bold">18,00 €</td>
            </tr>
            <tr>
              <td class="p-3 font-semibold border border-stone-200">Valor inferior a 500 €</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center font-bold">18,00 €</td>
              <td class="p-3 border border-stone-200 text-center font-bold">28,00 €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* C. Climatizadores */}
    <div class="space-y-3 pt-3">
      <h4 class="font-bold text-stone-900 text-base flex items-center gap-2">
        <span>❄️</span> Climatizadores e Aparelhos de Ar Condicionado
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-left border-collapse border border-stone-200">
          <thead>
            <tr class="bg-stone-100 text-stone-800 font-bold">
              <th class="p-3 border border-stone-200">Critério</th>
              <th class="p-3 border border-stone-200">Cobertura</th>
              <th class="p-3 border border-stone-200 text-center">Envio Standard</th>
              <th class="p-3 border border-stone-200 text-center">Envio Expresso (24h)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr>
              <td class="p-3 font-semibold border border-stone-200">1 Aparelho até 300 €</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center font-bold">18,00 €</td>
              <td class="p-3 border border-stone-200 text-center font-bold">25,00 €</td>
            </tr>
            <tr class="bg-emerald-50/50">
              <td class="p-3 font-extrabold text-emerald-800 border border-stone-200">1 Aparelho superior a 300 €</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-700 font-black">100% GRÁTIS</td>
              <td class="p-3 border border-stone-200 text-center font-bold">15,00 €</td>
            </tr>
            <tr class="bg-emerald-50/50">
              <td class="p-3 font-extrabold text-emerald-800 border border-stone-200">A partir de 2 Aparelhos</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-700 font-black">100% GRÁTIS</td>
              <td class="p-3 border border-stone-200 text-center font-bold">15,00 €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* D. Internacional e Ilhas */}
    <div class="space-y-3 pt-3">
      <h4 class="font-bold text-stone-900 text-base flex items-center gap-2">
        <span>🌍</span> Destinos Internacionais & Ilhas Autónomas
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-left border-collapse border border-stone-200">
          <thead>
            <tr class="bg-stone-100 text-stone-800 font-bold">
              <th class="p-3 border border-stone-200">Destino</th>
              <th class="p-3 border border-stone-200">Prazos Médios</th>
              <th class="p-3 border border-stone-200">Condições & Isenções</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr>
              <td class="p-3 font-bold border border-stone-200">🇪🇸 Espanha Peninsular</td>
              <td class="p-3 border border-stone-200">3 a 5 dias úteis (48h expresso)</td>
              <td class="p-3 border border-stone-200">Portes grátis a partir de 5 paletes ou equipamentos a partir de 700 €. Tarifa padrão de 35 € a 45 €.</td>
            </tr>
            <tr>
              <td class="p-3 font-bold border border-stone-200">🇫🇷 França (Hexagone)</td>
              <td class="p-3 border border-stone-200">5 a 7 dias úteis (72h expresso)</td>
              <td class="p-3 border border-stone-200">Envio internacional especializado com camião plataforma. 75 € por palete / 45 € por equipamento.</td>
            </tr>
            <tr>
              <td class="p-3 font-bold border border-stone-200">🏝️ Açores e Madeira</td>
              <td class="p-3 border border-stone-200">5 a 10 dias úteis (Marítimo regular)</td>
              <td class="p-3 border border-stone-200">Saída semanal via porto de Leixões ou Lisboa. Taxa regular de 75 € para cargas pesadas e 25 € para climatizadores.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Section 3: Condições de Descarga */}
  <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
    <h3 class="text-xl font-bold text-stone-900 flex items-center gap-2 border-b pb-3">
      <span class="text-red-600">3.</span> Descarga com Plataforma Elevatória Traseira (Hayon)
    </h3>
    <ul class="space-y-2 text-stone-700 text-sm list-disc pl-5">
      <li><strong>Equipamento de Descarga Incluído:</strong> Todas as encomendas de paletes e equipamentos de aquecimento são descarregadas por camiões equipados com plataforma hidráulica elevatória traseira e porta-paletes mecânico ou elétrico.</li>
      <li><strong>Acesso à Propriedade:</strong> A descarga é efetuada ao nível do solo, até ao portão, garagem ou entrada da propriedade do cliente, desde que exista piso plano pavimentado e livre de obstáculos.</li>
      <li><strong>Contacto Prévio por Telefone:</strong> O motorista ou a central de tráfego entra em contacto com o cliente no dia útil anterior ou na manhã da entrega para confirmar a disponibilidade do destinatário.</li>
    </ul>
  </div>

  {/* Section 4: Contacto */}
  <div class="bg-stone-900 text-stone-200 p-6 rounded-2xl border border-stone-800 space-y-3">
    <h3 class="text-lg font-bold text-white flex items-center gap-2">
      <span>📞</span> Dúvidas sobre Logística ou Agendamentos Especiais
    </h3>
    <p class="text-xs sm:text-sm text-stone-300">
      A nossa equipa de apoio ao cliente está disponível para coordenar entregas especiais, acessos restritos ou encomendas em grande volume.
    </p>
    <div class="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold">
      <div>📧 Email: <a href="mailto:cabeliminizenda@gmail.com" class="text-red-400 hover:underline">cabeliminizenda@gmail.com</a></div>
      <div>📞 Telefone: <span class="text-white">+351 253 000 000</span></div>
      <div>📍 Sede: <span class="text-white">Braga, Portugal</span></div>
    </div>
  </div>

</div>
`;

async function main() {
  // Update 'expedicao'
  const expPage = await prisma.page.upsert({
    where: { slug: 'expedicao' },
    update: {
      title: 'Expedição e Entrega de Paletes & Equipamentos',
      desktopContent: modernShippingPolicyHTML,
      mobileContent: modernShippingPolicyHTML,
      isPublished: true,
      metaTitle: 'Expedição e Entrega de Paletes | Lenha & Carvão Silva Dias',
      metaDescription: 'Consulte as tarifas calibradas de envio de paletes, recuperadores e climatizadores em Portugal e destinos internacionais.'
    },
    create: {
      slug: 'expedicao',
      title: 'Expedição e Entrega de Paletes & Equipamentos',
      desktopContent: modernShippingPolicyHTML,
      mobileContent: modernShippingPolicyHTML,
      isPublished: true,
      metaTitle: 'Expedição e Entrega de Paletes | Lenha & Carvão Silva Dias',
      metaDescription: 'Consulte as tarifas calibradas de envio de paletes, recuperadores e climatizadores em Portugal e destinos internacionais.'
    }
  });
  console.log('Updated /expedicao:', expPage.id, expPage.title);

  // Update 'politica-de-expedicao'
  const polPage = await prisma.page.upsert({
    where: { slug: 'politica-de-expedicao' },
    update: {
      title: 'Política de Expedição & Condições de Entrega',
      desktopContent: modernShippingPolicyHTML,
      mobileContent: modernShippingPolicyHTML,
      isPublished: true,
      metaTitle: 'Política de Expedição Oficial | Lenha & Carvão Silva Dias',
      metaDescription: 'Condições de transporte especializado, prazos e taxas de entrega standard e expresso para Portugal, Espanha e França.'
    },
    create: {
      slug: 'politica-de-expedicao',
      title: 'Política de Expedição & Condições de Entrega',
      desktopContent: modernShippingPolicyHTML,
      mobileContent: modernShippingPolicyHTML,
      isPublished: true,
      metaTitle: 'Política de Expedição Oficial | Lenha & Carvão Silva Dias',
      metaDescription: 'Condições de transporte especializado, prazos e taxas de entrega standard e expresso para Portugal, Espanha e França.'
    }
  });
  console.log('Updated /politica-de-expedicao:', polPage.id, polPage.title);
}

main().catch(console.error).finally(() => prisma.$disconnect());

