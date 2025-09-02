import React from 'react';
import type { OCRResponse } from '@/services/api.service';

type Props = {
  result?: OCRResponse | null;
  fileName?: string | null;
};

const ResultOverview: React.FC<Props> = ({ result, fileName }) => {
  return (
    <div>
      <div className='mb-6 text-center'>
        <h2 className='mb-2 text-xl font-bold md:text-2xl text-zatobox-900'>
          Invoice Processing Result
        </h2>
        <p className='text-sm text-zatobox-600 md:text-base'>
          Document processed successfully with AI + OCR
        </p>
      </div>

      <div className='flex flex-wrap justify-center gap-4 mt-4 mb-6'>
        <div className='px-4 py-2 border border-green-200 rounded-lg bg-green-50'>
          <div className='text-sm text-zatobox-600'>OCR Confidence</div>
          <div className='text-lg font-bold text-green-600'>
            {result?.statistics?.ocr_confidence
              ? (result.statistics.ocr_confidence * 100).toFixed(1)
              : '85.0'}
            %
          </div>
        </div>

        <div className='px-4 py-2 border border-blue-200 rounded-lg bg-blue-50'>
          <div className='text-sm text-zatobox-600'>YOLO Detections</div>
          <div className='text-lg font-bold text-blue-600'>
            {result?.statistics?.yolo_detections || 0}
          </div>
        </div>

        <div className='px-4 py-2 border border-purple-200 rounded-lg bg-purple-50'>
          <div className='text-sm text-zatobox-600'>Processing Time</div>
          <div className='text-lg font-bold text-purple-600'>
            {result?.processing_time || 0}s
          </div>
        </div>
      </div>

      <div className='grid gap-6 mb-6 md:grid-cols-2 md:gap-8 md:mb-8'>
        <div className='p-4 rounded-lg bg-zatobox-50 md:p-6'>
          <h3 className='mb-3 text-base font-semibold md:text-lg text-zatobox-900 md:mb-4'>
            4CB Invoice Information
          </h3>
          <div className='space-y-2 md:space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-zatobox-600 md:text-base'>
                Company:
              </span>
              <span className='text-sm text-zatobox-900 md:text-base'>
                {result?.metadata?.company_name || 'No detectado'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-zatobox-600 md:text-base'>
                RUC:
              </span>
              <span className='text-sm text-zatobox-900 md:text-base'>
                {result?.metadata?.ruc || 'No detectado'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-zatobox-600 md:text-base'>
                Date:
              </span>
              <span className='text-sm text-zatobox-900 md:text-base'>
                {result?.metadata?.date || 'No detectado'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-zatobox-600 md:text-base'>
                Invoice #:
              </span>
              <span className='text-sm text-zatobox-900 md:text-base'>
                {result?.metadata?.invoice_number || 'No detectado'}
              </span>
            </div>
          </div>
        </div>

        <div className='p-4 rounded-lg bg-zatobox-50 md:p-6'>
          <h3 className='mb-3 text-base font-semibold md:text-lg text-zatobox-900 md:mb-4'>
            4B0 Financial Summary
          </h3>
          <div className='space-y-2 md:space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-zatobox-600 md:text-base'>
                Subtotal:
              </span>
              <span className='text-sm text-zatobox-900 md:text-base'>
                {result?.metadata?.subtotal || 'No detectado'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm font-medium text-zatobox-600 md:text-base'>
                IVA:
              </span>
              <span className='text-sm text-zatobox-900 md:text-base'>
                {result?.metadata?.iva || 'No detectado'}
              </span>
            </div>
            <div className='flex justify-between pt-2 border-t border-zatobox-200'>
              <span className='text-sm font-bold text-zatobox-900 md:text-base'>
                Total:
              </span>
              <span className='text-lg font-bold text-green-600 md:text-xl'>
                {result?.metadata?.total || 'No detectado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultOverview;
