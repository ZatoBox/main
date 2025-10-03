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
          Mostrando {count} resultados{count !== 1 ? 's' : ''} para "{searchTerm}"
        </>
      ) : (
        'Selecciona productos para crear pedidos de venta rápidamente'
      )}
    </p>
  );
};

export default HomeStats;
