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
    <div className="border-b bg-[#FFFFFF] border-[#CBD5E1]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 transition-colors rounded-full hover:bg-gray-100"
            >
              <IoMdArrowRoundBack size={20} className="text-[#000000]" />
            </button>
            <h1 className="text-xl font-bold text-[#000000]">Nuevo Producto</h1>
          </div>

          <div className="flex items-center space-x-4">
            {error && <div className="text-sm text-red-500">{error}</div>}

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className={`relative px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200
                       flex items-center justify-center space-x-2 group
                       bg-gradient-to-r from-[#F88612] to-[#d17110]
                       hover:from-[#d17110] hover:to-[#b85a0a]
                       text-white shadow-md hover:shadow-lg
                       active:scale-95
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
                       ${saving ? 'pointer-events-none' : ''}`}
            >
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                <>
                  <FaRegFolder className="w-4 h-4" />
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
