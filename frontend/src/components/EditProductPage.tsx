import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { productsAPI, Product } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface VariantValue {
  id: string;
  value: string;
  selected: boolean;
}

interface VariantData {
  [key: string]: {
    isActive: boolean;
    values: VariantValue[];
    newValue: string;
    showPanel: boolean;
  };
}

const EditProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    productType: 'Physical Product',
    name: '',
    description: '',
    location: 'main-warehouse',
    createCategory: false,
    unit: 'Per item',
    weight: '',
    price: '',
    inventoryQuantity: '',
    lowStockAlert: '',
    sku: '',
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showMoreVariantsPanel, setShowMoreVariantsPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  const existingCategories = [
    'Furniture',
    'Textiles',
    'Lighting',
    'Electronics',
    'Decoration',
    'Office',
  ];

  const variantTypes = ['Color', 'Size', 'Material', 'Style', 'Finish'];

  const [variants, setVariants] = useState<VariantData>({
    Color: {
      isActive: true,
      values: [
        { id: '1', value: 'Red', selected: false },
        { id: '2', value: 'Blue', selected: true },
        { id: '3', value: 'Green', selected: false },
        { id: '4', value: 'Black', selected: true },
      ],
      newValue: '',
      showPanel: false,
    },
    Size: {
      isActive: true,
      values: [
        { id: '1', value: 'Small', selected: false },
        { id: '2', value: 'Medium', selected: true },
        { id: '3', value: 'Large', selected: false },
        { id: '4', value: 'Extra Large', selected: false },
      ],
      newValue: '',
      showPanel: false,
    },
    Material: {
      isActive: false,
      values: [
        { id: '1', value: 'Wood', selected: false },
        { id: '2', value: 'Metal', selected: false },
        { id: '3', value: 'Plastic', selected: false },
        { id: '4', value: 'Glass', selected: false },
      ],
      newValue: '',
      showPanel: false,
    },
    Style: {
      isActive: false,
      values: [
        { id: '1', value: 'Modern', selected: false },
        { id: '2', value: 'Classic', selected: false },
        { id: '3', value: 'Minimalist', selected: false },
        { id: '4', value: 'Industrial', selected: false },
      ],
      newValue: '',
      showPanel: false,
    },
    Finish: {
      isActive: false,
      values: [
        { id: '1', value: 'Matte', selected: false },
        { id: '2', value: 'Glossy', selected: false },
        { id: '3', value: 'Satin', selected: false },
        { id: '4', value: 'Textured', selected: false },
      ],
      newValue: '',
      showPanel: false,
    },
  });

  // Load product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || !isAuthenticated) {
        setError('ID de producto inválido o no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await productsAPI.getById(parseInt(id));

        if (response.success) {
          const product = response.product;
          setFormData({
            productType: 'Physical Product',
            name: product.name,
            description: product.description || '',
            location: 'main-warehouse',
            createCategory: false,
            unit: 'Per item',
            weight: '',
            price: product.price.toString(),
            inventoryQuantity: product.stock.toString(),
            lowStockAlert: '',
            sku: product.sku || '',
          });
          setSelectedCategories([product.category]);
          setOriginalProduct(product);
        } else {
          setError('Error al cargar el producto');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isAuthenticated]);

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

  const handleVariantToggle = (variantType: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        isActive: !prev[variantType].isActive,
        showPanel: !prev[variantType].isActive ? true : false,
      },
    }));
  };

  const handleVariantValueToggle = (variantType: string, valueId: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        values: prev[variantType].values.map((value) =>
          value.id === valueId ? { ...value, selected: !value.selected } : value
        ),
      },
    }));
  };

  const handleAddVariantValue = (variantType: string) => {
    const newValue = variants[variantType].newValue.trim();
    if (newValue) {
      const newId = Date.now().toString();
      setVariants((prev) => ({
        ...prev,
        [variantType]: {
          ...prev[variantType],
          values: [
            ...prev[variantType].values,
            { id: newId, value: newValue, selected: true },
          ],
          newValue: '',
        },
      }));
    }
  };

  const handleNewValueChange = (variantType: string, value: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        newValue: value,
      },
    }));
  };

  const handleSaveVariant = (variantType: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        showPanel: false,
      },
    }));
  };

  const handleCancelVariant = (variantType: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        showPanel: false,
        isActive: false,
        values: prev[variantType].values.map((value) => ({
          ...value,
          selected: false,
        })),
        newValue: '',
      },
    }));
  };

  const getSelectedValues = (variantType: string) => {
    return variants[variantType].values
      .filter((value) => value.selected)
      .map((value) => value.value)
      .join(', ');
  };

  const handleMoreVariantsToggle = (variantType: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantType]: {
        ...prev[variantType],
        isActive: !prev[variantType].isActive,
      },
    }));
  };

  const handleSaveMoreVariants = () => {
    setShowMoreVariantsPanel(false);
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      setError('You must log in to edit products');
      return;
    }

    if (!id) {
      setError('Invalid product ID or not authenticated');
      return;
    }

    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const priceNum = parseFloat(formData.price);
      const stockNum = parseInt(formData.inventoryQuantity) || 0;
      const category = selectedCategories[0] || 'General';

      const payload: Partial<Product> = {};

      if (!originalProduct) {
        payload.name = formData.name;
        payload.description = formData.description || undefined;
        payload.price = priceNum;
        payload.stock = stockNum;
        payload.category = category;
        if (formData.sku !== undefined)
          payload.sku = formData.sku === '' ? undefined : formData.sku;
      } else {
        if (formData.name !== originalProduct.name)
          payload.name = formData.name;
        if (
          (formData.description || '') !== (originalProduct.description || '')
        )
          payload.description = formData.description || undefined;
        if (!Number.isNaN(priceNum) && priceNum !== originalProduct.price)
          payload.price = priceNum;
        if (stockNum !== originalProduct.stock) payload.stock = stockNum;
        if (category !== originalProduct.category) payload.category = category;
        if ((formData.sku || '') !== (originalProduct.sku || '')) {
          if (formData.sku) payload.sku = formData.sku;
          else payload.sku = undefined;
        }
      }

      if (Object.keys(payload).length === 0) {
        setError('No changes to save');
        setSaving(false);
        return;
      }

      const response = await productsAPI.update(parseInt(id), payload);

      if (response.success) {
        setOriginalProduct(response.product);
        navigate('/inventory');
      } else {
        setError('Error updating product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Error updating product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      setError('You must log in to delete products');
      return;
    }

    if (!id) {
      setError('Invalid product ID or not authenticated');
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await productsAPI.delete(parseInt(id));

      if (response.success) {
        console.log('Product deleted successfully');
        navigate('/inventory');
      } else {
        setError('Error deleting product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error deleting product');
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
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
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='w-8 h-8 border-b-2 rounded-full animate-spin border-primary'></div>
          <p className='ml-3 text-text-secondary'>Loading product...</p>
        </div>
      ) : (
        <>
          {/* Sub-header */}
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
                    onClick={handleDelete}
                    disabled={saving}
                    className='px-4 py-2 font-medium text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Delete
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

          {/* Content */}
          <div className='px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8'>
            {/* Desktop Two Column Layout */}
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {/* Left Column */}
              <div className='space-y-6'>
                {/* Product Type */}
                <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <label className='block mb-2 text-sm font-medium text-text-primary'>
                        Tipo de artículo
                      </label>
                      <select
                        value={formData.productType}
                        onChange={(e) =>
                          handleInputChange('productType', e.target.value)
                        }
                        className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                      >
                        <option value='Physical Product'>
                          Physical Product
                        </option>
                        <option value='Service'>Service</option>
                        <option value='Digital'>Digital</option>
                      </select>
                    </div>
                    <button className='px-4 py-2 ml-4 text-sm transition-colors border rounded-lg border-divider hover:bg-gray-50 text-text-primary'>
                      Cambiar
                    </button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className='p-6 space-y-4 border rounded-lg shadow-sm bg-bg-surface border-divider'>
                  <div>
                    <label className='block mb-2 text-sm font-medium text-text-primary'>
                      Product Name *
                    </label>
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
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

                {/* Image Upload */}
                <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
                  <label className='block mb-4 text-sm font-medium text-text-primary'>
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

                {/* Location */}
                <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Locations
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value=''>Select warehouse</option>
                    <option value='main-warehouse'>Main Warehouse</option>
                    <option value='secondary-warehouse'>
                      Secondary Warehouse
                    </option>
                    <option value='physical-store'>Physical Store</option>
                  </select>
                </div>

                {/* Categorization */}
                <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
                  <h3 className='mb-4 text-lg font-medium text-text-primary'>
                    Categorization
                  </h3>

                  <div className='space-y-4'>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        id='create-category'
                        checked={formData.createCategory}
                        onChange={(e) =>
                          handleInputChange('createCategory', e.target.checked)
                        }
                        className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                      />
                      <label
                        htmlFor='create-category'
                        className='text-sm font-medium text-text-primary'
                      >
                        Create category
                      </label>
                    </div>

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

              {/* Right Column */}
              <div className='space-y-6'>
                {/* Units Section */}
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
                        onChange={(e) =>
                          handleInputChange('unit', e.target.value)
                        }
                        className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                      >
                        <option value='Per item'>Per item</option>
                        <option value='Per kilogram'>Per kilogram</option>
                        <option value='Per meter'>Per meter</option>
                        <option value='Per liter'>Per liter</option>
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

                {/* Inventory Section */}
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

                    <div>
                      <label className='block mb-2 text-sm font-medium text-text-primary'>
                        SKU
                      </label>
                      <input
                        type='text'
                        value={formData.sku}
                        onChange={(e) =>
                          handleInputChange('sku', e.target.value)
                        }
                        className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                        placeholder='SKU-001'
                      />
                    </div>
                  </div>
                </div>

                {/* Variants Section */}
                <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
                  <h3 className='mb-4 text-lg font-medium text-text-primary'>
                    Variants
                  </h3>

                  <div className='space-y-4'>
                    {variantTypes.map((variant) => (
                      <div key={variant} className='space-y-2'>
                        <div className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            id={`variant-${variant}`}
                            checked={variants[variant].isActive}
                            onChange={() => handleVariantToggle(variant)}
                            className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                          />
                          <label
                            htmlFor={`variant-${variant}`}
                            className='text-sm text-text-primary'
                          >
                            {variant}
                          </label>
                        </div>

                        {/* Show selected values summary */}
                        {variants[variant].isActive &&
                          !variants[variant].showPanel &&
                          getSelectedValues(variant) && (
                            <div className='ml-6 text-sm text-text-secondary'>
                              {variant}: {getSelectedValues(variant)}
                            </div>
                          )}

                        {/* Inline Panel */}
                        {variants[variant].showPanel && (
                          <div className='p-4 ml-6 border rounded-lg border-divider bg-gray-50'>
                            <div className='flex items-center justify-between mb-3'>
                              <h4 className='font-medium text-text-primary'>
                                {variant}
                              </h4>
                              <button
                                onClick={() => handleCancelVariant(variant)}
                                className='p-1 transition-colors rounded hover:bg-gray-200'
                              >
                                <X size={16} className='text-text-secondary' />
                              </button>
                            </div>

                            {/* Add new value */}
                            <div className='flex items-center mb-3 space-x-2'>
                              <input
                                type='text'
                                value={variants[variant].newValue}
                                onChange={(e) =>
                                  handleNewValueChange(variant, e.target.value)
                                }
                                placeholder='Add value'
                                className='flex-1 p-2 text-sm border rounded border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                              />
                              <button
                                onClick={() => handleAddVariantValue(variant)}
                                className='p-2 text-white transition-colors rounded bg-complement hover:bg-complement-600'
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Existing values */}
                            <div className='mb-4 space-y-2'>
                              {variants[variant].values.map((value) => (
                                <div
                                  key={value.id}
                                  className='flex items-center space-x-2'
                                >
                                  <input
                                    type='checkbox'
                                    id={`${variant}-${value.id}`}
                                    checked={value.selected}
                                    onChange={() =>
                                      handleVariantValueToggle(
                                        variant,
                                        value.id
                                      )
                                    }
                                    className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                                  />
                                  <label
                                    htmlFor={`${variant}-${value.id}`}
                                    className='text-sm text-text-primary'
                                  >
                                    {value.value}
                                  </label>
                                </div>
                              ))}
                            </div>

                            {/* Panel actions */}
                            <div className='flex items-center space-x-2'>
                              <button
                                onClick={() => handleSaveVariant(variant)}
                                className='px-3 py-1 text-sm text-white transition-colors rounded bg-success hover:bg-success-600'
                              >
                                Save
                              </button>
                              <button
                                onClick={() => handleCancelVariant(variant)}
                                className='px-3 py-1 text-sm transition-colors bg-gray-300 rounded hover:bg-gray-400 text-text-primary'
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      onClick={() => setShowMoreVariantsPanel(true)}
                      className='flex items-center justify-center w-full p-3 mt-4 space-x-2 transition-colors border border-dashed rounded-lg border-divider text-text-secondary hover:bg-gray-50'
                    >
                      <Plus size={16} />
                      <span>Add more variants</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* More Variants Floating Panel */}
      {showMoreVariantsPanel && (
        <div className='fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-60'>
          <div className='w-full max-w-md p-6 border rounded-lg shadow-xl bg-bg-surface border-divider'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-text-primary'>
                Add Variants
              </h3>
              <button
                onClick={() => setShowMoreVariantsPanel(false)}
                className='p-1 transition-colors rounded hover:bg-gray-50'
              >
                <X size={20} className='text-text-secondary' />
              </button>
            </div>

            <div className='mb-6 space-y-3'>
              {variantTypes.map((variant) => (
                <div key={variant} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id={`more-variant-${variant}`}
                    checked={variants[variant].isActive}
                    onChange={() => handleMoreVariantsToggle(variant)}
                    className='w-4 h-4 border-gray-300 rounded text-complement focus:ring-complement'
                  />
                  <label
                    htmlFor={`more-variant-${variant}`}
                    className='text-sm text-text-primary'
                  >
                    {variant}
                  </label>
                </div>
              ))}
            </div>

            <div className='flex items-center space-x-3'>
              <button
                onClick={handleSaveMoreVariants}
                className='flex-1 py-2 font-medium text-white transition-colors rounded-lg bg-success hover:bg-success-600'
              >
                Save
              </button>
              <button
                onClick={() => setShowMoreVariantsPanel(false)}
                className='flex-1 py-2 font-medium transition-colors bg-gray-300 rounded-lg hover:bg-gray-400 text-text-primary'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
