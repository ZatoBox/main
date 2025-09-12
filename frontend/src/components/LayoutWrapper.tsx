'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SideMenu from '@/components/SideMenu';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const noSidebarPaths = [
    '/',
    '/login',
    '/register',
    '/auth/login',
    '/auth/register',
  ];
  const showSidebar = !noSidebarPaths.includes(pathname || '/');

  return (
    <div className='flex min-h-screen w-full overflow-x-hidden'>
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
