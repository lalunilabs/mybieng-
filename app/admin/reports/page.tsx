import { AdminLayout } from '@/components/admin/AdminLayout';
import { DataExport } from '@/components/admin/DataExport';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  // Mock admin user - replace with actual authentication
  const adminUser = {
    name: 'Dr. MyBeing',
    email: 'admin@mybeing.com',
    role: 'super_admin',
    avatar: undefined
  };

  return (
    <AdminLayout user={adminUser}>
      <DataExport />
    </AdminLayout>
  );
}
