'use client';

import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface Props {
  onBack: () => void;
  title?: string;
}

const ReceiptsHeader: React.FC<Props> = ({ onBack, title = 'Recibos' }) => {
  return (
    <div className="border-b bg-white border-[#E5E7EB]">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 transition-colors rounded-full hover:bg-[#F3F4F6] md:hidden"
            >
              <ArrowLeft size={20} className="text-[#374151]" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                <FileText size={20} className="text-[#F88612]" />
              </div>
              <h1 className="text-xl font-bold text-[#000000]">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsHeader;
