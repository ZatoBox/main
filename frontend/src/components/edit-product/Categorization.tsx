import React from 'react';

interface Props {
  existingCategories: string[];
  selectedCategories: string[];
  onToggle: (category: string) => void;
}

const Categorization: React.FC<Props> = ({
  existingCategories,
  selectedCategories,
  onToggle,
}) => {
  return (
    <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
      <h3 className='mb-4 text-lg font-medium text-text-primary'>
        Categorization
      </h3>
      <div className='space-y-4'>
        <div>
          <label className='block mb-3 text-sm font-medium text-text-primary'>
            Existing categories
          </label>
          <div className='space-y-2'>
            {existingCategories.map((category) => (
              <div key={category} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => onToggle(category)}
                  className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                />
                <label
                  htmlFor={`category-${category}`}
                  className='text-sm text-text-primary'
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categorization;
