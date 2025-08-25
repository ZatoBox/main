import React from 'react';

type Props = {
  fileName?: string | null;
  onChange: (f: File | null) => void;
};

const FileUploader: React.FC<Props> = ({ fileName, onChange }) => {
  return (
    <div className='mb-6'>
      <label className='block mb-3 text-sm font-medium text-text-primary'>
        4C1 Select invoice document
      </label>
      <div className='p-6 text-center transition-colors duration-300 border-2 border-dashed rounded-lg border-divider md:p-8 hover:border-complement'>
        <input
          id='file-upload'
          type='file'
          accept='.pdf,.png,.jpg,.jpeg,.tiff,.bmp'
          onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
          className='hidden'
        />
        <label htmlFor='file-upload' className='cursor-pointer'>
          <div className='text-text-secondary'>
            <div className='mb-4 text-4xl md:text-5xl animate-bounce'>9FE</div>
            <p className='text-base font-medium md:text-lg'>
              {fileName
                ? `Selected: ${fileName}`
                : 'Click to select an invoice'}
            </p>
            <p className='mt-2 text-xs md:text-sm text-text-secondary'>
              PDF, PNG, JPG, JPEG, TIFF, BMP (max 50MB)
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
