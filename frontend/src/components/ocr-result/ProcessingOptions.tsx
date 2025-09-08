import React from 'react';

type Props = {
  options: {
    enhance_ocr?: boolean;
    rotation_correction?: boolean;
    confidence_threshold?: number;
  };
  onChange: (opts: Props['options']) => void;
};

const ProcessingOptions: React.FC<Props> = ({ options, onChange }) => {
  return (
    <div className='p-4 mt-4'>
      <h4 className='mb-3 text-sm font-medium text-gray-900'>
        Processing Options
      </h4>
    </div>
  );
};

export default ProcessingOptions;
