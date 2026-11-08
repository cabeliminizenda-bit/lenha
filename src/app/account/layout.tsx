'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutUser } from '@/actions/auth';
import { useTranslations } from 'next-intl';
import AutoLogout from '@/components/AutoLogout';

export const dynamic = 'force-dynamic';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Account');

  const navItems = [
    { name: t('nav_dashboard') || 'Painel', id: 'Dashboard', href: '/account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: t('nav_orders') || 'Encomendas', id: 'Orders', href: '/account/orders', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { name: t('nav_addresses') || 'Moradas', id: 'Addresses', href: '/account/addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z' },
    { name: t('nav_account_details') || 'Dados Pessoais', id: 'Account details', href: '/account/details', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: t('nav_logout') || 'Terminar Sessão', id: 'Logout', href: '#', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50">
      <AutoLogout redirectUrl="/login" timeoutMs={15 * 60 * 1000} />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 pb-24 sm:pb-12">
        
        {/* Header Breadcrumb / Welcome on Mobile */}
        <div className="mb-4 sm:mb-6">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">Área Reservada</span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-stone-900">A Minha Conta Silva Dias</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
          {/* Responsive Navigation: Horizontal Pill-Bar on Mobile, Sidebar on Desktop */}
          <aside className="w-full md:w-1/4 shrink-0">
            <nav 
              aria-label="Navegação da conta"
              className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0"
            >
              {navItems.map((item) => {
                const isActive = item.href === '/account' 
                  ? pathname === '/account'
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={async (e) => {
                      if (item.id === 'Logout') {
                        e.preventDefault();
                        await logoutUser();
                        router.push('/login');
                      }
                    }}
                    className={`flex items-center px-3.5 py-2.5 md:py-3 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <svg className={`w-4 h-4 mr-2 shrink-0 ${isActive ? 'text-white' : 'text-stone-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <section className="w-full md:w-3/4 min-w-0">
            {children}
          </section>

        </div>
      </main>
    </div>
  );
}
