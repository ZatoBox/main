import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Check } from 'lucide-react';
import { productsAPI, Product } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    productType: '',
    name: '',
    description: '',
    location: '',
    unit: '',
    weight: '',
    price: '',
    inventoryQuantity: '',
    lowStockAlert: '',
    sku: '',
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'active' | 'inactive' | ''>('');
  const [togglingStatus, setTogglingStatus] = useState(false);

  const existingCategories = [
    'Furniture',
    'Textiles',
    'Lighting',
    'Electronics',
    'Decoration',
    'Office',
    'Gaming',
  ];

  const unitOptions = [
    { label: 'Per item', value: 'Per item' },
    { label: 'Per kilogram', value: 'Per kilogram' },
    { label: 'Per liter', value: 'Per liter' },
    { label: 'Per metro', value: 'Per metro' },
  ];

  const productTypeOptions = [
    { label: 'Physical Product', value: 'Physical Product' },
    { label: 'Service', value: 'Service' },
    { label: 'Digital', value: 'Digital' },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID de producto inválido');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getById(parseInt(id, 10));
        if (response.success) {
          const product = response.product as Product;
          setOriginalProduct(product);
          setStatus(product.status ?? 'inactive');
          setFormData((prev) => ({
            ...prev,
            productType: '',
            name: product.name || '',
            description: product.description || '',
            location: product.localization || '',
            unit: '',
            weight: product.weight != null ? String(product.weight) : '',
            price: product.price != null ? String(product.price) : '',
            inventoryQuantity:
              product.stock != null ? String(product.stock) : '',
            lowStockAlert:
              product.min_stock != null ? String(product.min_stock) : '',
            sku: product.sku || '',
          }));
          setSelectedCategories(product.category ? [product.category] : []);
        } else {
          setError('Error al cargar el producto');
        }
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para editar productos');
      return;
    }
    if (!id) {
      setError('ID de producto inválido');
      return;
    }
    if (!formData.name || formData.name.trim() === '') {
      setError('El nombre es requerido');
      return;
    }
    const priceNum = Number(formData.price);
    if (
      formData.price !== '' &&
      (!Number.isFinite(priceNum) || priceNum <= 0)
    ) {
      setError('Precio inválido');
      return;
    }
    const stockNum =
      formData.inventoryQuantity === ''
        ? null
        : parseInt(formData.inventoryQuantity, 10);
    if (
      stockNum !== null &&
      (!Number.isFinite(stockNum) || Number.isNaN(stockNum) || stockNum < 0)
    ) {
      setError('Cantidad de inventario inválida');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload: Record<string, unknown> = {};
      const category = selectedCategories[0];

      if (!originalProduct) {
        payload.name = formData.name;
        payload.description = formData.description || null;
        if (formData.price !== '') payload.price = priceNum;
        if (stockNum !== null) payload.stock = stockNum;
        if (category) payload.category = category;
        if (formData.unit !== '') payload.unit = formData.unit;
        if (formData.productType !== '')
          payload.product_type = formData.productType;
        if (formData.location !== '') payload.localization = formData.location;
        if (formData.weight !== '') payload.weight = Number(formData.weight);
        if (formData.sku !== '') payload.sku = formData.sku;
        if (formData.lowStockAlert !== '')
          payload.min_stock = Number(formData.lowStockAlert);
      } else {
        if (formData.name !== originalProduct.name)
          payload.name = formData.name;
        if (
          (formData.description || '') !== (originalProduct.description || '')
        )
          payload.description = formData.description || null;
        if (formData.price !== '' && priceNum !== originalProduct.price)
          payload.price = priceNum;
        if (stockNum !== null && stockNum !== originalProduct.stock)
          payload.stock = stockNum;
        if (category && category !== originalProduct.category)
          payload.category = category;
        if (
          formData.unit !== '' &&
          formData.unit !== ((originalProduct as any).unit || '')
        )
          payload.unit = formData.unit;
        if (
          formData.productType !== '' &&
          formData.productType !== (originalProduct.product_type || '')
        )
          payload.product_type = formData.productType;
        if (
          formData.location !== '' &&
          formData.location !== (originalProduct.localization || '')
        )
          payload.localization = formData.location;
        if (
          formData.weight !== '' &&
          Number(formData.weight) !== (originalProduct.weight || 0)
        )
          payload.weight = Number(formData.weight);
        if (formData.sku !== '' && formData.sku !== (originalProduct.sku || ''))
          payload.sku = formData.sku;
        if (
          formData.lowStockAlert !== '' &&
          Number(formData.lowStockAlert) !== (originalProduct.min_stock || 0)
        )
          payload.min_stock = Number(formData.lowStockAlert);
      }

      if (Object.keys(payload).length === 0) {
        setError('No changes to save');
        setSaving(false);
        return;
      }

      const response = await productsAPI.update(parseInt(id, 10), payload);

      if (response.success) {
        setOriginalProduct(response.product);
        setStatus(response.product.status ?? 'inactive');
        navigate('/inventory');
      } else {
        setError('Error updating product');
      }
    } catch (err) {
      setError('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para eliminar productos');
      return;
    }
    if (!id) {
      setError('ID de producto inválido');
      return;
    }
    if (!window.confirm('¿Seguro que querés eliminar este producto?')) return;
    try {
      setSaving(true);
      setError(null);
      const response = await productsAPI.delete(parseInt(id, 10));
      if (response.success) navigate('/inventory');
      else setError('Error deleting product');
    } catch (err) {
      setError('Error deleting product');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para cambiar el estado');
      return;
    }
    if (!id) {
      setError('ID de producto inválido');
      return;
    }
    const newStatus = status === 'active' ? 'inactive' : 'active';
    try {
      setTogglingStatus(true);
      setError(null);
      const response = await productsAPI.update(parseInt(id, 10), {
        status: newStatus,
      });
      if (response.success) {
        setStatus(newStatus);
        setOriginalProduct(response.product);
      } else {
        setError('Error al cambiar estado');
      }
    } catch (err) {
      setError('Error al cambiar estado');
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen pt-16 bg-bg-main'>
        <div className='text-center'>
          <div className='w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary'></div>
          <p className='text-text-secondary'>Cargando producto...</p>
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
            onClick={() => navigate('/inventory')}
            className='px-4 py-2 font-medium text-black transition-colors rounded-lg bg-primary hover:bg-primary-600'
          >
            Volver al inventario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-16 bg-bg-main'>
      <div className='border-b shadow-sm bg-bg-surface border-divider'>
        <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => navigate('/inventory')}
                className='p-2 transition-colors rounded-full hover:bg-gray-50 md:hidden'
              >
                <ArrowLeft size={20} className='text-text-primary' />
              </button>
              <h1 className='text-xl font-semibold text-text-primary md:hidden'>
                Edit Product
              </h1>
            </div>
            <div className='flex items-center space-x-3'>
              {error && <div className='text-sm text-red-500'>{error}</div>}
              <button
                onClick={() => navigate('/inventory')}
                className='px-4 py-2 font-medium text-black transition-colors bg-gray-100 rounded-lg hover:bg-gray-200'
              >
                Go back
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className='px-4 py-2 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Delete
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={saving || togglingStatus}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  status === 'active'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                } ${
                  saving || togglingStatus
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <Check size={16} />
                <span>{status === 'active' ? 'Active' : 'Inactive'}</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`bg-primary hover:bg-primary-600 text-black font-medium px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
                  <>
                    <div className='w-4 h-4 border-b-2 border-black rounded-full animate-spin'></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          <div className='space-y-6'>
            <div className='p-6 space-y-4 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <div>
                <label className='block mb-2 text-sm font-medium text-text-primary'>
                  Product Name *
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder='Product name'
                  className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  required
                />
              </div>
              <div>
                <label className='block mb-2 text-sm font-medium text-text-primary'>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  placeholder='Product description'
                  rows={3}
                  className='w-full p-3 border rounded-lg resize-none border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                />
              </div>
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <label className='block mb-2 text-sm font-medium text-text-primary'>
                Product Images
              </label>
              <div className='p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-divider hover:border-gray-400'>
                <Upload
                  size={48}
                  className='mx-auto mb-4 text-text-secondary'
                />
                <p className='mb-2 text-text-secondary'>
                  Drag and drop images here
                </p>
                <p className='text-sm text-text-secondary'>
                  or click to select files
                </p>
              </div>
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <label className='block mb-2 text-sm font-medium text-text-primary'>
                Locations
              </label>
              <input
                type='text'
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                placeholder='Optional physical location'
              />
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <h3 className='mb-4 text-lg font-medium text-text-primary'>
                Categorization
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block mb-3 text-sm font-medium text-text-primary'>
                    Existing categories
                  </label>
                  <div className='space-y-2'>
                    {existingCategories.map((category) => (
                      <div
                        key={category}
                        className='flex items-center space-x-2'
                      >
                        <input
                          type='checkbox'
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className='text-sm text-text-primary'
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <h3 className='mb-4 text-lg font-medium text-text-primary'>
                Units
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value=''>-- Leave blank to keep current --</option>
                    {unitOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Product Type
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) =>
                      handleInputChange('productType', e.target.value)
                    }
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value=''>-- Leave blank to keep current --</option>
                    {productTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Weight (kg)
                  </label>
                  <input
                    type='number'
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange('weight', e.target.value)
                    }
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                    placeholder='0.00'
                    step='0.01'
                  />
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Price (required)
                  </label>
                  <div className='relative'>
                    <span className='absolute transform -translate-y-1/2 left-3 top-1/2 text-text-secondary'>
                      $
                    </span>
                    <input
                      type='number'
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange('price', e.target.value)
                      }
                      className='w-full py-3 pl-8 pr-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                      placeholder='0.00'
                      step='0.01'
                    />
                  </div>
                </div>

                <button className='flex items-center justify-center w-full p-3 space-x-2 transition-colors border border-dashed rounded-lg border-divider text-text-secondary hover:bg-gray-50'>
                  <Plus size={16} />
                  <span>Add additional unit</span>
                </button>
              </div>
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <h3 className='mb-4 text-lg font-medium text-text-primary'>
                Inventory
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Inventory quantity
                  </label>
                  <input
                    type='number'
                    value={formData.inventoryQuantity}
                    onChange={(e) =>
                      handleInputChange('inventoryQuantity', e.target.value)
                    }
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                    placeholder='0'
                  />
                </div>

                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Low stock alert
                  </label>
                  <input
                    type='number'
                    value={formData.lowStockAlert}
                    onChange={(e) =>
                      handleInputChange('lowStockAlert', e.target.value)
                    }
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                    placeholder='5'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
