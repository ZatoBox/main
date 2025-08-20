import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Printer,
  Plus,
  Package,
  ChevronDown,
} from 'lucide-react';
import { productsAPI, inventoryAPI } from '../services/api';
import type { Product } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchInventory = async () => {
      if (!isAuthenticated) {
        setError('You must log in to view inventory');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await inventoryAPI.getUserInventory();

        if (!response.success) {
          setError('Error loading inventory');
          return;
        }

        const mappedProducts: Product[] = response.inventory.map((item) => {
          const anyItem = item as unknown as Record<string, unknown>;

          // If backend returns an embedded product object
          if (anyItem.product && typeof anyItem.product === 'object') {
            return anyItem.product as Product;
          }

          // If inventory item already contains product-like fields
          if (anyItem.name || anyItem.price !== undefined) {
            return {
              id: (anyItem.product_id as number) ?? (anyItem.id as number) ?? 0,
              name:
                (anyItem.name as string) ??
                `Product ${
                  (anyItem.product_id as number) ?? (anyItem.id as number) ?? ''
                }`,
              description: (anyItem.description as string) ?? null,
              price: Number(anyItem.price ?? 0),
              stock: Number(anyItem.quantity ?? 0),
              category: (anyItem.category as string) ?? null,
              status: (anyItem.status as 'active' | 'inactive') ?? 'inactive',
            } as Product;
          }

          // Fallback minimal product constructed from inventory item
          return {
            id: (anyItem.product_id as number) ?? (anyItem.id as number) ?? 0,
            name: `Product ${
              (anyItem.product_id as number) ?? (anyItem.id as number) ?? ''
            }`,
            price: 0,
            stock: Number(anyItem.quantity ?? 0),
          } as Product;
        });

        setInventoryItems(mappedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError('Error loading inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [isAuthenticated]);

  const categories = [
    'all',
    'Furniture',
    'Textiles',
    'Lighting',
    'Electronics',
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(inventoryItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const handleEditProduct = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDeleteClick = (id: number, event?: React.MouseEvent) => {
    // Prevent event propagation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    console.log('Delete button clicked for product ID:', id);
    console.log('User authenticated:', isAuthenticated);
    console.log('Token available:', !!localStorage.getItem('token'));

    // Show confirmation dialog
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      console.log('Attempting to delete product:', deleteConfirmId);
      const response = await productsAPI.delete(deleteConfirmId);
      console.log('Delete response:', response);

      if (response.success) {
        console.log('Product deleted successfully, updating UI');
        // Remove the product from the local state
        setInventoryItems((prevItems) =>
          prevItems.filter((item) => item.id !== deleteConfirmId)
        );
        // Remove from selected items if it was selected
        setSelectedItems((prevSelected) =>
          prevSelected.filter((itemId) => itemId !== deleteConfirmId)
        );
        setError(null); // Clear any previous errors
      } else {
        console.error('Delete failed:', response.message);
        setError('Error deleting product: ' + response.message);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
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
      categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Show loading state
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

  // Show error state
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
      {/* Sub-header with filters */}
      <div className='border-b shadow-sm bg-bg-surface border-divider'>
        <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          {/* Top Row */}
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => navigate('/')}
                className='p-2 transition-colors rounded-full hover:bg-gray-50 md:hidden'
              >
                <ArrowLeft size={20} className='text-text-primary' />
              </button>
              <h1 className='text-xl font-semibold text-text-primary md:hidden'>
                Inventory
              </h1>
            </div>

            <button
              onClick={() => navigate('/new-product')}
              className='flex items-center px-4 py-2 space-x-2 font-medium text-black transition-colors rounded-lg bg-primary hover:bg-primary-600'
            >
              <Plus size={20} />
              <span className='hidden sm:inline'>Create Item</span>
            </button>
          </div>

          {/* Filters Row */}
          <div className='pb-4'>
            <div className='flex flex-wrap items-center gap-3'>
              {/* Category Filter */}
              <div className='relative'>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className='px-4 py-2 pr-8 text-sm border rounded-lg appearance-none bg-bg-surface border-divider focus:ring-2 focus:ring-complement focus:border-transparent text-text-primary'
                >
                  <option value='all'>All Categories</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className='absolute transform -translate-y-1/2 pointer-events-none right-2 top-1/2 text-text-secondary'
                />
              </div>

              {/* Status Toggle */}
              <div className='flex p-1 bg-gray-100 rounded-lg'>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-bg-surface text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-bg-surface text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    statusFilter === 'inactive'
                      ? 'bg-bg-surface text-text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Inactive
                </button>
              </div>

              {/* All Filters Dropdown */}
              <div className='relative'>
                <button className='flex items-center px-4 py-2 space-x-2 text-sm transition-colors border rounded-lg bg-bg-surface border-divider hover:bg-gray-50 text-text-primary'>
                  <span>All Filters</span>
                  <ChevronDown size={16} className='text-text-secondary' />
                </button>
              </div>

              {/* Search and Actions */}
              <div className='flex items-center ml-auto space-x-2'>
                <div className='relative'>
                  <Search
                    size={16}
                    className='absolute transform -translate-y-1/2 left-3 top-1/2 text-text-secondary'
                  />
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search...'
                    className='w-48 py-2 pl-10 pr-4 text-sm border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  />
                </div>
                <button className='p-2 transition-colors rounded-lg hover:bg-gray-50'>
                  <Printer size={20} className='text-text-secondary' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* Error Message */}
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
                    className='bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600'
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop/Tablet Table */}
        <div className='hidden overflow-hidden border rounded-lg shadow-sm md:block bg-bg-surface border-divider'>
          <table className='w-full'>
            <thead className='border-b bg-gray-50 border-divider'>
              <tr>
                <th className='w-12 px-4 py-3'>
                  <input
                    type='checkbox'
                    checked={selectedItems.length === inventoryItems.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                  />
                </th>
                <th className='w-16 px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary'>
                  Image
                </th>
                <th className='px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary'>
                  Item
                </th>
                <th className='px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary'>
                  Category
                </th>
                <th className='hidden px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary lg:table-cell'>
                  Stock
                </th>
                <th className='hidden px-4 py-3 text-xs font-medium tracking-wider text-left uppercase text-text-secondary xl:table-cell'>
                  Price
                </th>
                <th className='w-12 px-4 py-3'></th>
              </tr>
            </thead>
            <tbody className='divide-y bg-bg-surface divide-divider'>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className='transition-colors cursor-pointer hover:bg-gray-50'
                >
                  <td className='px-4 py-4'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(item.id)}
                      onChange={(e) =>
                        handleSelectItem(item.id, e.target.checked)
                      }
                      className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                    />
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg'>
                      <Package size={20} className='text-text-secondary' />
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-text-primary'>
                        {item.name}
                      </span>
                      <span
                        className={`text-xs ${
                          item.status === 'active'
                            ? 'text-success'
                            : 'text-error'
                        }`}
                      >
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-sm text-text-primary'>
                    {item.category}
                  </td>
                  <td className='hidden px-4 py-4 text-sm text-text-primary lg:table-cell'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.stock > 10
                          ? 'bg-success-100 text-success-800'
                          : item.stock > 0
                          ? 'bg-warning-100 text-warning-800'
                          : 'bg-error-100 text-error-800'
                      }`}
                    >
                      {item.stock} units
                    </span>
                  </td>
                  <td className='hidden px-4 py-4 text-sm font-medium text-text-primary xl:table-cell'>
                    ${item.price.toFixed(2)}
                  </td>
                  <td className='px-4 py-4'>
                    <div className='flex items-center space-x-1'>
                      <button
                        onClick={() => handleEditProduct(item.id)}
                        className='p-1 transition-colors rounded hover:bg-gray-50'
                        title='Edit'
                      >
                        <svg
                          className='w-4 h-4 text-text-secondary'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(item.id, e)}
                        className='p-1 transition-colors rounded hover:bg-red-50'
                        title='Delete'
                      >
                        <svg
                          className='w-4 h-4 text-red-500'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
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

        {/* Mobile Card Layout */}
        <div className='space-y-4 md:hidden'>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className='p-4 border rounded-lg shadow-sm bg-bg-surface border-divider'
            >
              <div className='flex items-start space-x-3'>
                <input
                  type='checkbox'
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  className='w-4 h-4 mt-1 border-gray-300 rounded text-complement focus:ring-complement'
                />

                <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg'>
                  <Package size={24} className='text-text-secondary' />
                </div>

                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-sm font-medium truncate text-text-primary'>
                        {item.name}
                      </h3>
                      <p className='text-sm text-text-secondary'>
                        {item.category}
                      </p>

                      <div className='flex items-center mt-2 space-x-4'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.stock > 10
                              ? 'bg-success-100 text-success-800'
                              : item.stock > 0
                              ? 'bg-warning-100 text-warning-800'
                              : 'bg-error-100 text-error-800'
                          }`}
                        >
                          {item.stock} units
                        </span>

                        <span className='text-sm font-medium text-text-primary'>
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <span
                        className={`inline-flex mt-2 text-xs ${
                          item.status === 'active'
                            ? 'text-success'
                            : 'text-error'
                        }`}
                      >
                        {item.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className='flex items-center space-x-1'>
                      <button
                        onClick={() => handleEditProduct(item.id)}
                        className='p-1 transition-colors rounded hover:bg-gray-50'
                        title='Edit'
                      >
                        <svg
                          className='w-4 h-4 text-text-secondary'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(item.id, e)}
                        className='p-1 transition-colors rounded hover:bg-red-50'
                        title='Delete'
                      >
                        <svg
                          className='w-4 h-4 text-red-500'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
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

        {/* Delete Confirmation Modal */}
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
                Are you sure you want to delete this product? This action cannot
                be undone.
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
  );
};

export default InventoryPage;
