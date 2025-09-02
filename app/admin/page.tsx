import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { VersionInfo } from '@/components/VersionInfo';
import { requireAdmin } from '@/lib/adminAuth';
import AdminNav from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await requireAdmin();
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-black">Dr N's Admin Dashboard</h1>
        <p className="mt-2 text-black">Full control center for articles, quizzes, and content management.</p>

      <div className="mt-4">
        <AdminNav />
      </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>📝</span>
                Article Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• Create and edit articles as Dr N</li>
                <li>• Manage titles, excerpts, and content</li>
                <li>• Set reading time and categories</li>
                <li>• Publish/unpublish articles</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>🧠</span>
                Quiz Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• Create and edit quiz questions</li>
                <li>• Set difficulty levels and duration</li>
                <li>• Manage scoring and results</li>
                <li>• Track completion statistics</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>📊</span>
                Analytics & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• View user engagement metrics</li>
                <li>• Track quiz completion rates</li>
                <li>• Monitor article readership</li>
                <li>• Export anonymized data</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <span>⚙️</span>
                Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-black">
                <li>• Update author information (Dr N)</li>
                <li>• Manage categories and tags</li>
                <li>• Configure SEO settings</li>
                <li>• System preferences</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-gradient-to-r from-yellow-100 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-black">Quick Actions</CardTitle>
              <CardDescription className="text-black">Common tasks for content management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="justify-start bg-white hover:bg-yellow-50 text-black border border-purple-200" variant="outline">
                  <span className="mr-3">📝</span>
                  Write New Article
                </Button>
                <Button className="justify-start bg-white hover:bg-yellow-50 text-black border border-purple-200" variant="outline">
                  <span className="mr-3">🧠</span>
                  Create New Quiz
                </Button>
                <Button className="justify-start bg-white hover:bg-yellow-50 text-black border border-purple-200" variant="outline">
                  <span className="mr-3">📊</span>
                  View Analytics
                </Button>
                <Button className="justify-start bg-white hover:bg-yellow-50 text-black border border-purple-200" variant="outline">
                  <span className="mr-3">⚙️</span>
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Version Information */}
          <div className="mt-6">
            <VersionInfo showComponents showHistory />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/" className="text-purple-700 hover:text-purple-800 font-medium">← Back to Home</Link>
          <div className="flex space-x-3">
            <Link href="/admin/content">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white">
                <span className="mr-2">📝</span>
                Manage Articles
              </Button>
            </Link>
            <Link href="/admin/quizzes">
              <Button variant="outline" className="border-purple-600 text-black hover:bg-yellow-50">
                <span className="mr-2">🧠</span>
                Manage Quizzes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
