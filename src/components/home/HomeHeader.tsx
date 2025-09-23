import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

interface Props {
  title?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onReload: () => void;
  loading: boolean;
}

const HomeHeader: React.FC<Props> = ({
  title = 'Sales Dashboard',
  searchValue,
  onSearchChange,
  onReload,
  loading,
}) => {
  return (
    <div className='border-b bg-[#FFFFFF] border-[#CBD5E1]'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Primer div: Agrupa el título */}
          <div className='flex items-center space-x-4'>
            <h1 className='text-xl font-bold text-[#000000]'>{title}</h1>
          </div>

          {/* Segundo div: Agrupa la barra de búsqueda y el botón de recarga */}
          <div className='flex items-center gap-3'>
            <div className='relative w-full sm:w-80'>
              <Search
                size={20}
                className='absolute transform -translate-y-1/2 left-3 top-1/2 text-zatobox-400'
              />
              <input
                type='text'
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder='Search products...'
                className='w-full py-2 pl-10 pr-4 text-sm transition-all duration-300 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-transparent text-zatobox-900 placeholder-gray-500 hover:border-zatobox-300'
              />
            </div>
            <button
              onClick={onReload}
              disabled={loading}
              className='p-2 text-white transition-all duration-300 rounded-lg bg-zatobox-500 hover:bg-zatobox-600 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
              title='Update products'
            >
              <RefreshCw
                size={20}
                className={`${loading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
