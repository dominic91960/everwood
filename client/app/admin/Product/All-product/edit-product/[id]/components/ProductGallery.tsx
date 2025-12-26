"use client";

import React, { useState, useRef } from 'react'

interface ProductGalleryProps {
  onFilesChange: (files: Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>) => void;
  existingImages?: string[];
}

const ProductGallery = ({ onFilesChange, existingImages = [] }: ProductGalleryProps) => {
  const [selectedFiles, setSelectedFiles] = useState<Array<{
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter(file => file.id !== fileId);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div>
      <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
        Product Gallery
      </label>
      
      {/* Existing Images */}
      {existingImages.length > 0 ? (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Current Images:</h4>
          <div className="grid grid-cols-4 gap-2">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-[#172D6D]"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            These images will be preserved when updating the product.
          </p>
        </div>
      ) : (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <p className="text-xs text-yellow-400">
            ⚠️ This product currently has no images. At least one image is required to update the product.
          </p>
        </div>
      )}

      {/* File Upload Area */}
      <div 
        className="border-2 border-dashed rounded-lg border-[#172D6D] p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <div className="space-y-2">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-gray-400 font-medium">
            Drop files here to upload
          </div>
          <div className="text-sm text-gray-500">
            or click to browse
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-white mb-2">New Images:</h4>
          <div className="grid grid-cols-4 gap-2">
            {selectedFiles.map((file) => (
              <div key={file.id} className="relative">
                <img
                  src={URL.createObjectURL(file.file)}
                  alt={file.name}
                  className="w-full h-20 object-cover rounded-lg border border-[#172D6D]"
                />
                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductGallery 