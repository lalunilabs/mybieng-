import { requireAdmin } from '@/lib/adminAuth';
import { WorldClassAdminLayout } from '@/components/admin/WorldClassAdminLayout';
import { AIManagementDashboard } from '@/components/admin/AIManagementDashboard';

export default function AIManagementPage() {
  requireAdmin();
  
  const user = {
    name: 'MyBeing Creator',
    email: process.env.ADMIN_EMAIL || 'sainiharika227@gmail.com'
  };

  return (
    <WorldClassAdminLayout user={user} activeSection="ai">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Management</h1>
          <p className="text-gray-600">Monitor and configure your AI providers and usage</p>
        </div>
        
        <AIManagementDashboard />
      </div>
    </WorldClassAdminLayout>
  );
}
