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
    <div className='mb-6'>
      <div className='flex flex-col gap-4 mb-2 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold text-zatobox-900 animate-slide-in-left'>
          {title}
        </h1>
        <div className='flex items-center gap-3'>
          <div className='relative w-full sm:w-80 animate-slide-in-left'>
            <Search
              size={20}
              className='absolute transform -translate-y-1/2 left-3 top-1/2 text-zatobox-600 icon-bounce'
            />
            <input
              type='text'
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder='Search products...'
              className='w-full py-2 pl-10 pr-4 text-sm transition-all duration-300 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900 placeholder-zatobox-600 hover:border-zatobox-300'
            />
          </div>
          <button
            onClick={onReload}
            disabled={loading}
            className='p-2 text-white transition-all duration-300 rounded-lg bg-zatobox-500 hover:bg-zatobox-600 hover:scale-110 hover:shadow-lg icon-bounce disabled:opacity-50 disabled:cursor-not-allowed'
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
  );
};

export default HomeHeader;
