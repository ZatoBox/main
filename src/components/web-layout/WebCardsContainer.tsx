import React from 'react';
import { Search, Share2, ShoppingCart } from 'lucide-react';

interface WebCardsContainerProps {
  children: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  onShareClick?: () => void;
  onCartClick?: () => void;
  cartItemsCount?: number;
}

const WebCardsContainer: React.FC<WebCardsContainerProps> = ({
  children,
  searchValue = '',
  onSearchChange,
  placeholder = 'Search products...',
  onShareClick,
  onCartClick,
  cartItemsCount = 0,
}) => {
  return (
    <div className="-mt-50 relative z-10">
      {onSearchChange && (
        <div className="mb-6 px-6">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="relative bg-white rounded-[8px] flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-blue-500 focus:border-transparent rounded-[8px]"
              />
            </div>

            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-2">
                {onShareClick && (
                  <button
                    onClick={onShareClick}
                    className="bg-white px-3 py-2 rounded-[8px] border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-[#E28E18]" />
                    <span className="text-[#E28E18] text-sm font-medium">
                      Share
                    </span>
                  </button>
                )}
              </div>

              <div className="flex items-center">
                {onCartClick && (
                  <button
                    onClick={onCartClick}
                    className="bg-[#E28E18] px-3 py-2 rounded-[8px] hover:bg-[#D67B0A] transition-colors relative flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount > 9 ? '9+' : cartItemsCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-t-[8px] pt-6 px-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WebCardsContainer;
