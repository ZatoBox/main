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
        <h1 className='text-2xl font-bold text-text-primary animate-slide-in-left'>
          {title}
        </h1>
        <div className='flex items-center gap-3'>
          <div className='relative w-full sm:w-80 animate-slide-in-left'>
            <Search
              size={20}
              className='absolute transform -translate-y-1/2 left-3 top-1/2 text-text-secondary icon-bounce'
            />
            <input
              type='text'
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder='Search products...'
              className='w-full py-2 pl-10 pr-4 text-sm transition-all duration-300 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary placeholder-text-secondary hover:border-complement/50'
            />
          </div>
          <button
            onClick={onReload}
            disabled={loading}
            className='p-2 text-black transition-all duration-300 rounded-lg bg-primary hover:bg-primary-600 hover:scale-110 hover:shadow-lg icon-bounce disabled:opacity-50 disabled:cursor-not-allowed'
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
