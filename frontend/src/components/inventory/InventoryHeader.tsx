import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

interface Props {
  onBack: () => void;
  onCreate: () => void;
}

const InventoryHeader: React.FC<Props> = ({ onBack, onCreate }) => {
  return (
    <div className='border-b  bg-[#FFFFFF] border-[#CBD5E1]'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={onBack}
              className='p-2 transition-colors rounded-full hover:bg-zatobox-100 md:hidden'
            >
              <ArrowLeft size={20} className='text-zatobox-900' />
            </button>
            <h1 className='text-xl font-semibold text-zatobox-900 md:hidden'>
              Inventory
            </h1>
          </div>

          <button
            onClick={onCreate}
            className='flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors rounded-lg bg-zatobox-500 hover:bg-zatobox-600'
          >
            <Plus size={20} />
            <span className='hidden sm:inline'>Create Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
