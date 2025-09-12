import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface Props {
  unitOptions: Option[];
  productTypeOptions: Option[];
  formData: {
    unit: string;
    productType: string;
    weight: string;
    price: string;
  };
  onChange: (field: string, value: string) => void;
}

const UnitsPanel: React.FC<Props> = ({
  unitOptions,
  productTypeOptions,
  formData,
  onChange,
}) => {
  return (
    <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
      <h3 className='mb-4 text-lg font-medium text-zatobox-900'>Units</h3>
      <div className='space-y-4'>
        <div>
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Unit
          </label>
          <select
            value={formData.unit}
            onChange={(e) => onChange('unit', e.target.value)}
            className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
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
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Product Type
          </label>
          <select
            value={formData.productType}
            onChange={(e) => onChange('productType', e.target.value)}
            className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
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
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Weight (kg)
          </label>
          <input
            type='number'
            value={formData.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
            placeholder='0.00'
            step='0.01'
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Price (required)
          </label>
          <div className='relative'>
            <span className='absolute transform -translate-y-1/2 left-3 top-1/2 text-zatobox-600'>
              $
            </span>
            <input
              type='number'
              value={formData.price}
              onChange={(e) => onChange('price', e.target.value)}
              className='w-full py-3 pl-8 pr-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
              placeholder='0.00'
              step='0.01'
            />
          </div>
        </div>

        <button className='flex items-center justify-center w-full p-3 space-x-2 transition-colors border border-dashed rounded-lg border-zatobox-200 text-zatobox-600 hover:bg-zatobox-100'>
          <span>Add additional unit</span>
        </button>
      </div>
    </div>
  );
};

export default UnitsPanel;
