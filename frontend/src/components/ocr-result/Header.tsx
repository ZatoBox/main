import React from 'react';

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title = 'OCR Invoice' }) => {
  return (
    <div className='mb-6 text-center'>
      <h2 className='mb-2 text-2xl font-bold md:text-3xl text-black'>
        {title}
      </h2>
      <p className='text-sm text-[#888888] md:text-base'>
        Upload a document to extract information automatically
      </p>
    </div>
  );
};

export default Header;
