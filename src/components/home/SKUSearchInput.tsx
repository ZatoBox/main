'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchProductBySKU } from '@/services/api.service';

interface SKUSearchInputProps {
  products: any[];
  onAddToCart: (product: any, quantity: number) => void;
  onClose?: () => void;
}

const SKUSearchInput: React.FC<SKUSearchInputProps> = ({
  products,
  onAddToCart,
  onClose,
}) => {
  const [skuInput, setSkuInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('1');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchProduct = async (sku: string) => {
    if (!sku.trim()) {
      setSelectedProduct(null);
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const response = await searchProductBySKU(sku.trim());

      if (response && response.success && Array.isArray(response.products)) {
        const found = response.products.find(
          (p: any) =>
            p.sku?.toLowerCase() === sku.toLowerCase().trim() && p.stock > 0
        );
        setSelectedProduct(found || null);
      } else {
        setSelectedProduct(null);
      }
    } catch (err) {
      setSelectedProduct(null);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (skuInput.trim()) {
      debounceTimer.current = setTimeout(() => {
        searchProduct(skuInput);
      }, 300);
    } else {
      setSelectedProduct(null);
      setSearching(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [skuInput]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      const quantity = Math.min(
        Math.max(1, parseInt(quantityInput) || 1),
        selectedProduct.stock
      );
      onAddToCart(selectedProduct, quantity);
      setSkuInput('');
      setQuantityInput('1');
      setSelectedProduct(null);
    }
  };

  const handleClear = () => {
    setSkuInput('');
    setQuantityInput('1');
    setSelectedProduct(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedProduct) {
        handleAddToCart();
      }
    }
  };

  useEffect(() => {
    if (selectedProduct && quantityInput) {
      const quantityNum = parseInt(quantityInput) || 1;
      if (quantityNum > 0) {
        const quantityInputElement = document.querySelector(
          'input[type="number"]'
        ) as HTMLInputElement;
        if (quantityInputElement) {
          quantityInputElement.focus();
        }
      }
    }
  }, [selectedProduct]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          SKU (Identificador único del producto.)
        </label>
        <input
          type="text"
          value={skuInput}
          onChange={(e) => {
            setSkuInput(e.target.value);
            setSelectedProduct(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="ABC-987"
          disabled={searching}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Cantidad
        </label>
        <input
          type="number"
          value={quantityInput}
          onChange={(e) => setQuantityInput(e.target.value)}
          onKeyDown={handleKeyDown}
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
        />
      </div>

      {selectedProduct && (
        <div className="flex gap-4">
          {selectedProduct.images?.[0] && (
            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-20 h-20 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {selectedProduct.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {selectedProduct.description}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!selectedProduct}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Añadir
        </button>
        <button
          onClick={handleClear}
          className="w-full py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium rounded-lg transition-colors"
        >
          Limpiar
        </button>
      </div>

      {skuInput && !selectedProduct && !searching && (
        <div className="text-center text-xs text-gray-500 py-2">
          Producto no encontrado
        </div>
      )}

      {searching && (
        <div className="text-center text-xs text-gray-400 py-2">
          Buscando...
        </div>
      )}
    </div>
  );
};

export default SKUSearchInput;
