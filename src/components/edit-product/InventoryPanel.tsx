import React from 'react';

interface Props {
  formData: { inventoryQuantity: string; lowStockAlert: string };
  onChange: (field: string, value: string) => void;
}

const InventoryPanel: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className='p-6 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]'>
      <h3 className='mb-4 text-lg font-medium text-[#000000]'>Inventory</h3>
      <div className='space-y-4'>
        <div>
          <label className='block mb-2 text-sm font-medium text-[#000000]'>
            Inventory quantity
          </label>
          <input
            type='number'
            value={formData.inventoryQuantity}
            onChange={(e) => onChange('inventoryQuantity', e.target.value)}
            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]'
            placeholder='0'
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-[#000000]'>
            Low stock alert
          </label>
          <input
            type='number'
            value={formData.lowStockAlert}
            onChange={(e) => onChange('lowStockAlert', e.target.value)}
            className='w-full p-3 border rounded-lg border-[#CBD5E1] focus:ring-2 focus:ring-[#CBD5E1] focus:border-transparent bg-[#FFFFFF] text-[#000000]'
            placeholder='5'
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
