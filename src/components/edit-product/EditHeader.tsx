// components/edit-product/Header.tsx

import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { FaRegFolder } from 'react-icons/fa6';
import { IoMdArrowRoundBack } from 'react-icons/io';

interface Props {
  onBack: () => void;
  onArchive: () => void;
  onToggleStatus: () => void;
  onSave: () => void;
  status: 'active' | 'inactive' | '';
  saving: boolean;
  togglingStatus: boolean;
}

const EditHeader: React.FC<Props> = ({
  onBack,
  onArchive,
  onToggleStatus,
  onSave,
  status,
  saving,
  togglingStatus,
}) => {
  return (
    <div className='border-b bg-[#FFFFFF] border-[#CBD5E1]'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={onBack}
              className='p-2 transition-colors rounded-full hover:bg-zatobox-100 '
            >
              <IoMdArrowRoundBack size={20} className='text-[#000000]' />
            </button>
            <h1 className='hidden text-xl font-bold text-[#000000] md:block'>
              Editar producto
            </h1>
          </div>
          <div className='flex items-center space-x-3'>
            <button
              onClick={onToggleStatus}
              disabled={togglingStatus}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                status === 'active'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-[#FFFFFF] text-zatobox-900 hover:bg-zatobox-200 border border-[#CBD5E1]'
              }`}
            >
              <Check size={16} />
              <span className='hidden sm:inline'>
                {status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </button>
            <button
              onClick={onArchive}
              className='px-4 py-2 font-medium text-[#FFFFFF] transition-colors bg-[#A94D14] rounded-lg hover:bg-[#8A3D16] hidden sm:block'
            >
              Archivar
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className={`bg-[#F88612] hover:bg-[#D9740F] text-[#FFFFFF] font-semibold 
                       rounded-lg transition-colors flex items-center justify-center space-x-1
                       w-[82px] h-[40px] ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <div className='w-4 h-4 border-b-2 border-[#CBD5E1] rounded-full animate-spin'></div>
              ) : (
                <>
                  <FaRegFolder className='w-4 h-4 self-center' />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHeader;
