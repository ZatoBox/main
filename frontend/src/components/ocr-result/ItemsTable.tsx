import React from 'react';

import type { OCRLineItem } from '@/services/api.service';

type Props = {
  items: OCRLineItem[];
  isEditing?: boolean;
  onChange?: (index: number, field: string, value: any) => void;
};

const ItemsTable: React.FC<Props> = ({
  items,
  isEditing = false,
  onChange,
}) => {
  return (
    <div className='mb-6'>
      <h3 className='mb-3 text-base font-semibold md:text-lg text-zatobox-900 md:mb-4'>
        4E6 Detected Items
      </h3>
      <div className='overflow-hidden rounded-lg bg-zatobox-50'>
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-zatobox-100'>
                <th className='px-3 py-3 text-xs font-medium text-left md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                  Description
                </th>
                <th className='px-3 py-3 text-xs font-medium text-right md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                  Quantity
                </th>
                <th className='px-3 py-3 text-xs font-medium text-right md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                  Unit Price
                </th>
                <th className='px-3 py-3 text-xs font-medium text-right md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                  Total
                </th>
                <th className='px-3 py-3 text-xs font-medium text-center md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className='transition-colors border-b border-zatobox-200 hover:bg-zatobox-50'
                >
                  <td className='px-3 py-3 text-xs md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                    {isEditing ? (
                      <input
                        type='text'
                        value={String(item.description ?? '')}
                        onChange={(e) =>
                          onChange &&
                          onChange(index, 'description', e.target.value)
                        }
                        className='w-full px-2 py-1 text-xs border rounded-lg md:px-3 md:py-2 border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent md:text-sm'
                      />
                    ) : (
                      <div className='max-w-xs'>
                        <div className='font-medium text-zatobox-900'>
                          {item.description}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className='px-3 py-3 text-xs text-right md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                    {isEditing ? (
                      <input
                        type='number'
                        value={String(item.quantity ?? '')}
                        onChange={(e) =>
                          onChange &&
                          onChange(
                            index,
                            'quantity',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className='w-16 px-2 py-1 text-xs text-right border rounded-lg md:w-20 md:px-3 md:py-2 border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent md:text-sm'
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className='px-3 py-3 text-xs text-right md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                    {isEditing ? (
                      <input
                        type='text'
                        value={String(item.unit_price ?? '')}
                        onChange={(e) =>
                          onChange &&
                          onChange(index, 'unit_price', e.target.value)
                        }
                        className='w-20 px-2 py-1 text-xs text-right border rounded-lg md:w-24 md:px-3 md:py-2 border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent md:text-sm'
                      />
                    ) : (
                      item.unit_price
                    )}
                  </td>
                  <td className='px-3 py-3 text-xs font-medium text-right md:px-6 md:py-4 md:text-sm text-zatobox-900'>
                    {item.total_price}
                  </td>
                  <td className='px-3 py-3 text-xs text-center md:px-6 md:py-4 md:text-sm'>
                    <span className='px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded'>
                      {item?.confidence
                        ? (item.confidence * 100).toFixed(0)
                        : '85'}
                      %
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsTable;
