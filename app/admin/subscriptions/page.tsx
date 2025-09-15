import { AdminLayout } from '@/components/admin/AdminLayout';
import { SubscriptionManagement } from '@/components/admin/SubscriptionManagement';

export const dynamic = 'force-dynamic';

export default async function AdminSubscriptionsPage() {
  // Mock admin user - replace with actual authentication
  const adminUser = {
    name: 'Dr. MyBeing',
    email: 'admin@mybeing.com',
    role: 'super_admin',
    avatar: undefined
  };

  return (
    <AdminLayout user={adminUser}>
      <SubscriptionManagement />
    </AdminLayout>
  );
}
