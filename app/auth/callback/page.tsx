'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storeToken } from '@/lib/actions';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCallback = async () => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (token) {
      // Store authentication data
      await storeToken({ token: token });
      localStorage.setItem('userId', userId || '');
      localStorage.setItem('userEmail', email || '');

      // Redirect to dashboard
      router.replace('/student');
    } else {
      // Handle authentication failure
      router.replace('/login?error=auth_failed');
    }
  };

  useEffect(() => {
    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-4">Completing authentication...</p>
      </div>
    </div>
  );
}
