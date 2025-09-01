import { requireAdmin } from '@/lib/adminAuth';
import AdminNav from '@/components/admin/AdminNav';
import AdminQuizzes from '@/components/admin/AdminQuizzes';

export const dynamic = 'force-dynamic';

export default function AdminQuizzesPage() {
  requireAdmin();
  return (
    <section className="py-10">
      <h1 className="text-2xl font-semibold">Manage Quizzes</h1>
      <p className="text-gray-600 mt-2">Create, edit, publish, pricing, and SEO metadata.</p>
      <div className="mt-4">
        <AdminNav />
      </div>
      <div className="mt-6">
        <AdminQuizzes />
      </div>
    </section>
  );
}
