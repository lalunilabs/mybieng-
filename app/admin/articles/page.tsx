import { requireAdminAuth } from '@/lib/auth/admin';
import { WorldClassAdminLayout } from '@/components/admin/WorldClassAdminLayout';
import AdminArticles from '@/components/admin/AdminArticles';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const adminUser = await requireAdminAuth();
  
  const user = {
    name: adminUser.name,
    email: adminUser.email
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
