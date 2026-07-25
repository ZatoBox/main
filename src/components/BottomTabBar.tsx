'use client';

/**
 * Barra de navegación inferior para móvil (<md). REVERSIBLE:
 * para quitarla, borrar este archivo y en LayoutWrapper.tsx eliminar
 * su línea de mount y las clases `pb-tabbar md:pb-0` del wrapper de
 * contenido. Nada más la referencia; SideMenu vuelve a hamburger-only.
 */

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAuth } from '@/context/auth-store';
import { useTranslation } from '@/hooks/use-translation';
import {
  menuItems,
  isMenuItemVisible,
} from '@/components/side-menu/menu-items';

interface BottomTabBarProps {
  onMoreClick: () => void;
}

const MAX_TABS = 4;

const BottomTabBar: React.FC<BottomTabBarProps> = ({ onMoreClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();

  const visibleTabs = menuItems
    .filter((item) => isMenuItemVisible(item, user?.modules))
    .slice(0, MAX_TABS);

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav
      aria-label={t('accessibility.ariaLabels.toggleNav')}
      className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white border-t border-[#CBD5E1] pb-safe"
    >
      <div className="flex h-16">
        {visibleTabs.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              aria-current={active ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-11 transition-colors ${
                active ? 'text-[#F88612]' : 'text-[#64748B]'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium leading-none truncate max-w-full px-1">
                {t(`sideMenu.${item.id}.name`)}
              </span>
            </button>
          );
        })}
        <button
          onClick={onMoreClick}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-11 text-[#64748B] transition-colors"
        >
          <Menu size={22} />
          <span className="text-[10px] font-medium leading-none truncate max-w-full px-1">
            {t('accessibility.ariaLabels.more')}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default BottomTabBar;
