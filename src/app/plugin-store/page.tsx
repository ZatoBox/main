'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, Wallet } from 'lucide-react';
import { useAuth } from '@/context/auth-store';
import { usePlugins } from '@/context/plugin-context';
import PluginGrid from '@/components/plugin-store/PluginGrid';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'info'>(
    'info'
  );

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
      id: 'wallet',
      name: 'Wallet',
      description: 'Gestiona tus fondos y realiza pagos',
      category: 'sales',
      icon: <Wallet size={24} />,
      status: 'inactive',
      version: '1.0.0',
      author: 'ZatoBox Team',
      rating: 4.9,
      installs: 1500,
      price: 'free',
      features: ['Gestiona tus fondos', 'Retiros', 'Historial'],
      screenshot:
        'https://i.pinimg.com/736x/f1/5e/71/f15e71b099330088cfd2902f56280782.jpg',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      const syncedPlugins = mockPlugins.map((plugin) => {
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

    if (searchQuery) {
      filtered = filtered.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlugins(filtered);
  }, [plugins, searchQuery]);

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
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-[#64748B]">
                <span>Herramientas</span>
                <ChevronRight size={14} />
                <span className="text-[#F88612] font-medium">Plugins</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1E293B]">
                  Tienda de Plugins
                </h1>
                <p className="text-[#64748B]">
                  Explora y gestiona los módulos comerciales de ZatoBox
                </p>
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={20}
                className="absolute transform -translate-y-1/2 left-3 top-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F88612]/20 focus:border-[#F88612] outline-none transition-all placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <PluginGrid
          plugins={filteredPlugins}
          onToggle={handlePluginToggle}
          getStatusBadge={getStatusBadge}
          getPriceBadge={getPriceBadge}
        />

        {filteredPlugins.length === 0 && (
          <div className="py-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold text-[#1E293B]">
              No se encontraron plugins
            </h3>
            <p className="text-[#64748B]">Intenta ajustar tu búsqueda</p>
          </div>
        )}

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
