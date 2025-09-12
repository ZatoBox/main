import React from 'react';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in'>
      <div className='w-full max-w-md overflow-hidden transition-all bg-white border rounded-xl shadow-xl border-gray-300 animate-scale-in'>
        <div className='flex items-start p-6 space-x-4 bg-gradient-to-r from-white to-zatobox-50'>
          <div className='flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-red-50'>
            <svg
              className='w-6 h-6 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <div className='flex-1'>
            <h3 className='text-xl font-semibold tracking-tight text-black'>
              Eliminar producto
            </h3>
            <p className='mt-2 text-sm leading-relaxed text-gray-600'>
              Esta acción es permanente y no se puede deshacer.
            </p>
          </div>
        </div>
        <div className='px-6 pt-2 pb-6 space-y-4'>
          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <button
              onClick={onCancel}
              disabled={loading}
              className='w-full px-5 py-2.5 text-sm font-medium transition-all border rounded-lg sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50'
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className='w-full px-5 py-2.5 text-sm font-semibold text-white transition-all rounded-lg sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center justify-center'
            >
              {loading ? (
                <>
                  <div className='w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin'></div>
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
