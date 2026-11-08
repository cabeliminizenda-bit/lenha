import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LogoutLink from '@/components/auth/LogoutLink';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function AccountDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const t = await getTranslations('Account');

  // Get username from user metadata if it exists, otherwise use email
  const username = user.user_metadata?.username || user.email?.split('@')[0] || "Cliente";

  return (
    <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-stone-200 h-full space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-stone-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Olá, <span className="text-red-600">{username}</span>!
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Bem-vindo(a) ao painel da sua conta pessoal Silva Dias.
          </p>
        </div>
        <div className="text-xs">
          <LogoutLink />
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Link
          href="/account/orders"
          className="p-4 rounded-xl border border-stone-200 hover:border-red-400 bg-stone-50/70 hover:bg-white hover:shadow-md transition-all group cursor-pointer flex sm:flex-col items-center sm:items-start gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-red-600 transition-colors">Encomendas</h3>
            <p className="text-xs text-stone-500 mt-0.5">Consultar histórico e rastreio</p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="p-4 rounded-xl border border-stone-200 hover:border-red-400 bg-stone-50/70 hover:bg-white hover:shadow-md transition-all group cursor-pointer flex sm:flex-col items-center sm:items-start gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-red-600 transition-colors">Moradas</h3>
            <p className="text-xs text-stone-500 mt-0.5">Faturação e entrega</p>
          </div>
        </Link>

        <Link
          href="/account/details"
          className="p-4 rounded-xl border border-stone-200 hover:border-red-400 bg-stone-50/70 hover:bg-white hover:shadow-md transition-all group cursor-pointer flex sm:flex-col items-center sm:items-start gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-red-600 transition-colors">Dados da Conta</h3>
            <p className="text-xs text-stone-500 mt-0.5">Nome, e-mail e segurança</p>
          </div>
        </Link>
      </div>

      <div className="pt-4 border-t border-stone-100 text-xs sm:text-sm text-stone-600 leading-relaxed">
        <p>
          A partir do painel da sua conta, pode visualizar facilmente as suas{' '}
          <Link href="/account/orders" className="text-red-600 hover:underline font-bold">
            encomendas recentes
          </Link>
          , gerir as suas{' '}
          <Link href="/account/addresses" className="text-red-600 hover:underline font-bold">
            moradas de entrega e faturação
          </Link>
          , e editar a sua{' '}
          <Link href="/account/details" className="text-red-600 hover:underline font-bold">
            palavra-passe e detalhes da conta
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
