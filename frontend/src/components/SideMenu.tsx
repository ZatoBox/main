'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Package,
  Home,
  Plus,
  Archive,
  Brain,
  LogOut,
  User,
  Menu,
  X,
  Scan,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/auth-store';
import { usePlugins } from '@/context/plugin-context';
const SideMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isPluginActive } = usePlugins();
  const [showLogout, setShowLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const userInfoRef = useRef<HTMLDivElement | null>(null);
  const [hoverSupported, setHoverSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      setHoverSupported(
        window.matchMedia && window.matchMedia('(hover: hover)').matches
      );
    } catch {
      setHoverSupported(true);
    }
  }, []);

  useEffect(() => {
    if (hoverSupported) return;
    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (
        userInfoRef.current &&
        target &&
        !userInfoRef.current.contains(target)
      ) {
        setShowLogout(false);
      }
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, [hoverSupported]);

  // Initialize visible items on component mount
  useEffect(() => {
    const initialVisibleItems = new Set<string>();
    menuItems.forEach((item) => {
      const shouldBeVisible =
        item.alwaysVisible || (item.pluginId && isPluginActive(item.pluginId));
      if (shouldBeVisible) {
        initialVisibleItems.add(item.path);
      }
    });
    setVisibleItems(initialVisibleItems);
  }, []);

  // Effect to handle menu item animations when plugins change
  useEffect(() => {
    const newVisibleItems = new Set<string>();

    menuItems.forEach((item) => {
      const shouldBeVisible =
        item.alwaysVisible || (item.pluginId && isPluginActive(item.pluginId));
      if (shouldBeVisible) {
        newVisibleItems.add(item.path);
      }
    });

    // Find items that are being added
    const addedItems = Array.from(newVisibleItems).filter(
      (path) => !visibleItems.has(path)
    );
    // Find items that are being removed
    const removedItems = Array.from(visibleItems).filter(
      (path) => !newVisibleItems.has(path)
    );

    // Animate out items that are being removed
    if (removedItems.length > 0) {
      setAnimatingItems((prev) => new Set([...prev, ...removedItems]));

      setTimeout(() => {
        setVisibleItems(newVisibleItems);
        setAnimatingItems((prev) => {
          const newSet = new Set(prev);
          removedItems.forEach((item) => newSet.delete(item));
          return newSet;
        });
      }, 300); // Match the CSS transition duration
    } else {
      // Immediately show new items
      setVisibleItems(newVisibleItems);
    }

    // Animate in new items
    if (addedItems.length > 0) {
      setTimeout(() => {
        setAnimatingItems((prev) => {
          const newSet = new Set(prev);
          addedItems.forEach((item) => newSet.delete(item));
          return newSet;
        });
      }, 50); // Small delay for smooth animation
    }
  }, [isPluginActive]); // Removed visibleItems from dependencies to prevent infinite loop

  const menuItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/home',
      description: 'Main page',
      alwaysVisible: true,
    },
    {
      name: 'Inventory',
      icon: Archive,
      path: '/inventory',
      description: 'View inventory',
      alwaysVisible: true,
    },
    {
      name: 'Smart Inventory',
      icon: Brain,
      path: '/smart-inventory',
      description: 'AI for inventory',
      pluginId: 'smart-inventory',
      alwaysVisible: false,
    },
    {
      name: 'OCR Documents',
      icon: Scan,
      path: '/ocr-result',
      description: 'Process documents',
      pluginId: 'ocr-module',
      alwaysVisible: false,
    },
    {
      name: 'POS Integration',
      icon: Package,
      path: '/pos-integration',
      description: 'POS system integration',
      pluginId: 'pos-integration',
      alwaysVisible: false,
    },
    {
      name: 'Plugin Store',
      icon: Store,
      path: '/plugin-store',
      description: 'Browse modules',
      alwaysVisible: true,
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    // Close mobile menu after navigation
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

  // Component to render menu items
  const renderMenuItems = (items: any[], className: string = '') => {
    return items
      .filter((item) => {
        // Always show items that are always visible
        if (item.alwaysVisible) {
          return true;
        }
        // Show items that have a pluginId only if the plugin is active
        if (item.pluginId) {
          return isPluginActive(item.pluginId);
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
            (item.pluginId && isPluginActive(item.pluginId)));

        // Don't render if not visible and not animating
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
                item.pluginId && isPluginActive(item.pluginId)
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
              <div className='flex-1'>
                <div
                  className={`font-medium transition-colors duration-300 ${
                    isActive ? 'text-[#F88612]' : 'text-text-primary'
                  }`}
                >
                  {item.name}
                </div>
                <div className='text-xs transition-colors duration-300 text-[#475569]'>
                  {item.description}
                </div>
              </div>
            </button>
          </div>
        );
      })
      .filter(Boolean); // Remove null items
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className='fixed z-50 md:hidden top-4 left-4'>
        <button
          onClick={toggleMobileMenu}
          className='p-2 transition-colors border rounded-lg shadow-lg bg-white border-[#CBD5E1] hover:bg-gray-50'
        >
          {isMobileMenuOpen ? (
            <X size={24} className='text-zatobox-900' />
          ) : (
            <Menu size={24} className='text-zatobox-900' />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-[#CBD5E1] z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo/Brand */}
        <div className='flex items-center justify-center h-16 px-6 border-b border-[#CBD5E1]'>
          <img
            src='/images/logozato.png'
            alt='ZatoBox Logo'
            className='w-auto h-10'
          />
        </div>

        {/* Main Navigation */}
        <nav className='flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-menu-container'>
          {renderMenuItems(menuItems)}
        </nav>

        {/* User Info */}
        <div className='px-4 py-4 border-t border-[#CBD5E1]'>
          <div className='flex items-center p-3 space-x-3 rounded-lg hover:bg-gray-50'>
            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#F88612]'>
              <User size={16} className='text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium truncate text-black'>
                {user?.full_name || 'User'}
              </div>
              <div className='text-xs truncate text-black'>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className='p-2 transition-colors rounded-lg text-white hover:bg-[#FEF9EC] hover:text-[#F88612] hover:border hover:border-[#EEB131]'
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Side Menu */}
      <div className='hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-white md:border-r md:border-[#CBD5E1] md:z-40'>
        {/* Logo/Brand */}
        <div className='flex items-center justify-center h-16 px-6 border-b border-[#CBD5E1]'>
          <img
            src='/images/logozato.png'
            alt='ZatoBox Logo'
            className='w-auto h-10'
          />
        </div>

        {/* Main Navigation */}
        <nav className='flex-1 px-4 py-6 space-y-2 sidebar-menu-container'>
          {renderMenuItems(menuItems)}
        </nav>

        {/* User Info with Hover Animation */}
        <div className='px-4 py-4 border-t border-[#CBD5E1]'>
          <div
            ref={userInfoRef}
            className='relative cursor-pointer'
            onMouseEnter={
              hoverSupported ? () => setShowLogout(true) : undefined
            }
            onMouseLeave={
              hoverSupported ? () => setShowLogout(false) : undefined
            }
            onClick={
              !hoverSupported ? () => setShowLogout((prev) => !prev) : undefined
            }
          >
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out ${
                showLogout
                  ? 'bg-[#FEF9EC]  border-[#EEB131] shadow-sm'
                  : 'hover:bg-[#FEF9EC]'
              }`}
            >
              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-[#F88612]'>
                <User size={16} className='text-white' />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium truncate text-black'>
                  {user?.full_name || 'User'}
                </div>
                <div className='text-xs truncate text-black'>
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </div>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  showLogout
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2'
                }`}
              >
                <LogOut size={16} className='text-white' />
              </div>
            </div>

            <div
              className={`absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out ${
                showLogout
                  ? 'opacity-100 bg-[#FEF9EC] text-[#F88612] shadow-lg transform scale-100'
                  : 'opacity-0 bg-transparent transform scale-95 pointer-events-none'
              }`}
            >
              <button
                onClick={handleLogout}
                className='flex items-center space-x-2 text-sm font-medium'
              >
                <LogOut size={16} className='text-[#F88612]' />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
