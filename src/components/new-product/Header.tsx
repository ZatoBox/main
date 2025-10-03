import React from 'react';
import { FaRegFolder } from 'react-icons/fa6';
import { IoMdArrowRoundBack } from 'react-icons/io';

type Props = {
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  error?: string | null;
};

const Header: React.FC<Props> = ({ onBack, onSave, saving, error }) => {
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
            <h1 className='text-xl font-bold text-[#000000]'>
              Nuevo Producto
            </h1>
          </div>

          <div className='flex items-center space-x-3'>
            {/* ELIMINE el botón de 'Delete' ya que no se aplica a un nuevo producto */}
            {/* ELIMINE el estado 'Active' ya que el producto se creará como activo */}
            {error && <div className='text-sm text-red-500'>{error}</div>}

            <button
              type='button'
              onClick={onSave}
              disabled={saving}
              className={`bg-[#F88612] hover:bg-[#D9740F] text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-1 px-4 py-2 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <div className='w-4 h-4 border-b-2 border-white rounded-full animate-spin'></div>
              ) : (
                <>
                  <FaRegFolder size={16} className='self-center' />
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

export default Header;
