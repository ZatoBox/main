import React from 'react';
import { FaRegFolder } from 'react-icons/fa6';

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
    <div className='border-b shadow-sm bg-[#FFFFFF] border-[#CBD5E1]'>
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
            <h1 className='text-xl font-semibold text-[#000000]'>{title}</h1>
          </div>

          <div className='flex items-center space-x-3'>
            <button
                     onClick={onSave}
                     disabled={saving}
                     className={`bg-[#F88612] hover:bg-[#D9740F] text-[#FFFFFF] font-semibold 
                         rounded-lg transition-colors flex items-center justify-center space-x-1
                         w-[82px] h-[40px] ${
                           saving ? "opacity-50 cursor-not-allowed" : ""
                         }`}
                   >
                     {saving ? (
                       <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                     ) : (
                       <>
                         <FaRegFolder className="w-4 h-4 self-center" />
                         <span >Save</span>
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
