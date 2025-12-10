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
import { useTranslation } from '@/hooks/use-translation';
import JsonImporterModal from '@/components/inventory/JsonImporterModal';
import Loader from '@/components/ui/Loader';

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
  const [deletingItems, setDeletingItems] = useState(false);
  const [showJsonImporter, setShowJsonImporter] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleImportSuccess = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.list(true);
      if (response && response.success && Array.isArray(response.products)) {
        setInventoryItems(response.products);
      }
    } catch (error) {
      console.error('Error refreshing inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      if (!initialized) {
        return;
      }

      if (!isAuthenticated) {
        setError(t('inventory.loginRequired'));
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
      const response = await productsAPI.delete(deleteConfirmId);

      if (response.success) {
        setInventoryItems((prevItems) =>
          prevItems.filter((item) => item.id !== deleteConfirmId)
        );
        setSelectedItems((prevSelected) =>
          prevSelected.filter((itemId) => itemId !== deleteConfirmId)
        );
        toast({
          title: t('inventory.toast.productDeleted'),
          description: t('inventory.toast.productDeletedDesc'),
        });
        setError(null);
      } else {
        setError(t('inventory.errors.deleteError') + ': ' + response.message);
      }
    } catch (err) {
      setError(
        t('inventory.errors.deleteError') +
          ': ' +
          (err instanceof Error
            ? err.message
            : t('inventory.errors.unknownError'))
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

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      return;
    }

    try {
      setDeletingItems(true);
      const deletePromises = selectedItems.map(async (id) => {
        try {
          const response = await productsAPI.delete(id);
          return { success: response.success, id };
        } catch (error) {
          return { success: false, id, error };
        }
      });

      const results = await Promise.all(deletePromises);
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      if (successful.length > 0) {
        setInventoryItems((prev) =>
          prev.filter((item) => !successful.some((s) => s.id === item.id))
        );
        toast({
          title: t('inventory.toast.productsDeleted'),
          description: `${successful.length} ${t(
            'inventory.toast.productsDeletedDesc'
          )}`,
        });
      }

      if (failed.length > 0) {
        toast({
          title: t('inventory.toast.someNotDeleted'),
          description: `${failed.length} ${t(
            'inventory.toast.someNotDeletedDesc'
          )}`,
          variant: 'destructive',
        });
      }

      setSelectedItems([]);
    } catch (err) {
      toast({
        title: t('inventory.toast.deleteError'),
        description:
          err instanceof Error
            ? err.message
            : t('inventory.toast.deleteErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setDeletingItems(false);
    }
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
          title: t('inventory.toast.statusUpdated'),
          description: `${successful.length} ${t(
            'inventory.toast.statusUpdatedDesc'
          )}`,
        });
      }

      if (failed.length > 0) {
        toast({
          title: t('inventory.toast.someNotUpdated'),
          description: `${failed.length} ${t(
            'inventory.toast.someNotUpdatedDesc'
          )}`,
          variant: 'destructive',
        });
      }

      setSelectedItems([]);
    } catch (err) {
      toast({
        title: t('inventory.toast.updateError'),
        description:
          err instanceof Error
            ? err.message
            : t('inventory.toast.updateErrorDesc'),
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
        : t('inventory.noCategory');

    return {
      id: p.id,
      name: p.name,
      category: categoryDisplay,
      status: p.active ? 'active' : 'inactive',
      stock: p.stock,
      price: p.price,
      imageUrl:
        Array.isArray(p.images) && p.images.length > 0
          ? p.images[0]
          : undefined,
    };
  });

  if (loading) {
    return <Loader text={t('inventory.loading')} />;
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
            {t('inventory.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <InventoryHeader
          onBack={() => router.push('/')}
          onCreate={() => router.push('/new-product')}
          selectedCount={selectedItems.length}
          onToggleSelectedStatus={handleToggleSelectedStatus}
          onBulkDelete={handleBulkDelete}
          deletingItems={deletingItems}
          onImportJson={() => setShowJsonImporter(true)}
          selectedStatus={
            selectedItems.length > 0 &&
            inventoryItems.some(
              (item) => selectedItems.includes(item.id) && item.active
            )
          }
        />

        <div>
          <InventoryFilters
            categories={['all', ...categories.map((c) => c.name)]}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <div className="mt-6">
            {error && (
              <div className="p-4 mb-4 border border-red-200 rounded-xl bg-red-50">
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
                        {t('inventory.dismiss')}
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
              <div className="p-12 text-center border border-gray-200 rounded-2xl shadow-sm bg-white">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {t('inventory.noItemsFound')}
                </h3>
                <p className="text-gray-500">{t('inventory.noItemsHint')}</p>
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

      <JsonImporterModal
        isOpen={showJsonImporter}
        onClose={() => setShowJsonImporter(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default InventoryPage;
