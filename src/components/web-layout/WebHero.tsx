import React, { useRef, useState } from 'react';
import WebButton from './WebButton';
import { layoutAPI } from '@/services/api.service';

interface WebHeroProps {
  title: string;
  description?: string;
  isOwner?: boolean;
  layoutSlug?: string;
  bannerUrl?: string;
  onBannerUpdated?: (bannerUrl: string) => void;
}

const WebHero: React.FC<WebHeroProps> = ({
  title,
  description,
  isOwner = false,
  layoutSlug,
  bannerUrl,
  onBannerUpdated,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return 'File size exceeds 5MB limit';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only jpg, jpeg, png, webp allowed';
    }

    return null;
  };

  const handleEditBanner = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !layoutSlug) return;

    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(`/api/layouts/${layoutSlug}/banner`, {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Upload failed');
      }

      if (uploadResult.success && uploadResult.banner) {
        onBannerUpdated?.(uploadResult.banner);
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <div
        className="h-[45vh] overflow-hidden"
        style={{
          background: bannerUrl
            ? `url(${bannerUrl}) center/cover no-repeat`
            : 'linear-gradient(to right, #E28E18, #D67B0A)',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-lg md:text-xl opacity-90">{description}</p>
          )}
        </div>
        {isOwner && (
          <div className="absolute top-4 right-4 z-20">
            <WebButton
              variant="secondary"
              size="sm"
              onClick={handleEditBanner}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Edit Banner'}
            </WebButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebHero;
