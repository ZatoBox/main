import React from 'react';

type Props = {
  title?: string;
};

const Header: React.FC<Props> = ({ title = 'OCR — Invoice' }) => {
  return (
    <div className='mb-6 text-center'>
      <div className='mb-4 text-3xl md:text-4xl'>50D</div>
      <h2 className='mb-2 text-2xl font-bold md:text-3xl text-text-primary'>
        {title}
      </h2>
      <p className='text-sm text-text-secondary md:text-base'>
        Upload a document to extract information automatically
      </p>
    </div>
  );
};

export default Header;
