import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  text = 'Cargando...',
  fullScreen = true,
  className = '',
}) => {
  const containerClasses = fullScreen
    ? 'min-h-screen bg-[#F8F9FA] flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-[#F88612] animate-spin" />
        <p className="text-[#64748B] font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
