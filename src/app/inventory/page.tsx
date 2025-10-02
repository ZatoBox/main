'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import {
  productsAPI,
  categoriesAPI,
  getAllProductsIncludingArchived,
} from '@/services/api.service';
import { Product } from '@/types/index';
import { useAuth } from '@/context/auth-store';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import InventoryGrid from '@/components/inventory/InventoryGrid';
import DeleteConfirmModal from '@/components/inventory/DeleteConfirmModal';
import { mapPolarProductToProduct } from '@/utils/polar.utils';
import { useToast } from '@/hooks/use-toast';

const InventoryPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchivingSelected, setIsArchivingSelected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInventory = async () => {
      if (!initialized) {
        return;
      }

      if (!isAuthenticated) {
        setError('You must log in to view inventory');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAllProductsIncludingArchived();
        if (response && response.success && Array.isArray(response.products)) {
          const rows: any[] = response.products;
          const availableProducts = rows.map(mapPolarProductToProduct);
          setInventoryItems(availableProducts);
          setError(null);
        } else if (response && response.success === false) {
          setInventoryItems([]);
          setError(response.message || 'Error loading inventory');
        } else {
          setInventoryItems([]);
          setError(null);
        }
      } catch (err: any) {
        const errorMessage = err?.message || '';
        if (errorMessage.toLowerCase().includes('api key')) {
          setInventoryItems([]);
          setError(null);
        } else {
          console.error('Error loading inventory:', err);
          setInventoryItems([]);
          setError('Error loading inventory');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [isAuthenticated, initialized]);

  useEffect(() => {
    let active = true;
    const loadCats = async () => {
      setLoadingCategories(true);
      try {
        const res = await categoriesAPI.list();
        if (active && (res as any).success)
          setCategories((res as any).categories);
      } finally {
        if (active) setLoadingCategories(false);
      }
    };
    loadCats();
    return () => {
      active = false;
    };
  }, []);

  const handleSelectAll = (ids: string[], checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => Array.from(new Set([...prev, ...ids])));
    } else {
      setSelectedItems((prev) =>
        prev.filter((itemId) => !ids.includes(itemId))
      );
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleEditProduct = (id: string) => {
    router.push(`/edit-product/${id}`);
  };

  const handleDeleteClick = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await productsAPI.update(deleteConfirmId, {
        is_archived: true,
      });

      if (response.success) {
        const updatedProduct = mapPolarProductToProduct(response.product);
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === deleteConfirmId ? (updatedProduct as Product) : item
          )
        );
        setSelectedItems((prevSelected) =>
          prevSelected.filter((itemId) => itemId !== deleteConfirmId)
        );
        setError(null);
      } else {
        setError('Error deleting product: ' + response.message);
      }
    } catch (err) {
      setError(
        'Error deleting product: ' +
          (err instanceof Error ? err.message : 'Unknown error')
      );
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
    setIsDeleting(false);
  };

  const handleArchiveSelected = async () => {
    if (selectedItems.length === 0 || isArchivingSelected) {
      return;
    }

    setIsArchivingSelected(true);
    try {
      const response = await productsAPI.archiveBulk(selectedItems);
      const successfulIds = Array.isArray(response?.results)
        ? response.results
            .filter((r: any) => r && typeof r.id === 'string')
            .map((r: any) => r.id)
        : [];
      const updatedMap = new Map<string, Product>();
      if (Array.isArray(response?.results)) {
        response.results.forEach((r: any) => {
          if (r && typeof r.id === 'string' && r.product) {
            const mapped = mapPolarProductToProduct(r.product) as Product;
            updatedMap.set(r.id, mapped);
          }
        });
      }
      if (updatedMap.size > 0) {
        setInventoryItems((prev) =>
          prev.map((item) => {
            const next = updatedMap.get(item.id);
            return next ? next : item;
          })
        );
      }
      if (successfulIds.length > 0) {
        toast({
          title: 'Productos archivados',
          description: `${successfulIds.length} productos archivados correctamente.`,
        });
      }
      const errorsCount = Array.isArray(response?.errors)
        ? response.errors.length
        : 0;
      if (errorsCount > 0) {
        toast({
          title: 'Algunos productos no se archivaron',
          description: 'Intenta de nuevo más tarde.',
          variant: 'destructive',
        });
      }
      setSelectedItems((prev) =>
        prev.filter((id) => !successfulIds.includes(id))
      );
    } catch (err) {
      toast({
        title: 'Error al archivar',
        description:
          err instanceof Error
            ? err.message
            : 'No se pudieron archivar los productos seleccionados.',
        variant: 'destructive',
      });
    } finally {
      setIsArchivingSelected(false);
    }
  };

  const categoryIdMap: Record<string, string> = Object.fromEntries(
    categories.map((c) => [c.id, c.name])
  );
  const nameToId: Record<string, string> = Object.fromEntries(
    categories.map((c) => [c.name, c.id])
  );
  const filteredItems = inventoryItems.filter((item) => {
    const ids = Array.isArray((item as any).category_ids)
      ? (item as any).category_ids
      : [];
    const targetId = categoryFilter === 'all' ? null : nameToId[categoryFilter];
    const matchesCategory = !targetId || ids.includes(targetId);
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const uiItems = filteredItems.map((p) => {
    const ids = Array.isArray((p as any).category_ids)
      ? (p as any).category_ids
      : [];
    const names = ids
      .map((id: string) => categoryIdMap[id])
      .filter(Boolean) as string[];

    const polarMetadata = (p as any).metadata;
    const polarCategory = polarMetadata?.category;

    let categoryDisplay = 'Uncategorized';
    if (polarCategory && typeof polarCategory === 'string') {
      categoryDisplay = polarCategory;
    } else if (names.length > 0) {
      categoryDisplay = names.join(', ');
    }

    return {
      id: p.id,
      name: p.name,
      category: categoryDisplay,
      status: p.status ?? 'inactive',
      stock: p.stock,
      price: p.price,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-bg-main">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-text-secondary">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-main">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="mb-4 text-text-primary">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-medium text-black transition-colors rounded-lg bg-primary hover:bg-primary-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <InventoryHeader
        onBack={() => router.push('/')}
        onCreate={() => router.push('/new-product')}
        selectedCount={selectedItems.length}
        onArchiveSelected={handleArchiveSelected}
        archivingSelected={isArchivingSelected}
      />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <InventoryFilters
          categories={['all', ...categories.map((c) => c.name)]}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="px-0 py-6 mx-auto max-w-7xl sm:px-0 lg:px-0">
          {error && (
            <div className="p-4 mb-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <InventoryGrid
            items={uiItems}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            onEditProduct={handleEditProduct}
            onDeleteClick={handleDeleteClick}
            onSelectAll={handleSelectAll}
          />

          {filteredItems.length === 0 && (
            <div className="p-12 text-center border rounded-lg shadow-sm bg-bg-surface border-divider">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-text-primary">
                No items found
              </h3>
              <p className="text-text-secondary">
                Try adjusting the filters or create a new item.
              </p>
            </div>
          )}

          <DeleteConfirmModal
            open={!!deleteConfirmId}
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            loading={isDeleting}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
