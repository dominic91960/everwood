"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { toast } from "sonner";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

interface ProductGalleryProps {
  label?: string;
  allRetainedImages: string[];
  retainedProductImagesData: string[];
  newProductImagesData: File[];
  onNewProductImagesChange: (newProductImagesData: File[]) => void;
  onRetainedProductImagesChange: (images: string[]) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  label = "Product Images",
  allRetainedImages,
  retainedProductImagesData,
  newProductImagesData,
  onNewProductImagesChange,
  onRetainedProductImagesChange,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const incomingFiles = Array.from(files);
    const totalArrLength =
      retainedProductImagesData.length +
      newProductImagesData.length +
      incomingFiles.length;
    let error = false;

    if (totalArrLength > MAX_FILES) {
      error = true;
      toast.error(`Cannot exceed ${MAX_FILES} image files`);
      return;
    }

    incomingFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        error = true;
        toast.error(`"${file.type.toLowerCase()}" files are not allowed`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        error = true;
        toast.error(`"${file.name}" exceeds the 2MB size limit`);
        return;
      }
    });

    if (!error)
      onNewProductImagesChange([...newProductImagesData, ...incomingFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = newProductImagesData.filter(
      (file) => file.name !== fileId
    );
    onNewProductImagesChange(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl space-y-4 border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6",
        label !== "Base Images" && "mt-6"
      )}
    >
      <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
        {label}
      </label>

      {allRetainedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">
            Existing Images ({allRetainedImages.length})
          </h4>
          <div className="max-h-48 overflow-y-auto grid grid-cols-4 gap-2">
            {allRetainedImages.map((image, i) => (
              <label
                key={`${image}-${i}`}
                className=" text-white relative grow rounded p-1 border border-black/30 aspect-square flex cursor-pointer hover:brightness-125 transition-all duration-300"
              >
                <div className="relative aspect-square">
                  <Image src={image} alt="" className="object-contain" fill />
                  <input
                    type="checkbox"
                    checked={retainedProductImagesData.includes(image)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const images = checked
                        ? [...retainedProductImagesData, image]
                        : retainedProductImagesData.filter((i) => i !== image);
                      onRetainedProductImagesChange(images);
                    }}
                    className="w-4 h-4 absolute top-1 left-1"
                  />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50/10"
            : "border-[#6E6E6E] hover:border-gray-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileExplorer}
      >
        <div className="space-y-2">
          <div className="text-gray-400">
            <svg
              className="mx-auto h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-gray-100 font-medium">
            Drop files here to select
          </div>
          <div className="text-sm text-gray-200">or click to browse files</div>
          <div className="text-xs text-gray-300 mt-2">
            Supported: JPEG, JPG, PNG (Max: {MAX_FILES} files, 2MB per file)
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {newProductImagesData.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">
            Selected Files ({newProductImagesData.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {newProductImagesData.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="flex items-center justify-between p-3 bg-black/20 border border-[#6E6E6E] rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* File Icon */}
                  <div className="shrink-0 relative p-1 rounded border border-black/30">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt=""
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-200">
                      {formatFileSize(file.size)} •{" "}
                      {formatDate(file.lastModified)}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.name);
                  }}
                  className="shrink-0 ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                  title="Remove file"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Explorer Button */}
      <div className="flex justify-center">
        <button
          onClick={openFileExplorer}
          className="px-4 py-2 bg-[#6E6E6E] text-white rounded-lg hover:bg-[#696969] transition-colors text-sm font-medium"
        >
          Browse Files
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
