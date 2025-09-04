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

const InventoryPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAuth();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        const response = await productsAPI.list();
        if (!response || !response.products) {
          setError('Error loading inventory');
          return;
        }

        setInventoryItems(response.products);
        setError(null);
      } catch (err) {
        setError('Error loading inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [isAuthenticated, initialized]);

  const categories = [
    'all',
    'Furniture',
    'Textiles',
    'Lighting',
    'Electronics',
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(inventoryItems.map((item) => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
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

  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory =
      categoryFilter === 'all' || item.category_id === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const uiItems = filteredItems.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category_id ?? 'Uncategorized',
    status: p.status ?? 'inactive',
    stock: p.stock,
    price: p.price,
  }));

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen pt-16 bg-bg-main'>
        <div className='text-center'>
          <div className='w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary'></div>
          <p className='text-text-secondary'>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen pt-16 bg-bg-main'>
        <div className='text-center'>
          <div className='mb-4 text-red-500'>
            <svg
              className='w-12 h-12 mx-auto'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <p className='mb-4 text-text-primary'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 font-medium text-black transition-colors rounded-lg bg-primary hover:bg-primary-600'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-16 bg-bg-main'>
      <InventoryHeader
        onBack={() => router.push('/')}
        onCreate={() => router.push('/new-product')}
      />

      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <InventoryFilters
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className='px-0 py-6 mx-auto max-w-7xl sm:px-0 lg:px-0'>
          {error && (
            <div className='p-4 mb-4 border border-red-200 rounded-lg bg-red-50'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-red-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>Error</h3>
                  <div className='mt-2 text-sm text-red-700'>{error}</div>
                  <div className='mt-4'>
                    <button
                      type='button'
                      onClick={() => setError(null)}
                      className='bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100'
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
          />

          {filteredItems.length === 0 && (
            <div className='p-12 text-center border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <Package size={48} className='mx-auto mb-4 text-gray-300' />
              <h3 className='mb-2 text-lg font-medium text-text-primary'>
                No items found
              </h3>
              <p className='text-text-secondary'>
                Try adjusting the filters or create a new item.
              </p>
            </div>
          )}

          {deleteConfirmId && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='w-full max-w-md p-6 mx-4 rounded-lg shadow-lg bg-bg-surface'>
                <div className='flex items-center mb-4'>
                  <div className='flex items-center justify-center w-10 h-10 mr-3 bg-red-100 rounded-full'>
                    <svg
                      className='w-6 h-6 text-red-600'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-lg font-medium text-text-primary'>
                    Confirm Delete
                  </h3>
                </div>

                <p className='mb-6 text-text-secondary'>
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>

                <div className='flex space-x-3'>
                  <button
                    onClick={handleDeleteCancel}
                    disabled={isDeleting}
                    className='flex-1 px-4 py-2 transition-colors border rounded-lg border-divider text-text-primary hover:bg-gray-50 disabled:opacity-50'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className='flex items-center justify-center flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50'
                  >
                    {isDeleting ? (
                      <>
                        <div className='w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin'></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
