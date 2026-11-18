import { Suspense } from 'react';
import type { Metadata } from 'next';
import ThankYouContent from './ThankYouContent';

export const metadata: Metadata = {
  title: 'Obrigado pela sua Inscrição | Lenha & Carvão Silva Dias',
  description: 'A sua inscrição na nossa comunidade foi realizada com sucesso. Aproveite o seu código de desconto exclusivo de boas-vindas!',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-[#FAF7F2] py-20 px-4 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
