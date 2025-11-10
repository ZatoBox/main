'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const ReceiptsFilters: React.FC<Props> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  const statuses = [
    { value: 'all', label: 'Todos' },
    { value: 'completed', label: 'Completados' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'cancelled', label: 'Cancelados' },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white border border-[#E5E7EB] rounded-lg p-4">
      {/* Search */}
      <div className="flex-1 relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]"
        />
        <input
          type="text"
          placeholder="Buscar recibos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F88612] focus:border-transparent transition-all bg-white text-[#000000] placeholder-[#9CA3AF]"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
              statusFilter === status.value
                ? 'bg-[#F88612] text-white shadow-md'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F88612] hover:text-white hover:border-[#F88612]'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReceiptsFilters;
