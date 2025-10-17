import React from 'react';
import { Package, Boxes } from 'lucide-react';
import WebButton from '@/components/web-layout/WebButton';

interface ProductInfoProps {
  productName: string;
  price: number;
  stock: number;
  description?: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productName,
  price,
  description,
  stock,
}) => {
  const getStockColor = () => {
    if (stock === 0) return 'text-red-500';
    return 'text-green-500';
  };

  const getStockText = () => {
    if (stock === 0) return 'Out of stock';
    return `${stock} In stock`;
  };

  return (
    <div>
      <h1 className={'text-2xl font-semibold'}>{productName}</h1>
      <p className={'text-2xl font-semibold py-4'}>${price}</p>
      <p className="text-[#475569]">{description}</p>
      <div className={'flex items-center gap-2 py-4'}>
        {stock > 10 ? (
          <Boxes className={`w-5 h-5 ${getStockColor()}`} />
        ) : (
          <Package className={`w-5 h-5 ${getStockColor()}`} />
        )}
        <span className={`${getStockColor()}`}>{getStockText()}</span>
      </div>
      <WebButton
        variant={'buy'}
        size="lg"
        className={'w-full mt-4 justify-center'}
      >
        Buy with <span className="font-bold">ZatoConnect</span>
        <span className="bg-white text-[#F88612] px-2 py-1 rounded ml-1 text-sm">
          Pay
        </span>
      </WebButton>
    </div>
  );
};

export default ProductInfo;
