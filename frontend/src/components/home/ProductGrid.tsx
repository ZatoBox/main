import React from 'react';
import type { Product } from '../../services/api.service';
import ProductCard from '../ProductCard';

interface Props {
  products: Product[];
  onProductClick: (p: Product) => void;
}

const ProductGrid: React.FC<Props> = ({ products, onProductClick }) => {
  if (products.length === 0) {
    return (
      <div className='py-12 text-center animate-fade-in'>
        <div className='mb-4 text-text-secondary animate-bounce-in'>
          <svg
            className='w-12 h-12 mx-auto'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <p className='text-text-secondary'>No products found</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 animate-stagger'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
