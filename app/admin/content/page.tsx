import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentManagement } from '@/components/admin/ContentManagement';
import UploadManager from '@/components/admin/UploadManager';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  // Mock admin user - replace with actual authentication
  const adminUser = {
    name: 'Dr. MyBeing',
    email: 'admin@mybeing.com',
    role: 'super_admin',
    avatar: undefined
  };

  return (
    <AdminLayout user={adminUser}>
      <ContentManagement />
      <div className="mt-6">
        <UploadManager />
      </div>
    </AdminLayout>
  );
}
