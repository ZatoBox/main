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
    <div className='p-6 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]'>
      <label className='block mb-2 text-sm font-medium text-[#000000]'>
        Product Images
      </label>
      <label className='block w-full p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-[#CBD5E1] hover:border-gray-400'>
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
      </label>
    </div>
  );
};

export default ImagesUploader;
