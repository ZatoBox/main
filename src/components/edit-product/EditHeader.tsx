import React from 'react';
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
  onToggleStatus,
  onSave,
  status,
  saving,
  togglingStatus,
}) => {
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
            <h1 className="hidden text-xl font-bold text-[#000000] md:block">
              Editar producto
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative w-6 h-6">
                <input
                  type="checkbox"
                  checked={status === 'active'}
                  onChange={onToggleStatus}
                  disabled={togglingStatus}
                  className="sr-only peer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FEF9EC] to-[#FFF5E6] border-2 border-[#EEB131] rounded-full transition-all peer-checked:from-[#F88612] peer-checked:to-[#d17110] peer-checked:border-[#d17110] shadow-sm peer-checked:shadow-md peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                <div
                  className={`absolute inset-1 rounded-full transition-all transform ${
                    status === 'active' ? 'scale-100' : 'scale-0'
                  }`}
                >
                  <svg
                    className="w-full h-full text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <span
                className={`text-sm font-semibold transition-colors ${
                  status === 'active' ? 'text-[#F88612]' : 'text-[#64748B]'
                }`}
              >
                Activado
              </span>
            </label>
            <button
              onClick={onSave}
              disabled={saving}
              className={`relative px-6 py-2.5 text-sm font-semibold rounded-[10px] transition-all duration-200
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

export default EditHeader;
