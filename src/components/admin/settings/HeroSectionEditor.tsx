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
  // We use an accordion list format so all items are listed vertically
  const [openSection, setOpenSection] = useState<string>('background');
  const settings = section.settings || {};

  const handleFieldChange = (key: string, value: any) => {
    updateSectionSettings(section.id, key, value);
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSection(prev => prev === sectionKey ? '' : sectionKey);
  };

  const isShowcaseVisible = settings.showShowcase !== false && settings.showShowcase !== 'false';
  const isShowcaseImageVisible = settings.showShowcaseImage !== false && settings.showShowcaseImage !== 'false';
  const isTrustBadgesVisible = settings.showTrustBadges !== false && settings.showTrustBadges !== 'false';

  return (
    <div className="flex flex-col h-full bg-white text-stone-800">
      {/* Editor Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/90">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <h2 className="font-bold text-gray-900 text-sm">Configurações do Hero Principal</h2>
            <p className="text-xs text-gray-500">Clique numa secção abaixo para expandir e editar os parâmetros.</p>
          </div>
        </div>
      </div>

      {/* Accordion LIST of Settings (Vertical) */}
      <div className="p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-210px)]">

        {/* ITEM 1: IMAGEM DE FUNDO GLOBAL (HERO BG) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection('background')}
            className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${
              openSection === 'background' ? 'bg-red-50/70 border-b border-red-100' : 'bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🖼️</span>
              <div>
                <span className="text-xs font-bold text-gray-900 block">1. Imagem de Fundo (Hero BG)</span>
                <span className="text-[11px] text-gray-500">Fundo atmosférico do banner principal</span>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'background' ? 'rotate-180 text-red-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'background' && (
            <div className="p-4 space-y-4 bg-white">
              {/* Image Preview & Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Imagem de Fundo Ativa
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-16 rounded-xl border border-gray-300 overflow-hidden relative bg-stone-950 shrink-0">
                    {settings.bgImageUrl ? (
                      <Image
                        src={settings.bgImageUrl}
                        alt="Hero BG"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-gray-400">Sem fundo</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={settings.bgImageUrl ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600'}
                      onChange={(e) => handleFieldChange('bgImageUrl', e.target.value)}
                      placeholder="URL da Imagem..."
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpload(section.id, 'bgImageUrl')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <span>🖼️</span> Carregar / Escolher Fundo
                    </button>
                  </div>
                </div>
              </div>

              {/* Opacity Control */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Visibilidade / Opacidade da Imagem de Fundo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={settings.bgOverlayOpacity ?? 0.60}
                    onChange={(e) => handleFieldChange('bgOverlayOpacity', parseFloat(e.target.value))}
                    className="flex-1 accent-red-600"
                  />
                  <span className="text-xs font-bold text-gray-700 w-12 text-right">
                    {Math.round((parseFloat(settings.bgOverlayOpacity ?? '0.60')) * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Aumente para 70%-90% se desejar a imagem bem clara e visível.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ITEM 2: PRODUTO VITRINE & IMAGEM (CARTÃO LATERAL) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection('showcase')}
            className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${
              openSection === 'showcase' ? 'bg-red-50/70 border-b border-red-100' : 'bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🎯</span>
              <div>
                <span className="text-xs font-bold text-gray-900 block">2. Cartão Vitrine do Produto</span>
                <span className="text-[11px] text-gray-500">
                  {isShowcaseVisible ? 'Visível (à direita)' : 'Oculto (largura total)'}
                </span>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'showcase' ? 'rotate-180 text-red-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'showcase' && (
            <div className="p-4 space-y-4 bg-white">
              {/* TOGGLE 1: Exibir ou Não o Bloco Vitrine */}
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">Exibir Cartão Vitrine</span>
                  <span className="text-[11px] text-stone-500">
                    {isShowcaseVisible ? 'Ativado à direita' : 'Oculto (hero em largura total)'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isShowcaseVisible}
                    onChange={(e) => handleFieldChange('showShowcase', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {isShowcaseVisible && (
                <div className="space-y-4 pt-1">
                  {/* TOGGLE 2: Exibir Imagem dentro do Cartão */}
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">Exibir Imagem do Equipamento</span>
                      <span className="text-[11px] text-stone-500">Mostra a moldura com imagem.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isShowcaseImageVisible}
                        onChange={(e) => handleFieldChange('showShowcaseImage', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-800"></div>
                    </label>
                  </div>

                  {/* IMAGEM PRINCIPAL DO EQUIPAMENTO */}
                  {isShowcaseImageVisible && (
                    <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Imagem do Equipamento
                      </label>

                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl border border-gray-300 overflow-hidden relative bg-stone-950 shrink-0 flex items-center justify-center">
                          {settings.showcaseImage ? (
                            <Image
                              src={settings.showcaseImage}
                              alt="Showcase"
                              fill
                              className={settings.showcaseImageFit === 'cover' ? 'object-cover' : 'object-contain p-1'}
                            />
                          ) : (
                            <span className="text-2xl">🔥</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            value={settings.showcaseImage ?? 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'}
                            onChange={(e) => handleFieldChange('showcaseImage', e.target.value)}
                            placeholder="URL da imagem..."
                            className="w-full text-xs p-1.5 border border-gray-300 rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpload(section.id, 'showcaseImage')}
                            className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded shadow-sm"
                          >
                            Carregar / Escolher
                          </button>
                        </div>
                      </div>

                      {/* Ajuste de Enquadramento */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-gray-600">Ajuste da foto:</span>
                        <select
                          value={settings.showcaseImageFit ?? 'contain'}
                          onChange={(e) => handleFieldChange('showcaseImageFit', e.target.value)}
                          className="text-xs p-1 border rounded"
                        >
                          <option value="contain">Sem cortar (Contain)</option>
                          <option value="cover">Preencher quadro (Cover)</option>
                        </select>
                      </div>

                      {/* FUNDO DA MOLDURA VITRINE (BG) */}
                      <div className="pt-2 border-t border-gray-100 space-y-1.5">
                        <label className="block text-xs font-bold text-gray-700">
                          Imagem de Fundo do Quadro (Showcase BG)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={settings.showcaseBgImage ?? ''}
                            onChange={(e) => handleFieldChange('showcaseBgImage', e.target.value)}
                            placeholder="URL de fundo da moldura..."
                            className="flex-1 text-xs p-1.5 border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpload(section.id, 'showcaseBgImage')}
                            className="px-2.5 py-1.5 bg-stone-700 hover:bg-stone-800 text-white text-xs rounded shrink-0"
                          >
                            Upload BG
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TEXTOS E PREÇOS DO PRODUTO */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Badge de Poupança</label>
                      <input
                        type="text"
                        value={settings.showcaseBadge ?? 'POUPANÇA -25%'}
                        onChange={(e) => handleFieldChange('showcaseBadge', e.target.value)}
                        placeholder="Ex: POUPANÇA -25%"
                        className="w-full text-xs p-2 border rounded font-bold text-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Nome do Equipamento</label>
                      <input
                        type="text"
                        value={settings.showcaseTitle ?? 'Fogão / Salamandra Eco 11kW'}
                        onChange={(e) => handleFieldChange('showcaseTitle', e.target.value)}
                        placeholder="Ex: Fogão / Salamandra Eco 11kW"
                        className="w-full text-xs p-2 border rounded font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Subtítulo / Especificação</label>
                      <input
                        type="text"
                        value={settings.showcaseSubtitle ?? 'Combustão limpa • Pellets & Lenha • EcoDesign 2026'}
                        onChange={(e) => handleFieldChange('showcaseSubtitle', e.target.value)}
                        placeholder="Subtítulo..."
                        className="w-full text-xs p-2 border rounded text-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={settings.showcaseBadgeTech ?? '🔥 Alto Rendimento 92%'}
                        onChange={(e) => handleFieldChange('showcaseBadgeTech', e.target.value)}
                        placeholder="Etiqueta 1"
                        className="text-xs p-2 border rounded"
                      />
                      <input
                        type="text"
                        value={settings.showcaseBadgeTech2 ?? 'Até 110 m²'}
                        onChange={(e) => handleFieldChange('showcaseBadgeTech2', e.target.value)}
                        placeholder="Etiqueta 2"
                        className="text-xs p-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={settings.showcasePrice ?? '1.417,50 €'}
                        onChange={(e) => handleFieldChange('showcasePrice', e.target.value)}
                        placeholder="Preço Final"
                        className="text-xs p-2 border rounded font-bold text-red-600"
                      />
                      <input
                        type="text"
                        value={settings.showcaseComparePrice ?? '1.890,00 €'}
                        onChange={(e) => handleFieldChange('showcaseComparePrice', e.target.value)}
                        placeholder="Preço Riscado"
                        className="text-xs p-2 border rounded line-through text-gray-500"
                      />
                      <input
                        type="text"
                        value={settings.showcaseSavings ?? 'Poupe 472,50 €'}
                        onChange={(e) => handleFieldChange('showcaseSavings', e.target.value)}
                        placeholder="Poupança"
                        className="text-xs p-2 border rounded text-emerald-600 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Texto do Botão Carrinho</label>
                      <input
                        type="text"
                        value={settings.showcaseBtnText ?? 'Adicionar ao Carrinho'}
                        onChange={(e) => handleFieldChange('showcaseBtnText', e.target.value)}
                        placeholder="Adicionar ao Carrinho"
                        className="w-full text-xs p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ITEM 3: TÍTULOS & TEXTOS PRINCIPAIS */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection('titles')}
            className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${
              openSection === 'titles' ? 'bg-red-50/70 border-b border-red-100' : 'bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">📝</span>
              <div>
                <span className="text-xs font-bold text-gray-900 block">3. Títulos & Textos Principais</span>
                <span className="text-[11px] text-gray-500">Títulos, slogans e descrição</span>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'titles' ? 'rotate-180 text-red-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'titles' && (
            <div className="p-4 space-y-4 bg-white">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Badge de Campanha</label>
                <input
                  type="text"
                  value={settings.campaignBadge ?? 'Campanha de Inverno 2026 • Stock Garantido em Armazém'}
                  onChange={(e) => handleFieldChange('campaignBadge', e.target.value)}
                  placeholder="Ex: Campanha de Inverno..."
                  className="w-full text-xs p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título Principal (Linha 1)</label>
                <input
                  type="text"
                  value={settings.titlePrefix ?? 'Promoção de Inverno!'}
                  onChange={(e) => handleFieldChange('titlePrefix', e.target.value)}
                  placeholder="Ex: Promoção de Inverno!"
                  className="w-full text-xs p-2 border rounded font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Título em Dégradé (Linha 2)</label>
                <input
                  type="text"
                  value={settings.titleGradient ?? 'FOGÃO A PELLETS & LENHA'}
                  onChange={(e) => handleFieldChange('titleGradient', e.target.value)}
                  placeholder="Ex: FOGÃO A PELLETS & LENHA"
                  className="w-full text-xs p-2 border rounded font-extrabold text-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Texto Descritivo</label>
                <textarea
                  rows={3}
                  value={settings.description ?? 'Rendimento térmico máximo, economia comprovada e conforto para toda a família. Descubra a gama completa de equipamentos certificados Eco-Design com entrega direta em sua casa.'}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Descrição..."
                  className="w-full text-xs p-2 border rounded leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* ITEM 4: BOTÕES DE AÇÃO (CTA) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection('buttons')}
            className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${
              openSection === 'buttons' ? 'bg-red-50/70 border-b border-red-100' : 'bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🔴</span>
              <div>
                <span className="text-xs font-bold text-gray-900 block">4. Botões de Ação (CTA)</span>
                <span className="text-[11px] text-gray-500">Botão principal e botão de envio</span>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'buttons' ? 'rotate-180 text-red-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'buttons' && (
            <div className="p-4 space-y-3 bg-white">
              {/* Botão 1 */}
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 space-y-2">
                <span className="text-xs font-bold text-red-700 block">🔴 Botão 1 (Catálogo / Ofertas)</span>
                <input
                  type="text"
                  value={settings.cta1Text ?? 'Ver Ofertas em Destaque'}
                  onChange={(e) => handleFieldChange('cta1Text', e.target.value)}
                  placeholder="Texto do botão"
                  className="w-full text-xs p-2 border rounded"
                />
                <input
                  type="text"
                  value={settings.cta1Link ?? '/shop'}
                  onChange={(e) => handleFieldChange('cta1Link', e.target.value)}
                  placeholder="URL (/shop)"
                  className="w-full text-xs p-2 border rounded"
                />
              </div>

              {/* Botão 2 */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 block">🚚 Botão 2 (Simulador Envio)</span>
                <input
                  type="text"
                  value={settings.cta2Text ?? 'Calcular Envio de Palete'}
                  onChange={(e) => handleFieldChange('cta2Text', e.target.value)}
                  placeholder="Texto do botão"
                  className="w-full text-xs p-2 border rounded"
                />
                <input
                  type="text"
                  value={settings.cta2Link ?? '#simulador-envio'}
                  onChange={(e) => handleFieldChange('cta2Link', e.target.value)}
                  placeholder="Âncora (#simulador-envio)"
                  className="w-full text-xs p-2 border rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* ITEM 5: GARANTIAS & SELOS DE CONFIANÇA */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button
            type="button"
            onClick={() => toggleSection('badges')}
            className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${
              openSection === 'badges' ? 'bg-red-50/70 border-b border-red-100' : 'bg-gray-50/60 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🛡️</span>
              <div>
                <span className="text-xs font-bold text-gray-900 block">5. Selos de Garantia (3 Badges)</span>
                <span className="text-[11px] text-gray-500">
                  {isTrustBadgesVisible ? 'Ativos abaixo dos botões' : 'Ocultos'}
                </span>
              </div>
            </div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${openSection === 'badges' ? 'rotate-180 text-red-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'badges' && (
            <div className="p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-bold text-gray-800">Exibir Selos</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrustBadgesVisible}
                    onChange={(e) => handleFieldChange('showTrustBadges', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-800"></div>
                </label>
              </div>

              {/* 3 Badges */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.badge1Title ?? 'ENplus A1'}
                    onChange={(e) => handleFieldChange('badge1Title', e.target.value)}
                    placeholder="Título 1"
                    className="text-xs p-1.5 border rounded font-bold"
                  />
                  <input
                    type="text"
                    value={settings.badge1Subtitle ?? 'Pellets Certificados'}
                    onChange={(e) => handleFieldChange('badge1Subtitle', e.target.value)}
                    placeholder="Subtítulo 1"
                    className="text-xs p-1.5 border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.badge2Title ?? '48 a 72h'}
                    onChange={(e) => handleFieldChange('badge2Title', e.target.value)}
                    placeholder="Título 2"
                    className="text-xs p-1.5 border rounded font-bold"
                  />
                  <input
                    type="text"
                    value={settings.badge2Subtitle ?? 'Entrega Rápida'}
                    onChange={(e) => handleFieldChange('badge2Subtitle', e.target.value)}
                    placeholder="Subtítulo 2"
                    className="text-xs p-1.5 border rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={settings.badge3Title ?? '100% Seguro'}
                    onChange={(e) => handleFieldChange('badge3Title', e.target.value)}
                    placeholder="Título 3"
                    className="text-xs p-1.5 border rounded font-bold"
                  />
                  <input
                    type="text"
                    value={settings.badge3Subtitle ?? 'MB WAY & Multibanco'}
                    onChange={(e) => handleFieldChange('badge3Subtitle', e.target.value)}
                    placeholder="Subtítulo 3"
                    className="text-xs p-1.5 border rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
