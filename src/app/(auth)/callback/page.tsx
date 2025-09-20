'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-store';

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setError('No token returned');
      return;
    }
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const state = params.get('state');
    const storedState = sessionStorage.getItem('auth0_state');

    if (!accessToken) {
      setError('Missing access token');
      return;
    }
    if (!state || !storedState || state !== storedState) {
      setError('Invalid state');
      return;
    }

    sessionStorage.removeItem('auth0_state');
    sessionStorage.removeItem('auth0_nonce');

    setError(
      'Social login not implemented yet. Please use email/password login.'
    );

    history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }, []);

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='p-6 border rounded bg-bg-surface border-divider'>
          <p className='text-error-700'>{error}</p>
          <button
            onClick={() => router.push('/login')}
            className='px-4 py-2 mt-4 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary-600'
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='p-6 border rounded bg-bg-surface border-divider'>
        <p>Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
