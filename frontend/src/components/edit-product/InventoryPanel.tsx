import React from 'react';

interface Props {
  formData: { inventoryQuantity: string; lowStockAlert: string };
  onChange: (field: string, value: string) => void;
}

const InventoryPanel: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
      <h3 className='mb-4 text-lg font-medium text-zatobox-900'>Inventory</h3>
      <div className='space-y-4'>
        <div>
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Inventory quantity
          </label>
          <input
            type='number'
            value={formData.inventoryQuantity}
            onChange={(e) => onChange('inventoryQuantity', e.target.value)}
            className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
            placeholder='0'
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-zatobox-900'>
            Low stock alert
          </label>
          <input
            type='number'
            value={formData.lowStockAlert}
            onChange={(e) => onChange('lowStockAlert', e.target.value)}
            className='w-full p-3 border rounded-lg border-zatobox-200 focus:ring-2 focus:ring-zatobox-500 focus:border-transparent bg-zatobox-50 text-zatobox-900'
            placeholder='5'
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
