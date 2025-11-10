'use client';

import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
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
  const [hasAddedProducts, setHasAddedProducts] = useState(false);

  const handleAddProduct = useCallback(
    (product: any, quantity: number) => {
      onAddToCart(product, quantity);
      setHasAddedProducts(true);
    },
    [onAddToCart]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    },
    [handleClose]
  );

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        style={{ pointerEvents: 'auto' }}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="w-full max-w-md bg-white rounded-[30px] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Atajo de búsqueda
            </h2>
            <button
              onClick={handleClose}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <SKUSearchInput
              products={products}
              onAddToCart={handleAddProduct}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SKUSearchModal;
