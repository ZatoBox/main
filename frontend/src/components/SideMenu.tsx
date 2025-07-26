import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, Home, Plus, Archive, Brain, Settings, LogOut, User, Menu, X, Scan, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePlugins } from '../contexts/PluginContext';

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isPluginActive } = usePlugins();
  const [showLogout, setShowLogout] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());


  // Initialize visible items on component mount
  useEffect(() => {
    const initialVisibleItems = new Set<string>();
    menuItems.forEach((item) => {
      const shouldBeVisible = item.alwaysVisible || (item.pluginId && isPluginActive(item.pluginId));
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
      const shouldBeVisible = item.alwaysVisible || (item.pluginId && isPluginActive(item.pluginId));
      if (shouldBeVisible) {
        newVisibleItems.add(item.path);
      }
    });

    // Find items that are being added
    const addedItems = Array.from(newVisibleItems).filter(path => !visibleItems.has(path));
    // Find items that are being removed
    const removedItems = Array.from(visibleItems).filter(path => !newVisibleItems.has(path));

    // Animate out items that are being removed
    if (removedItems.length > 0) {
      setAnimatingItems(prev => new Set([...prev, ...removedItems]));

      setTimeout(() => {
        setVisibleItems(newVisibleItems);
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          removedItems.forEach(item => newSet.delete(item));
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
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          addedItems.forEach(item => newSet.delete(item));
          return newSet;
        });
      }, 50); // Small delay for smooth animation
    }
  }, [isPluginActive]); // Removed visibleItems from dependencies to prevent infinite loop

  const menuItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/',
      description: 'Main page',
      alwaysVisible: true,
    },
    {
      name: 'New Product',
      icon: Plus,
      path: '/new-product',
      description: 'Add product',
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
    },
    {
      name: 'OCR Documents',
      icon: Scan,
      path: '/ocr-result',
      description: 'Process documents',
      pluginId: 'ocr-module',
    },
    {
      name: 'POS Integration',
      icon: Package,
      path: '/pos-integration',
      description: 'POS system integration',
      pluginId: 'pos-integration',
    },
    {
      name: 'Plugin Store',
      icon: Store,
      path: '/plugin-store',
      description: 'Browse modules',
      alwaysVisible: true,
    },
  ];

  const bottomMenuItems = [
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'Settings',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        if (item.alwaysVisible) {return true;}
        // Show items that have a pluginId only if the plugin is active
        if (item.pluginId) {return isPluginActive(item.pluginId);}
        return true;
      })
      .map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        const isVisible = visibleItems.has(item.path);
        const isAnimating = animatingItems.has(item.path);
        const isNewItem = !visibleItems.has(item.path) && (item.alwaysVisible || (item.pluginId && isPluginActive(item.pluginId)));

        // Don't render if not visible and not animating
        if (!isVisible && !isAnimating && !isNewItem) {return null;}

        return (
          <div
            key={item.path}
            className={`sidebar-menu-item transition-all duration-300 ease-in-out transform ${
              isVisible && !isAnimating
                ? 'opacity-100 translate-y-0 scale-100 animate-menu-item-bounce'
                : isAnimating
                  ? 'opacity-0 translate-y-2 scale-95 animate-menu-item-out'
                  : 'opacity-0 translate-y-2 scale-95'
            } ${isNewItem ? 'animate-menu-item-in' : ''} ${isActive ? 'active' : ''}`}
            style={{
              animationDelay: `${index * 50}ms`,
              transitionDelay: isNewItem ? `${index * 50}ms` : '0ms',
            }}
          >
            <button
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group ${className} ${
                isActive
                  ? 'bg-complement-50 text-complement-700 border border-complement-200 shadow-sm'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary hover:shadow-sm'
              } ${item.pluginId && isPluginActive(item.pluginId) ? 'plugin-indicator' : ''}`}
            >
              <Icon
                size={20}
                className={`mr-3 transition-all duration-300 ${
                  isActive ? 'text-complement-600 scale-110' : 'text-text-secondary group-hover:text-text-primary group-hover:scale-105'
                }`}
              />
              <div className="flex-1">
                <div className={`font-medium transition-colors duration-300 ${
                  isActive ? 'text-complement-700' : 'text-text-primary'
                }`}>
                  {item.name}
                </div>
                <div className="text-xs text-text-secondary transition-colors duration-300">
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
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-bg-surface border border-divider rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-text-primary" />
          ) : (
            <Menu size={24} className="text-text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 w-64 bg-bg-surface border-r border-divider z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-divider">
          <img
            src="/images/logozato.png"
            alt="ZatoBox Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-menu-container">
          {renderMenuItems(menuItems)}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 py-4 border-t border-divider space-y-2">
          {renderMenuItems(bottomMenuItems)}
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-divider">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
            <div className="w-8 h-8 bg-complement rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">
                {user?.fullName || 'User'}
              </div>
              <div className="text-xs text-text-secondary truncate">
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-error hover:bg-error-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Side Menu */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 md:bg-bg-surface md:border-r md:border-divider md:z-40">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-divider">
          <img
            src="/images/logozato.png"
            alt="ZatoBox Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 sidebar-menu-container">
          {renderMenuItems(menuItems)}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 py-4 border-t border-divider space-y-2">
          {renderMenuItems(bottomMenuItems)}
        </div>

        {/* User Info with Hover Animation */}
        <div className="px-4 py-4 border-t border-divider">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out ${
              showLogout
                ? 'bg-error-50 border border-error-200 shadow-sm'
                : 'hover:bg-gray-50'
            }`}>
              <div className="w-8 h-8 bg-complement rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">
                  {user?.fullName || 'User'}
                </div>
                <div className="text-xs text-text-secondary truncate">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </div>
              </div>

              {/* Logout Icon with Animation */}
              <div className={`transition-all duration-300 ease-in-out ${
                showLogout
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-2'
              }`}>
                <LogOut size={16} className="text-error" />
              </div>
            </div>

            {/* Logout Overlay with Animation */}
            <div className={`absolute inset-0 flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out ${
              showLogout
                ? 'opacity-100 bg-error-500 text-white shadow-lg transform scale-100'
                : 'opacity-0 bg-transparent transform scale-95 pointer-events-none'
            }`}>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 font-medium text-sm"
              >
                <LogOut size={16} />
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
