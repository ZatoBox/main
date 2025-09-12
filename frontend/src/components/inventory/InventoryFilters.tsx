import React from 'react';
import { Search, Printer, ChevronDown } from 'lucide-react';

interface Props {
  categories: string[];
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}

const InventoryFilters: React.FC<Props> = ({
  categories,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className='pb-4 mt-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative'>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='px-4 py-2 pr-8 text-sm border rounded-lg appearance-none bg-[#FFFFFF] border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#000000]'
          >
            <option value='all'>All Categories</option>
            {categories.slice(1).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className='absolute transform -translate-y-1/2 pointer-events-none right-2 top-1/2 text-zatobox-600'
          />
        </div>

        <div className='flex p-1 bg-[#FFFFFF] rounded-lg border border-[#CBD5E1]'>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              statusFilter === 'all'
                ? 'bg-[#F88612] text-[#FFFFFF] shadow-sm'
                : 'text-[#000000] hover:text-zatobox-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-md text-sm  transition-colors ${
              statusFilter === 'active'
                ? 'bg-[#F88612]  text-[#FFFFFF] shadow-sm'
                : 'text-[#000000] hover:text-zatobox-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1 rounded-md text-sm  transition-colors ${
              statusFilter === 'inactive'
                ? 'bg-[#F88612]  text-[#FFFFFF] shadow-sm'
                : 'text-[#000000] hover:text-zatobox-900'
            }`}
          >
            Inactive
          </button>
        </div>

        <div className='flex items-center ml-auto space-x-2'>
          <div className='relative'>
            <Search
              size={16}
              className='absolute transform -translate-y-1/2 left-3 top-1/2 text-zatobox-600'
            />
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Search...'
              className='w-48 py-2 pl-10 pr-4 text-sm border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-zatobox-900'
            />
          </div>
          <button className='p-2 transition-colors rounded-lg hover:bg-zatobox-100'>
            <Printer size={20} className='text-zatobox-600' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
