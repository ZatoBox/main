import React from 'react';

type Props = {
  imageUrl?: string | null;
  onChange: (file: File | null) => void;
};

const AvatarUploader: React.FC<Props> = ({ imageUrl, onChange }) => {
  return (
    <div className='flex items-center space-x-4'>
      <div className='relative'>
        <div className='flex items-center justify-center w-20 h-20 rounded-full bg-[#E28E18]'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt='avatar'
              className='object-cover w-20 h-20 rounded-full'
            />
          ) : (
            <svg
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-white'
            >
              <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
              <circle cx='12' cy='7' r='4' />
            </svg>
          )}
        </div>
        <label className='absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer -bottom-1 -right-1 bg-[#A94D14] hover:bg-[#8A3D16]'>
          <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) =>
              onChange(e.target.files ? e.target.files[0] : null)
            }
          />
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-white'
          >
            <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
            <polyline points='7 10 12 15 17 10' />
            <line x1='12' y1='15' x2='12' y2='3' />
          </svg>
        </label>
      </div>
      <div>
        <div className='text-sm font-medium text-[#A94D14]'>
          Change avatar
        </div>
        <div className='text-sm text-[#88888888]'>PNG, JPG up to 5MB</div>
      </div>
    </div>
  );
};

export default AvatarUploader;
