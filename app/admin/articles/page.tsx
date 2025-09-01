import { requireAdmin } from '@/lib/adminAuth';
import AdminNav from '@/components/admin/AdminNav';
import AdminArticles from '@/components/admin/AdminArticles';

export const dynamic = 'force-dynamic';

export default function AdminArticlesPage() {
  requireAdmin();
  return (
    <section className="py-10">
      <h1 className="text-2xl font-semibold">Manage Articles</h1>
      <p className="text-gray-600 mt-2">Create, edit, publish, and control SEO metadata.</p>
      <div className="mt-4">
        <AdminNav />
      </div>
      <div className="mt-6">
        <AdminArticles />
      </div>
    </section>
  );
}
