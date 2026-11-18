'use server';

import prisma from '@/lib/prisma';
import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

const SENSITIVE_SETTING_KEYS = new Set([
  'STRIPE_SECRET_KEY',
  'PAYPAL_SECRET',
  'SMTP_PASS',
  'SMTP_PASSWORD',
  'SMTP_USER',
  'SMTP_HOST',
  'CRON_SECRET',
  'SETUP_TOKEN',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'CLOUDINARY_API_SECRET',
  'WOOCOMMERCE_CONSUMER_SECRET',
  'WOOCOMMERCE_CONSUMER_KEY',
]);

function isSensitiveSettingKey(key: string): boolean {
  if (SENSITIVE_SETTING_KEYS.has(key)) return true;
  const upper = key.toUpperCase();
  if (upper.startsWith('NEXT_PUBLIC_')) return false;
  return upper.includes('SECRET') || upper.includes('PASSWORD') || upper.endsWith('_PASS');
}

/**
 * Fetch settings map.
 *
 * SECURITY: If called without an active ADMIN session, sensitive credentials
 * (Stripe Secret Key, PayPal Secret, SMTP Password/Host/User, Service keys)
 * are stripped to prevent unauthorized extraction through Next.js Server Action RPCs.
 */
export async function getSettings() {
  const settings = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};

  let isAdmin = false;
  try {
    const { requireAdmin } = await import('@/lib/auth');
    await requireAdmin();
    isAdmin = true;
  } catch {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (dbUser?.role === 'ADMIN') {
          isAdmin = true;
        }
      }
    } catch {
      isAdmin = false;
    }
  }

  settings.forEach(s => {
    // Si l'utilisateur est admin, on envoie tout. Sinon, on filtre toutes les clés sensibles.
    if (isAdmin || !isSensitiveSettingKey(s.key)) {
      settingsMap[s.key] = s.value;
    }
  });

  return settingsMap;
}

export async function updateSetting(key: string, value: string) {
  await requireAdmin();
  try {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    revalidatePath('/', 'layout');
    updateTag('settings');
    return { success: true };
  } catch (error: any) {
    console.error('[updateSetting] Error:', error);
    return { error: 'Erreur lors de la mise à jour du paramètre.' };
  }
}

export async function updateSettingsBatch(settingsMap: Record<string, string>) {
  await requireAdmin();
  try {
    const transactions = Object.entries(settingsMap).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    });

    await prisma.$transaction(transactions);
    revalidatePath('/', 'layout');
    updateTag('settings');
    return { success: true };
  } catch (error: any) {
    console.error('[updateSettingsBatch] Error:', error);
    return { error: 'Erreur lors de la mise à jour des paramètres.' };
  }
}
