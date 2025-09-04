'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { loadFromCookies, initialized } = useAuth();

  useEffect(() => {
    if (!initialized) {
      loadFromCookies();
    }
  }, [initialized, loadFromCookies]);

  return <>{children}</>;
};
