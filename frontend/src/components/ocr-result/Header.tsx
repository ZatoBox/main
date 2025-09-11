import React from 'react';

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title = 'OCR Processing Result' }) => {
  return (
    <div className='mb-8 text-center'>
      <h2 className='text-2xl font-bold text-[#1F1F1F] md:text-3xl'>{title}</h2>
      <p className='mt-2 text-sm text-[#666666] md:text-base'>
        Documento procesado exitosamente
      </p>
    </div>
  );
};

export default Header;
