import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-[688px] h-[688px] rounded-[20px] bg-gray-200 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-[688px] h-[688px] rounded-[20px] overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={images[selectedImageIndex]}
          alt={productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('div');
              fallback.className =
                'w-full h-full bg-gray-200 flex items-center justify-center';
              fallback.textContent = 'No image available';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
      {images.length > 1 && (
        <div className="flex space-x-2 px-0 py-6">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${productName} - ${index + 1}`}
              onClick={() => setSelectedImageIndex(index)}
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.src = '';
                t.style.objectFit = 'contain';
              }}
              className={`w-20 h-20 object-contain rounded border cursor-pointer ${
                selectedImageIndex === index
                  ? 'border-zatobox-400 border-2'
                  : 'border-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
