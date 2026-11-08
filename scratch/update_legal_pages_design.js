const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const devolucoesHTML = `
<div class="space-y-6 text-stone-700 leading-relaxed font-sans">
  
  <div class="p-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-4">
    <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xl font-bold">
      🛡️
    </div>
    <div class="space-y-1">
      <h3 class="text-base font-bold text-stone-900">Compromisso de Satisfação & Transparência Silva Dias</h3>
      <p class="text-xs sm:text-sm text-stone-600">
        Na <strong>Lenha & Carvão Silva Dias</strong>, a confiança nas suas compras de biomassa e equipamentos é prioridade absoluta. Beneficia de todas as garantias previstas na legislação portuguesa e comunitária de defesa do consumidor.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Secção 1: Direito de Livre Resolução -->
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</span>
        <h3 class="text-base font-bold text-stone-900">Direito de Livre Resolução (14 Dias)</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Nos termos do <strong>Decreto-Lei n.º 24/2014, de 14 de fevereiro</strong>, o cliente dispõe de um prazo legal de <strong>14 dias de calendário</strong>, a contar do dia da receção física dos bens na sua morada, para resolver o contrato sem necessidade de justificação.
      </p>
    </div>

    <!-- Secção 2: Prazos e Meios de Reembolso -->
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">2</span>
        <h3 class="text-base font-bold text-stone-900">Prazos e Meios de Reembolso</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Após a receção e validação do estado dos artigos no nosso entreposto em Braga, o reembolso integral é processado no prazo de <strong>5 a 7 dias úteis</strong> através do método de pagamento original (MB WAY, transferência bancária direta ou estorno no cartão).
      </p>
    </div>

  </div>

  <!-- Secção 3: Condições dos Artigos a Devolver -->
  <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-4">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">3</span>
      <h3 class="text-base font-bold text-stone-900">Condições dos Artigos a Devolver</h3>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
      <div class="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
        <div class="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-800">
          <span>🪵</span> Combustíveis (Paletes de Lenha e Pellets)
        </div>
        <p class="text-xs text-stone-600 leading-relaxed">
          Os sacos ou paletes devem manter-se rigorosamente selados, secos, sem perfurações na película impermeável e sem sinais de humidade ou intempéries.
        </p>
      </div>

      <div class="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
        <div class="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-stone-800">
          <span>🔥</span> Equipamentos (Salamandras, Recuperadores e Climatização)
        </div>
        <p class="text-xs text-stone-600 leading-relaxed">
          Devem encontrar-se rigorosamente novos, nunca acendidos nem ligados à rede elétrica/chaminé, na embalagem original intacta, acompanhados de manuais, comandos e garantia.
        </p>
      </div>
    </div>
  </div>

  <!-- Secção 4: Procedimento de Recolha de Carga Pesada -->
  <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">4</span>
      <h3 class="text-base font-bold text-stone-900">Recolha Especializada com Camião Plataforma</h3>
    </div>
    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
      Devido ao peso e volume das paletes e recuperadores de calor pesados, disponibilizamos um serviço de agendamento de recolha direta na sua morada com <strong>camião equipado com plataforma elevatória e porta-paletes</strong>. Os custos diretos de transporte de devolução são comunicados previamente de forma clara e transparente.
    </p>
  </div>

  <!-- Secção 5: Como Acionar a sua Devolução -->
  <div class="p-6 bg-red-50/50 rounded-2xl border border-red-200 space-y-3">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">5</span>
      <h3 class="text-base font-bold text-stone-900">Como Solicitar a Devolução</h3>
    </div>
    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
      Para iniciar o processo, envie um e-mail para <strong class="text-red-700">cabeliminizenda@gmail.com</strong> indicando o número da sua encomenda, fotografias do produto e motivo da devolução. A nossa equipa de apoio entrará em contacto nas 24 horas úteis seguintes.
    </p>
  </div>

</div>
`;

const termosHTML = `
<div class="space-y-6 text-stone-700 leading-relaxed font-sans">
  
  <div class="p-6 bg-stone-50/80 border border-stone-200/80 rounded-2xl space-y-2">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 text-stone-800 font-bold text-xs uppercase tracking-wider mb-1">
      <span>📜</span>
      <span>Enquadramento Geral das Vendas Online</span>
    </div>
    <p class="text-xs sm:text-sm text-stone-600">
      Os presentes Termos e Condições Gerais de Venda regem todas as transações comerciais efetuadas na loja online da <strong>Lenha & Carvão Silva Dias</strong>, sedeada em Braga, Portugal, em conformidade com o enquadramento legal português do comércio eletrónico.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Secção 1: Identificação do Vendedor -->
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</span>
        <h3 class="text-base font-bold text-stone-900">Identificação do Operador</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Loja online gerida por <strong>Lenha & Carvão Silva Dias</strong>, especialista em combustíveis biomassa, lenha de sobro e azinho calibrada, recuperadores e climatizadores em Portugal Continental e Espanha. E-mail oficial: <strong>cabeliminizenda@gmail.com</strong>.
      </p>
    </div>

    <!-- Secção 2: Preços e Taxa de IVA -->
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">2</span>
        <h3 class="text-base font-bold text-stone-900">Preços e IVA Incluído</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Todos os preços indicados incluem IVA à taxa legal em vigor em Portugal. As encomendas estão sujeitas a confirmação imediata de stock e disponibilidade logística nos nossos centros de distribuição.
      </p>
    </div>

  </div>

  <!-- Secção 3: Garantia Legal de 3 Anos -->
  <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">3</span>
      <h3 class="text-base font-bold text-stone-900">Garantia Legal de 3 Anos (DL n.º 84/2021)</h3>
    </div>
    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
      Todos os equipamentos e aparelhos elétricos ou de combustão (salamandras, recuperadores de calor, climatizadores e caldeiras) beneficiam da <strong>garantia legal de 3 anos</strong> para o consumidor final, nos termos do Decreto-Lei n.º 84/2021, contra quaisquer defeitos de fabrico ou conformidade.
    </p>
  </div>

  <!-- Secção 4: Modos de Pagamento -->
  <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">4</span>
      <h3 class="text-base font-bold text-stone-900">Pagamento Seguro e Faturação</h3>
    </div>
    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
      Disponibilizamos métodos de pagamento auditados: Transferência Bancária direta com upload de comprovativo, Cartão de Crédito/Débito processado com encriptação SSL e MB WAY. A fatura com NIF/NIPC é gerada e enviada por e-mail após confirmação do pedido.
    </p>
  </div>

  <!-- Secção 5: Livro de Reclamações & RAL -->
  <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">5</span>
      <h3 class="text-base font-bold text-stone-900">Resolução de Litígios & Livro de Reclamações</h3>
    </div>
    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
      Em cumprimento da legislação em vigor, disponibilizamos o acesso ao <strong>Livro de Reclamações Online</strong> em <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" class="text-red-600 font-semibold underline">www.livroreclamacoes.pt</a> e a entidades de Resolução Alternativa de Litígios de Consumo (CNIACC / CIAB).
    </p>
  </div>

</div>
`;

const privacidadeHTML = `
<div class="space-y-6 text-stone-700 leading-relaxed font-sans">
  
  <div class="p-6 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-4">
    <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 text-xl font-bold">
      🔒
    </div>
    <div class="space-y-1">
      <h3 class="text-base font-bold text-stone-900">Compromisso RGPD (Regulamento UE 2016/679)</h3>
      <p class="text-xs sm:text-sm text-stone-600">
        A <strong>Lenha & Carvão Silva Dias</strong> garante a total confidencialidade, integridade e proteção dos seus dados pessoais. Tratamos apenas as informações estritamente necessárias ao processamento das suas encomendas e faturação fiscal.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Secção 1: Dados Recolhidos -->
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</span>
        <h3 class="text-base font-bold text-stone-900">Finalidade dos Dados Recolhidos</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Recolhemos exclusivamente os dados imprescindíveis para: emissão da fatura legal (Nome, NIF/NIPC, morada fiscal) e encaminhamento logístico da carga (morada de descarga, contacto telefónico do destinatário).
      </p>
    </div>

    <!-- Secção 2: Partilha Estritamente Operacional -->
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">2</span>
        <h3 class="text-base font-bold text-stone-900">Não Cedência a Terceiros Comerciais</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Os seus dados nunca são vendidos, alugados ou partilhados com entidades terceiras para fins de marketing. São transmitidos unicamente ao transportador para efeito de entrega física e à Autoridade Tributária para faturação.
      </p>
    </div>

  </div>

  <!-- Secção 3: Direitos do Titular -->
  <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">3</span>
      <h3 class="text-base font-bold text-stone-900">Exercício dos seus Direitos</h3>
    </div>
    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
      A qualquer momento, o titular pode solicitar o acesso, retificação, oposição, portabilidade ou eliminação dos seus dados nos termos do RGPD. Basta enviar uma mensagem simples para <strong class="text-red-700">cabeliminizenda@gmail.com</strong> com o assunto "RGPD / Dados Pessoais".
    </p>
  </div>

</div>
`;

const garantiaHTML = `
<div class="space-y-6 text-stone-700 leading-relaxed font-sans">
  
  <div class="p-6 bg-stone-50/80 border border-stone-200/80 rounded-2xl flex items-start gap-4">
    <div class="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0 text-xl font-bold">
      🛡️
    </div>
    <div class="space-y-1">
      <h3 class="text-base font-bold text-stone-900">Garantia Oficial Silva Dias de 3 Anos</h3>
      <p class="text-xs sm:text-sm text-stone-600">
        Todos os equipamentos de biomassa e climatização comercializados pela <strong>Lenha & Carvão Silva Dias</strong> cumprem os mais rigorosos padrões europeus (EcoDesign 2022) e contam com garantia legal completa.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</span>
        <h3 class="text-base font-bold text-stone-900">Equipamentos Abrangidos</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Salamandras a pellets, salamandras a lenha, recuperadores de calor ventilados, caldeiras a biomassa e sistemas de ar condicionado/climatização portátil e mural.
      </p>
    </div>

    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">2</span>
        <h3 class="text-base font-bold text-stone-900">Prazo de Garantia</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        <strong>3 anos</strong> para uso doméstico/particular (Decreto-Lei n.º 84/2021) e <strong>1 ano</strong> para aquisições registadas sob NIF empresarial/profissional para exploração comercial.
      </p>
    </div>

  </div>

  <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
    <div class="flex items-center gap-3">
      <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">3</span>
      <h3 class="text-base font-bold text-stone-900">Assistência Técnica & Ativação</h3>
    </div>
    <p class="text-xs sm:text-sm text-stone-600 leading-relaxed">
      Para acionar a garantia, guarde a sua fatura de compra. A assistência técnica é assegurada diretamente pelos centros de assistência técnica autorizados dos respetivos fabricantes em Portugal ou pela nossa equipa de apoio através de <strong class="text-red-700">cabeliminizenda@gmail.com</strong>.
    </p>
  </div>

</div>
`;

const faturacaoHTML = `
<div class="space-y-6 text-stone-700 leading-relaxed font-sans">
  
  <div class="p-6 bg-stone-50/80 border border-stone-200/80 rounded-2xl flex items-start gap-4">
    <div class="w-10 h-10 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center shrink-0 text-xl font-bold">
      🧾
    </div>
    <div class="space-y-1">
      <h3 class="text-base font-bold text-stone-900">Faturação Certificada pela Autoridade Tributária</h3>
      <p class="text-xs sm:text-sm text-stone-600">
        Todas as encomendas faturadas pela <strong>Lenha & Carvão Silva Dias</strong> são comunicadas eletronicamente à Autoridade Tributária e Aduaneira (AT) de acordo com a legislação fiscal portuguesa.
      </p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">1</span>
        <h3 class="text-base font-bold text-stone-900">Inclusão de NIF / NIPC</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Disponibilizamos no checkout campos específicos para particulares e empresas indicarem o seu <strong>Nome da Empresa e NIF/NIPC</strong>, garantindo faturas dedutíveis e em conformidade contábil.
      </p>
    </div>

    <div class="p-6 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">2</span>
        <h3 class="text-base font-bold text-stone-900">Envio Automático em PDF</h3>
      </div>
      <p class="text-xs sm:text-sm text-stone-600">
        Após a confirmação e receção do pagamento, a fatura em formato PDF é gerada automaticamente e enviada para o e-mail associado à encomenda.
      </p>
    </div>

  </div>

</div>
`;

async function main() {
  const updates = [
    { slugs: ['devolucoes', 'politica-de-devolucao-e-reembolso'], title: 'Política de Devolução e Reembolso', html: devolucoesHTML },
    { slugs: ['termos-e-condicoes', 'condicoes-gerais-de-venda'], title: 'Termos e Condições Gerais de Venda', html: termosHTML },
    { slugs: ['privacidade', 'politica-de-privacidade'], title: 'Política de Privacidade e Proteção de Dados (RGPD)', html: privacidadeHTML },
    { slugs: ['politica-de-garantia', 'politica-de-garantia-2'], title: 'Política de Garantia de Equipamentos', html: garantiaHTML },
    { slugs: ['politica-de-faturacao'], title: 'Política de Faturação & Dados Fiscais', html: faturacaoHTML }
  ];

  for (const item of updates) {
    for (const slug of item.slugs) {
      const page = await prisma.page.findUnique({ where: { slug } });
      if (page) {
        await prisma.page.update({
          where: { slug },
          data: {
            title: item.title,
            desktopContent: item.html,
            mobileContent: item.html,
            isPublished: true
          }
        });
        console.log(`Updated page: ${slug}`);
      }
    }
  }

  console.log('All legal pages have been successfully updated in database!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

