import React from 'react';

type Props = {
  isEditing: boolean;
  isAdding: boolean;
  onConfirm: () => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onProcessAnother: () => void;
};

const ActionsBar: React.FC<Props> = ({
  isEditing,
  isAdding,
  onConfirm,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onProcessAnother,
}) => {
  return (
    <div className='flex flex-col justify-center gap-3 sm:flex-row md:gap-4'>
      {isEditing ? (
        <>
          <button
            onClick={onSaveEdit}
            className='px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform bg-green-600 rounded-lg md:px-6 md:py-3 hover:bg-green-700 md:text-base'
          >
            4BE Save Changes
          </button>
          <button
            onClick={onCancelEdit}
            className='px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform bg-zatobox-500 rounded-lg md:px-6 md:py-3 hover:bg-zatobox-600 md:text-base'
          >
            74C Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onConfirm}
            disabled={isAdding}
            className='px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform bg-green-600 rounded-lg md:px-6 md:py-3 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed md:text-base'
          >
            {isAdding ? (
              <>
                <div className='inline-block w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin'></div>
                Adding to Inventory...
              </>
            ) : (
              '197 Confirm Data'
            )}
          </button>
          <button
            onClick={onEdit}
            className='px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform bg-zatobox-500 rounded-lg md:px-6 md:py-3 hover:bg-zatobox-600 md:text-base'
          >
            4DD Edit Result
          </button>
          <button
            onClick={onProcessAnother}
            className='px-4 py-2 text-sm font-medium text-white transition-all duration-300 transform bg-zatobox-500 rounded-lg md:px-6 md:py-3 hover:bg-zatobox-600 md:text-base'
          >
            504 Process Another
          </button>
        </>
      )}
    </div>
  );
};

export default ActionsBar;
