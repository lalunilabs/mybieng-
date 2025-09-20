import { requireAdmin } from '@/lib/adminAuth';
import { WorldClassAdminLayout } from '@/components/admin/WorldClassAdminLayout';
import AdminQuizzes from '@/components/admin/AdminQuizzes';

export const dynamic = 'force-dynamic';

export default function AdminQuizzesPage() {
  requireAdmin();
  
  const user = {
    name: 'MyBeing Creator',
    email: process.env.ADMIN_EMAIL || 'creator@mybeing.in'
  };

  return (
    <WorldClassAdminLayout user={user} activeSection="quizzes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
            <p className="text-gray-600 mt-1">Create and manage research-backed self-discovery quizzes</p>
          </div>
        </div>
        <AdminQuizzes />
      </div>
    </WorldClassAdminLayout>
  );
}
