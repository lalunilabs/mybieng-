import { requireAdmin } from '@/lib/adminAuth';
import { WorldClassAdminLayout } from '@/components/admin/WorldClassAdminLayout';
import { ContentCreator } from '@/components/admin/ContentCreator';

export default function CreateContentPage() {
  requireAdmin();
  
  const user = {
    name: 'MyBeing Creator',
    email: process.env.ADMIN_EMAIL || 'sainiharika227@gmail.com'
  };

  return (
    <WorldClassAdminLayout user={user} activeSection="content">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Content</h1>
          <p className="text-gray-600">Add new blog posts and quizzes to your platform</p>
        </div>
        
        <ContentCreator />
      </div>
    </WorldClassAdminLayout>
  );
}
