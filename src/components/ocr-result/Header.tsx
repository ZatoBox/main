import React from 'react';
import { ChevronRight } from 'lucide-react';

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title = 'Procesado OCR' }) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center gap-2 text-sm text-[#64748B]">
        <span>Herramientas</span>
        <ChevronRight size={14} />
        <span className="text-[#F88612] font-medium">OCR</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">{title}</h1>
        <p className="text-[#64748B]">
          Escanee su documento para ver el texto reconocido
        </p>
      </div>
    </div>
  );
};

export default Header;
