import React from 'react'
import { Product } from '@/lib/api/productApi'
import ProductGalleryView from './ProductGalleryView'

interface ProductDetailsViewProps {
  product: Product
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Title
        </label>
        <input
          type="text"
          value={product.title}
          className="w-full px-4 py-3 rounded-lg border border-[#172D6D] text-white text-sm bg-black/20"
          readOnly
        />
      </div>

      {/* Product Short Description */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Short Description
        </label>
        <textarea
          rows={3}
          value={product.smallDescription}
          className="w-full px-4 py-3 rounded-lg border border-[#172D6D] text-white placeholder-gray-400 text-sm resize-none bg-black/20"
          readOnly
        />
      </div>

      {/* Product Description */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Description
        </label>
        <textarea
          rows={6}
          value={product.description}
          className="w-full px-4 py-3 rounded-lg border border-[#172D6D] text-white placeholder-gray-400 text-sm resize-none bg-black/20"
          readOnly
        />
      </div>

      {/* Product Gallery */}
      <ProductGalleryView product={product} />

      {/* Price Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Price
          </label>
          <input
            type="number"
            value={product.price}
            className="w-full px-4 py-3 rounded-lg border border-[#172D6D] text-white placeholder-gray-400 text-sm bg-black/20"
            readOnly
          />
        </div>
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Discount Price
          </label>
          <input
            type="number"
            value={product.discountPrice || ''}
            className="w-full px-4 py-3 rounded-lg border border-[#172D6D] text-white placeholder-gray-400 text-sm bg-black/20"
            readOnly
          />
        </div>
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Quantity
          </label>
          <input
            value={product.quantity || 0}
            className="w-full px-4 py-3 rounded-lg border border-[#172D6D] text-white placeholder-gray-400 text-sm bg-black/20"
            readOnly
          />
        </div>
      </div>

      {/* Feature Product Display */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Feature Product
        </label>
        <div className="flex items-center space-x-3">
          <div className={`w-5 h-5 rounded border-2 border-[#172D6D] flex items-center justify-center ${
            product.isFeatured ? 'bg-white' : 'bg-transparent'
          }`}>
            {product.isFeatured && (
              <span className="text-black text-xs font-bold">✓</span>
            )}
          </div>
          <span className="text-white text-[17px] font-medium">
            {product.isFeatured ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsView
