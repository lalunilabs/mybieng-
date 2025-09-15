import { AdminLayout } from '@/components/admin/AdminLayout';
import { SystemHealth } from '@/components/admin/SystemHealth';

export const dynamic = 'force-dynamic';

export default async function AdminSystemPage() {
  // Mock admin user - replace with actual authentication
  const adminUser = {
    name: 'Dr. MyBeing',
    email: 'admin@mybeing.com',
    role: 'super_admin',
    avatar: undefined
  };

  return (
    <AdminLayout user={adminUser}>
      <SystemHealth />
    </AdminLayout>
  );
}
