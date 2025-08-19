import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const getApiEndpoint = () => {
    let api =
      (import.meta.env.VITE_API_URL as string) || 'http://localhost:4444';
    api = api.replace(/\/$/, '');
    if (api.includes('/api')) {
      return `${api}/auth/social`;
    }
    return `${api}/api/auth/social`;
  };

  const fetchMe = async (token: string) => {
    const raw =
      (import.meta.env.VITE_API_URL as string) || 'http://localhost:4444';
    const base = raw.replace(/\/+$/g, '');
    const url = base.endsWith('/api')
      ? `${base}/auth/me`
      : `${base}/api/auth/me`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Failed /me (${res.status}) ${body}`);
    }
    return res.json();
  };

  const sendSocialToken = async (accessToken: string) => {
    try {
      const endpoint = getApiEndpoint();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          payload.detail ||
          payload.message ||
          JSON.stringify(payload) ||
          'Social register failed';
        throw new Error(msg);
      }

      const localToken =
        payload.access_token || payload.token || payload.accessToken;
      if (!localToken) {
        try {
          const me = await fetchMe(accessToken);
          localStorage.setItem('user', JSON.stringify(me));
          localStorage.setItem('auth0_token', accessToken);
          navigate('/');
          window.location.reload();
          return;
        } catch {
          throw new Error('No local token received');
        }
      }

      localStorage.setItem('token', localToken);
      localStorage.setItem('user', JSON.stringify(payload.user));

      try {
        const me = await fetchMe(localToken);
        localStorage.setItem('user', JSON.stringify(me));
      } catch {
        console.warn('Could not fetch /me with local token');
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
