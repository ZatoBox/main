import React from 'react';
import { ArrowLeft, Plus, Archive } from 'lucide-react';

interface Props {
  onBack: () => void;
  onCreate: () => void;
  title?: string;
  selectedCount?: number;
  onArchiveSelected?: () => void;
  archivingSelected?: boolean;
}

const InventoryHeader: React.FC<Props> = ({
  onBack,
  onCreate,
  title = 'Inventario',
  selectedCount = 0,
  onArchiveSelected,
  archivingSelected = false,
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

          <div className="flex items-center space-x-3">
            {selectedCount > 0 && (
              <button
                onClick={onArchiveSelected}
                disabled={!onArchiveSelected || archivingSelected}
                className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-white transition-colors rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Archive size={18} />
                <span>
                  {archivingSelected
                    ? 'Archiving...'
                    : `Archive Selected (${selectedCount})`}
                </span>
              </button>
            )}
            <button
              onClick={onCreate}
              className="flex items-center px-4 py-2 space-x-2 font-medium text-white transition-colors rounded-lg bg-zatobox-500 hover:bg-zatobox-600"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Crear Producto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
