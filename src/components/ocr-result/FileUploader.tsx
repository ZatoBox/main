import React from 'react';
import { Upload } from 'lucide-react';

type Props = {
  fileName?: string | null;
  onChange: (f: File | null) => void;
};

const FileUploader: React.FC<Props> = ({ fileName, onChange }) => {
  return (
    <div className='mb-6'>
      <label className='block mb-3 text-sm font-medium text-black'>
        Seleccionar documento
      </label>
      <div className='p-6 text-center transition-colors duration-300 border-2 border-dashed rounded-lg border-[#888888] md:p-8 hover:border-[#888888]'>
        <input
          id='file-upload'
          type='file'
          accept='.pdf,.png,.jpg,.jpeg,.tiff,.bmp'
          onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
          className='hidden'
        />
        <label htmlFor='file-upload' className='cursor-pointer'>
          <div>
            <Upload
              size={48}
              className='mb-4 animate-bounce text-[#F88612] mx-auto'
            />
            <p className='text-base font-medium md:text-lg text-[#888888]'>
              {fileName
                ? `Selected: ${fileName}`
                : 'Click to select an invoice'}
            </p>
            <p className='mt-2 text-xs md:text-sm text-[#888888]'>
              PNG, WEBP, JPG, JPEG (max 5MB)
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
