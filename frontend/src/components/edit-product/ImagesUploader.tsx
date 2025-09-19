import React from 'react';
import { Upload, X } from 'lucide-react';

interface Props {
  existingImages?: string[];
  newFiles?: File[];
  onAddFiles?: (files: FileList | null) => void;
  onRemoveExisting?: (index: number) => void;
  onRemoveNew?: (index: number) => void;
  onReplaceAll?: (files: FileList | null) => void;
}

const ImagesUploader: React.FC<Props> = ({
  existingImages = [],
  newFiles = [],
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
  onReplaceAll,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAddFiles && onAddFiles(e.target.files);
  };

  return (
    <div className='p-6 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]'>
      <label className='block mb-2 text-sm font-medium text-[#000000]'>
        Product Images
      </label>
      <div className='mb-4'>
        <label className='relative block w-full p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-[#CBD5E1] hover:border-gray-400'>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleChange}
            className='hidden'
          />
          <Upload size={48} className='mx-auto mb-4 text-[#88888888]' />
          <p className='mb-2 text-[#88888888]'>Drag and drop images here</p>
          <p className='text-sm text-[#88888888]'>or click to select files</p>
          <div className='absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center pointer-events-none'>
            <span className='text-lg font-semibold text-gray-700'>Fixing</span>
          </div>
        </label>
      </div>

      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className='space-y-4'>
          {existingImages.length > 0 && (
            <div>
              <p className='mb-2 text-sm font-medium text-[#000000]'>
                Existing
              </p>
              <div className='flex flex-wrap gap-2'>
                {existingImages.map((url, idx) => (
                  <div
                    key={idx}
                    className='relative w-24 h-24 overflow-hidden bg-gray-100 rounded'
                  >
                    <img
                      src={url}
                      alt={`img-${idx}`}
                      className='object-cover w-full h-full'
                    />
                    {onRemoveExisting && (
                      <button
                        type='button'
                        onClick={() => onRemoveExisting(idx)}
                        className='absolute top-0 right-0 p-1 text-white bg-black/50'
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {newFiles.length > 0 && (
            <div>
              <p className='mb-2 text-sm font-medium text-[#000000]'>New</p>
              <div className='flex flex-wrap gap-2'>
                {newFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className='relative w-24 h-24 overflow-hidden bg-gray-100 rounded'
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className='object-cover w-full h-full'
                    />
                    {onRemoveNew && (
                      <button
                        type='button'
                        onClick={() => onRemoveNew(idx)}
                        className='absolute top-0 right-0 p-1 text-white bg-black/50'
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {onReplaceAll && existingImages.length > 0 && (
        <div className='mt-4'>
          <label className='text-xs text-blue-600 cursor-pointer hover:underline'>
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={(e) => onReplaceAll(e.target.files)}
              className='hidden'
            />
            Replace all images
          </label>
        </div>
      )}
    </div>
  );
};

export default ImagesUploader;
