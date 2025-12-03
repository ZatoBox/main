'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Package,
  Home,
  Plus,
  Archive,
  Brain,
  Sparkles,
  LogOut,
  User,
  Menu,
  X,
  Scan,
  Store,
  FileText,
  RefreshCw,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/auth-store';

const SideMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initialVisibleItems = new Set<string>();
    menuItems.forEach((item) => {
      const shouldBeVisible =
        item.alwaysVisible || (item.pluginId && user?.modules?.[item.pluginId]);
      if (shouldBeVisible) {
        initialVisibleItems.add(item.path);
      }
    });
    setVisibleItems(initialVisibleItems);
  }, [user]);

  useEffect(() => {
    setVisibleItems((prevVisible) => {
      const newVisibleItems = new Set<string>();
      menuItems.forEach((item) => {
        const shouldBeVisible =
          item.alwaysVisible ||
          (item.pluginId && user?.modules?.[item.pluginId]);
        if (shouldBeVisible) newVisibleItems.add(item.path);
      });

      const addedItems = Array.from(newVisibleItems).filter(
        (path) => !prevVisible.has(path)
      );
      const removedItems = Array.from(prevVisible).filter(
        (path) => !newVisibleItems.has(path)
      );

      if (removedItems.length > 0) {
        setAnimatingItems((prev) => new Set([...prev, ...removedItems]));

        setTimeout(() => {
          setVisibleItems(newVisibleItems);
          setAnimatingItems((prev) => {
            const newSet = new Set(prev);
            removedItems.forEach((item) => newSet.delete(item));
            return newSet;
          });
        }, 300);

        return prevVisible;
      }

      if (addedItems.length > 0) {
        setTimeout(() => {
          setAnimatingItems((prev) => {
            const newSet = new Set(prev);
            addedItems.forEach((item) => newSet.delete(item));
            return newSet;
          });
        }, 50);
      }

      return newVisibleItems;
    });
  }, [user]);

  const menuItems = [
    {
      name: 'Inicio',
      icon: Home,
      path: '/home',
      description: 'Página principal',
      alwaysVisible: true,
    },
    {
      name: 'Inventario',
      icon: Archive,
      path: '/inventory',
      description: 'Gestionar inventario',
      alwaysVisible: true,
    },
    {
      name: 'Inventario Inteligente',
      icon: Brain,
      path: '/smart-inventory',
      description: 'AI para inventario',
      pluginId: 'smart-inventory',
      alwaysVisible: false,
    },
    {
      name: 'Documentos OCR',
      icon: Scan,
      path: '/ocr-result',
      description: 'Procesar documentos',
      pluginId: 'ocr-module',
      alwaysVisible: false,
    },
    {
      name: 'Integración POS',
      icon: Package,
      path: '/pos-integration',
      description: 'Integración con sistemas POS',
      pluginId: 'pos-integration',
      alwaysVisible: false,
    },
    {
      name: 'Recibos',
      icon: FileText,
      path: '/receipts',
      description: 'Ver recibos de compra',
      pluginId: 'receipts',
      alwaysVisible: false,
    },
    {
      name: 'Restock',
      icon: RefreshCw,
      path: '/restock',
      description: 'Reabastecer inventario',
      pluginId: 'restock',
      alwaysVisible: false,
    },
    {
      name: 'Wallet',
      icon: Wallet,
      path: '/wallet-withdraw',
      description: 'Gestiona tus fondos',
      pluginId: 'wallet',
      alwaysVisible: false,
    },
    {
      name: 'Tienda de Plugins',
      icon: Store,
      path: '/plugin-store',
      description: 'Buscar módulos',
      alwaysVisible: true,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMenuItems = (items: any[], className: string = '') => {
    return items
      .filter((item) => {
        if (item.alwaysVisible) {
          return true;
        }
        if (item.pluginId) {
          return user?.modules?.[item.pluginId];
        }
        return true;
      })
      .map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        const isVisible = visibleItems.has(item.path);
        const isAnimating = animatingItems.has(item.path);
        const isNewItem =
          !visibleItems.has(item.path) &&
          (item.alwaysVisible ||
            (item.pluginId && user?.modules?.[item.pluginId]));

        if (!isVisible && !isAnimating && !isNewItem) {
          return null;
        }

        return (
          <div
            key={item.path}
            className={`sidebar-menu-item transition-all duration-300 ease-in-out transform ${
              isVisible && !isAnimating
                ? 'opacity-100 translate-y-0 scale-100 animate-menu-item-bounce'
                : isAnimating
                ? 'opacity-0 translate-y-2 scale-95 animate-menu-item-out'
                : 'opacity-0 translate-y-2 scale-95'
            } ${isNewItem ? 'animate-menu-item-in' : ''} ${
              isActive ? 'active' : ''
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              transitionDelay: isNewItem ? `${index * 50}ms` : '0ms',
            }}
          >
            <button
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group ${className} ${
                isActive
                  ? 'bg-[#FEF9EC] text-[#F88612] border border-[#EEB131] shadow-sm'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary hover:shadow-sm'
              } ${
                item.pluginId && user?.modules?.[item.pluginId]
                  ? 'plugin-indicator'
                  : ''
              }`}
            >
              <Icon
                size={20}
                className={`mr-3 transition-all duration-300 ${
                  isActive
                    ? 'text-[#F88612] scale-110'
                    : 'text-text-secondary group-hover:text-text-primary group-hover:scale-105'
                }`}
              />
              <div className="flex-1">
                <div
                  className={`font-medium transition-colors duration-300 ${
                    isActive ? 'text-[#F88612]' : 'text-text-primary'
                  }`}
                >
                  {item.name}
                </div>
                <div className="text-xs transition-colors duration-300 text-[#475569]">
                  {item.description}
                </div>
              </div>
            </button>
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <>
      {user?.role === 'guest' ? null : (
        <>
          <div className="fixed z-50 md:hidden top-4 left-4">
            <button
              onClick={toggleMobileMenu}
              className="p-2 transition-colors border rounded-lg shadow-lg bg-white border-[#CBD5E1] hover:bg-gray-50"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-zatobox-900" />
              ) : (
                <Menu size={24} className="text-zatobox-900" />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          <div
            className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-[#CBD5E1] z-50 transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center justify-center h-16 px-6 border-b border-[#CBD5E1]">
              <div
                onClick={() => router.push('/home')}
                className="cursor-pointer"
              >
                <img
                  src="/images/logozato.png"
                  alt="ZatoBox Logo"
                  className="w-auto h-10"
                />
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-menu-container">
              {renderMenuItems(menuItems)}
            </nav>

            <div className="px-4 py-2">
              <div className="mb-2 flex justify-center">
                <button
                  onClick={() =>
                    window.open(
                      'https://docs.google.com/forms/d/e/1FAIpQLSfJTvb4AK999EZVWsvaJk_6nFMKw67WrRHDlYhKjfg0fCZoFw/viewform',
                      '_blank'
                    )
                  }
                  className="relative w-[223px] h-[115px] bg-[#F3F5F7] border-2 border-[#CBD5E1] rounded-xl p-3 flex flex-col items-start text-left overflow-hidden group hover:border-[#F88612] transition-colors duration-300"
                >
                  <span className="text-black font-semibold text-xs leading-tight mb-1">
                    Queremos tu opinión
                  </span>
                  <span className="text-[#6A7282] text-[11px] leading-tight mb-auto pr-4">
                    Estamos mejorando tu experiencia y tu opinión es clave
                    ayúdanos a construir la próxima mejora
                  </span>
                  <div className="flex items-center gap-1 text-[#F88612] mt-1 z-10">
                    <ArrowRight size={14} />
                    <span className="font-bold text-xs">Dejar feedback</span>
                  </div>
                  <img
                    src="/images/feedback-geometric-shape.svg"
                    alt=""
                    className="absolute bottom-0 right-0"
                  />
                </button>
              </div>
            </div>

            <div className="px-4 py-4 border-t border-[#CBD5E1]">
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group text-text-secondary hover:bg-gray-50 hover:text-text-primary hover:shadow-sm"
              >
                <User
                  size={20}
                  className="mr-3 transition-all duration-300 text-text-secondary group-hover:text-text-primary group-hover:scale-105"
                />
                <div className="flex-1">
                  <div className="font-medium transition-colors duration-300 text-text-primary">
                    Perfil
                  </div>
                  <div className="text-xs transition-colors duration-300 text-[#475569]">
                    Gestionar cuenta
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-white md:border-r md:border-[#CBD5E1] md:z-40">
            <div className="flex items-center justify-center h-16 px-6 border-b border-[#CBD5E1]">
              <div
                onClick={() => router.push('/home')}
                className="cursor-pointer"
              >
                <img
                  src="/images/logozato.png"
                  alt="ZatoBox Logo"
                  className="w-auto h-10"
                />
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 sidebar-menu-container">
              {renderMenuItems(menuItems)}
            </nav>

            <div className="px-4 py-2">
              <div className="mb-2 flex justify-center">
                <button
                  onClick={() =>
                    window.open(
                      'https://docs.google.com/forms/d/e/1FAIpQLSfJTvb4AK999EZVWsvaJk_6nFMKw67WrRHDlYhKjfg0fCZoFw/viewform',
                      '_blank'
                    )
                  }
                  className="relative w-[223px] h-[115px] bg-[#F3F5F7] border-2 border-[#CBD5E1] rounded-xl p-3 flex flex-col items-start text-left overflow-hidden group hover:border-[#F88612] transition-colors duration-300"
                >
                  <span className="text-black font-semibold text-xs leading-tight mb-1">
                    Queremos tu opinión
                  </span>
                  <span className="text-[#6A7282] text-[11px] leading-tight mb-auto pr-4">
                    Estamos mejorando tu experiencia y tu opinión es clave
                    ayúdanos a construir la próxima mejora
                  </span>
                  <div className="flex items-center gap-1 text-[#F88612] mt-1 z-10">
                    <ArrowRight size={14} />
                    <span className="font-bold text-xs">Dejar feedback</span>
                  </div>
                  <img
                    src="/images/feedback-geometric-shape.svg"
                    alt=""
                    className="absolute bottom-0 right-0"
                  />
                </button>
              </div>
            </div>

            <div className="px-4 py-4 border-t border-[#CBD5E1]">
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group text-text-secondary hover:bg-gray-50 hover:text-text-primary hover:shadow-sm"
              >
                <User
                  size={20}
                  className="mr-3 transition-all duration-300 text-text-secondary group-hover:text-text-primary group-hover:scale-105"
                />
                <div className="flex-1">
                  <div className="font-medium transition-colors duration-300 text-text-primary">
                    Perfil
                  </div>
                  <div className="text-xs transition-colors duration-300 text-[#475569]">
                    Gestionar cuenta
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SideMenu;
