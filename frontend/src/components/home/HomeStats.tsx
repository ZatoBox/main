import React from 'react';

interface Props {
  count: number;
  searchTerm?: string;
}

const HomeStats: React.FC<Props> = ({ count, searchTerm }) => {
  return (
    <p className='text-gray-500 animate-slide-in-right'>
      {searchTerm ? (
        <>
          Showing {count} result{count !== 1 ? 's' : ''} for "{searchTerm}"
        </>
      ) : (
        'Select products to create sales orders quickly'
      )}
    </p>
  );
};

export default HomeStats;
