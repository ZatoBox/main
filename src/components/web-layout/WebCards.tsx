import React, { useState } from 'react';
import { Package } from 'lucide-react';
import WebButton from '@/components/web-layout/WebButton';
import { useRouter } from 'next/navigation';

interface WebCardsProps {
  productId: string;
  storeSlug: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  onBuyClick: () => void;
}

const WebCards: React.FC<WebCardsProps> = ({
  productId,
  storeSlug,
  title,
  description,
  price,
  image,
  stock,
  onBuyClick,
}) => {
  const router = useRouter();
  const [isInShoppingList] = useState(false);
  const [isSharedLink] = useState(false);
  const unitPrice = typeof price === 'number' && isFinite(price) ? price : 0;
  const unitStock = typeof stock === 'number' && isFinite(stock) ? stock : 0;

  const handleShoppingListClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
  };

  const handleBuyClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onBuyClick();
  };

  const handleCardClick = () => {
    router.push(`/link/${storeSlug}/product-detail/${productId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center relative group">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400">
            <Package className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2 transition-opacity duration-200">
          <WebButton
            className="bg-zatobox-50"
            onClick={(e) => handleShoppingListClick(e)}
            variant={isInShoppingList ? 'shoppinglist-active' : 'shoppinglist'}
            size="sm"
          />
          <WebButton
            className="bg-zatobox-50"
            variant={isSharedLink ? 'shareProduct-active' : 'shareProduct'}
            productId={productId}
            size="sm"
          ></WebButton>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{title}</h3>
        <div className="flex-grow mb-4">
          {description && (
            <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
          )}
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-zatobox-600">
            ${unitPrice.toFixed(2)}
          </span>
          <div className="text-sm text-gray-500">Stock: {unitStock}</div>
        </div>
        <WebButton
          variant={unitStock === 0 ? 'buy-disabled' : 'buy'}
          onClick={handleBuyClick}
          size="md"
          className="w-full mt-auto justify-center"
        >
          {unitStock === 0 ? 'Out of stock' : 'Buy'}
        </WebButton>
      </div>
    </div>
  );
};

export default WebCards;
