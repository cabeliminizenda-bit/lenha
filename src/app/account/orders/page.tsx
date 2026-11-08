import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import Price from '@/components/Price';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const t = await getTranslations('AccountOrders');
  const locale = await getLocale();

  const statusLabels: Record<string, string> = {
    PENDING: t('status_pending'),
    PAID: t('status_paid'),
    PROCESSING: t('status_processing'),
    SHIPPED: t('status_shipped'),
    IN_TRANSIT: t('status_in_transit'),
    DELIVERED: t('status_delivered'),
    AT_PICKUP_POINT: t('status_at_pickup_point'),
    CANCELLED: t('status_cancelled')
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-stone-100 text-stone-800',
    PAID: 'bg-emerald-100 text-emerald-800',
    PROCESSING: 'bg-amber-100 text-amber-800',
    SHIPPED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-teal-100 text-teal-800',
    AT_PICKUP_POINT: 'bg-purple-100 text-purple-800',
    CANCELLED: 'bg-red-100 text-red-800'
  };

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  });

  if (!dbUser) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-stone-100 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-stone-900">{t('orders_title')}</h2>
        <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
          {orders.length} {orders.length === 1 ? 'encomenda' : 'encomendas'}
        </span>
      </div>
      
      {/* Mobile Orders List (Sleek Native Cards) */}
      <div className="block md:hidden divide-y divide-stone-100">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">
            {t('no_orders')}
          </div>
        ) : (
          orders.map((order) => {
            const totalItems = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
            
            return (
              <div key={order.id} className="p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-stone-900 text-sm">
                    #{order.id.split('-')[0].toUpperCase()}
                  </span>
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full ${statusColors[order.status] || 'bg-stone-100 text-stone-800'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span>
                    {totalItems} {totalItems === 1 ? 'artigo' : 'artigos'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="font-black text-stone-900 text-base">
                    <Price amount={order.total} showTax={false} />
                  </div>
                  <Link 
                    href={`/account/orders/${order.id}`} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Ver Encomenda</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Orders Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">{t('order_th')}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">{t('date_th')}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">{t('status_th')}</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-stone-600 uppercase tracking-wider">{t('total_th')}</th>
              <th className="px-6 py-3.5 text-right text-xs font-bold text-stone-600 uppercase tracking-wider">{t('actions_th')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                  {t('no_orders')}
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const totalItems = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
                
                return (
                  <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-stone-900">
                      #{order.id.split('-')[0].toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                      {new Date(order.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${statusColors[order.status] || 'bg-stone-100 text-stone-800'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                      <span className="font-extrabold text-stone-900"><Price amount={order.total} showTax={false} /></span>
                      <span className="text-stone-400 text-xs ml-1">
                        {t('for_x_products', { count: totalItems })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/account/orders/${order.id}`} 
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                        title={t('view_order')}
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
