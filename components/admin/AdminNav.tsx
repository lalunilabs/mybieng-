"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      router.push('/admin/login');
    }
  };

  return (
    <nav className="flex items-center justify-between mb-6">
      <div className="space-x-4">
        <Link href="/admin" className="text-brand-700 hover:underline">Dashboard</Link>
        <Link href="/admin/articles" className="text-brand-700 hover:underline">Articles</Link>
        <Link href="/admin/quizzes" className="text-brand-700 hover:underline">Quizzes</Link>
      </div>
      <button onClick={logout} disabled={loading} className="rounded-md bg-gray-800 text-white px-3 py-1 disabled:opacity-60">
        {loading ? 'Signing out...' : 'Sign out'}
      </button>
    </nav>
  );
}
