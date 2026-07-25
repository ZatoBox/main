'use client';

import React from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { Product } from '@/types';

export interface SelectedProduct extends Product {
  quantityToAdd: number;
}

interface Props {
  selectedProducts: SelectedProduct[];
  onRemove: (product: Product) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  showTitle?: boolean;
}

const RestockSummary: React.FC<Props> = ({
  selectedProducts,
  onRemove,
  onQuantityChange,
  onSubmit,
  isSubmitting,
  showTitle = true,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {showTitle && (
        <h2 className="text-lg font-bold text-[#000000] mb-4">
          {t('restock.selected')} ({selectedProducts.length})
        </h2>
      )}

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product) => (
            <div
              key={product.id}
              className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#000000] text-sm truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    {t('restock.stock')}: {product.stock}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(product)}
                  className="ml-2 flex items-center justify-center w-9 h-9 -mr-1 -mt-1 text-[#9CA3AF] hover:text-[#F88612] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <input
                type="number"
                inputMode="numeric"
                value={product.quantityToAdd || ''}
                onChange={(e) =>
                  onQuantityChange(product.id, parseInt(e.target.value) || 0)
                }
                placeholder={t('restock.quantityPlaceholder')}
                className="w-full px-3 py-2 min-h-11 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#F88612] bg-white"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-[#9CA3AF] text-sm py-4">
            {t('restock.selectToRestock')}
          </p>
        )}
      </div>

      <button
        onClick={onSubmit}
        disabled={
          isSubmitting ||
          selectedProducts.length === 0 ||
          !selectedProducts.some((p) => p.quantityToAdd > 0)
        }
        className="w-full py-3 min-h-11 bg-[#F88612] text-white rounded-lg font-medium transition-all hover:bg-[#E07A0A] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {t('restock.submit.processing')}
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            {t('restock.submit.confirm')}
          </>
        )}
      </button>
    </>
  );
};

export default RestockSummary;
