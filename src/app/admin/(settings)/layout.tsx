import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import SettingsSidebar from '@/components/admin/SettingsSidebar';

export const dynamic = 'force-dynamic';

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  // 1. Check if an admin exists in the database
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  if (adminCount === 0) {
    redirect('/admin/setup');
  }

  // 2. Check current session
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin/login');
  }

  // 3. Verify user role
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || dbUser.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Settings Sidebar */}
      <SettingsSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
