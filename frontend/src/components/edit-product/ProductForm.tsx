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
      <div className='p-6 space-y-4 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
        <div>
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Product Name *
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder='Product name'
            className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
            required
          />
        </div>
        <div>
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder='Product description'
            rows={3}
            className='w-full p-3 border rounded-lg resize-none border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
          />
        </div>
      </div>

      <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
        <label className='block mb-2 text-sm font-medium text-zatobox-900'>
          Locations
        </label>
        <input
          type='text'
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
          placeholder='Optional physical location'
        />
      </div>
    </div>
  );
};

export default ProductForm;
