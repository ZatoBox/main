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
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div>
      <img
        src={images[selectedImageIndex]}
        alt={productName}
        className="w-full h-96 rounded-lg"
      />
      {images.length > 1 && (
        <div className="flex space-x-2 px-0 py-6">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${productName} - ${index + 1}`}
              onClick={() => setSelectedImageIndex(index)}
              className={`w/20 h-20 object-contain rounded border cursor-pointer ${
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
