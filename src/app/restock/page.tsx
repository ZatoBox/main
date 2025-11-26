'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Package as PackageIcon,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { productsAPI } from '@/services/api.service';
import { useAuth } from '@/context/auth-store';
import type { Product } from '@/types';

interface SelectedProduct extends Product {
  quantityToAdd: number;
}

const RestockPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, initialized, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      setError('Debes iniciar sesión');
      setIsLoading(false);
      return;
    }

    fetchProducts();
  }, [initialized, isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productsAPI.list(true);
      if (response && response.success && Array.isArray(response.products)) {
        setProducts(response.products);
        setFilteredProducts(response.products);
      }
    } catch (err) {
      setError('Error cargando productos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.sku && product.sku.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, products]);

  const handleSelectProduct = (product: Product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([
        ...selectedProducts,
        { ...product, quantityToAdd: 0 },
      ]);
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === productId ? { ...p, quantityToAdd: quantity } : p
      )
    );
  };

  const handleSubmitRestock = async () => {
    if (selectedProducts.length === 0) {
      setError('Selecciona al menos un producto');
      return;
    }

    const hasValidQuantities = selectedProducts.some(
      (p) => p.quantityToAdd > 0
    );
    if (!hasValidQuantities) {
      setError('Ingresa cantidades a reabastecer');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const authToken = token;
      if (!authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch('/api/inventory/restock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          items: selectedProducts.map((p) => ({
            productId: p.id,
            quantity: p.quantityToAdd,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restock');
      }

      setSelectedProducts([]);
      setSearchQuery('');
      await fetchProducts();
      alert('¡Reabastecimiento completado!');
    } catch (err) {
      setError((err as Error).message || 'Error al reabastecer');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#000000] mb-2">
            Reabastecer Inventario
          </h1>
          <p className="text-[#9CA3AF]">
            Busca productos y agrega cantidades al stock
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 shadow-sm">
              <div className="mb-6">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-3 text-[#9CA3AF]"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#F88612] bg-white"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-[#991B1B] text-sm">
                  {error}
                </div>
              )}

              {isLoading ? (
                <Loader
                  fullScreen={false}
                  className="py-12"
                  text="Cargando productos..."
                />
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {paginatedProducts.length > 0 ? (
                      paginatedProducts.map((product) => {
                        const isSelected = selectedProducts.some(
                          (p) => p.id === product.id
                        );
                        const image = product.images?.[0];

                        return (
                          <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#F88612] bg-[#FEF9EC]'
                                : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB]'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-[#F9FAFB] rounded border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <PackageIcon
                                    size={24}
                                    className="text-[#D1D5DB]"
                                  />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-[#000000] truncate">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-[#9CA3AF]">
                                  Stock actual: {product.stock} unidades
                                </p>
                              </div>

                              <div
                                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                                  isSelected
                                    ? 'border-[#F88612] bg-[#F88612]'
                                    : 'border-[#D1D5DB]'
                                }`}
                              >
                                {isSelected && (
                                  <CheckCircle2
                                    size={20}
                                    className="text-white"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12 text-[#9CA3AF]">
                        {searchQuery
                          ? 'No se encontraron productos'
                          : 'No hay productos'}
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Anterior
                      </button>

                      <span className="text-sm text-[#9CA3AF]">
                        Página {currentPage} de {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-[#000000] mb-4">
                Seleccionados ({selectedProducts.length})
              </h2>

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
                            Stock: {product.stock}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(product)}
                          className="ml-2 text-[#9CA3AF] hover:text-[#F88612] transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <input
                        type="number"
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Cantidad a agregar"
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#F88612] bg-white"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#9CA3AF] text-sm py-4">
                    Selecciona productos para reabastecer
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmitRestock}
                disabled={
                  isSubmitting ||
                  selectedProducts.length === 0 ||
                  !selectedProducts.some((p) => p.quantityToAdd > 0)
                }
                className="w-full py-3 bg-[#F88612] text-white rounded-lg font-medium transition-all hover:bg-[#E07A0A] disabled:bg-[#D1D5DB] disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Confirmar Restock
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockPage;
