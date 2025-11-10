'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-store';
import SideMenu from '@/components/SideMenu';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const noSidebarPaths = [
    '/',
    '/login',
    '/register',
    '/upgrade',
    '/landing',
    '/auth/login',
    '/auth/register',
  ];
  const existingPaths = [
    '/',
    '/auth/callback',
    '/auth/login',
    '/auth/register',
    '/failure',
    '/home',
    '/inventory',
    '/landing',
    '/new-product',
    '/ocr-result',
    '/plugin-store',
    '/polar-products',
    '/profile',
    '/receipts',
    '/restock',
    '/smart-inventory',
    '/success',
    '/swagger',
    '/upgrade',
  ];

  const isExisting = (path: string) => {
    if (existingPaths.includes(path)) return true;
    return false;
  };

  const shouldShowSidebar =
    isExisting(pathname || '/') && !noSidebarPaths.includes(pathname || '/');

  const showSidebar = shouldShowSidebar;

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {showSidebar && <SideMenu />}
      <div
        className={`${
          showSidebar
            ? 'flex-1 ml-0 md:ml-64 min-w-0 w-full overflow-x-hidden'
            : 'flex-1 w-full min-w-0 overflow-x-hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
