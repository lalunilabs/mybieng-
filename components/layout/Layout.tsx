import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBack?: boolean;
  actions?: ReactNode;
}

export function Layout({ children, title, description, showBack, actions }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(title || description || actions) && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                {showBack && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 text-gray-600 hover:text-gray-900"
                    onClick={() => window.history.back()}
                  >
                    ← Back
                  </Button>
                )}
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg text-gray-600">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ContentCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card className={className} hover>
      {children}
    </Card>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
