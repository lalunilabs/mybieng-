import { requireAdmin } from '@/lib/adminAuth';
import { WorldClassAdminLayout } from '@/components/admin/WorldClassAdminLayout';
import { WorldClassDashboard } from '@/components/admin/WorldClassDashboard';

export default function AdminPage() {
  requireAdmin();
  
  const user = {
    name: 'MyBeing Creator',
    email: process.env.ADMIN_EMAIL || 'sainiharika227@gmail.com'
  };

  return (
    <WorldClassAdminLayout user={user} activeSection="dashboard">
      <WorldClassDashboard />
    </WorldClassAdminLayout>
  );
}
