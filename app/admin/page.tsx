import { AdminLayout } from '@/components/admin/AdminLayout';
import { EnhancedDashboard } from '@/components/admin/EnhancedDashboard';

const mockUser = {
  name: 'Admin User',
  email: 'admin@mybeing.com',
  role: 'super_admin'
};

export default function AdminPage() {
  return (
    <AdminLayout user={mockUser}>
      <EnhancedDashboard />
    </AdminLayout>
  );
}
