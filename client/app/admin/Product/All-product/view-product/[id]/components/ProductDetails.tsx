import React from 'react'
import ProductGallery from './ProductGallery'


const ProductDetails = () => {
  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px]  mb-2">
          Product Title
        </label>
        <input
          type="text"
          className="w-full px-4 py-3  rounded-lg border border-[#172D6D]  text-white text-sm"
          readOnly
        />
      </div>

      {/* Product Short Description */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Short Description
        </label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 b rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none"
          readOnly
        />
      </div>

      {/* Product Description */}
      <div>
        <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Description
        </label>
        <textarea
          rows={6}
          className="w-full px-4 py-3  rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none"
          readOnly
        />
      </div>

      {/* Product Gallery */}
      <ProductGallery />

      {/* Price Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
            Price
          </label>
          <input

            className="w-full px-4 py-3  rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
            readOnly
          />
        </div>
        <div>
          <label className="block  font-medium text-[#FFFFFF] text-[17px] mb-2">
            Discount Price
          </label>
          <input

            className="w-full px-4 py-3  rounded-lg border border-[#172D6D] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
            readOnly
          />
        </div>
      </div>

    
    </div>
  )
}

export default ProductDetails 