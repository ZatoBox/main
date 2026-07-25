import React from 'react';
import { OCRLineItem } from '@/types/index';
import { useTranslation } from '@/hooks/use-translation';

type Props = {
  items: OCRLineItem[];
  isEditing?: boolean;
  onChange?: (index: number, field: string, value: any) => void;
};

const inputClass =
  'px-2 py-1 border rounded-md border-[#D8D8D8] focus:ring-2 focus:ring-[#F88612] focus:outline-none';

const getRowTotal = (item: OCRLineItem) =>
  item.total_price ||
  (item.quantity && item.unit_price
    ? `${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}`
    : '');

const ItemsTable: React.FC<Props> = ({
  items,
  isEditing = false,
  onChange,
}) => {
  const { t } = useTranslation();

  const confidenceBadge = (item: OCRLineItem) => (
    <span className="px-2 py-1 text-xs font-medium rounded-md bg-[#FFF1E4] text-[#A94D14]">
      {item?.confidence ? (item.confidence * 100).toFixed(0) : '85'}%
    </span>
  );

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-[#A94D14] uppercase">
        {t('ocr.itemsTable.title')}
      </h3>

      {/* Desktop: tabla */}
      <div className="hidden md:block overflow-hidden bg-white border rounded-lg shadow-sm border-[#EDEDED]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-[#FAF8F6]">
                <th className="px-4 py-3 text-left font-medium text-[#444444]">
                  {t('ocr.itemsTable.name')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-[#444444]">
                  {t('ocr.itemsTable.description')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-[#444444]">
                  {t('ocr.itemsTable.quantity')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-[#444444]">
                  {t('ocr.itemsTable.unitPrice')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-[#444444]">
                  {t('ocr.itemsTable.total')}
                </th>
                <th className="px-4 py-3 text-center font-medium text-[#444444]">
                  {t('ocr.itemsTable.confidence')}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-[#F0F0F0] hover:bg-[#FFFAF5] transition-colors"
                >
                  <td className="px-4 py-3 align-top">
                    {isEditing ? (
                      <input
                        type="text"
                        value={String(item.name ?? '')}
                        onChange={(e) =>
                          onChange && onChange(index, 'name', e.target.value)
                        }
                        className={`w-full ${inputClass}`}
                      />
                    ) : (
                      <span className="font-medium text-[#1F1F1F]">
                        {item.name || t('ocr.itemsTable.unnamed')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {isEditing ? (
                      <input
                        type="text"
                        value={String(item.description ?? '')}
                        onChange={(e) =>
                          onChange &&
                          onChange(index, 'description', e.target.value)
                        }
                        className={`w-full ${inputClass}`}
                      />
                    ) : (
                      <span className="text-[#1F1F1F]">
                        {item.description || t('ocr.itemsTable.noDescription')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={String(item.quantity ?? '')}
                        onChange={(e) =>
                          onChange &&
                          onChange(
                            index,
                            'quantity',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className={`w-20 text-right ${inputClass}`}
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isEditing ? (
                      <input
                        type="text"
                        value={String(item.unit_price ?? '')}
                        onChange={(e) =>
                          onChange &&
                          onChange(index, 'unit_price', e.target.value)
                        }
                        className={`w-24 text-right ${inputClass}`}
                      />
                    ) : (
                      item.unit_price
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#1F1F1F]">
                    {getRowTotal(item)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {confidenceBadge(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Móvil: cards apiladas */}
      <div className="md:hidden space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg shadow-sm border-[#EDEDED] p-4"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={String(item.name ?? '')}
                  onChange={(e) =>
                    onChange && onChange(index, 'name', e.target.value)
                  }
                  placeholder={t('ocr.itemsTable.name')}
                  className={`flex-1 min-h-11 ${inputClass}`}
                />
              ) : (
                <span className="font-medium text-[#1F1F1F]">
                  {item.name || t('ocr.itemsTable.unnamed')}
                </span>
              )}
              <div className="shrink-0">{confidenceBadge(item)}</div>
            </div>

            {isEditing ? (
              <input
                type="text"
                value={String(item.description ?? '')}
                onChange={(e) =>
                  onChange && onChange(index, 'description', e.target.value)
                }
                placeholder={t('ocr.itemsTable.description')}
                className={`w-full min-h-11 mb-3 ${inputClass}`}
              />
            ) : (
              <p className="text-sm text-[#666666] mb-3">
                {item.description || t('ocr.itemsTable.noDescription')}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 mb-3">
              <label className="block">
                <span className="block text-xs text-[#666666] mb-1">
                  {t('ocr.itemsTable.quantity')}
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    inputMode="numeric"
                    value={String(item.quantity ?? '')}
                    onChange={(e) =>
                      onChange &&
                      onChange(index, 'quantity', parseInt(e.target.value) || 0)
                    }
                    className={`w-full min-h-11 ${inputClass}`}
                  />
                ) : (
                  <span className="text-sm text-[#1F1F1F]">
                    {item.quantity}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="block text-xs text-[#666666] mb-1">
                  {t('ocr.itemsTable.unitPrice')}
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={String(item.unit_price ?? '')}
                    onChange={(e) =>
                      onChange && onChange(index, 'unit_price', e.target.value)
                    }
                    className={`w-full min-h-11 ${inputClass}`}
                  />
                ) : (
                  <span className="text-sm text-[#1F1F1F]">
                    {item.unit_price}
                  </span>
                )}
              </label>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
              <span className="text-xs text-[#666666]">
                {t('ocr.itemsTable.total')}
              </span>
              <span className="font-semibold text-[#1F1F1F]">
                {getRowTotal(item)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsTable;
