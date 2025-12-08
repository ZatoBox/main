import React from 'react';
import InventoryCard from './InventoryCard';
import { Package } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  stock: number;
  price: number;
  imageUrl?: string;
}

interface Props {
  items: Product[];
  selectedItems: string[];
  onSelectItem: (id: string, checked: boolean) => void;
  onEditProduct: (id: string) => void;
  onDeleteClick: (id: string, e?: React.MouseEvent) => void;
  onSelectAll: (ids: string[], checked: boolean) => void;
}

const InventoryGrid: React.FC<Props> = ({
  items,
  selectedItems,
  onSelectItem,
  onEditProduct,
  onDeleteClick,
  onSelectAll,
}) => {
  const { t } = useTranslation();
  const desktopSelectAllRef = React.useRef<HTMLInputElement>(null);
  const mobileSelectAllRef = React.useRef<HTMLInputElement>(null);
  const selectedInView = React.useMemo(
    () => items.filter((item) => selectedItems.includes(item.id)).length,
    [items, selectedItems]
  );
  const allSelected = items.length > 0 && selectedInView === items.length;

  React.useEffect(() => {
    const isIndeterminate = selectedInView > 0 && !allSelected;
    if (desktopSelectAllRef.current) {
      desktopSelectAllRef.current.indeterminate = isIndeterminate;
    }
    if (mobileSelectAllRef.current) {
      mobileSelectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedInView, allSelected]);

  const handleSelectAllChange = (checked: boolean) => {
    const ids = items.map((item) => item.id);
    onSelectAll(ids, checked);
  };

  return (
    <>
      <div className="hidden w-full overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-[#CBD5E1]">
          <thead className="bg-[#FFFFFF]">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  ref={desktopSelectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                  className="w-4 h-4 rounded border border-[#767676] bg-white appearance-none checked:bg-[#EEB131] focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]"
                />
              </th>
              <th className="w-16 px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-[#475569]">
                {t('inventory.table.image')}
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-[#475569]">
                {t('inventory.table.item')}
              </th>
              <th className="px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-[#475569]">
                {t('inventory.table.category')}
              </th>
              <th className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-[#475569] lg:table-cell">
                {t('inventory.table.stock')}
              </th>
              <th className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-[#475569] xl:table-cell">
                {t('inventory.table.price')}
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y bg-[#FFFFFF] divide-[#CBD5E1]">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  onSelectItem(
                    item.id,
                    selectedItems.includes(item.id) ? false : true
                  )
                }
                className={`transition-colors cursor-pointer hover:bg-[#FEF9EC] group ${
                  selectedItems.includes(item.id)
                    ? 'bg-[#FEF9EC]'
                    : 'bg-[#FFFFFF]'
                } ${item.status !== 'active' ? 'opacity-60' : ''}`}
              >
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#FBEFCA] rounded-lg overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={20} className="text-zatobox-600" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <button
                      className="inline text-sm font-medium text-[#374151] hover:underline text-left max-w-max"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(item.id);
                      }}
                    >
                      {item.name}
                    </button>
                    <span
                      className={`text-xs ${
                        item.status === 'active'
                          ? 'text-[#10B981]'
                          : 'text-[#E7000B80]'
                      }`}
                    >
                      {item.status === 'active'
                        ? t('inventory.card.active')
                        : t('inventory.card.inactive')}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-[#475569]">
                  {item.category}
                </td>
                <td className="hidden px-4 py-4 text-sm text-text-primary lg:table-cell">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.stock > 10
                        ? 'bg-[#D1FAE5] text-[#065F46]'
                        : item.stock === 0
                        ? 'bg-[#FEE2E2] text-[#991B1B]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {item.stock} {t('inventory.card.units')}
                  </span>
                </td>
                <td className="hidden px-4 py-4 text-sm font-semibold text-[#374151] xl:table-cell">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProduct(item.id);
                      }}
                      className="p-1 transition-colors rounded hover:bg-[#FEF9EC]"
                      title={t('inventory.card.edit')}
                    >
                      <svg
                        className="w-4 h-4 text-zatobox-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(item.id, e);
                      }}
                      className="p-1 transition-colors rounded hover:bg-red-100"
                      title={t('inventory.card.delete')}
                    >
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

      <div className="space-y-4 md:hidden">
        {items.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-[#475569]">
              <input
                ref={mobileSelectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAllChange(e.target.checked)}
                className="w-4 h-4 rounded border border-[#767676] bg-white appearance-none checked:bg-[#EEB131] focus:outline-none focus:ring-2 focus:ring-[#CBD5E1]"
              />
              <span>{t('inventory.table.selectAll')}</span>
            </label>
            {selectedInView > 0 && (
              <span className="text-xs text-[#475569]">
                {selectedInView} {t('inventory.table.selected')}
              </span>
            )}
          </div>
        )}
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
