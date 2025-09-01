import { designSystem } from '@/styles/design-system';

export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full font-sans antialiased bg-gray-50 text-gray-900">
        <div className="min-h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <main className="py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
