'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SideMenu from '@/components/SideMenu';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const showSidebar = pathname !== '/';

  return (
    <div className='flex min-h-screen'>
      {showSidebar && <SideMenu />}
      <div
        className={`${showSidebar ? 'flex-1 ml-0 md:ml-64' : 'flex-1 w-full'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
