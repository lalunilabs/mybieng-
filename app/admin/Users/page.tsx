import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagement } from '@/components/admin/UserManagement';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  // Mock admin user - replace with actual authentication
  const adminUser = {
    name: 'Dr. MyBeing',
    email: 'admin@mybeing.com',
    role: 'super_admin',
    avatar: undefined
  };

  return (
    <AdminLayout user={adminUser}>
      <UserManagement />
    </AdminLayout>
  );
}
