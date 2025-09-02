import React from 'react';

type Props = {
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  error?: string | null;
};

const Header: React.FC<Props> = ({ onBack, onSave, saving, error }) => {
  return (
    <div className='border-b shadow-sm bg-zatobox-50 border-zatobox-200'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={onBack}
              className='p-2 transition-colors rounded-full hover:bg-gray-50 md:hidden'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-zatobox-900'
              >
                <path d='M15 18l-6-6 6-6' />
              </svg>
            </button>
            <h1 className='text-xl font-semibold text-zatobox-900 md:hidden'>
              New Product
            </h1>
          </div>

          <div className='flex items-center space-x-3'>
            {error && <div className='text-sm text-red-500'>{error}</div>}
            <button
              onClick={onSave}
              disabled={saving}
              className={`bg-zatobox-500 hover:bg-zatobox-600 text-black font-medium px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <div className='w-4 h-4 border-b-2 border-black rounded-full animate-spin'></div>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
