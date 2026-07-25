'use client';

import React, { useState, useCallback } from 'react';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { useTranslation } from '@/hooks/use-translation';
import SKUSearchInput from './SKUSearchInput';

interface SKUSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onAddToCart: (product: any, quantity: number) => void;
}

const SKUSearchModal: React.FC<SKUSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const [, setHasAddedProducts] = useState(false);

  const handleAddProduct = useCallback(
    (product: any, quantity: number) => {
      onAddToCart(product, quantity);
      setHasAddedProducts(true);
    },
    [onAddToCart]
  );

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={t('home.header.skuSearch')}
    >
      <div className="py-2 pb-4">
        <SKUSearchInput
          products={products}
          onAddToCart={handleAddProduct}
          onClose={onClose}
        />
      </div>
    </ResponsiveModal>
  );
};

export default SKUSearchModal;
