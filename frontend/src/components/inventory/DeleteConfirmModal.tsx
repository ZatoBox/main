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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='w-full max-w-md p-6 mx-4 rounded-lg shadow-lg bg-zatobox-50'>
        <div className='flex items-center mb-4'>
          <div className='flex items-center justify-center w-10 h-10 mr-3 bg-red-100 rounded-full'>
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
          <h3 className='text-lg font-medium text-zatobox-900'>
            Confirm Delete
          </h3>
        </div>

        <p className='mb-6 text-zatobox-600'>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>

        <div className='flex space-x-3'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='flex-1 px-4 py-2 transition-colors border rounded-lg border-zatobox-200 text-zatobox-900 hover:bg-zatobox-100 disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className='flex items-center justify-center flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50'
          >
            {loading ? (
              <>
                <div className='w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin'></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
