"use client";

import React, { useState, useEffect } from "react";
import ProductGallery from "./ProductGallery";

interface ProductDetailsProps {
  initialData: {
    type: "simple" | "variable";
    sku: string;
    title: string;
    shortDescription: string;
    description: string;
    price: string;
    discountPrice: string;
    quantity: string;
    isFeatured: boolean;
  };
  onProductDataChange: (data: {
    type: "simple" | "variable";
    sku: string;
    title: string;
    shortDescription: string;
    description: string;
    price: string;
    discountPrice: string;
    quantity: string;
    isFeatured: boolean;
  }) => void;
  onFilesChange: (
    files: Array<{
      id: string;
      file: File;
      name: string;
      size: number;
      type: string;
      lastModified: number;
    }>
  ) => void;
  existingImages?: string[];
}

const ProductDetails = ({
  initialData,
  onProductDataChange,
  onFilesChange,
  existingImages = [],
}: ProductDetailsProps) => {
  const [formData, setFormData] = useState(initialData);
  const [priceError, setPriceError] = useState("");

  // Update local state when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    const newData = { ...formData, [field]: value };

    // Validate price vs discount price
    if (field === "price" || field === "discountPrice") {
      const price = parseFloat(
        field === "price" ? (value as string) : newData.price
      );
      const discountPrice = parseFloat(
        field === "discountPrice" ? (value as string) : newData.discountPrice
      );

      if (price && discountPrice && discountPrice >= price) {
        setPriceError("Discount price must be less than regular price");
        return;
      } else {
        setPriceError("");
      }
    }

    setFormData(newData);
    onProductDataChange(newData);
  };

  return (
    <div className="space-y-6">
      {/* Product Type */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange("type", e.target.value)}
          className="w-full px-3 py-3 rounded-lg border border-[#6E6E6E]  focus:outline-none  focus:ring-blue-500 focus:border-[#6E6E6E] text-white placeholder:text-sm text-sm  bg-black/30 backdrop-blur-[500px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="simple">Simple</option>
          <option value="variable">Variable</option>
        </select>
      </div>

      {/* Product SKU */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product SKU
        </label>
        <input
          type="text"
          value={formData.sku}
          onChange={(e) => handleInputChange("sku", e.target.value)}
          placeholder="Enter product SKU"
          className="w-full px-4 py-3  rounded-lg border border-[#6E6E6E] text-white text-sm bg-black/30 backdrop-blur-[500px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Product Title */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] bg-black/30 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter product title"
        />
      </div>

      {/* Product Short Description */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Short Description
        </label>
        <textarea
          rows={3}
          value={formData.shortDescription}
          onChange={(e) =>
            handleInputChange("shortDescription", e.target.value)
          }
          className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none"
          placeholder="Enter short description"
        />
      </div>

      {/* Product Description */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Description
        </label>
        <textarea
          rows={6}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none"
          placeholder="Enter detailed description"
        />
      </div>

      {/* Product Gallery */}
      <ProductGallery
        onFilesChange={onFilesChange}
        existingImages={existingImages}
      />

      {/* Price Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Discount Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.discountPrice}
            onChange={(e) => handleInputChange("discountPrice", e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 ${
              priceError
                ? "border-red-500 focus:ring-red-500"
                : "border-[#6E6E6E] focus:ring-blue-500"
            }`}
            placeholder="0.00"
          />
          {priceError && (
            <p className="text-red-400 text-sm mt-1">{priceError}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Quantity
          </label>
          <input
            type="number"
            step="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
            placeholder="0"
          />
        </div>
      </div>

      {/* Feature Product Checkbox */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => handleInputChange("isFeatured", e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-transparent border-2 border-[#6E6E6E] rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-white text-[17px] font-medium">
            Feature product
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProductDetails;
