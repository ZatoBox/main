import React from 'react';
import { OCRLineItem } from '@/types/index';

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
    <div className='mb-8'>
      <h3 className='mb-4 text-sm font-semibold tracking-wide text-[#A94D14] uppercase'>
        Items detectados
      </h3>
      <div className='overflow-hidden bg-white border rounded-lg shadow-sm border-[#EDEDED]'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='bg-[#FAF8F6]'>
                <th className='px-4 py-3 text-left font-medium text-[#444444]'>
                  Nombre
                </th>
                <th className='px-4 py-3 text-left font-medium text-[#444444]'>
                  Descripción
                </th>
                <th className='px-4 py-3 text-right font-medium text-[#444444]'>
                  Cantidad
                </th>
                <th className='px-4 py-3 text-right font-medium text-[#444444]'>
                  Precio Unitario
                </th>
                <th className='px-4 py-3 text-right font-medium text-[#444444]'>
                  Total
                </th>
                <th className='px-4 py-3 text-center font-medium text-[#444444]'>
                  Confidencialidad
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const rowTotal =
                  item.total_price ||
                  (item.quantity && item.unit_price
                    ? `${(
                        Number(item.quantity) * Number(item.unit_price)
                      ).toFixed(2)}`
                    : '');
                return (
                  <tr
                    key={index}
                    className='border-t border-[#F0F0F0] hover:bg-[#FFFAF5] transition-colors'
                  >
                    <td className='px-4 py-3 align-top'>
                      {isEditing ? (
                        <input
                          type='text'
                          value={String(item.name ?? '')}
                          onChange={(e) =>
                            onChange && onChange(index, 'name', e.target.value)
                          }
                          className='w-full px-2 py-1 border rounded-md border-[#D8D8D8] focus:ring-2 focus:ring-[#F88612] focus:outline-none'
                        />
                      ) : (
                        <span className='font-medium text-[#1F1F1F]'>
                          {item.name || 'Unnamed'}
                        </span>
                      )}
                    </td>
                    <td className='px-4 py-3 align-top'>
                      {isEditing ? (
                        <input
                          type='text'
                          value={String(item.description ?? '')}
                          onChange={(e) =>
                            onChange &&
                            onChange(index, 'description', e.target.value)
                          }
                          className='w-full px-2 py-1 border rounded-md border-[#D8D8D8] focus:ring-2 focus:ring-[#F88612] focus:outline-none'
                        />
                      ) : (
                        <span className='text-[#1F1F1F]'>
                          {item.description || 'No description'}
                        </span>
                      )}
                    </td>
                    <td className='px-4 py-3 text-right'>
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
                          className='w-20 px-2 py-1 text-right border rounded-md border-[#D8D8D8] focus:ring-2 focus:ring-[#F88612] focus:outline-none'
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className='px-4 py-3 text-right'>
                      {isEditing ? (
                        <input
                          type='text'
                          value={String(item.unit_price ?? '')}
                          onChange={(e) =>
                            onChange &&
                            onChange(index, 'unit_price', e.target.value)
                          }
                          className='w-24 px-2 py-1 text-right border rounded-md border-[#D8D8D8] focus:ring-2 focus:ring-[#F88612] focus:outline-none'
                        />
                      ) : (
                        item.unit_price
                      )}
                    </td>
                    <td className='px-4 py-3 text-right font-semibold text-[#1F1F1F]'>
                      {rowTotal}
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <span className='px-2 py-1 text-xs font-medium rounded-md bg-[#FFF1E4] text-[#A94D14]'>
                        {item?.confidence
                          ? (item.confidence * 100).toFixed(0)
                          : '85'}
                        %
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsTable;
