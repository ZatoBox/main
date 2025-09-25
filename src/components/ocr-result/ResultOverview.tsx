import React from 'react';
import { OCRResponse } from '@/types/index';

type Props = {
  result?: OCRResponse | null;
  fileName?: string | null;
};

const ResultOverview: React.FC<Props> = ({ result, fileName }) => {
  return (
    <div className="mb-6">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-[#1F1F1F] md:text-3xl">
          OCR Processing Result
        </h2>
        <p className="mt-2 text-sm text-[#666666] md:text-base">
          Document processed successfully
        </p>
        {fileName && (
          <div className="inline-block px-4 py-2 mt-4 text-sm border rounded-md border-[#E5E7EB] bg-white text-[#1F1F1F]">
            <span className="mr-1">📄</span> file: {fileName}
          </div>
        )}
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div className="p-5 bg-white border rounded-lg shadow-sm md:p-6 border-[#EFEFEF]">
          <h3 className="mb-4 text-base font-semibold text-[#1F1F1F] md:text-lg">
            Document Information
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#555555]">Type:</span>
              <span className="font-medium text-[#1F1F1F]">Invoice</span>
            </div>
            {result?.metadata?.company_name && (
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Supplier:</span>
                <span className="font-medium text-[#1F1F1F]">
                  {result.metadata.company_name}
                </span>
              </div>
            )}
            {result?.metadata?.date && (
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Date:</span>
                <span className="font-medium text-[#1F1F1F]">
                  {result.metadata.date}
                </span>
              </div>
            )}
            {result?.metadata?.invoice_number && (
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Number:</span>
                <span className="font-medium text-[#1F1F1F]">
                  {result.metadata.invoice_number}
                </span>
              </div>
            )}
            {!result?.metadata?.company_name &&
              !result?.metadata?.date &&
              !result?.metadata?.invoice_number && (
                <div className="text-sm text-center text-[#888888] py-4">
                  No document information detected
                </div>
              )}
          </div>
        </div>
        <div className="p-5 bg-white border rounded-lg shadow-sm md:p-6 border-[#EFEFEF]">
          <h3 className="mb-4 text-base font-semibold text-[#1F1F1F] md:text-lg">
            Financial Summary
          </h3>
          <div className="space-y-2">
            {result?.metadata?.subtotal && (
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Subtotal:</span>
                <span className="font-medium text-[#1F1F1F]">
                  {result.metadata.subtotal}
                </span>
              </div>
            )}
            {result?.metadata?.iva && (
              <div className="flex justify-between text-sm">
                <span className="text-[#555555]">Taxes:</span>
                <span className="font-medium text-[#1F1F1F]">
                  {result.metadata.iva}
                </span>
              </div>
            )}
            {result?.metadata?.total && (
              <div className="pt-2 mt-2 border-t border-[#E6E6E6] flex justify-between text-sm">
                <span className="font-semibold text-[#1F1F1F]">Total:</span>
                <span className="text-[#F88612] font-bold">
                  {result.metadata.total}
                </span>
              </div>
            )}
            {!result?.metadata?.subtotal &&
              !result?.metadata?.iva &&
              !result?.metadata?.total && (
                <div className="text-sm text-center text-[#888888] py-4">
                  No financial summary detected
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultOverview;
