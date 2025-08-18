import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productsAPI } from '../services/api';

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

const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    productType: 'Physical Product',
    name: '',
    description: '',
    location: '',
    createCategory: false,
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
  const [showMoreVariantsPanel, setShowMoreVariantsPanel] = useState(false);

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
      isActive: false,
      values: [
        { id: '1', value: 'Red', selected: false },
        { id: '2', value: 'Blue', selected: false },
        { id: '3', value: 'Green', selected: false },
        { id: '4', value: 'Black', selected: false },
      ],
      newValue: '',
      showPanel: false,
    },
    Size: {
      isActive: false,
      values: [
        { id: '1', value: 'Small', selected: false },
        { id: '2', value: 'Medium', selected: false },
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // File upload handlers
  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(
        (file) => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
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
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError('You must log in to create products');
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      setLoading(false);
      return;
    }

    try {
      const productPayload: Partial<number | any> = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.inventoryQuantity) || 0,
        category: selectedCategories[0] || 'General',
      };

      if (formData.sku) {
        productPayload.sku = formData.sku;
      }

      const createResult = await productsAPI.create(productPayload);

      if (!createResult || !createResult.success) {
        setError(
          (createResult && createResult.message) || 'Error creating product'
        );
        setLoading(false);
        return;
      }

      const createdProduct = createResult.product;

      if (selectedFiles.length > 0 && createdProduct && createdProduct.id) {
        const imagesForm = new FormData();
        selectedFiles.forEach((file) => {
          imagesForm.append('images', file);
        });
        await productsAPI.uploadImages(createdProduct.id, imagesForm);
      }

      navigate('/inventory');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen pt-16 bg-bg-main'>
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
                    Product Type
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) =>
                      handleInputChange('productType', e.target.value)
                    }
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value='Physical Product'>Physical Product</option>
                    <option value='Service'>Service</option>
                    <option value='Digital'>Digital</option>
                  </select>
                </div>
                <button className='px-4 py-2 ml-4 text-sm transition-colors border rounded-lg border-divider hover:bg-gray-50 text-text-primary'>
                  Change
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

            {/* Image Upload */}
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

            {/* Location */}
            <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
              <label className='block mb-2 text-sm font-medium text-text-primary'>
                Locations
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
              >
                <option value=''>Select a warehouse</option>
                <option value='almacen-principal'>Main Warehouse</option>
                <option value='almacen-secundario'>Secondary Warehouse</option>
                <option value='tienda-fisica'>Physical Store</option>
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
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
                  >
                    <option value='Per item'>Per item</option>
                    <option value='Per kilogramo'>Per kilogramo</option>
                    <option value='Per metro'>Per metro</option>
                    <option value='Per litro'>Per litro</option>
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
                    onChange={(e) => handleInputChange('sku', e.target.value)}
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
                                  handleVariantValueToggle(variant, value.id)
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

export default NewProductPage;
