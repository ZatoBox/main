import React, { useState, useMemo } from 'react';

interface Category {
  id: string;
  name: string;
}
interface Props {
  categories: Category[];
  selectedCategories: string[];
  onToggle: (id: string) => void;
  loading?: boolean;
}

const Categorization: React.FC<Props> = ({
  categories,
  selectedCategories,
  onToggle,
  loading,
}) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      ),
    [categories, query]
  );
  return (
    <div className='p-6 border rounded-lg shadow-sm bg-white border-[#CBD5E1] space-y-4'>
      <h3 className='text-lg font-medium text-black'>Categorías</h3>
      {loading ? (
        <div className='text-sm text-gray-500'>Cargando...</div>
      ) : (
        <>
          <input
            type='text'
            placeholder='Buscar categorías...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='w-full p-2 text-sm border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent'
          />
          <div className='max-h-48 overflow-auto pr-1 space-y-1 custom-scrollbar'>
            {filtered.map((c) => {
              const isSelected = selectedCategories.includes(c.id);
              return (
                <button
                  type='button'
                  key={c.id}
                  onClick={() => onToggle(c.id)}
                  className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-sm border transition-colors ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-black'
                      : 'border-[#CBD5E1] hover:border-primary hover:bg-primary/5 text-gray-600'
                  }`}
                >
                  <span className='truncate'>{c.name}</span>
                  {isSelected && (
                    <span className='ml-2 text-xs font-medium text-primary'>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className='px-2 py-4 text-xs text-center text-gray-400'>
                No matches
              </div>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            {selectedCategories.map((id) => {
              const cat = categories.find((c) => c.id === id);
              return (
                <span
                  key={id}
                  className='inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded-md border border-primary'
                >
                  {cat ? cat.name : id}
                  <button
                    type='button'
                    className='ml-1 text-primary/70 hover:text-primary'
                    onClick={() => onToggle(id)}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Categorization;
