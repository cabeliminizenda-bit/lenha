'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const isConfirmed = searchParams.get('newsletter') === 'confirmed';
  const [copied, setCopied] = useState(false);

  const couponCode = 'WELCOME10';

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(couponCode);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = couponCode;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success('Código WELCOME10 copiado com sucesso! 🏷️', {
        style: {
          background: '#1c1917',
          color: '#ffffff',
          borderRadius: '10px',
          fontSize: '14px',
        },
        iconTheme: {
          primary: '#dc2626',
          secondary: '#ffffff',
        },
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Não foi possível copiar o código.');
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] py-10 sm:py-16 md:py-20 px-4 sm:px-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-xl mx-auto">
        
        {/* Confirmed pill badge if landing from confirmation email */}
        {isConfirmed && (
          <div className="mb-6 mx-auto inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xs">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Subscrição verificada e ativada com sucesso!</span>
          </div>
        )}

        {/* Main Card (harmonized with inspiration image & brand palette) */}
        <div className="bg-white border border-[#E7DFD4] rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-10 md:p-12 text-center relative overflow-hidden">
          
          {/* Subtle top brand accent line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 absolute top-0 left-0" />

          {/* Brand Eyebrow */}
          <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#8C6D53] uppercase mb-1">
            BEM-VINDO(A) À NOSSA COMUNIDADE
          </p>

          {/* Main H1 */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1D1A] tracking-tight mt-1">
            Obrigado pela sua inscrição!
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#666059] mt-2 font-normal">
            A sua inscrição foi realizada com sucesso.
          </p>

          {/* Thin Divider */}
          <div className="w-full border-t border-[#ECE5DB] my-6 sm:my-7" />

          {/* Comfort Heading */}
          <h2 className="text-base sm:text-xl font-bold text-[#1F1D1A]">
            O conforto começa aqui.
          </h2>

          {/* Comfort Description */}
          <p className="text-xs sm:text-sm text-[#666059] leading-relaxed mt-2 max-w-md mx-auto">
            Prepare-se para receber novidades, conselhos, campanhas exclusivas e tudo o que precisa para tornar a sua casa ainda mais acolhedora.
          </p>

          {/* Special Gift Container (Box) */}
          <div className="bg-[#FAF7F2] border border-[#E7DFD4] rounded-xl sm:rounded-2xl p-5 sm:p-7 mt-6 sm:mt-7 text-center">
            
            <p className="text-[10px] sm:text-[11px] font-bold text-[#8B5E3C] tracking-widest uppercase">
              UM PRESENTE ESPECIAL PARA SI
            </p>

            <h3 className="text-lg sm:text-2xl font-black text-[#1F1D1A] mt-1">
              Temos um mimo para si!
            </h3>

            <p className="text-xs sm:text-sm text-[#666059] mt-1.5 max-w-sm mx-auto">
              Para agradecer a sua confiança, oferecemos-lhe um desconto exclusivo na sua próxima compra.
            </p>

            {/* Dashed Coupon Ticket Box */}
            <div className="border-2 border-dashed border-[#CBB89D] bg-white/80 rounded-lg sm:rounded-xl p-5 sm:p-6 my-5 max-w-sm mx-auto relative shadow-xs">
              
              <div className="text-lg sm:text-2xl font-black text-[#8B5E3C] tracking-wide uppercase">
                10% DE DESCONTO
              </div>

              <div className="text-[10px] font-bold text-[#8C847A] tracking-widest uppercase mt-1">
                O SEU CÓDIGO DE BOAS-VINDAS
              </div>

              {/* Coupon Code + Click-to-copy */}
              <div className="my-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Clique para copiar o código"
                  className="group inline-flex items-center gap-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-300 hover:border-red-400 px-4 py-2 rounded-lg transition-all cursor-pointer"
                >
                  <span className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-[#1F1D1A] group-hover:text-red-600 transition-colors">
                    {couponCode}
                  </span>
                  <span className="text-stone-400 group-hover:text-red-600 transition-colors">
                    {copied ? (
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>

              {copied ? (
                <p className="text-xs font-semibold text-emerald-600 transition-all">
                  ✓ Código copiado para a área de transferência!
                </p>
              ) : (
                <p className="text-[11px] sm:text-xs text-[#78716A]">
                  Utilize este código no momento da sua encomenda.
                </p>
              )}
            </div>

            {/* CTA Button -> Harmonized with Silva Dias Brand Red */}
            <div className="mt-5">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3.5 px-8 rounded-lg shadow-sm hover:shadow transition-all text-xs sm:text-sm tracking-wider uppercase"
              >
                <span>DESCUBRA OS NOSSOS PRODUTOS</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Category Links underneath button */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-[#666059]">
              <Link
                href="/categoria-de-produto/lenha-e-pellets"
                className="hover:text-red-600 hover:underline transition-colors"
              >
                Lenha
              </Link>
              <span className="text-[#CBB89D]">·</span>
              <Link
                href="/categoria-de-produto/pellets"
                className="hover:text-red-600 hover:underline transition-colors"
              >
                Pellets
              </Link>
              <span className="text-[#CBB89D]">·</span>
              <Link
                href="/categoria-de-produto/salamandras-a-pellets"
                className="hover:text-red-600 hover:underline transition-colors"
              >
                Salamandras
              </Link>
              <span className="text-[#CBB89D]">·</span>
              <Link
                href="/categoria-de-produto/recuperadores-de-calor"
                className="hover:text-red-600 hover:underline transition-colors"
              >
                Recuperadores de calor
              </Link>
            </div>

          </div>

          {/* Thin Divider */}
          <div className="w-full border-t border-[#ECE5DB] my-6 sm:my-7" />

          {/* Signoff Header */}
          <h3 className="text-sm sm:text-base font-bold text-[#1F1D1A]">
            Mais calor. Mais conforto. Mais momentos especiais.
          </h3>

          {/* Signoff Text */}
          <p className="text-xs sm:text-sm text-[#666059] mt-1.5 max-w-md mx-auto">
            Obrigado por fazer parte da nossa comunidade. Estamos aqui para ajudar a aquecer a sua casa!
          </p>

          {/* Italic Signoff */}
          <p className="italic font-serif text-[#A86438] text-base sm:text-lg mt-4 font-semibold">
            Até breve!
          </p>

          {/* Company Team Signature */}
          <p className="text-xs font-semibold text-[#8C847A] mt-1">
            A equipa Lenha &amp; Carvão Silva Dias
          </p>

        </div>

      </div>
    </div>
  );
}
