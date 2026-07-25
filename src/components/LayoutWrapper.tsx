'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import SideMenu from '@/components/SideMenu';
import BottomTabBar from '@/components/BottomTabBar';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rutas de la app autenticada: reciben sidebar/nav (prefix-match para
  // segmentos dinámicos como /edit-product/[id]).
  const APP_ROUTES = [
    '/home',
    '/inventory',
    '/smart-inventory',
    '/ocr-result',
    '/receipts',
    '/restock',
    '/wallet-withdraw',
    '/plugin-store',
    '/profile',
    '/new-product',
    '/edit-product',
    '/success',
    '/checkout',
  ];

  const currentPath = pathname || '/';
  const showSidebar = APP_ROUTES.some(
    (r) => currentPath === r || currentPath.startsWith(r + '/')
  );

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {showSidebar && (
        <SideMenu
          mobileOpen={mobileMenuOpen}
          onMobileOpenChange={setMobileMenuOpen}
        />
      )}
      {showSidebar && (
        <BottomTabBar onMoreClick={() => setMobileMenuOpen(true)} />
      )}
      <div
        className={`${
          showSidebar
            ? 'flex-1 md:ml-64 min-w-0 w-full overflow-x-hidden pb-tabbar md:pb-0'
            : 'flex-1 w-full min-w-0 overflow-x-hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
