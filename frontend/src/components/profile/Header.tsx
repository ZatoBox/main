import React from 'react';

type Props = {
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  title?: string;
};

const Header: React.FC<Props> = ({
  onBack,
  onSave,
  saving,
  title = 'My Profile',
}) => {
  return (
    <div className='border-b shadow-sm bg-zatobox-50 border-zatobox-200'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={onBack}
              className='p-2 transition-colors rounded-full hover:bg-zatobox-100 md:hidden'
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
            <h1 className='text-xl font-semibold text-zatobox-900'>{title}</h1>
          </div>

          <div className='flex items-center space-x-3'>
            <button
              onClick={onSave}
              disabled={saving}
              className={`flex items-center px-4 py-2 text-white transition-colors rounded-lg bg-zatobox-500 hover:bg-zatobox-600 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mr-2'
              >
                <path d='M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2z' />
              </svg>
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
