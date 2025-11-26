'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, Wallet } from 'lucide-react';
import { useAuth } from '@/context/auth-store';
import { usePlugins } from '@/context/plugin-context';
import PluginGrid from '@/components/plugin-store/PluginGrid';
import FeaturedSection from '@/components/plugin-store/FeaturedSection';
import PluginNotification from '@/components/plugin-store/PluginNotification';
import Loader from '@/components/ui/Loader';

interface IPlugin {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode | string;
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
  const { isPluginActive, togglePlugin, activePlugins } = usePlugins();
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
    { id: 'all', name: 'Descubrir', icon: '🌟' },
    { id: 'productivity', name: 'Archivos y Productividad', icon: '📁' },
    { id: 'inventory', name: 'Inventario', icon: '📦' },
    { id: 'sales', name: 'Ventas', icon: '💰' },
    { id: 'analytics', name: 'Analítica', icon: '📊' },
    { id: 'automation', name: 'Automatización', icon: '⚡' },
    { id: 'integrations', name: 'Integraciones', icon: '🔗' },
    { id: 'developer', name: 'Herramientas para Desarrolladores', icon: '🛠️' },
  ];

  const mockPlugins: IPlugin[] = [
    {
      id: 'ocr-module',
      name: 'Escáner de Documentos OCR',
      description:
        'Escanea y extrae datos de facturas, recibos y documentos automáticamente',
      category: 'productivity',
      icon: '🔍',
      status: 'active',
      version: '1.2.0',
      author: 'ZatoBox Team',
      rating: 4.8,
      installs: 1250,
      price: 'free',
      features: [
        'Escaneo de documentos',
        'Extracción de datos',
        'Procesamiento de facturas',
        'Gestión de recibos',
      ],
      screenshot:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    },
    {
      id: 'receipts',
      name: 'Recibos',
      description: 'Gestión y visualización de recibos de compra',
      category: 'productivity',
      icon: '🧾',
      status: 'active',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 4.5,
      installs: 420,
      price: 'free',
      features: [
        'Almacenamiento de recibos',
        'Búsqueda por cliente',
        'Exportar PDF',
      ],
      screenshot:
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=300&fit=crop',
    },
    {
      id: 'restock',
      name: 'Restock',
      description: 'Automatiza reabastecimiento y alertas de stock',
      category: 'inventory',
      icon: '📦',
      status: 'active',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 4.6,
      installs: 300,
      price: 'free',
      features: [
        'Alertas de bajo stock',
        'Sugerencias de reorden',
        'Pedidos automáticos',
      ],
      screenshot:
        'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/ifqONX8Chb7o/v1/715x-1.jpg',
    },
    {
      id: 'smart-inventory',
      name: 'Gestor de Inventario Inteligente',
      description:
        'Seguimiento avanzado de inventario con predicciones de stock impulsadas por IA y alertas',
      category: 'inventory',
      icon: '🧠',
      status: 'coming-soon',
      version: '2.1.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'Predicciones de IA',
        'Alertas de bajo stock',
        'Pronóstico de demanda',
        'Reordenamiento automatizado',
      ],
      screenshot:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    },
    {
      id: 'advanced-analytics',
      name: 'Panel de Control de Analítica Avanzada',
      description:
        'Analítica empresarial integral con información y generación de informes en tiempo real',
      category: 'analytics',
      icon: '📈',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'Paneles de control en tiempo real',
        'Informes personalizados',
        'Visualización de datos',
        'Capacidades de exportación',
      ],
    },
    {
      id: 'pos-integration',
      name: 'Integración de Sistemas POS',
      description:
        'Conéctese con sistemas POS populares para una sincronización de datos sin problemas',
      category: 'integrations',
      icon: '💳',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 4.7,
      installs: 850,
      price: 'free',
      features: [
        'Soporte para múltiples POS',
        'Sincronización en tiempo real',
        'Procesamiento de pagos',
        'Impresión de recibos',
      ],
    },
    {
      id: 'email-automation',
      name: 'Automatización de Email Marketing',
      description:
        'Automatice las comunicaciones con los clientes y las campañas de marketing',
      category: 'automation',
      icon: '📧',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'Plantillas de email',
        'Campañas automatizadas',
        'Segmentación de clientes',
        'Seguimiento de rendimiento',
      ],
    },
    {
      id: 'mobile-app',
      name: 'Aplicación Móvil',
      description:
        'Aplicación móvil nativa para gestionar su negocio sobre la marcha',
      category: 'productivity',
      icon: '📱',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'free',
      features: [
        'Modo fuera de línea',
        'Notificaciones push',
        'Escaneo de códigos de barras',
        'Acciones rápidas',
      ],
    },
    {
      id: 'api-gateway',
      name: 'Pasarela API',
      description:
        'Herramientas para desarrolladores para integraciones personalizadas y conexiones de terceros',
      category: 'developer',
      icon: '🔌',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: ['REST API', 'Webhooks', 'Soporte OAuth', 'Límites de tasa'],
    },
    {
      id: 'multi-store',
      name: 'Gestor de Múltiples Tiendas',
      description:
        'Administre múltiples ubicaciones de tiendas desde un solo panel',
      category: 'inventory',
      icon: '🏪',
      status: 'coming-soon',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'premium',
      features: [
        'Gestión de tiendas',
        'Sincronización de inventario',
        'Informes centralizados',
        'Acceso basado en roles',
      ],
    },
    {
      id: 'wallet',
      name: 'Wallet',
      description: 'Gestiona tus fondos',
      category: 'sales',
      icon: <Wallet />,
      status: 'inactive',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 0,
      installs: 0,
      price: 'free',
      features: ['Gestiona tus fondos', 'Retiros', 'Historial'],
      screenshot:
        'https://i.pinimg.com/736x/f1/5e/71/f15e71b099330088cfd2902f56280782.jpg',
    },
  ];

  useEffect(() => {
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
  }, [activePlugins]);

  useEffect(() => {
    let filtered = plugins;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (plugin) => plugin.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlugins(filtered);
  }, [plugins, selectedCategory, searchQuery]);

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

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    const timeoutId = setTimeout(checkScrollButtons, 100);
    return () => {
      window.removeEventListener('resize', checkScrollButtons);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(checkScrollButtons, 50);
    return () => clearTimeout(timeoutId);
  }, [filteredPlugins]);

  const showPluginNotification = (
    message: string,
    type: 'success' | 'info'
  ) => {
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

    const plugin = plugins.find((p) => p.id === pluginId);
    if (!plugin) {
      return;
    }

    await togglePlugin(pluginId);

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
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
            Activo
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">
            Inactivo
          </span>
        );
      case 'coming-soon':
        return (
          <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
            Próximamente
          </span>
        );
      case 'maintenance':
        return (
          <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
            Mantenimiento
          </span>
        );
      default:
        return null;
    }
  };

  const getPriceBadge = (price: string) => {
    return price === 'free' ? (
      <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
        Gratis
      </span>
    ) : (
      <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
        Premium
      </span>
    );
  };

  if (loading) {
    return <Loader text="Cargando tienda de plugins..." />;
  }

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
      <div className="bg-white border-b border-[#CBD5E1] ">
        <div className="px-3 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full min-w-0">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <h1 className="text-xl  font-bold text-text-primary truncate">
                Tienda de Plugins
              </h1>
              <p className="hidden m-4 text-xs sm:text-sm text-text-secondary lg:block truncate">
                Explora la creciente colección de módulos comerciales en ZatoBox
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 mx-auto max-w-7xl sm:px-6 sm:py-8 lg:px-8 lg:py-8 w-full min-w-0">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          {/* Category Tabs with Horizontal Scroll */}
          <div className="relative mb-4 sm:mb-6">
            <div className="relative">
              {/* Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border rounded-full shadow-lg top-1/2 border-divider hover:bg-gray-50 hover:scale-110"
                >
                  <ChevronLeft size={16} className="text-text-primary" />
                </button>
              )}

              {/* Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 transition-all duration-200 transform -translate-y-1/2 bg-white border rounded-full shadow-lg top-1/2 border-divider hover:bg-gray-50 hover:scale-110"
                >
                  <ChevronRight size={16} className="text-text-primary" />
                </button>
              )}

              {/* Categories Container */}
              <div
                ref={categoriesRef}
                onScroll={checkScrollButtons}
                className="flex gap-2 sm:gap-3 px-1 py-1 overflow-x-auto scrollbar-hide category-scroll-container w-full min-w-0"
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
                    <span className="mr-1 sm:mr-2">{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">
                      {category.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Gradient Overlay for Right Edge */}
              <div className="absolute top-0 bottom-0 right-0 w-6 sm:w-8 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>
          </div>

          {/* Search Section */}
          <div className="animate-slide-in-left">
            <div className="relative group">
              <Search
                size={16}
                className="absolute transform -translate-y-1/2 left-3 sm:left-4 top-1/2 text-gray-400 group-focus-within:text-zatobox-500 transition-colors duration-200"
              />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-sm transition-all duration-300 border rounded-xl border-gray-200 focus:ring-2 focus:ring-zatobox-500/20 focus:border-zatobox-500 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-300 hover:shadow-sm focus:shadow-md"
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
          <div className="py-8 sm:py-12 text-center">
            <div className="mb-4 text-4xl sm:text-6xl">🔍</div>
            <h3 className="mb-2 text-lg sm:text-xl font-semibold text-text-primary">
              No se encontraron plugins
            </h3>
            <p className="text-sm sm:text-base text-text-secondary">
              Intenta ajustar tu búsqueda o criterios de filtrado
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
