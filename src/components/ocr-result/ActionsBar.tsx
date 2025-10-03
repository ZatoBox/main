import React from 'react';

type Props = {
  isEditing: boolean;
  isAdding: boolean;
  onConfirm: () => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onProcessAnother: () => void;
  processAnotherDisabled?: boolean;
  processAnotherLabel?: string;
};

const baseBtn =
  'px-5 py-2.5 md:px-6 md:py-3 rounded-md text-sm md:text-base font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

const ActionsBar: React.FC<Props> = ({
  isEditing,
  isAdding,
  onConfirm,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onProcessAnother,
  processAnotherDisabled,
  processAnotherLabel,
}) => {
  return (
    <div className='flex flex-col justify-center gap-3 sm:flex-row md:gap-4'>
      {isEditing ? (
        <>
          <button
            onClick={onSaveEdit}
            className={`${baseBtn} bg-[#F88612] hover:bg-[#A94D14] text-white`}
          >
            Guardar cambios
          </button>
          <button
            onClick={onCancelEdit}
            className={`${baseBtn} bg-[#ECECEC] hover:bg-[#E0E0E0] text-[#333333]`}
          >
            Cancelar
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onProcessAnother}
            disabled={processAnotherDisabled}
            className={`${baseBtn} bg-white border border-[#E2E2E2] hover:bg-[#FFF5EC] text-[#A94D14]`}
          >
            {processAnotherLabel || 'Process Another'}
          </button>
          <button
            onClick={onEdit}
            className={`${baseBtn} bg-[#A94D14] hover:bg-[#8C3D0F] text-white`}
          >
            Editar resultado
          </button>
          <button
            onClick={onConfirm}
            disabled={isAdding}
            className={`${baseBtn} bg-[#F88612] hover:bg-[#A94D14] text-white flex items-center justify-center`}
          >
            {isAdding ? (
              <>
                <span className='inline-block w-4 h-4 mr-2 border-2 border-white border-b-transparent rounded-full animate-spin'></span>
                Agregando...
              </>
            ) : (
              'Confirm Data'
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default ActionsBar;
