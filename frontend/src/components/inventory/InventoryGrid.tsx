import React from 'react';
import InventoryCard from './InventoryCard';
import { Package } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  status: string;
  stock: number;
  price: number;
}

interface Props {
  items: Product[];
  selectedItems: number[];
  onSelectItem: (id: number, checked: boolean) => void;
  onEditProduct: (id: number) => void;
  onDeleteClick: (id: number, e?: React.MouseEvent) => void;
}

const InventoryGrid: React.FC<Props> = ({
  items,
  selectedItems,
  onSelectItem,
  onEditProduct,
  onDeleteClick,
}) => {
  return (
    <>
      <div className='hidden overflow-hidden border rounded-lg shadow-sm md:block bg-bg-surface border-divider'>
        <table className='w-full'>
          <thead className='border-b bg-gray-50 border-divider'>
            <tr>
              <th className='w-12 px-4 py-3'></th>
              <th className='w-16 px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary'>
                Image
              </th>
              <th className='px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary'>
                Item
              </th>
              <th className='px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary'>
                Category
              </th>
              <th className='hidden px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary lg:table-cell'>
                Stock
              </th>
              <th className='hidden px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary xl:table-cell'>
                Price
              </th>
              <th className='w-12 px-4 py-3'></th>
            </tr>
          </thead>
          <tbody className='divide-y bg-bg-surface divide-divider'>
            {items.map((item) => (
              <tr
                key={item.id}
                className='transition-colors cursor-pointer hover:bg-gray-50'
              >
                <td className='px-4 py-4'>
                  <input
                    type='checkbox'
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => onSelectItem(item.id, e.target.checked)}
                    className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                  />
                </td>
                <td className='px-4 py-4'>
                  <div className='flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg'>
                    <Package size={20} className='text-text-secondary' />
                  </div>
                </td>
                <td className='px-4 py-4'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-text-primary'>
                      {item.name}
                    </span>
                    <span
                      className={`text-xs ${
                        item.status === 'active' ? 'text-success' : 'text-error'
                      }`}
                    >
                      {item.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className='px-4 py-4 text-sm text-text-primary'>
                  {item.category}
                </td>
                <td className='hidden px-4 py-4 text-sm text-text-primary lg:table-cell'>
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
                </td>
                <td className='hidden px-4 py-4 text-sm font-medium text-text-primary xl:table-cell'>
                  ${item.price.toFixed(2)}
                </td>
                <td className='px-4 py-4'>
                  <div className='flex items-center space-x-1'>
                    <button
                      onClick={() => onEditProduct(item.id)}
                      className='p-1 transition-colors rounded hover:bg-gray-50'
                      title='Edit'
                    >
                      <svg
                        className='w-4 h-4 text-text-secondary'
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
                      onClick={(e) => onDeleteClick(item.id, e)}
                      className='p-1 transition-colors rounded hover:bg-red-50'
                      title='Delete'
                    >
                      <svg
                        className='w-4 h-4 text-red-500'
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='space-y-4 md:hidden'>
        {items.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            selected={selectedItems.includes(item.id)}
            onSelect={onSelectItem}
            onEdit={onEditProduct}
            onDelete={onDeleteClick}
          />
        ))}
      </div>
    </>
  );
};

export default InventoryGrid;
