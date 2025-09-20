import React, { useState } from 'react';
import { authAPI } from '@/services/api.service';

type Props = {
  imageUrl?: string | null;
  onImageUpdated: (newImageUrl: string | null, updatedUser?: any) => void;
  onError?: (error: string) => void;
};

const AvatarUploader: React.FC<Props> = ({
  imageUrl,
  onImageUpdated,
  onError,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onError?.('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const res = await authAPI.uploadProfileImage(file);
      if (res.success && res.user && res.user.profile_image) {
        onImageUpdated(res.user.profile_image, res.user);
      } else if (res.success) {
        onImageUpdated(null, res.user);
      } else {
        onError?.('Upload failed');
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!imageUrl) return;
    setUploading(true);
    try {
      const res = await authAPI.deleteProfileImage();
      if (res.success) {
        onImageUpdated(null, res.user);
      } else {
        onError?.('Delete failed');
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='flex items-center space-x-4'>
      <div className='relative'>
        <div className='flex items-center justify-center w-32 h-32 rounded-full bg-[#E28E18]'>
          {uploading ? (
            <div className='flex items-center justify-center w-8 h-8'>
              <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt='avatar'
              className='object-cover w-32 h-32 rounded-full'
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
        {!uploading && (
          <label className='absolute flex items-center justify-center w-8 h-8 transition-colors rounded-full cursor-pointer -bottom-1 -right-1 bg-[#A94D14] hover:bg-[#8A3D16]'>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
              disabled={uploading}
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
        )}
        {imageUrl && !uploading && (
          <button
            onClick={handleDeleteImage}
            className='absolute flex items-center justify-center w-6 h-6 transition-colors rounded-full cursor-pointer -top-1 -right-1 bg-red-500 hover:bg-red-600'
          >
            <svg
              width='12'
              height='12'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-white'
            >
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </button>
        )}
      </div>
      <div>
        <div className='text-sm font-medium text-[#A94D14]'>
          {uploading ? 'Uploading...' : 'Change avatar'}
        </div>
        <div className='text-sm text-[#88888888]'>PNG, JPG up to 5MB</div>
      </div>
    </div>
  );
};

export default AvatarUploader;
