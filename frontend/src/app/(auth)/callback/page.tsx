'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api.service';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    const res = await authAPI.getCurrentUser();
    return res.user;
  };

  const sendSocialToken = async (accessToken: string) => {
    try {
      const payload = await authAPI.socialRegister(accessToken);
      const localToken =
        (payload as any).token ||
        (payload as any).access_token ||
        (payload as any).token;
      const user = (payload as any).user || null;

      if (!localToken) {
        localStorage.setItem('auth0_token', accessToken);
        try {
          const me = await fetchMe();
          localStorage.setItem('user', JSON.stringify(me));
          navigate('/');
          window.location.reload();
          return;
        } catch {
          throw new Error('No local token received and /me failed');
        }
      }

      localStorage.setItem('token', localToken);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        try {
          const me = await fetchMe();
          localStorage.setItem('user', JSON.stringify(me));
        } catch {
          console.warn('Could not fetch /me with local token');
        }
      }

      navigate('/');
      window.location.reload();
    } catch (e: any) {
      setError(e.message || 'Error creating user');
    }
  };

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
    void sendSocialToken(accessToken);
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
