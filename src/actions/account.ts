'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function updateAccountDetails(formData: FormData) {
  const ip = await getClientIp();
  const rl = await checkRateLimit(`account_update_${ip}`, 10, 600); // 10 updates per 10 min
  if (!rl.success) {
    return { error: 'Demasiados pedidos. Por favor, aguarde um momento.' };
  }

  const firstName = String(formData.get('firstName') || '').trim().slice(0, 100);
  const lastName = String(formData.get('lastName') || '').trim().slice(0, 100);
  const displayName = String(formData.get('displayName') || '').trim().slice(0, 100);
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const newPassword = String(formData.get('newPassword') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: 'Deve iniciar sessão para continuar.' };
  }

  const updates: any = {
    data: {
      firstName,
      lastName,
      displayName,
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && email !== user.email) {
    if (!emailRegex.test(email) || email.length > 254) {
      return { error: 'Endereço de e-mail inválido.' };
    }
    updates.email = email;
  }

  if (newPassword || confirmPassword) {
    if (newPassword !== confirmPassword) {
      return { error: 'As novas palavras-passe não coincidem.' };
    }
    if (!newPassword || newPassword.length < 8) {
      return { error: 'A palavra-passe deve ter pelo menos 8 carateres.' };
    }
    updates.password = newPassword;
  }

  const { error: updateError } = await supabase.auth.updateUser(updates);

  if (updateError) {
    console.warn('[Account] Supabase updateUser error:', updateError.message);
    return { error: 'Erro ao atualizar a conta. Por favor, verifique as suas informações.' };
  }

  // Sync Prisma user if email was changed
  if (email && email !== user.email) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { email }
      });
    } catch (e) {
      console.error('[Account] Error syncing email to Prisma:', e);
    }
  }

  revalidatePath('/account/details');
  return { success: true, message: 'Dados da conta atualizados com sucesso.' };
}
