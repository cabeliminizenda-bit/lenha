'use server';

import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function loginUser(formData: FormData) {
  const ip = await getClientIp();
  const rl = await checkRateLimit(`login_${ip}`, 5, 300); // 5 attempts per 5 mins
  if (!rl.success) {
    return { error: 'Demasiadas tentativas de início de sessão. Por favor, aguarde 5 minutos.' };
  }

  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'O e-mail e a palavra-passe são obrigatórios.' };
  }

  const supabase = await createClient();

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !signInData.user) {
    return { error: 'Credenciais incorretas.' };
  }

  // Once authenticated with verified password/email:
  // Link prior guest orders if a guest customer record with this email exists in Prisma
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: signInData.user.email || email }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: signInData.user.id,
          email: signInData.user.email || email,
          role: 'CUSTOMER'
        }
      });
    } else if (existingUser.id !== signInData.user.id && existingUser.role !== 'ADMIN') {
      // SECURITY: Only link guest orders if the user's email has been verified/confirmed
      const isEmailConfirmed = Boolean(
        signInData.user.email_confirmed_at || 
        (signInData.user as any).confirmed_at
      );

      if (isEmailConfirmed) {
        // Safe transaction after verified credentials: link guest orders to registered account
        await prisma.$transaction([
          prisma.order.updateMany({ where: { userId: existingUser.id }, data: { userId: signInData.user.id } }),
          prisma.review.updateMany({ where: { userId: existingUser.id }, data: { userId: signInData.user.id } }),
          prisma.notification.updateMany({ where: { userId: existingUser.id }, data: { userId: signInData.user.id } }),
          prisma.user.delete({ where: { id: existingUser.id } }),
          prisma.user.create({
            data: {
              id: signInData.user.id,
              email: signInData.user.email || email,
              role: 'CUSTOMER'
            }
          })
        ]);
      } else {
        console.warn(`[Login] Deferred linking guest orders for ${email}: email not yet confirmed.`);
      }
    }
  } catch (e) {
    console.error("[Login] Error syncing guest orders on verified login:", e);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function registerUser(formData: FormData) {
  const ip = await getClientIp();
  const rl = await checkRateLimit(`register_${ip}`, 5, 1800); // 5 registrations per 30 mins
  if (!rl.success) {
    return { error: 'Demasiadas tentativas de registo. Por favor, tente novamente mais tarde.' };
  }

  const username = String(formData.get('username') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password || !username) {
    return { error: 'Todos os campos são obrigatórios.' };
  }

  if (password.length < 8) {
    return { error: 'A palavra-passe deve conter pelo menos 8 carateres.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      }
    }
  });

  if (error) {
    console.warn('[Register] Supabase signup error:', error.message);
    // Generic sanitized error to avoid account enumeration
    if (error.message.toLowerCase().includes('already registered')) {
      return { error: 'Já existe uma conta associada a este endereço de e-mail ou os dados são inválidos.' };
    }
    return { error: 'Erro ao registar a conta. Por favor, verifique os seus dados.' };
  }

  if (data.user) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.user.email || email }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email || email,
            role: 'CUSTOMER'
          }
        });
      } else {
        // Un compte existe déjà. Ne JAMAIS supprimer ni écraser lors de l'inscription
        // pour empêcher tout déni de service admin ou vol de commandes invitées.
        // La liaison sécurisée s'effectue au login vérifié.
        console.warn(`[Register] User already exists in DB for ${email}. Deferring linking to verified login.`);
      }
    } catch (e) {
      console.error("Error syncing Prisma user on signup:", e);
    }
  }

  revalidatePath('/', 'layout');
  
  if (!data.session) {
    return { success: true, message: "Registo concluído com sucesso! Por favor, verifique a sua caixa de correio para confirmar a sua conta antes de iniciar sessão." };
  }
  
  return { success: true };
}

export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'global' });
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function setupAdmin(formData: FormData) {
  const ip = await getClientIp();
  const rl = await checkRateLimit(`setup_admin_${ip}`, 3, 3600); // 3 attempts per hour
  if (!rl.success) {
    return { error: 'Demasiadas tentativas de configuração. Acesso restrito.' };
  }

  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Todos os campos são obrigatórios.' };
  }

  if (password.length < 12) {
    return { error: 'A palavra-passe de administrador deve conter pelo menos 12 carateres.' };
  }

  // Atomically check that there is no existing admin
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  if (adminCount > 0) {
    return { error: 'Já existe um administrador configurado. A inicialização está bloqueada.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: 'Admin' }
    }
  });

  if (error) {
    console.error('[setupAdmin] Supabase error:', error.message);
    return { error: 'Erro ao criar a conta de administrador.' };
  }

  if (data.user) {
    // Re-verify no other admin was created concurrently
    const recheckCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (recheckCount > 0) {
      return { error: 'Já foi configurado um administrador.' };
    }

    await prisma.user.upsert({
      where: { email: data.user.email || email },
      update: { role: 'ADMIN', id: data.user.id },
      create: {
        id: data.user.id,
        email: data.user.email || email,
        role: 'ADMIN',
      }
    });
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function loginAdmin(formData: FormData) {
  const ip = await getClientIp();
  const rl = await checkRateLimit(`login_admin_${ip}`, 20, 900); // 20 attempts per 15 mins
  if (!rl.success) {
    return { error: 'Demasiadas tentativas de início de sessão. Acesso temporariamente suspenso.' };
  }

  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'O e-mail e a palavra-passe são obrigatórios.' };
  }

  const supabase = await createClient();
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Auto-sync / recovery: If Supabase Auth fails, verify if this user is the registered ADMIN in Prisma
  // (Common when Supabase Auth instance was reconnected or users table wasn't migrated into auth.users)
  if (error) {
    const dbAdmin = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        role: 'ADMIN'
      }
    });

    if (dbAdmin) {
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (serviceRoleKey && supabaseUrl) {
        try {
          const { createClient: createAdminSupabase } = await import('@supabase/supabase-js');
          const adminSupabase = createAdminSupabase(supabaseUrl, serviceRoleKey);

          // Check if this email exists in Supabase Auth
          const { data: { users } } = await adminSupabase.auth.admin.listUsers();
          const authUser = users?.find(u => u.email?.toLowerCase() === email);

          if (!authUser) {
            // User exists in Prisma as ADMIN but was never initialized in Supabase Auth
            // Create user in Supabase Auth with the matching Prisma UUID and the provided password
            const createRes = await adminSupabase.auth.admin.createUser({
              id: dbAdmin.id,
              email: dbAdmin.email,
              password: password,
              email_confirm: true,
              user_metadata: { username: 'Admin' }
            });

            if (createRes.data?.user) {
              const retryLogin = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              data = retryLogin.data;
              error = retryLogin.error;
            }
          }
        } catch (syncErr) {
          console.error('[loginAdmin] Auto-sync admin account error:', syncErr);
        }
      }
    }
  }

  if (error) {
    return { error: 'Credenciais incorretas.' };
  }

  if (data.user) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: data.user.id },
          { email: { equals: data.user.email || email, mode: 'insensitive' } }
        ]
      }
    });
    if (!user || user.role !== 'ADMIN') {
      await supabase.auth.signOut({ scope: 'global' });
      return { error: 'Acesso negado. Não tem privilégios de administrador.' };
    }
  }

  revalidatePath('/admin', 'layout');
  return { success: true };
}

export async function getUserRole() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser) return dbUser.role;
    }
  } catch (e) {
    console.error("Error fetching user role", e);
  }
  return null;
}
