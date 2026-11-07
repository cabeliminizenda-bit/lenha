'use client';

import { useState } from 'react';
import { SectionConfig } from '@/app/admin/(dashboard)/landing/LandingForm';
import Image from "next/image";

interface HeroSectionEditorProps {
  section: SectionConfig;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  updateSectionSettings: (id: string, keyOrUpdates: string | Record<string, any>, value?: any) => void;
  handleUpload: (id: string, key: string) => void;
  editingBlockNum?: number;
}

export default function HeroSectionEditor({ 
  section, 
  updateSectionSettings, 
  handleUpload 
}: HeroSectionEditorProps) {
  const [activeTab, setActiveTab] = useState<'titles' | 'buttons' | 'badges' | 'showcase' | 'background'>('titles');
  const settings = section.settings || {};

  const handleFieldChange = (key: string, value: string) => {
    updateSectionSettings(section.id, key, value);
  };

  return (
    <div className="flex flex-col h-full bg-white text-stone-800">
      {/* Editor Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">Editor do Hero Principal (Silva Dias)</h2>
            <p className="text-xs text-gray-500">Personalize o banner principal, títulos térmicos e o produto em destaque.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar border-b border-gray-200">
          <button
            onClick={() => setActiveTab('titles')}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'titles'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Títulos & Textos
          </button>
          <button
            onClick={() => setActiveTab('buttons')}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'buttons'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Botões (CTA)
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'badges'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Garantias (3 Badges)
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'showcase'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Produto Vitrine
          </button>
          <button
            onClick={() => setActiveTab('background')}
            className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'background'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Fundo do Banner
          </button>
        </div>
      </div>

      {/* Editor Content Body */}
      <div className="p-4 space-y-5 overflow-y-auto max-h-[calc(100vh-220px)]">

        {/* TAB 1: TÍTULOS & TEXTOS */}
        {activeTab === 'titles' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Badge Superior de Campanha
              </label>
              <input
                type="text"
                value={settings.campaignBadge ?? 'Campanha de Inverno 2026 • Stock Garantido em Armazém'}
                onChange={(e) => handleFieldChange('campaignBadge', e.target.value)}
                placeholder="Ex: Campanha de Inverno 2026 • Stock Garantido"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 mt-1">Exibido na pílula com indicador vermelho pulsante.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Título Principal (Linha 1)
              </label>
              <input
                type="text"
                value={settings.titlePrefix ?? 'Promoção de Inverno!'}
                onChange={(e) => handleFieldChange('titlePrefix', e.target.value)}
                placeholder="Ex: Promoção de Inverno!"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Título em Destaque Dégradé (Linha 2)
              </label>
              <input
                type="text"
                value={settings.titleGradient ?? 'FOGÃO A PELLETS & LENHA'}
                onChange={(e) => handleFieldChange('titleGradient', e.target.value)}
                placeholder="Ex: FOGÃO A PELLETS & LENHA"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none font-extrabold text-red-600"
              />
              <p className="text-[11px] text-gray-500 mt-1">Aparece com o efeito gradiente ardente (vermelho-laranja-âmbar).</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Texto Descritivo / Argumentário
              </label>
              <textarea
                rows={4}
                value={settings.description ?? 'Rendimento térmico máximo, economia comprovada e conforto para toda a família. Descubra a gama completa de equipamentos certificados Eco-Design com entrega direta em sua casa.'}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Descrição dos equipamentos de aquecimento..."
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: BOTÕES (CTA) */}
        {activeTab === 'buttons' && (
          <div className="space-y-5">
            {/* Botão 1 */}
            <div className="bg-red-50/50 p-3.5 rounded-xl border border-red-100 space-y-3">
              <span className="text-xs font-extrabold text-red-700 uppercase tracking-wider block">
                🔴 Botão Principal (Vermelho)
              </span>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texto do Botão</label>
                <input
                  type="text"
                  value={settings.cta1Text ?? 'Ver Ofertas em Destaque'}
                  onChange={(e) => handleFieldChange('cta1Text', e.target.value)}
                  placeholder="Ex: Ver Ofertas em Destaque"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ligação de Destino (URL)</label>
                <input
                  type="text"
                  value={settings.cta1Link ?? '/shop'}
                  onChange={(e) => handleFieldChange('cta1Link', e.target.value)}
                  placeholder="Ex: /shop ou #destaques"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Botão 2 */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-3">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                🚚 Botão Secundário (Simulador de Envio)
              </span>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texto do Botão</label>
                <input
                  type="text"
                  value={settings.cta2Text ?? 'Calcular Envio de Palete'}
                  onChange={(e) => handleFieldChange('cta2Text', e.target.value)}
                  placeholder="Ex: Calcular Envio de Palete"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Ação / Âncora de Scroll</label>
                <input
                  type="text"
                  value={settings.cta2Link ?? '#simulador-envio'}
                  onChange={(e) => handleFieldChange('cta2Link', e.target.value)}
                  placeholder="Ex: #simulador-envio"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GARANTIAS (3 BADGES) */}
        {activeTab === 'badges' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">Estes 3 selos de confiança aparecem abaixo dos botões de ação.</p>

            {/* Badge 1 */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <span className="text-[11px] font-bold text-gray-600 uppercase">Selo 1 (Qualidade)</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={settings.badge1Title ?? 'ENplus A1'}
                  onChange={(e) => handleFieldChange('badge1Title', e.target.value)}
                  placeholder="Título (ex: ENplus A1)"
                  className="text-xs p-2 border rounded font-bold"
                />
                <input
                  type="text"
                  value={settings.badge1Subtitle ?? 'Pellets Certificados'}
                  onChange={(e) => handleFieldChange('badge1Subtitle', e.target.value)}
                  placeholder="Subtítulo (ex: Pellets Certificados)"
                  className="text-xs p-2 border rounded text-gray-600"
                />
              </div>
            </div>

            {/* Badge 2 */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <span className="text-[11px] font-bold text-gray-600 uppercase">Selo 2 (Prazos de Entrega)</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={settings.badge2Title ?? '48 a 72h'}
                  onChange={(e) => handleFieldChange('badge2Title', e.target.value)}
                  placeholder="Título (ex: 48 a 72h)"
                  className="text-xs p-2 border rounded font-bold"
                />
                <input
                  type="text"
                  value={settings.badge2Subtitle ?? 'Entrega Rápida'}
                  onChange={(e) => handleFieldChange('badge2Subtitle', e.target.value)}
                  placeholder="Subtítulo (ex: Entrega Rápida)"
                  className="text-xs p-2 border rounded text-gray-600"
                />
              </div>
            </div>

            {/* Badge 3 */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <span className="text-[11px] font-bold text-gray-600 uppercase">Selo 3 (Pagamento Seguro)</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={settings.badge3Title ?? '100% Seguro'}
                  onChange={(e) => handleFieldChange('badge3Title', e.target.value)}
                  placeholder="Título (ex: 100% Seguro)"
                  className="text-xs p-2 border rounded font-bold"
                />
                <input
                  type="text"
                  value={settings.badge3Subtitle ?? 'MB WAY & Multibanco'}
                  onChange={(e) => handleFieldChange('badge3Subtitle', e.target.value)}
                  placeholder="Subtítulo (ex: MB WAY & Multibanco)"
                  className="text-xs p-2 border rounded text-gray-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUTO VITRINE (SHOWCASE) */}
        {activeTab === 'showcase' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Etiqueta / Badge de Poupança
              </label>
              <input
                type="text"
                value={settings.showcaseBadge ?? 'POUPANÇA -25%'}
                onChange={(e) => handleFieldChange('showcaseBadge', e.target.value)}
                placeholder="Ex: POUPANÇA -25%"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 font-bold text-red-600"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Imagem do Equipamento em Destaque
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-gray-300 overflow-hidden relative bg-stone-900 shrink-0">
                  {settings.showcaseImage ? (
                    <Image
                      src={settings.showcaseImage}
                      alt="Vitrine"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">🔥</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={settings.showcaseImage ?? 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800'}
                    onChange={(e) => handleFieldChange('showcaseImage', e.target.value)}
                    placeholder="URL da Imagem..."
                    className="w-full text-xs p-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpload(section.id, 'showcaseImage')}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>🖼️</span> Escolher da Biblioteca / Upload
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Nome do Equipamento
              </label>
              <input
                type="text"
                value={settings.showcaseTitle ?? 'Fogão / Salamandra Eco 11kW'}
                onChange={(e) => handleFieldChange('showcaseTitle', e.target.value)}
                placeholder="Ex: Fogão / Salamandra Eco 11kW"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Subtítulo / Especificação
              </label>
              <input
                type="text"
                value={settings.showcaseSubtitle ?? 'Combustão limpa • Pellets & Lenha • EcoDesign 2026'}
                onChange={(e) => handleFieldChange('showcaseSubtitle', e.target.value)}
                placeholder="Ex: Combustão limpa • Pellets & Lenha • EcoDesign 2026"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Etiqueta Técnica 1</label>
                <input
                  type="text"
                  value={settings.showcaseBadgeTech ?? '🔥 Alto Rendimento 92%'}
                  onChange={(e) => handleFieldChange('showcaseBadgeTech', e.target.value)}
                  placeholder="Ex: 🔥 Alto Rendimento 92%"
                  className="w-full text-xs p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Etiqueta Técnica 2</label>
                <input
                  type="text"
                  value={settings.showcaseBadgeTech2 ?? 'Até 110 m²'}
                  onChange={(e) => handleFieldChange('showcaseBadgeTech2', e.target.value)}
                  placeholder="Ex: Até 110 m²"
                  className="w-full text-xs p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preço Final (€)</label>
                <input
                  type="text"
                  value={settings.showcasePrice ?? '1.417,50 €'}
                  onChange={(e) => handleFieldChange('showcasePrice', e.target.value)}
                  placeholder="1.417,50 €"
                  className="w-full text-xs p-2 border rounded font-bold text-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Preço Riscado (€)</label>
                <input
                  type="text"
                  value={settings.showcaseComparePrice ?? '1.890,00 €'}
                  onChange={(e) => handleFieldChange('showcaseComparePrice', e.target.value)}
                  placeholder="1.890,00 €"
                  className="w-full text-xs p-2 border rounded line-through text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Texto de Poupança</label>
                <input
                  type="text"
                  value={settings.showcaseSavings ?? 'Poupe 472,50 €'}
                  onChange={(e) => handleFieldChange('showcaseSavings', e.target.value)}
                  placeholder="Poupe 472,50 €"
                  className="w-full text-xs p-2 border rounded text-emerald-600 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Texto do Botão de Adição
              </label>
              <input
                type="text"
                value={settings.showcaseBtnText ?? 'Adicionar ao Carrinho'}
                onChange={(e) => handleFieldChange('showcaseBtnText', e.target.value)}
                placeholder="Adicionar ao Carrinho"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* TAB 5: FUNDO DO BANNER */}
        {activeTab === 'background' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              Personalize a imagem de fundo atmosférica por trás do degradé escuro e das brasas.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                URL da Imagem de Fundo (Ambiente Térmico / Salamandra)
              </label>
              <input
                type="text"
                value={settings.bgImageUrl ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600'}
                onChange={(e) => handleFieldChange('bgImageUrl', e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg mb-2"
              />
              <button
                type="button"
                onClick={() => handleUpload(section.id, 'bgImageUrl')}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                <span>🖼️</span> Carregar Imagem de Fundo
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
