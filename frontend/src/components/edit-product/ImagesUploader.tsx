import React from 'react';
import { Upload } from 'lucide-react';

interface Props {
  onFiles?: (files: FileList | null) => void;
}

const ImagesUploader: React.FC<Props> = ({ onFiles }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiles && onFiles(e.target.files);
  };

  return (
    <div className='p-6 border rounded-lg shadow-sm bg-bg-surface border-divider'>
      <label className='block mb-2 text-sm font-medium text-text-primary'>
        Product Images
      </label>
      <label className='block w-full p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-divider hover:border-gray-400'>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleChange}
          className='hidden'
        />
        <Upload size={48} className='mx-auto mb-4 text-text-secondary' />
        <p className='mb-2 text-text-secondary'>Drag and drop images here</p>
        <p className='text-sm text-text-secondary'>or click to select files</p>
      </label>
    </div>
  );
};

export default ImagesUploader;
