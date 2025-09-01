import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { VersionInfo } from '@/components/VersionInfo';
import { requireAdmin } from '@/lib/adminAuth';
import AdminNav from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  requireAdmin();
  return (
    <section className="py-10">
      <h1 className="text-3xl font-semibold">Owner Admin</h1>
      <p className="mt-2 text-gray-600">Full control center for content, quizzes, images, and system settings.</p>

      <div className="mt-4">
        <AdminNav />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Content Management</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Articles: create, edit, publish, SEO</li>
            <li>Images: upload, edit, tag, CDN</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Quizzes</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Builder: questions, scoring bands</li>
            <li>Pricing & access</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Analytics</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Usage, conversions, revenue</li>
            <li>Anonymized exports</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">System</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Auth, 2FA, IP allowlist</li>
            <li>Integrations (Stripe, Supabase, AI)</li>
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-brand-50 rounded-lg p-6 border border-brand-100">
          <h3 className="text-lg font-semibold text-brand-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="ghost">
              <span className="mr-3">📝</span>
              Create New Quiz
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <span className="mr-3">📊</span>
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <span className="mr-3">👥</span>
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <span className="mr-3">⚙️</span>
              System Settings
            </Button>
          </div>
        </div>

        {/* Version Information */}
        <VersionInfo showComponents showHistory />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link href="/" className="text-brand-700 hover:underline">Back to Home</Link>
        <div className="flex space-x-3">
          <Link href="/admin/content">
            <Button>
              <span className="mr-2">📝</span>
              Manage Content
            </Button>
          </Link>
          <Link href="/admin/research">
            <Button variant="outline">
              <span className="mr-2">📊</span>
              Research Data
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
