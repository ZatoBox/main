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
    <div className='p-4 mt-4 rounded-lg bg-zatobox-50'>
      <h4 className='mb-3 text-sm font-medium text-zatobox-900'>
        699 Processing Options
      </h4>
      <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-3'>
        <label className='flex items-center'>
          <input
            type='checkbox'
            checked={!!options.enhance_ocr}
            onChange={(e) =>
              onChange({ ...options, enhance_ocr: e.target.checked })
            }
            className='mr-2'
          />
          <span>Enhance OCR</span>
        </label>

        <label className='flex items-center'>
          <input
            type='checkbox'
            checked={!!options.rotation_correction}
            onChange={(e) =>
              onChange({ ...options, rotation_correction: e.target.checked })
            }
            className='mr-2'
          />
          <span>Auto-rotation</span>
        </label>

        <label className='flex items-center'>
          <span className='mr-2'>Confidence:</span>
          <input
            type='range'
            min='0.1'
            max='0.9'
            step='0.1'
            value={options.confidence_threshold ?? 0.25}
            onChange={(e) =>
              onChange({
                ...options,
                confidence_threshold: parseFloat(e.target.value),
              })
            }
            className='flex-1'
          />
          <span className='ml-2 text-xs'>
            {Math.round((options.confidence_threshold ?? 0.25) * 100)}%
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProcessingOptions;
