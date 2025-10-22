'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { productsAPI } from '@/services/api.service';
import { Product } from '@/types/index';
import { useAuth } from '@/context/auth-store';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryFilters from '@/components/inventory/InventoryFilters';
import InventoryGrid from '@/components/inventory/InventoryGrid';
import DeleteConfirmModal from '@/components/inventory/DeleteConfirmModal';
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchInventory = async () => {
      if (!initialized) {
        return;
      }

      if (!isAuthenticated) {
        setError('Debes iniciar sesión para ver el inventario');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productsAPI.list(true);
        if (response && response.success && Array.isArray(response.products)) {
          setInventoryItems(response.products);
          setError(null);
        } else if (response && response.success === false) {
          setInventoryItems([]);
          setError(response.message || 'Error al cargar inventario');
        } else {
          setInventoryItems([]);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error loading inventory:', err);
        setInventoryItems([]);
        setError(err?.message || 'Error al cargar inventario');
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
        const uniqueCategories = new Set<string>();
        inventoryItems.forEach((item) => {
          if (Array.isArray(item.categories)) {
            item.categories.forEach((cat) => {
              if (cat && typeof cat === 'string') {
                uniqueCategories.add(cat);
              }
            });
          }
        });
        const catArray = Array.from(uniqueCategories).map((name, idx) => ({
          id: `cat-${idx}`,
          name,
        }));
        if (active) setCategories(catArray);
      } finally {
        if (active) setLoadingCategories(false);
      }
    };
    loadCats();
    return () => {
      active = false;
    };
  }, [inventoryItems]);

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
        active: false,
      });

      if (response.success) {
        setInventoryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === deleteConfirmId ? response.product : item
          )
        );
        setSelectedItems((prevSelected) =>
          prevSelected.filter((itemId) => itemId !== deleteConfirmId)
        );
        toast({
          title: 'Producto archivado',
          description: 'El producto se archivó correctamente.',
        });
        setError(null);
      } else {
        setError('Error al archivar producto: ' + response.message);
      }
    } catch (err) {
      setError(
        'Error al archivar producto: ' +
          (err instanceof Error ? err.message : 'Error desconocido')
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

  const handleToggleSelectedStatus = async () => {
    if (selectedItems.length === 0) {
      return;
    }

    try {
      const updates = selectedItems.map(async (id) => {
        const currentItem = inventoryItems.find((item) => item.id === id);
        const newStatus = !currentItem?.active;

        try {
          const response = await productsAPI.update(id, { active: newStatus });
          return { success: true, id, product: response.product };
        } catch (error) {
          return { success: false, id, error };
        }
      });

      const results = await Promise.all(updates);
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      if (successful.length > 0) {
        setInventoryItems((prev) =>
          prev.map((item) => {
            const update = successful.find((s) => s.id === item.id);
            return update && update.product ? update.product : item;
          })
        );
        toast({
          title: 'Estado actualizado',
          description: `${successful.length} productos actualizados correctamente.`,
        });
      }

      if (failed.length > 0) {
        toast({
          title: 'Algunos productos no se actualizaron',
          description: `${failed.length} productos no pudieron actualizarse.`,
          variant: 'destructive',
        });
      }

      setSelectedItems([]);
    } catch (err) {
      toast({
        title: 'Error al actualizar',
        description:
          err instanceof Error
            ? err.message
            : 'No se pudieron actualizar los productos seleccionados.',
        variant: 'destructive',
      });
    }
  };

  const filteredItems = inventoryItems.filter((item) => {
    const itemCategories = Array.isArray(item.categories)
      ? item.categories
      : [];
    const matchesCategory =
      categoryFilter === 'all' || itemCategories.includes(categoryFilter);
    const itemStatus = item.active ? 'active' : 'inactive';
    const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const uiItems = filteredItems.map((p) => {
    const categoryDisplay =
      Array.isArray(p.categories) && p.categories.length > 0
        ? p.categories.join(', ')
        : 'Sin categoría';

    return {
      id: p.id,
      name: p.name,
      category: categoryDisplay,
      status: p.active ? 'active' : 'inactive',
      stock: p.stock,
      price: p.price,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-bg-main">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-gray-300"></div>
          <p className="text-text-secondary">Cargando productos...</p>
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
            Reintentar
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
        onToggleSelectedStatus={handleToggleSelectedStatus}
        selectedStatus={
          selectedItems.length > 0 &&
          inventoryItems.some(
            (item) => selectedItems.includes(item.id) && item.active
          )
        }
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
                      Descartar
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
            <div className="p-12 text-center border border-gray-300 rounded-lg shadow-sm bg-bg-surface border-divider">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-text-primary">
                No se encontraron elementos
              </h3>
              <p className="text-text-secondary">
                Intenta ajustar los filtros o crear un nuevo elemento.
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
