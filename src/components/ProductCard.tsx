import React, { useState, useRef, useEffect } from 'react';
import { Package, Archive, Repeat } from 'lucide-react';
import { Product } from '@/types/index';
import { PolarProduct } from '@/types/polar';

interface ProductCardProps {
  product: Product | PolarProduct;
  onClick: (product: Product | PolarProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isPolarProduct = (p: any): p is PolarProduct => {
    return 'medias' in p && 'organization_id' in p;
  };

  const getImageUrls = () => {
    if (isPolarProduct(product)) {
      return (
        product.medias
          ?.filter(
            (media) => media.mime_type.startsWith('image/') && media.public_url
          )
          .map((media) => media.public_url) || []
      );
    } else {
      if (
        !product.images ||
        !Array.isArray(product.images) ||
        product.images.length === 0
      )
        return [];
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4444';
      return product.images
        .filter((v) => typeof v === 'string' && v.trim() !== '')
        .map((raw) => {
          if (/^(https?:\/\/|data:|blob:)/i.test(raw)) return raw;
          if (/^\/\//.test(raw)) return `https:${raw}`;
          return `${apiBase.replace(/\/$/, '')}${
            raw.startsWith('/') ? '' : '/'
          }${raw}`;
        });
    }
  };

  const getProductInfo = () => {
    if (isPolarProduct(product)) {
      const primaryPrice = product.prices?.[0];
      const formattedPrice = primaryPrice
        ? `${primaryPrice.price_amount / 100} ${primaryPrice.price_currency}`
        : 'Free';

      const stock = product.metadata?.quantity || 0;
      const category = product.metadata?.category || null;
      const categoryNames = category ? [category] : [];

      return {
        name: product.name,
        description: product.description,
        price: formattedPrice,
        unit: primaryPrice?.recurring_interval
          ? `per ${primaryPrice.recurring_interval}`
          : 'one-time',
        stock: stock,
        sku: product.id.slice(-8),
        categoryNames,
        isArchived: product.is_archived,
        isRecurring: product.is_recurring,
        recurringInterval: product.recurring_interval,
      };
    } else {
      const unitLabel = (product as any).unit_name ?? 'per unit';
      return {
        name: product.name,
        description: product.description,
        price: `$${product.price.toFixed(2)}`,
        unit: unitLabel,
        stock: product.stock,
        sku: product.sku,
        categoryNames:
          (product as any).category_names || product.category_ids || [],
        isArchived: false,
        isRecurring: false,
        recurringInterval: null,
      };
    }
  };

  const images = getImageUrls();
  const fallbackImg = '/images/placeholder-product.png';
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const productInfo = getProductInfo();

  const startSlide = () => {
    if (images.length <= 1) return;
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);
  };

  const stopSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIndex(0);
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    []
  );

  return (
    <div
      onClick={() => onClick(product)}
      onMouseEnter={startSlide}
      onMouseLeave={stopSlide}
      className="relative overflow-hidden transition-all duration-300 ease-in-out transform bg-white border rounded-lg cursor-pointer group border-gray-300 hover:scale-105 hover:shadow-lg hover:border-gray-300 animate-fade-in"
    >
      <div className="absolute z-10 top-3 right-3 flex gap-2">
        {productInfo.isArchived && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Archive className="w-3 h-3 mr-1" />
            Archived
          </span>
        )}
        {productInfo.isRecurring && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Repeat className="w-3 h-3 mr-1" />
            {productInfo.recurringInterval}
          </span>
        )}
        {productInfo.stock !== null && (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 bg-[#FEF3C7] ${
              productInfo.stock > 10
                ? 'text-success-800'
                : productInfo.stock > 0
                ? 'text-warning-800'
                : 'text-error-800'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-1 transition-all duration-300 ${
                productInfo.stock > 10
                  ? 'bg-[#10B981]'
                  : productInfo.stock > 0
                  ? 'bg-[#f0ad4e]'
                  : 'bg-[#d9534f]'
              }`}
            ></div>
            {productInfo.stock} in stock
          </span>
        )}
      </div>

      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
        {images.length > 0 ? (
          <div className="w-full h-full overflow-hidden">
            <div
              className="flex w-full h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {images.map((src, i) => (
                <div key={i} className="w-full h-48 shrink-0 relative">
                  <img
                    src={src || fallbackImg}
                    alt={productInfo.name}
                    loading="lazy"
                    draggable={false}
                    className="object-cover w-full h-full select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImg;
                    }}
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-400">
              <Package className="w-16 h-16" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 transition-all duration-300 bg-black/0 group-hover:bg-black/10" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          {Array.isArray(productInfo.categoryNames) &&
          productInfo.categoryNames.length > 0 ? (
            <span className="text-xs font-medium tracking-wide uppercase transition-colors duration-300 text-zatobox-900 group-hover:text-zatobox-900">
              {productInfo.categoryNames.join(', ')}
            </span>
          ) : (
            <span className="text-xs font-medium tracking-wide uppercase transition-colors duration-300 text-zatobox-900 group-hover:text-zatobox-900">
              Product
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold transition-colors duration-300 text-black/75 group-hover:text-black line-clamp-2">
          {productInfo.name}
        </h3>

        {productInfo.description && (
          <p className="text-sm transition-colors duration-300 text-gray-500 line-clamp-2 group-hover:text-gray-500">
            {productInfo.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold transition-colors duration-300 text-black group-hover:text-zatobox-500">
              {productInfo.price}
            </span>
            <span className="text-xs transition-colors duration-300 text-gray-500 group-hover:text-gray-500">
              {productInfo.unit}
            </span>
          </div>

          {images.length > 0 && (
            <div className="text-right">
              <span className="text-xs text-gray-500">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 transition-all duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-zatobox-500/20"></div>
    </div>
  );
};

export default ProductCard;
