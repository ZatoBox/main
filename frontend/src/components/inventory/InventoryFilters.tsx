import React from "react";
import { Search, Printer, ChevronDown } from "lucide-react";

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
    <div className="pb-4 mt-4">
  <div className="flex flex-wrap gap-3">
    {/* Filtros de categoría y estado */}
    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
      <div className="relative">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 pr-8 text-sm border rounded-lg appearance-none bg-[#FFFFFF] border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent text-[#000000]"
        >
          <option value="all">All Categories</option>
          {categories.slice(1).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute transform -translate-y-1/2 pointer-events-none right-2 top-1/2 text-zatobox-600"
        />
      </div>

      <div className="flex p-1 bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] flex-wrap gap-1">
        {['all', 'active', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              statusFilter === status
                ? 'bg-[#F88612] text-[#FFFFFF] shadow-sm'
                : 'text-[#000000] hover:text-zatobox-900'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
    </div>

    {/* Search + Print */}
    <div className="flex w-full lg:w-auto lg:flex-1 items-center space-x-2 mt-2 lg:mt-0">
      <div className="relative flex-1 min-w-0">
        <Search
          size={16}
          className="absolute transform -translate-y-1/2 left-3 top-1/2 text-zatobox-600"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full py-2 pl-10 pr-4 text-sm border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-zatobox-900 min-w-0"
        />
      </div>
      <button className="p-2 transition-colors rounded-lg hover:bg-zatobox-100 flex-shrink-0">
        <Printer size={20} className="text-zatobox-600" />
      </button>
    </div>
  </div>
</div>

  );
};

export default InventoryFilters;
