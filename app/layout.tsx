import type { Metadata } from 'next';
import './globals.css';
import '../styles/colors.css';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/Container';
import Providers from '@/components/Providers';
import ScrollAnimations from '@/components/ScrollAnimations';
import EngagementProvider from '@/components/EngagementProvider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyBeing - Self-Discovery Platform',
  description: 'Discover patterns in your thoughts, behaviors, and personal growth through research-backed assessments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>
          <EngagementProvider>
            <ScrollAnimations />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </EngagementProvider>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
