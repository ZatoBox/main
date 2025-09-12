import React from 'react';
import { Package } from 'lucide-react';
import { Product } from '@/types/index';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    onClick(product);
  };

  const getImageUrl = () => {
    if (
      !product.images ||
      !Array.isArray(product.images) ||
      product.images.length === 0
    )
      return null;
    const raw = product.images[0];
    if (typeof raw !== 'string' || raw.trim() === '') return null;
    // Aceptar urls absolutas (http/https), data URIs, blob URLs
    if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw;
    // Evitar añadir localhost si ya parece una ruta absoluta sin protocolo (ej: //res.cloudinary...)
    if (/^\/\//.test(raw)) return `https:${raw}`;
    // Si es una ruta relativa, no forzar puerto fijo; usar NEXT_PUBLIC_API_URL si existe
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444';
    return `${apiBase.replace(/\/$/, '')}${
      raw.startsWith('/') ? '' : '/'
    }${raw}`;
  };

  const imageUrl = getImageUrl();
  const unitLabel = (product as any).unit_name ?? 'per unit';

  return (
    <div
      onClick={handleClick}
      className='relative overflow-hidden transition-all duration-300 ease-in-out transform bg-white border rounded-lg cursor-pointer group border-gray-300 hover:scale-105 hover:shadow-lg hover:border-gray-300 animate-fade-in'
    >
      {/* Stock Badge */}
      <div className='absolute z-10 top-3 right-3'>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            product.stock > 10
              ? 'bg-success-100 text-success-800 group-hover:bg-success-200'
              : product.stock > 0
              ? 'bg-warning-100 text-warning-800 group-hover:bg-warning-200'
              : 'bg-error-100 text-error-800 group-hover:bg-error-200'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-1 transition-all duration-300 ${
              product.stock > 10
                ? 'bg-success-500'
                : product.stock > 0
                ? 'bg-warning-500'
                : 'bg-error-500'
            }`}
          ></div>
          {product.stock} in stock
        </span>
      </div>

      {/* Product Image */}
      <div className='relative h-48 overflow-hidden transition-colors duration-300 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-50'>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            loading='lazy'
            className='object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-110'
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback =
                target.parentElement?.querySelector('.img-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
        )}
        <div
          className={`img-fallback absolute inset-0 flex items-center justify-center ${
            imageUrl ? 'hidden' : ''
          }`}
        >
          <div className='text-gray-400 transition-colors duration-300 group-hover:text-gray-500'>
            <Package className='w-16 h-16' />
          </div>
        </div>
        <div className='absolute inset-0 transition-all duration-300 bg-black/0 group-hover:bg-black/10' />
      </div>

      {/* Product Info */}
      <div className='p-4 space-y-3'>
        {/* Category  text-zatobox-700*/}
        <div className='flex items-center justify-between'>
          <span className='text-xs font-medium tracking-wide uppercase transition-colors duration-300 text-zatobox-900 group-hover:text-zatobox-900'>
            {product.category_id ?? ''}
          </span>
          {product.sku && (
            <span className='text-xs transition-colors duration-300 text-zatobox-900 group-hover:text-zatobox-900'>
              {product.sku}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className='text-lg font-semibold transition-colors duration-300 text-black/75 group-hover:text-black line-clamp-2'>
          {product.name}
        </h3>

        {/* Description */}
        {product.description ? (
          <p className='text-sm transition-colors duration-300 text-gray-500 line-clamp-2 group-hover:text-gray-500'>
            {product.description}
          </p>
        ) : null}

        {/* Price and Action */}
        <div className='flex items-center justify-between pt-2'>
          <div className='flex flex-col'>
            <span className='text-2xl font-bold transition-colors duration-300  text-black group-hover:text-zatobox-500'>
              ${product.price.toFixed(2)}
            </span>
            <span className='text-xs transition-colors duration-300 text-gray-500  group-hover:text-gray-500'>
              {unitLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Click indicator */}
      <div className='absolute inset-0 transition-all duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-zatobox-500/20'></div>
    </div>
  );
};

export default ProductCard;
