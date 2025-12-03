import React, { useState } from 'react';
import Loader from '@/components/ui/Loader';
import { authAPI } from '@/services/api.service';

type Props = {
  imageUrl?: string | null;
  onImageUpdated: (newImageUrl: string | null, updatedUser?: any) => void;
  onError?: (error: string) => void;
};

const AvatarUploader: React.FC<Props> = ({
  imageUrl,
  onImageUpdated,
  onError,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onError?.('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const res = await authAPI.uploadProfileImage(file);
      if (res.success && res.user && res.user.profile_image) {
        onImageUpdated(res.user.profile_image, res.user);
      } else if (res.success) {
        onImageUpdated(null, res.user);
      } else {
        onError?.('Upload failed');
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!imageUrl) return;
    setUploading(true);
    try {
      const res = await authAPI.deleteProfileImage();
      if (res.success) {
        onImageUpdated(null, res.user);
      } else {
        onError?.('Delete failed');
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {uploading && <Loader fullScreen />}
      <div className="flex items-center space-x-4">
        <div className="relative group">
          <div className="flex items-center justify-center w-32 h-32 rounded-full bg-orange-100 border border-orange-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="object-cover w-32 h-32 rounded-full"
              />
            ) : (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-orange-400"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>

          {!uploading && (
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-orange-300 rounded-full cursor-pointer flex items-center justify-center hover:bg-orange-50 transition-colors shadow-sm">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-orange-500"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </label>
          )}
        </div>
      </div>
    </>
  );
};

export default AvatarUploader;
