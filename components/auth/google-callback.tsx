'use client';

import { useEffect } from 'react';

export default function GoogleCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      window.location.href = '/home';
    }
  }, []);

  return <p>Signing you in...</p>;
}
