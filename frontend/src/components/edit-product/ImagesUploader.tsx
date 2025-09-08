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
    <div className='p-6 border rounded-lg shadow-sm bg-zatobox-50 border-zatobox-200'>
      <label className='block mb-2 text-sm font-medium text-zatobox-900'>
        Product Images
      </label>
      <label className='block w-full p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-zatobox-200 hover:border-zatobox-400'>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleChange}
          className='hidden'
        />
        <Upload size={48} className='mx-auto mb-4 text-zatobox-600' />
        <p className='mb-2 text-zatobox-600'>Drag and drop images here</p>
        <p className='text-sm text-zatobox-600'>or click to select files</p>
      </label>
    </div>
  );
};

export default ImagesUploader;
