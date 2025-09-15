import type { Metadata } from 'next';
import CheckInsClient from '@/components/checkins/CheckInsClient';

export const metadata: Metadata = {
  title: 'Check-ins | MyBeing',
  description: 'Daily EMA micro-check-ins with weekly and monthly modules to track patterns in energy, mood, alignment, and progress.',
  alternates: { canonical: '/check-ins' },
  openGraph: {
    title: 'MyBeing Check-ins',
    description: 'Daily EMA micro-check-ins + weekly and monthly reflections.',
    url: '/check-ins',
    type: 'website',
    images: ['/api/og?title=MyBeing%20Check-ins&subtitle=Daily%20EMA%20micro-check-ins%20%2B%20weekly%20and%20monthly%20reflections.']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBeing Check-ins',
    description: 'Daily EMA micro-check-ins + weekly and monthly reflections.',
    images: ['/api/og?title=MyBeing%20Check-ins&subtitle=Daily%20EMA%20micro-check-ins%20%2B%20weekly%20and%20monthly%20reflections.']
  },
  robots: { index: true, follow: true },
};

export default function CheckInsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-white shadow-brutal text-sm font-semibold">
            <span>📈</span>
            <span className="text-foreground">Longitudinal pattern tracking</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">Daily, Weekly, Monthly Check-ins</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Non-medical, research-backed EMA designed to surface patterns in energy, mood, value alignment, and progress over time.
          </p>
        </div>

        <CheckInsClient />
      </div>
    </div>
  );
}
