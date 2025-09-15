import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary/5">
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary ring-1 ring-primary/20 shadow-soft">
              <span className="mr-2 text-lg">⚙️</span>
              <span className="font-semibold">Settings</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">Your Preferences</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">Manage your account, privacy and experience across MyBeing.</p>
          </div>

          {/* Account */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Email</div>
                  <div className="text-sm text-muted-foreground">Manage your sign-in email</div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Password</div>
                  <div className="text-sm text-muted-foreground">Change your password</div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Email updates</div>
                  <div className="text-sm text-muted-foreground">Receive progress summaries and insights</div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Data export</div>
                  <div className="text-sm text-muted-foreground">Download your quiz runs and insights</div>
                </div>
                <Link href="/api/runs/export">
                  <Button variant="outline" size="sm">Export JSON</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
