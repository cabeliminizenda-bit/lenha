const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getUpdatedShippingPolicyHTML() {
  return `
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
      A <strong>Silva Dias – Lenha & Carvão</strong> garante uma rede logística especializada para transporte de biomassa em paletes pesadas (até 1050 kg) e equipamentos térmicos em todo o Portugal Continental, Ilhas e destinos internacionais na Europa (Espanha, França e Alemanha) com camiões equipados com plataforma elevatória (hayon).
    </p>
  </div>

  {/* Section 1: Modalidades e Prazos */}
  <div class="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
    <h3 class="text-xl font-bold text-stone-900 flex items-center gap-2 border-b pb-3">
      <span class="text-red-600">1.</span> Modalidades de Envio & Prazos Oficiais
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-stone-900 text-base">🚛 Envio Standard com Plataforma</span>
          <span class="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-bold text-xs">PT: 3 a 5 dias | INT: 5 a 7 dias</span>
        </div>
        <p class="text-xs text-stone-600 leading-relaxed">
          Transporte rodoviário regular com camião equipado com plataforma traseira elevatória (hayon) e porta-paletes mecânico.
        </p>
        <ul class="text-xs text-stone-700 space-y-1 list-disc pl-4 pt-1">
          <li><strong>Portugal Continental:</strong> 3 a 5 dias úteis</li>
          <li><strong>Destinos Internacionais (ES, FR, DE):</strong> 5 a 7 dias úteis</li>
          <li><strong>Ilhas (Açores e Madeira):</strong> 5 a 10 dias úteis (saída marítima semanal)</li>
        </ul>
      </div>

      <div class="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-amber-900 text-base">⚡ Envio Expresso Prioritário</span>
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 font-bold text-xs">PT: 48h | INT: 72h</span>
        </div>
        <p class="text-xs text-stone-600 leading-relaxed">
          Expedição prioritária direta do nosso armazém logístico com agendamento dedicado e prazos garantidos de transporte:
        </p>
        <ul class="text-xs text-amber-950 space-y-1 list-disc pl-4 pt-1">
          <li><strong>Portugal Continental:</strong> 48 horas úteis</li>
          <li><strong>Destinos Internacionais (ES, FR, DE):</strong> 72 horas úteis</li>
          <li><strong>Ilhas (Açores e Madeira):</strong> 48h a 72h úteis (aéreo prioritário para volumes compactos)</li>
        </ul>
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
              <th class="p-3 border border-stone-200 text-center">Envio Standard (3-5 dias)</th>
              <th class="p-3 border border-stone-200 text-center">Envio Expresso (48h)</th>
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
            <tr class="bg-stone-50">
              <td class="p-3 font-semibold border border-stone-200" rowspan="2">2 Paletes</td>
              <td class="p-3 border border-stone-200">Zona Norte (Braga, Porto, Viana)</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-600 font-bold">GRÁTIS (0,00 €)</td>
              <td class="p-3 border border-stone-200 text-center font-bold">15,00 € total</td>
            </tr>
            <tr class="bg-stone-50">
              <td class="p-3 border border-stone-200">Outras Regiões PT Continental</td>
              <td class="p-3 border border-stone-200 text-center font-bold">16,00 € (8 € / palete)</td>
              <td class="p-3 border border-stone-200 text-center font-bold">25,00 € total</td>
            </tr>
            <tr class="bg-emerald-50/60 font-bold">
              <td class="p-3 border border-stone-200 text-emerald-900">A partir de 3 Paletes</td>
              <td class="p-3 border border-stone-200 text-emerald-900">Todo o Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-700 font-black">100% GRÁTIS</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-900">19,00 € total</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* B. Equipamentos Térmicos */}
    <div class="space-y-3 pt-3">
      <h4 class="font-bold text-stone-900 text-base flex items-center gap-2">
        <span>🔥</span> Equipamentos Térmicos (Recuperadores, Salamandras, Fogões e Caldeiras)
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-left border-collapse border border-stone-200">
          <thead>
            <tr class="bg-stone-100 text-stone-800 font-bold">
              <th class="p-3 border border-stone-200">Valor do Equipamento</th>
              <th class="p-3 border border-stone-200">Destino</th>
              <th class="p-3 border border-stone-200 text-center">Envio Standard (3-5 dias)</th>
              <th class="p-3 border border-stone-200 text-center">Envio Expresso (48h)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr>
              <td class="p-3 font-semibold border border-stone-200">Valor inferior a 500 €</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center font-bold">18,00 €</td>
              <td class="p-3 border border-stone-200 text-center font-bold">28,00 €</td>
            </tr>
            <tr class="bg-emerald-50/50">
              <td class="p-3 font-extrabold text-emerald-800 border border-stone-200">Valor igual ou superior a 500 €</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center text-emerald-700 font-black">100% GRÁTIS</td>
              <td class="p-3 border border-stone-200 text-center font-bold">18,00 €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* C. Climatizadores */}
    <div class="space-y-3 pt-3">
      <h4 class="font-bold text-stone-900 text-base flex items-center gap-2">
        <span>❄️</span> Climatização (Ar Condicionado Portátil e Split)
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm text-left border-collapse border border-stone-200">
          <thead>
            <tr class="bg-stone-100 text-stone-800 font-bold">
              <th class="p-3 border border-stone-200">Condição</th>
              <th class="p-3 border border-stone-200">Destino</th>
              <th class="p-3 border border-stone-200 text-center">Envio Standard (3-5 dias)</th>
              <th class="p-3 border border-stone-200 text-center">Envio Expresso (48h)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr>
              <td class="p-3 font-semibold border border-stone-200">1 Aparelho até 300 €</td>
              <td class="p-3 border border-stone-200">Portugal Continental</td>
              <td class="p-3 border border-stone-200 text-center font-bold">15,00 €</td>
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
              <th class="p-3 border border-stone-200">Prazos Oficiais</th>
              <th class="p-3 border border-stone-200">Condições & Tarifas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <tr>
              <td class="p-3 font-bold border border-stone-200">🇪🇸 Espanha Peninsular</td>
              <td class="p-3 border border-stone-200">Standard: 5 a 7 dias úteis<br/><span class="text-amber-700 font-bold">Expresso: 72 horas úteis</span></td>
              <td class="p-3 border border-stone-200">Portes 100% grátis a partir de 5 paletes ou equipamentos a partir de 700 €. Tarifa padrão: 35 € a 45 € por unidade (+20 € expresso 72h).</td>
            </tr>
            <tr>
              <td class="p-3 font-bold border border-stone-200">🇫🇷 França (Hexagone)</td>
              <td class="p-3 border border-stone-200">Standard: 5 a 7 dias úteis<br/><span class="text-amber-700 font-bold">Expresso: 72 horas úteis</span></td>
              <td class="p-3 border border-stone-200">Transporte internacional direto com camião plataforma. 75,00 € por palete / 45,00 € por equipamento térmico / 35,00 € por climatizador (+20 € expresso 72h).</td>
            </tr>
            <tr class="bg-stone-50">
              <td class="p-3 font-bold border border-stone-200">🇩🇪 Alemanha (Deutschland)</td>
              <td class="p-3 border border-stone-200">Standard: 5 a 7 dias úteis<br/><span class="text-amber-700 font-bold">Expresso: 72 horas úteis</span></td>
              <td class="p-3 border border-stone-200">Transporte internacional especializado Europa Central com descarga por plataforma. 75,00 € por palete / 45,00 € por equipamento térmico / 35,00 € por climatizador (+20 € expresso 72h).</td>
            </tr>
            <tr>
              <td class="p-3 font-bold border border-stone-200">🏝️ Açores e Madeira</td>
              <td class="p-3 border border-stone-200">5 a 10 dias úteis (Marítimo regular)<br/><span class="text-amber-700 font-bold">Aéreo: 48h a 72h</span></td>
              <td class="p-3 border border-stone-200">Saída semanal dos portos de Leixões ou Lisboa. Taxa de 75 € para cargas pesadas / paletes e 25 € para climatizadores.</td>
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
  `.trim();
}

async function run() {
  const content = getUpdatedShippingPolicyHTML();
  
  for (const slug of ['expedicao', 'politica-de-expedicao']) {
    const updated = await prisma.page.updateMany({
      where: { slug },
      data: {
        desktopContent: content,
        mobileContent: content,
        updatedAt: new Date()
      }
    });
    console.log(`Updated page "${slug}": ${updated.count} record(s)`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

