import { getCachedSettings, getCachedShippingZones } from '@/lib/cache';
import CheckoutClient from './CheckoutClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const [settings, zones] = await Promise.all([
    getCachedSettings(),
    getCachedShippingZones()
  ]);

  const paymentSettings = {
    ENABLE_STRIPE: settings.ENABLE_STRIPE !== undefined ? settings.ENABLE_STRIPE : 'true',
    ENABLE_PAYPAL: settings.ENABLE_PAYPAL !== undefined ? settings.ENABLE_PAYPAL : 'true',
    ENABLE_BANK_TRANSFER: settings.ENABLE_BANK_TRANSFER !== undefined ? settings.ENABLE_BANK_TRANSFER : 'true',
    BANK_TRANSFER_CHECKOUT_MESSAGE: settings.BANK_TRANSFER_CHECKOUT_MESSAGE || '',
  };

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-stone-600 font-medium">A carregar checkout...</div>}>
      <CheckoutClient settings={paymentSettings} zones={zones} />
    </Suspense>
  );
}
