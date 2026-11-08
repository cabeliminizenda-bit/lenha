import React from 'react';

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-stone-200 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Entrega com Plataforma */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Entrega com Plataforma</h4>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">Descarga facilitada à porta</p>
          </div>
        </div>

        {/* 2. Qualidade Certificada */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Qualidade Certificada</h4>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">Pellets ENplus A1 e lenha seca</p>
          </div>
        </div>

        {/* 3. Pagamento 100% Seguro */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Pagamento 100% Seguro</h4>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">MB WAY, Multibanco e Cartões</p>
          </div>
        </div>

        {/* 4. Apoio ao Cliente */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">Apoio ao Cliente</h4>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">Especialistas térmicos Silva Dias</p>
          </div>
        </div>
      </div>
    </section>
  );
}
