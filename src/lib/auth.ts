// Server-only authorization helpers (internal, not client-callable server actions)

import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/session';

/**
 * Vérifie que l'utilisateur courant est authentifié et a le rôle ADMIN.
 * Lance une erreur si non autorisé — à utiliser dans toutes les server actions admin.
 * 
 * @returns L'utilisateur Prisma vérifié
 * @throws Error si non authentifié ou non admin
 */
export async function requireAdmin() {
  // 1. Prioritize native Neon session (0 external dependency, fast & reliable)
  try {
    const session = await getSessionUser();
    if (session && session.role === 'ADMIN') {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });
      if (user && user.role === 'ADMIN') {
        return user;
      }
    }
  } catch (e) {
    console.warn('[requireAdmin] Error reading native session:', e);
  }

  // 2. Fallback to Supabase Auth
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();

    if (!error && authUser) {
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
      });

      if (user && user.role === 'ADMIN') {
        return user;
      }
    }
  } catch (e) {
    console.warn('[requireAdmin] Supabase fallback unavailable:', e);
  }

  throw new Error('Forbidden: Admin access required.');
}

/**
 * Vérifie que l'utilisateur courant est authentifié (n'importe quel rôle).
 * 
 * @returns L'utilisateur Prisma vérifié
 * @throws Error si non authentifié
 */
export async function requireAuth() {
  // 1. Prioritize native Neon session
  try {
    const session = await getSessionUser();
    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
      });
      if (user) {
        return user;
      }
    }
  } catch (e) {
    console.warn('[requireAuth] Error reading native session:', e);
  }

  // 2. Fallback to Supabase Auth
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error } = await supabase.auth.getUser();

    if (!error && authUser) {
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
      });

      if (user) {
        return user;
      }
    }
  } catch (e) {
    console.warn('[requireAuth] Supabase fallback unavailable:', e);
  }

  throw new Error('Unauthorized: You must be logged in.');
}
