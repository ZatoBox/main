import React from 'react';

interface FormDataShape {
  productType: string;
  name: string;
  description: string;
  location: string;
  unit: string;
  weight: string;
  price: string;
  inventoryQuantity: string;
  lowStockAlert: string;
  sku: string;
}

interface Props {
  formData: FormDataShape;
  onChange: (field: keyof FormDataShape, value: string) => void;
}

const ProductForm: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className='space-y-6'>
      <div className='p-6 space-y-4 border rounded-lg shadow-sm bg-bg-surface border-divider'>
        <div>
          <label className='block mb-2 text-sm font-medium text-text-primary'>
            Product Name *
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
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
            onChange={(e) => onChange('description', e.target.value)}
            placeholder='Product description'
            rows={3}
            className='w-full p-3 border rounded-lg resize-none border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
          />
        </div>
      </div>

      <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
        <label className='block mb-2 text-sm font-medium text-text-primary'>
          Locations
        </label>
        <input
          type='text'
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className='w-full p-3 border rounded-lg border-divider focus:ring-2 focus:ring-complement focus:border-transparent bg-bg-surface text-text-primary'
          placeholder='Optional physical location'
        />
      </div>
    </div>
  );
};

export default ProductForm;
