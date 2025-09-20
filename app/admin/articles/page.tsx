import { requireAdmin } from '@/lib/adminAuth';
import { WorldClassAdminLayout } from '@/components/admin/WorldClassAdminLayout';
import AdminArticles from '@/components/admin/AdminArticles';

export const dynamic = 'force-dynamic';

export default function AdminArticlesPage() {
  requireAdmin();
  
  const user = {
    name: 'MyBeing Creator',
    email: process.env.ADMIN_EMAIL || 'creator@mybeing.in'
  };

  return (
    <WorldClassAdminLayout user={user} activeSection="articles">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600 mt-1">Create and manage your research-backed articles</p>
          </div>
        </div>
        <AdminArticles />
      </div>
    </WorldClassAdminLayout>
  );
}
