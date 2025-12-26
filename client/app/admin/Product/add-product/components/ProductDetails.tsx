"use client";

import React, { useState } from 'react'
import ProductGallery from './ProductGallery'

interface ProductDetailsProps {
  onProductDataChange: (data: {
    title: string;
    shortDescription: string;
    description: string;
    price: string;
    discountPrice: string;
    quantity: string;
    isFeatured: boolean;
  }) => void;
  onFilesChange?: (files: Array<{
    id: string;
    file: File; // Store the actual File object
    name: string;
    size: number;
    type: string;
    lastModified: number;
  }>) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ onProductDataChange, onFilesChange }) => {
  const [productData, setProductData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    price: '',
    discountPrice: '',
    quantity: '',
    isFeatured: false
  });
  
  const [priceError, setPriceError] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    const newData = { ...productData, [field]: value };
    
    // Validate price vs discount price
    if (field === 'price' || field === 'discountPrice') {
      const priceStr = field === 'price' ? value as string : newData.price;
      const discountPriceStr = field === 'discountPrice' ? value as string : newData.discountPrice;
      
      console.log('Price validation debug:', {
        field,
        priceStr,
        discountPriceStr,
        value
      });
      
      // Only validate if both prices are provided and are valid numbers
      if (priceStr && discountPriceStr && priceStr.trim() !== '' && discountPriceStr.trim() !== '') {
        const price = parseFloat(priceStr);
        const discountPrice = parseFloat(discountPriceStr);
        
        console.log('Parsed prices:', { price, discountPrice });
        
        if (!isNaN(price) && !isNaN(discountPrice) && discountPrice >= price) {
          console.log('Setting price error: discount >= price');
          setPriceError('Discount price must be less than regular price');
        } else {
          console.log('Clearing price error');
          setPriceError('');
        }
      } else {
        console.log('Clearing price error - missing values');
        setPriceError('');
      }
    }
    
    setProductData(newData);
    onProductDataChange(newData);
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px]  mb-2">
          Product Title
        </label>
        <input
          type="text"
          value={productData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter product title"
          className="w-full px-4 py-3  rounded-lg border border-[#172D6D]  text-white text-sm bg-black/30 backdrop-blur-[500px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Product Short Description */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Short Description
        </label>
        <textarea
          rows={3}
          value={productData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          placeholder="Enter short description"
          className="w-full px-4 py-3 b rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none bg-black/30 backdrop-blur-[500px]"
        />
      </div>

      {/* Product Description */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Description
        </label>
        <textarea
          rows={6}
          value={productData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter detailed description"
          className="w-full px-4 py-3  rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none bg-black/30 backdrop-blur-[500px]"
        />
      </div>

      {/* Product Gallery */}
      <ProductGallery onFilesChange={onFilesChange} />

      {/* Price Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
            Price
          </label>
          <input
            type="number"
            value={productData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-3  rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 backdrop-blur-[500px]"
          />
        </div>
        <div>
          <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
            Discount Price
          </label>
          <input
            type="number"
            value={productData.discountPrice}
            onChange={(e) => handleInputChange('discountPrice', e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 backdrop-blur-[500px] ${
              priceError ? 'border-red-500 focus:ring-red-500' : 'border-[#172D6D] focus:ring-blue-500'
            }`}
          />
          {priceError && (
            <p className="text-red-400 text-sm mt-1">{priceError}</p>
          )}
        </div>
        <div>
          <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={productData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="0"
            step="1"
            min="0"
            className="w-full px-4 py-3  rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 backdrop-blur-[500px]"
          />
        </div>
      </div>

      {/* Feature Product Checkbox */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={productData.isFeatured}
            onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-transparent border-2 border-[#172D6D] rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-white text-[17px] font-medium">Feature product</span>
        </label>
      </div>
    </div>
  )
}

export default ProductDetails 