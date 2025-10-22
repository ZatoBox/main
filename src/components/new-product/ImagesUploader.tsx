'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
  files: File[];
  onAddFiles: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  isUploading?: boolean;
};

export default function ImagesUploader({
  files,
  onAddFiles,
  onRemove,
  isUploading = false,
}: Props) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length)
      onAddFiles(e.dataTransfer.files);
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm bg-[#FFFFFF] border-[#CBD5E1]">
      <label className="block mb-4 text-sm font-medium text-[#000000]">
        Imagenes del Producto
      </label>
      <div
        className={`relative border-2 border-dashed border-[#CBD5E1] rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer ${
          dragActive ? 'border-[#CBD5E1]' : ''
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => onAddFiles(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={files.length >= 4 || isUploading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-[#88888888]"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <p className="mb-2 text-[#88888888]">
            Arrastra y suelta imágenes aquí
          </p>
          <p className="text-sm text-[#88888888]">
            o haz clic para seleccionar archivos
          </p>
        </label>
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 dark:bg-white/90 flex items-center justify-center rounded-lg">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center p-2 text-sm text-gray-800 bg-gray-100 rounded-md"
            >
              <span className="truncate max-w-[160px]">{file.name}</span>
              <button
                onClick={() => onRemove(index)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
