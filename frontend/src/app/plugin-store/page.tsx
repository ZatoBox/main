'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/auth-store';
import { usePlugins } from '@/context/plugin-context';
import PluginGrid from '@/components/plugin-store/PluginGrid';
import FeaturedSection from '@/components/plugin-store/FeaturedSection';
import PluginNotification from '@/components/plugin-store/PluginNotification';

interface IPlugin {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'inactive' | 'coming-soon' | 'maintenance';
  version: string;
  author: string;
  rating: number;
  installs: number;
  price: 'free' | 'premium';
  features: string[];
  screenshot?: string;
}

const PluginStorePage: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { isPluginActive, togglePlugin } = usePlugins();
  const [plugins, setPlugins] = useState<IPlugin[]>([]);
  const [filteredPlugins, setFilteredPlugins] = useState<IPlugin[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'info'>(
    'info'
  );

  const categories = [
    { id: 'all', name: 'Discover', icon: '🌟' },
    { id: 'productivity', name: 'Files & Productivity', icon: '📁' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'automation', name: 'Automation', icon: '⚡' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'developer', name: 'Developer Tools', icon: '🛠️' },
  ];

  // Mock data for plugins
  const mockPlugins: IPlugin[] = [
    {
      id: 'ocr-module',
      name: 'OCR Document Scanner',
      description:
        'Scan and extract data from invoices, receipts, and documents automatically',
      category: 'productivity',
      icon: '🔍',
      status: 'active',
      version: '1.2.0',
      author: 'ZatoBox Team',
      rating: 4.8,
      installs: 1250,
      price: 'free',
      features: [
        'Document scanning',
        'Data extraction',
        'Invoice processing',
        'Receipt management',
      ],
      screenshot:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    },
    {
      id: 'smart-inventory',
      name: 'Smart Inventory Manager',
      description:
        'Advanced inventory tracking with AI-powered stock predictions and alerts',
      category: 'inventory',
      icon: '🧠',
      status: 'coming-soon',
      version: '2.1.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'AI predictions',
        'Low stock alerts',
        'Demand forecasting',
        'Automated reordering',
      ],
      screenshot:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics Dashboard',
      description:
        'Comprehensive business analytics with real-time insights and reporting',
      category: 'analytics',
      icon: '📈',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'Real-time dashboards',
        'Custom reports',
        'Data visualization',
        'Export capabilities',
      ],
    },
    {
      id: 'pos-integration',
      name: 'POS System Integration',
      description:
        'Connect with popular POS systems for seamless data synchronization',
      category: 'integrations',
      icon: '💳',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 4.7,
      installs: 850,
      price: 'free',
      features: [
        'Multi-POS support',
        'Real-time sync',
        'Payment processing',
        'Receipt printing',
      ],
    },
    {
      id: 'email-automation',
      name: 'Email Automation Suite',
      description: 'Automate customer communications and marketing campaigns',
      category: 'automation',
      icon: '📧',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'Email templates',
        'Automated campaigns',
        'Customer segmentation',
        'Performance tracking',
      ],
    },
    {
      id: 'mobile-app',
      name: 'Mobile App Companion',
      description: 'Native mobile app for managing your business on the go',
      category: 'productivity',
      icon: '📱',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'free',
      features: [
        'Offline mode',
        'Push notifications',
        'Barcode scanning',
        'Quick actions',
      ],
    },
    {
      id: 'api-gateway',
      name: 'API Gateway',
      description:
        'Developer tools for custom integrations and third-party connections',
      category: 'developer',
      icon: '🔌',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: ['REST API', 'Webhooks', 'OAuth support', 'Rate limiting'],
    },
    {
      id: 'multi-store',
      name: 'Multi-Store Manager',
      description: 'Manage multiple store locations from a single dashboard',
      category: 'inventory',
      icon: '🏪',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'Store management',
        'Inventory sync',
        'Centralized reporting',
        'Role-based access',
      ],
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const syncedPlugins = mockPlugins.map((plugin) => {
        if (
          plugin.status === 'coming-soon' ||
          plugin.status === 'maintenance'
        ) {
          return plugin;
        }
        return {
          ...plugin,
          status: (isPluginActive(plugin.id) ? 'active' : 'inactive') as
            | 'active'
            | 'inactive'
            | 'coming-soon'
            | 'maintenance',
        };
      });

      setPlugins(syncedPlugins);
      setFilteredPlugins(syncedPlugins);
      setLoading(false);
    }, 1000);
  }, [isPluginActive]);

  useEffect(() => {
    let filtered = plugins;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (plugin) => plugin.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlugins(filtered);
  }, [plugins, selectedCategory, searchQuery]);

  // Functions for horizontal scrolling
  const checkScrollButtons = () => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Effect to check scroll buttons on mount and resize
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);

    // Check scroll buttons after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(checkScrollButtons, 100);

    return () => {
      window.removeEventListener('resize', checkScrollButtons);
      clearTimeout(timeoutId);
    };
  }, []);

  // Effect to update scroll buttons when filtered plugins change
  useEffect(() => {
    const timeoutId = setTimeout(checkScrollButtons, 50);
    return () => clearTimeout(timeoutId);
  }, [filteredPlugins]);

  // Function to show notification
  const showPluginNotification = (
    message: string,
    type: 'success' | 'info'
  ) => {
    // Only show notifications when explicitly called, not automatically
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handlePluginToggle = async (pluginId: string) => {
    if (!token) {
      alert('Please log in to manage plugins');
      return;
    }

    // Get current plugin info
    const plugin = plugins.find((p) => p.id === pluginId);
    if (!plugin) {
      return;
    }

    // Toggle plugin status using context
    togglePlugin(pluginId);

    // Update local state to reflect the change
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === pluginId) {
          const newStatus = isPluginActive(pluginId) ? 'active' : 'inactive';
          return {
            ...p,
            status: newStatus as 'active' | 'inactive' | 'coming-soon',
          };
        }
        return p;
      })
    );

    // Plugin status updated successfully
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className='px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full'>
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className='px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full'>
            Inactive
          </span>
        );
      case 'coming-soon':
        return (
          <span className='px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full'>
            Coming Soon
          </span>
        );
      case 'maintenance':
        return (
          <span className='px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full'>
            Maintenance
          </span>
        );
      default:
        return null;
    }
  };

  const getPriceBadge = (price: string) => {
    return price === 'free' ? (
      <span className='px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full'>
        Free
      </span>
    ) : (
      <span className='px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full'>
        Premium
      </span>
    );
  };

  if (loading) {
    return (
     <div className="flex items-center justify-center min-h-screen  bg-bg-main">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-bg-main'>
      {/* Header */}
      <div className='bg-white '>
        <div className='px-3 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full min-w-0'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center gap-2 sm:gap-4 min-w-0'>
              <h1 className='text-xl sm:text-2xl font-bold text-text-primary truncate'>
                Plugin Store
              </h1>
              <p className='hidden text-xs sm:text-sm text-text-secondary lg:block truncate'>
                Browse the ever-growing collection of business modules on
                ZatoBox
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='px-3 py-4 mx-auto max-w-7xl sm:px-6 sm:py-8 lg:px-8 lg:py-8 w-full min-w-0'>
        {/* Search and Filters */}
        <div className='mb-6 sm:mb-8'>
          {/* Category Tabs with Horizontal Scroll */}
          <div className='relative mb-4 sm:mb-6'>
            <div className='relative'>
              {/* Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className='absolute left-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border rounded-full shadow-lg top-1/2 border-divider hover:bg-gray-50 hover:scale-110'
                >
                  <ChevronLeft size={16} className='text-text-primary' />
                </button>
              )}

              {/* Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className='absolute right-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border rounded-full shadow-lg top-1/2 border-divider hover:bg-gray-50 hover:scale-110'
                >
                  <ChevronRight size={16} className='text-text-primary' />
                </button>
              )}

              {/* Categories Container */}
              <div
                ref={categoriesRef}
                onScroll={checkScrollButtons}
                className='flex gap-2 sm:gap-3 px-1 py-1 overflow-x-auto scrollbar-hide category-scroll-container w-full min-w-0'
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap category-tab ${
                      selectedCategory === category.id
                        ? 'active shadow-md transform scale-105'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <span className='mr-1 sm:mr-2'>{category.icon}</span>
                    <span className='hidden sm:inline'>{category.name}</span>
                    <span className='sm:hidden'>
                      {category.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Gradient Overlay for Right Edge */}
              <div className='absolute top-0 bottom-0 right-0 w-6 sm:w-8 pointer-events-none bg-gradient-to-l from-white to-transparent'></div>
            </div>
          </div>

          {/* Search Section */}
          <div className='animate-slide-in-left'>
            <div className='relative group'>
              <Search
                size={16}
                className='absolute transform -translate-y-1/2 left-3 sm:left-4 top-1/2 text-gray-400 group-focus-within:text-zatobox-500 transition-colors duration-200'
              />
              <input
                type='text'
                placeholder='Search plugins...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm transition-all duration-300 border rounded-xl border-gray-200 focus:ring-2 focus:ring-zatobox-500/20 focus:border-zatobox-500 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300 hover:shadow-sm focus:shadow-md'
              />
            </div>
          </div>
        </div>

        {selectedCategory === 'all' && (
          <FeaturedSection
            plugins={filteredPlugins}
            getStatusBadge={getStatusBadge}
            getPriceBadge={getPriceBadge}
            onToggle={handlePluginToggle}
          />
        )}

        <PluginGrid
          plugins={filteredPlugins}
          onToggle={handlePluginToggle}
          getStatusBadge={getStatusBadge}
          getPriceBadge={getPriceBadge}
        />

        {/* Empty State */}
        {filteredPlugins.length === 0 && (
          <div className='py-8 sm:py-12 text-center'>
            <div className='mb-4 text-4xl sm:text-6xl'>🔍</div>
            <h3 className='mb-2 text-lg sm:text-xl font-semibold text-text-primary'>
              No plugins found
            </h3>
            <p className='text-sm sm:text-base text-text-secondary'>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Plugin Change Notification */}
        {showNotification && (
          <PluginNotification
            message={notificationMessage}
            type={notificationType}
          />
        )}
      </div>
    </div>
  );
};

export default PluginStorePage;
