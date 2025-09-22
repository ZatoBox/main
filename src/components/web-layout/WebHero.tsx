import React from 'react';
import WebButton from './WebButton';

interface WebHeroProps {
  title: string;
  description?: string;
  isOwner?: boolean;
}

const WebHero: React.FC<WebHeroProps> = ({
  title,
  description,
  isOwner = false,
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center">
        <div className="absolute top-4 right-4 flex gap-2">
          <WebButton variant="shareStoreHeader" size="sm"></WebButton>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
    </header>
  );
};

export default WebHero;
