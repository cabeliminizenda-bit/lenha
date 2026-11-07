'use client';

import React, { useState } from 'react';

export default function ShippingSimulator() {
  const [district, setDistrict] = useState('');

  const renderResult = () => {
    if (!district) return null;

    if (district === 'porto' || district === 'braga') {
      return (
        <div className="mt-4 p-4 rounded-xl bg-stone-800/90 border border-stone-700 text-xs space-y-1.5 animate-fadeIn">
          <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Zona de Entrega Direta (Norte)
          </div>
          <div className="text-stone-300">Prazo estimado: <strong className="text-white">24 a 48 horas</strong></div>
          <div className="text-stone-300">Descarga com plataforma elevatória: <strong className="text-white">Incluída à porta</strong></div>
          <div className="text-amber-400 font-semibold mt-1">✓ Portes Gratuitos para encomendas de paletes completas!</div>
        </div>
      );
    }

    if (district === 'lisboa' || district === 'coimbra') {
      return (
        <div className="mt-4 p-4 rounded-xl bg-stone-800/90 border border-stone-700 text-xs space-y-1.5 animate-fadeIn">
          <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Zona Centro & Lisboa
          </div>
          <div className="text-stone-300">Prazo estimado: <strong className="text-white">48 a 72 horas</strong></div>
          <div className="text-stone-300">Descarga com plataforma elevatória: <strong className="text-white">Incluída à porta</strong></div>
          <div className="text-stone-300">Taxa de transporte: <strong className="text-white">19,90 € por palete</strong></div>
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 rounded-xl bg-stone-800/90 border border-stone-700 text-xs space-y-1.5 animate-fadeIn">
        <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          Zona Sul & Alentejo / Algarve
        </div>
        <div className="text-stone-300">Prazo estimado: <strong className="text-white">3 a 5 dias úteis</strong></div>
        <div className="text-stone-300">Descarga com plataforma elevatória: <strong className="text-white">Incluída à porta</strong></div>
        <div className="text-stone-300">Taxa de transporte: <strong className="text-white">29,90 € por palete</strong></div>
      </div>
    );
  };

  return (
    <section className="py-14 max-w-7xl mx-auto px-4">
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl border border-stone-700">
        <div className="max-w-2xl space-y-4">
          <span className="text-red-400 font-bold text-xs uppercase tracking-wider block">
            Logística Especializada
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Simulador de Entrega de Paletes
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            O transporte de biomassa, lenha e recuperadores requer camião com plataforma elevatória e porta-paletes. 
            Selecione o seu distrito para consultar a estimativa de entrega e os custos associados.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3">
            <div className="sm:col-span-8">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 bg-stone-800 border border-stone-600 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Selecione o seu Distrito (Portugal Continental)</option>
                <option value="porto">Porto (Zona Norte)</option>
                <option value="braga">Braga & Viana do Castelo</option>
                <option value="lisboa">Lisboa & Vale do Tejo</option>
                <option value="coimbra">Coimbra, Aveiro & Leiria</option>
                <option value="faro">Faro & Algarve</option>
                <option value="alentejo">Évora, Beja & Portalegre</option>
              </select>
            </div>
            <div className="sm:col-span-4">
              <button
                type="button"
                onClick={() => {
                  if (!district) setDistrict('porto');
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md"
              >
                Calcular Frete
              </button>
            </div>
          </div>

          {renderResult()}
        </div>
      </div>
    </section>
  );
}

