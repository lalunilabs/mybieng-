import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import { getCurrentAdminUser } from '@/lib/auth/admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAdminUser();
  const legacy = cookies().get('admin_auth')?.value === '1';
  if (!user && !legacy) {
    redirect('/admin/login');
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-purple-50">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
