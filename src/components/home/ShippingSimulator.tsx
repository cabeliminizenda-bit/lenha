'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface DistrictZoneInfo {
  name: string;
  zone: string;
  timeframe: string;
  baseRatePerPallet: number;
  freeShippingMinPallets: number;
  highlightNote?: string;
  isDirectZone?: boolean;
}

const DISTRICTS_DATA: Record<string, DistrictZoneInfo> = {
  braga: {
    name: 'Braga (Sede & Entrega Direta)',
    zone: 'Zona Norte Proximidade',
    timeframe: '24 a 48 horas úteis',
    baseRatePerPallet: 0,
    freeShippingMinPallets: 1,
    isDirectZone: true,
    highlightNote: '✓ Portes 100% Gratuitos a partir de 1 palete (Logística Direta Silva Dias)!'
  },
  porto: {
    name: 'Porto & Grande Porto',
    zone: 'Zona Norte',
    timeframe: '24 a 48 horas úteis',
    baseRatePerPallet: 0,
    freeShippingMinPallets: 1,
    isDirectZone: true,
    highlightNote: '✓ Portes Gratuitos para encomendas de paletes completas!'
  },
  viana: {
    name: 'Viana do Castelo & Alto Minho',
    zone: 'Zona Norte',
    timeframe: '24 a 48 horas úteis',
    baseRatePerPallet: 15,
    freeShippingMinPallets: 2,
    highlightNote: '✓ Portes Gratuitos a partir de 2 paletes!'
  },
  vilareal_braganca: {
    name: 'Vila Real & Bragança (Trás-os-Montes)',
    zone: 'Zona Norte Interior',
    timeframe: '48 a 72 horas úteis',
    baseRatePerPallet: 20,
    freeShippingMinPallets: 2,
    highlightNote: '✓ Portes Gratuitos a partir de 2 paletes!'
  },
  aveiro: {
    name: 'Aveiro & Região Centro Litoral',
    zone: 'Zona Centro',
    timeframe: '48 a 72 horas úteis',
    baseRatePerPallet: 18,
    freeShippingMinPallets: 2,
    highlightNote: '✓ Portes Gratuitos a partir de 2 paletes!'
  },
  coimbra_leiria: {
    name: 'Coimbra & Leiria',
    zone: 'Zona Centro',
    timeframe: '48 a 72 horas úteis',
    baseRatePerPallet: 19.90,
    freeShippingMinPallets: 2,
    highlightNote: '✓ Portes Gratuitos a partir de 2 paletes!'
  },
  viseu_guarda: {
    name: 'Viseu, Guarda & Castelo Branco',
    zone: 'Zona Centro Interior / Beiras',
    timeframe: '48 a 72 horas úteis',
    baseRatePerPallet: 22,
    freeShippingMinPallets: 3,
    highlightNote: '✓ Tarifa reduzida para carga múltipla!'
  },
  lisboa_valetejo: {
    name: 'Lisboa, Setúbal & Santarém (Vale do Tejo)',
    zone: 'Zona Metropolitana de Lisboa',
    timeframe: '48 a 72 horas úteis',
    baseRatePerPallet: 19.90,
    freeShippingMinPallets: 2,
    highlightNote: '✓ Portes Gratuitos a partir de 2 paletes!'
  },
  alentejo: {
    name: 'Évora, Beja & Portalegre (Alentejo)',
    zone: 'Zona Sul / Alentejo',
    timeframe: '3 a 5 dias úteis',
    baseRatePerPallet: 29.90,
    freeShippingMinPallets: 3,
    highlightNote: '✓ Entrega com camião plataforma adaptado ao terreno rural!'
  },
  faro: {
    name: 'Faro & Algarve',
    zone: 'Zona Sul / Algarve',
    timeframe: '3 a 5 dias úteis',
    baseRatePerPallet: 29.90,
    freeShippingMinPallets: 3,
    highlightNote: '✓ Camião com plataforma elevatória com agendamento direto!'
  },
  ilhas: {
    name: 'Açores & Madeira (Regiões Autónomas)',
    zone: 'Ilhas (Transporte Marítimo)',
    timeframe: '5 a 10 dias úteis (saída semanal)',
    baseRatePerPallet: 75,
    freeShippingMinPallets: 999,
    highlightNote: 'ℹ️ Carga consolidada em transitário marítimo (Porto de Leixões ou Lisboa).'
  }
};

// Auto-detect district key from Portuguese Postal Code (first 4 digits)
function detectDistrictFromPostalCode(code: string): string | null {
  const clean = code.replace(/\D/g, '');
  if (clean.length < 2) return null;
  const num = parseInt(clean.slice(0, 4), 10);
  const prefix2 = parseInt(clean.slice(0, 2), 10);

  if (num >= 4700 && num <= 4899) return 'braga';
  if ((num >= 4000 && num <= 4699) || (prefix2 >= 44 && prefix2 <= 46)) return 'porto';
  if (num >= 4900 && num <= 4999) return 'viana';
  if ((num >= 5000 && num <= 5499)) return 'vilareal_braganca';
  if (num >= 3700 && num <= 3899) return 'aveiro';
  if ((num >= 3000 && num <= 3499) || (num >= 2400 && num <= 2499)) return 'coimbra_leiria';
  if ((num >= 3500 && num <= 3699) || (num >= 6000 && num <= 6499)) return 'viseu_guarda';
  if ((num >= 1000 && num <= 2999)) return 'lisboa_valetejo';
  if (num >= 7000 && num <= 7999) return 'alentejo';
  if (num >= 8000 && num <= 8999) return 'faro';
  if (num >= 9000 && num <= 9999) return 'ilhas';

  return null;
}

export default function ShippingSimulator() {
  const [district, setDistrict] = useState<string>('braga');
  const [palletQuantity, setPalletQuantity] = useState<number>(1);
  const [postalCodeInput, setPostalCodeInput] = useState<string>('');
  const [detectedBadge, setDetectedBadge] = useState<string | null>(null);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostalCodeInput(val);
    const detected = detectDistrictFromPostalCode(val);
    if (detected && DISTRICTS_DATA[detected]) {
      setDistrict(detected);
      setDetectedBadge(DISTRICTS_DATA[detected].name);
    } else {
      setDetectedBadge(null);
    }
  };

  const selectedData = DISTRICTS_DATA[district] || DISTRICTS_DATA['braga'];

  // Pricing calculation
  const isFree = selectedData.baseRatePerPallet === 0 || palletQuantity >= selectedData.freeShippingMinPallets;
  const calculatedShippingCost = isFree ? 0 : selectedData.baseRatePerPallet * palletQuantity;

  return (
    <section id="simulador-envios" className="py-16 max-w-7xl mx-auto px-4">
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 sm:p-10 md:p-12 text-white relative overflow-hidden shadow-2xl border border-stone-700/80">
        
        {/* Glow ambient background accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: inputs & configurations */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 font-extrabold text-[11px] uppercase tracking-wider mb-2">
                <span>🚛</span>
                <span>Logística Pesada & Biomassa</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Simulador de Entrega de Paletes
              </h2>
              <p className="text-stone-300 text-sm mt-2 leading-relaxed">
                Entregamos paletes de pellets (1050kg), lenha seca (500kg a 1.5 estéreos) e recuperadores de calor em todo o 
                <strong className="text-white"> Portugal Continental</strong> com <strong className="text-white">camião plataforma e porta-paletes</strong> incluídos.
              </p>
            </div>

            {/* Quick Postal Code Search + District Selector */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                
                {/* Postal Code input */}
                <div className="sm:col-span-5">
                  <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                    Código Postal (ex: 4700-001)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: 4700-001"
                      maxLength={8}
                      value={postalCodeInput}
                      onChange={handlePostalCodeChange}
                      className="w-full px-3.5 py-2.5 bg-stone-800/90 border border-stone-600 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-mono"
                    />
                    {detectedBadge && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-bold">
                        ✓ Detetado
                      </span>
                    )}
                  </div>
                </div>

                {/* District dropdown */}
                <div className="sm:col-span-7">
                  <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-1.5">
                    Ou Selecione o Distrito
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setPostalCodeInput('');
                      setDetectedBadge(null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-stone-800/90 border border-stone-600 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all cursor-pointer"
                  >
                    <option value="braga">Braga & Cávado (Sede Silva Dias)</option>
                    <option value="porto">Porto & Grande Porto</option>
                    <option value="viana">Viana do Castelo & Alto Minho</option>
                    <option value="aveiro">Aveiro & Centro Litoral</option>
                    <option value="coimbra_leiria">Coimbra & Leiria</option>
                    <option value="lisboa_valetejo">Lisboa, Setúbal & Santarém</option>
                    <option value="vilareal_braganca">Vila Real & Bragança (Trás-os-Montes)</option>
                    <option value="viseu_guarda">Viseu, Guarda & Castelo Branco</option>
                    <option value="alentejo">Évora, Beja & Portalegre (Alentejo)</option>
                    <option value="faro">Faro & Algarve</option>
                    <option value="ilhas">Açores & Madeira (Marítimo)</option>
                  </select>
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block mb-2">
                  Quantidade de Paletes Desejada
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((qty) => {
                    const isSelected = palletQuantity === qty;
                    return (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setPalletQuantity(qty)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                          isSelected
                            ? 'bg-red-600 border-red-500 text-white shadow-md'
                            : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-700/80 hover:text-white'
                        }`}
                      >
                        {qty === 4 ? '4+ Paletes' : `${qty} Palete${qty > 1 ? 's' : ''}`}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Guarantees Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-stone-800 text-[11px] text-stone-300 font-medium">
              <div className="flex items-center gap-2 bg-stone-800/50 p-2.5 rounded-xl border border-stone-800">
                <span className="text-base">🚚</span>
                <span>Camião Hayon</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-800/50 p-2.5 rounded-xl border border-stone-800">
                <span className="text-base">🧑‍🔧</span>
                <span>Porta-Paletes</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-800/50 p-2.5 rounded-xl border border-stone-800">
                <span className="text-base">📞</span>
                <span>Aviso Prévio</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-800/50 p-2.5 rounded-xl border border-stone-800">
                <span className="text-base">🛡️</span>
                <span>Carga Segura</span>
              </div>
            </div>

          </div>

          {/* Right Result Card: Dynamic pricing, timeframe and order button */}
          <div className="lg:col-span-5 bg-stone-800/90 rounded-2xl p-6 border border-stone-700 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-start justify-between border-b border-stone-700 pb-3">
                <div>
                  <span className="text-xs text-stone-400 block font-semibold">Destino Selecionado</span>
                  <h4 className="font-extrabold text-white text-base mt-0.5">{selectedData.name}</h4>
                  <span className="text-[11px] text-red-400 font-bold block">{selectedData.zone}</span>
                </div>
                <span className="text-2xl">🇵🇹</span>
              </div>

              {/* Price Display */}
              <div className="bg-stone-900/80 rounded-xl p-4 border border-stone-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block uppercase font-bold tracking-wider">
                    Custo de Envio ({palletQuantity} {palletQuantity > 1 ? 'paletes' : 'palete'})
                  </span>
                  {isFree ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black text-emerald-400">GRÁTIS</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Portes Oferecidos
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-white">
                        {calculatedShippingCost.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                      </span>
                      <span className="text-xs text-stone-400">
                        ({selectedData.baseRatePerPallet.toFixed(2)} € / palete)
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-xl">
                  {isFree ? '🎁' : '📦'}
                </div>
              </div>

              {/* Timeframe & Logistics Checklist */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-stone-700/50">
                  <span className="text-stone-400 font-medium">Prazo de Entrega Estimado:</span>
                  <span className="text-white font-bold">{selectedData.timeframe}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-stone-700/50">
                  <span className="text-stone-400 font-medium">Descarga no Local:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                    Incluída à Porta
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-stone-700/50">
                  <span className="text-stone-400 font-medium">Agendamento por Telefone:</span>
                  <span className="text-white font-bold">Sim, prévio ao envio</span>
                </div>
              </div>

              {/* Note / Promotion alert */}
              {selectedData.highlightNote && (
                <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-700 text-xs text-stone-300 leading-relaxed">
                  {selectedData.highlightNote}
                </div>
              )}

            </div>

            {/* Call to action button */}
            <div className="mt-6 pt-3">
              <Link
                href="/#catalogo"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-center"
              >
                <span>Ver Paletes e Encomendar</span>
                <span className="text-base">&rarr;</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
