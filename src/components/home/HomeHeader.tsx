import React, { useEffect } from 'react';
import { Search, RefreshCw, ShoppingCart, Hash } from 'lucide-react';

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
    <div className="border-b bg-[#FFFFFF] border-[#CBD5E1]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-[#000000]">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search
                size={20}
                className="absolute transform -translate-y-1/2 left-3 top-1/2 text-zatobox-400"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search products..."
                className="w-full py-2 pl-10 pr-4 text-sm transition-all duration-300 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-transparent text-zatobox-900 placeholder-gray-500 hover:border-zatobox-300"
              />
            </div>

            <button
              onClick={onToggleSKU}
              className="p-2 text-white transition-all duration-300 rounded-lg"
              style={{ backgroundColor: '#E28E18' }}
              title="Búsqueda rápida SKU"
            >
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                  <Hash
                    size={14}
                    style={{ color: '#E28E18' }}
                    strokeWidth={3}
                  />
                </div>
                <span className="text-xs font-medium hidden sm:inline">
                  SKU
                </span>
              </div>
            </button>

            <button
              onClick={onReload}
              disabled={loading}
              className="p-2 text-white transition-all duration-300 rounded-lg bg-zatobox-500 hover:bg-zatobox-600 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title="Update products"
            >
              <RefreshCw
                size={20}
                className={`${loading ? 'animate-spin' : ''}`}
              />
            </button>

            <button
              onClick={onToggleCart}
              className="relative p-2 text-white transition-all duration-300 rounded-lg bg-gradient-to-br from-[#F88612] to-[#d17110] hover:scale-110 hover:shadow-lg"
              title="Toggle cart (Ctrl+K)"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
