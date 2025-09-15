'use client';

import { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    if (mode === 'login') {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      // Handle signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Auto-login after signup
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/dashboard');
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
      />
    </div>
  );
}
