import React from 'react';
import { Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  stock: number;
  price: number;
}

interface Props {
  item: Product;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, e?: React.MouseEvent) => void;
}

const InventoryCard: React.FC<Props> = ({
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div className='p-4 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
      <div className='flex items-start space-x-3'>
        <input
          type='checkbox'
          checked={selected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
          className='w-4 h-4 mt-1 border-gray-300 rounded text-zatobox-500 focus:ring-zatobox-500'
        />

        <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 bg-zatobox-100 rounded-lg'>
          <Package size={24} className='text-zatobox-600' />
        </div>

        <div className='flex-1 min-w-0'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h3 className='text-sm font-medium truncate text-zatobox-900'>
                {item.name}
              </h3>
              <p className='text-sm text-zatobox-600'>{item.category}</p>

              <div className='flex items-center mt-2 space-x-4'>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    item.stock > 10
                      ? 'bg-success-100 text-success-800'
                      : item.stock > 0
                      ? 'bg-warning-100 text-warning-800'
                      : 'bg-error-100 text-error-800'
                  }`}
                >
                  {item.stock} units
                </span>

                <span className='text-sm font-medium text-zatobox-900'>
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <span
                className={`inline-flex mt-2 text-xs ${
                  item.status === 'active' ? 'text-zatobox-600' : 'text-red-600'
                }`}
              >
                {item.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className='flex items-center space-x-1'>
              <button
                onClick={() => onEdit(item.id)}
                className='p-1 transition-colors rounded hover:bg-zatobox-100'
                title='Edit'
              >
                <svg
                  className='w-4 h-4 text-zatobox-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                  />
                </svg>
              </button>
              <button
                onClick={(e) => onDelete(item.id, e)}
                className='p-1 transition-colors rounded hover:bg-red-100'
                title='Delete'
              >
                <svg
                  className='w-4 h-4 text-red-600'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
