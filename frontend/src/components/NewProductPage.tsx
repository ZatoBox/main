import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../services/api';

const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    productType: 'Physical Product',
    name: '',
    description: '',
    location: '',
    unit: 'Per item',
    weight: '',
    price: '',
    inventoryQuantity: '',
    lowStockAlert: '',
    sku: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(
        (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
      );
      if (validFiles.length !== fileArray.length) {
        setError(
          'Some files were rejected. Only images under 5MB are allowed.'
        );
        setTimeout(() => setError(null), 5000);
      }
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    if (!isAuthenticated) {
      setError('You must log in to create products');
      setLoading(false);
      return;
    }
    if (
      !formData.name ||
      !formData.price ||
      !formData.inventoryQuantity ||
      !formData.unit
    ) {
      setError('Name, price, inventory quantity and unit are required');
      setLoading(false);
      return;
    }
    if (selectedCategories.length === 0) {
      setError('Category is required');
      setLoading(false);
      return;
    }
    const priceNum = Number(formData.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }
    const stockNum = parseInt(formData.inventoryQuantity, 10);
    if (!Number.isFinite(stockNum) || Number.isNaN(stockNum) || stockNum < 0) {
      setError('Inventory quantity must be 0 or more');
      setLoading(false);
      return;
    }

    try {
      const productPayload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description || null,
        price: priceNum,
        stock: stockNum,
        unit: formData.unit,
        category: selectedCategories[0],
        sku: formData.sku || null,
      };

      if (formData.productType && formData.productType !== '') {
        productPayload.product_type = formData.productType;
      }

      await productsAPI.create(productPayload as any);
      navigate('/inventory');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

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
                New Product
              </h1>
            </div>
            <div className='flex items-center space-x-3'>
              {error && <div className='text-sm text-red-500'>{error}</div>}
              <button
                onClick={handleSave}
                disabled={loading}
                className={`bg-primary hover:bg-primary-600 text-black font-medium px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className='w-4 h-4 border-b-2 border-black rounded-full animate-spin'></div>
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
              <label className='block mb-4 text-sm font-medium text-text-primary'>
                Product Images
              </label>
              <div
                className={`border-2 border-dashed border-divider rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer ${
                  dragActive ? 'border-complement' : ''
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className='hidden'
                  id='image-upload'
                />
                <label htmlFor='image-upload' className='cursor-pointer'>
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
                </label>
              </div>
              {selectedFiles.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-4'>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className='flex items-center p-2 text-sm text-gray-800 bg-gray-100 rounded-md'
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className='ml-2 text-gray-500 hover:text-gray-700'
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    Suggested categories
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
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                    required
                  >
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
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <h3 className='mb-4 text-lg font-medium text-text-primary'>
                Inventory
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block mb-2 text-sm font-medium text-text-primary'>
                    Inventory quantity *
                  </label>
                  <input
                    type='number'
                    value={formData.inventoryQuantity}
                    onChange={(e) =>
                      handleInputChange('inventoryQuantity', e.target.value)
                    }
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                    placeholder='0'
                    required
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
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                    placeholder='SKU-001'
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

export default NewProductPage;
