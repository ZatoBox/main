import React, { useEffect } from 'react';
import {
  Search,
  RefreshCw,
  ShoppingCart,
  Hash,
  ChevronRight,
} from 'lucide-react';

interface Props {
  title?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onReload: () => void;
  loading: boolean;
  onToggleCart?: () => void;
  onToggleSKU?: () => void;
  cartItemsCount?: number;
  isCartOpen?: boolean;
}

const HomeHeader: React.FC<Props> = ({
  title = 'Dashboard de Ventas',
  searchValue,
  onSearchChange,
  onReload,
  loading,
  onToggleCart,
  onToggleSKU,
  cartItemsCount = 0,
  isCartOpen = false,
}) => {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onToggleCart?.();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [onToggleCart]);

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span>Inicio</span>
            <ChevronRight size={14} />
            <span className="text-[#F88612] font-medium">Dashboard</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">{title}</h1>
            <p className="text-[#64748B]">
              Resumen de rendimiento y catálogo de productos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search
              size={20}
              className="absolute transform -translate-y-1/2 left-3 top-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F88612]/20 focus:border-[#F88612] outline-none transition-all placeholder-gray-400"
            />
          </div>

          <button
            onClick={onToggleSKU}
            className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-[#F88612] hover:text-[#F88612] transition-all duration-300"
            title="Búsqueda rápida SKU"
          >
            <Hash size={20} />
          </button>

          <button
            onClick={onReload}
            disabled={loading}
            className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-[#F88612] hover:text-[#F88612] transition-all duration-300 disabled:opacity-50"
            title="Actualizar productos"
          >
            <RefreshCw
              size={20}
              className={`${loading ? 'animate-spin' : ''}`}
            />
          </button>

          <button
            onClick={onToggleCart}
            className="relative p-2.5 bg-[#F88612] text-white rounded-xl hover:bg-[#E67300] transition-all duration-300 shadow-lg shadow-orange-500/20"
            title="Ver carrito (Ctrl+K)"
          >
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
