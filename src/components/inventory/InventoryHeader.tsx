import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { FaRegFolder } from 'react-icons/fa6';

interface Props {
  onBack: () => void;
  onCreate: () => void;
  title?: string;
  selectedCount?: number;
  onToggleSelectedStatus?: () => void;
  togglingSelectedStatus?: boolean;
  selectedStatus?: boolean;
  onBulkDelete?: () => void;
  deletingItems?: boolean;
}

const InventoryHeader: React.FC<Props> = ({
  onBack,
  onCreate,
  title = 'Inventario',
  selectedCount = 0,
  onToggleSelectedStatus,
  togglingSelectedStatus = false,
  selectedStatus = false,
  onBulkDelete,
  deletingItems = false,
}) => {
  return (
    <div className="border-b  bg-[#FFFFFF] border-[#CBD5E1]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 transition-colors rounded-full hover:bg-zatobox-100 md:hidden"
            >
              <ArrowLeft size={20} className="text-zatobox-900" />
            </button>
            <h1 className="text-xl font-bold text-[#000000]">{title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {selectedCount > 0 && (
              <>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative w-6 h-6">
                    <input
                      type="checkbox"
                      checked={selectedStatus}
                      onChange={onToggleSelectedStatus}
                      disabled={togglingSelectedStatus}
                      className="sr-only peer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FEF9EC] to-[#FFF5E6] border-2 border-[#EEB131] rounded-full transition-all peer-checked:from-[#F88612] peer-checked:to-[#d17110] peer-checked:border-[#d17110] shadow-sm peer-checked:shadow-md peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                    <div
                      className={`absolute inset-1 rounded-full transition-all transform ${
                        selectedStatus ? 'scale-100' : 'scale-0'
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
                      selectedStatus ? 'text-[#F88612]' : 'text-[#64748B]'
                    }`}
                  >
                    {selectedStatus ? 'Desactivar' : 'Activar'} ({selectedCount}
                    )
                  </span>
                </label>
                {onBulkDelete && (
                  <button
                    onClick={onBulkDelete}
                    disabled={deletingItems}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-[10px] transition-all duration-200 shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        deletingItems ? 'animate-spin' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {deletingItems ? (
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </>
                      )}
                    </svg>
                    <span className="hidden sm:inline">
                      {deletingItems
                        ? 'Eliminando...'
                        : `Eliminar (${selectedCount})`}
                    </span>
                  </button>
                )}
              </>
            )}
            <button
              onClick={onCreate}
              className={`relative px-6 py-2.5 text-sm font-semibold rounded-[10px] transition-all duration-200
                       flex items-center justify-center space-x-2 group
                       bg-gradient-to-r from-[#F88612] to-[#d17110]
                       hover:from-[#d17110] hover:to-[#b85a0a]
                       text-white shadow-md hover:shadow-lg
                       active:scale-95`}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Crear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
