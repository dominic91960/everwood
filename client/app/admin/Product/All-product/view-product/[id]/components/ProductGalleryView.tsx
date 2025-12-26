import React from 'react'
import { Product } from '@/lib/api/productApi'

interface ProductGalleryViewProps {
  product: Product
}

const ProductGalleryView: React.FC<ProductGalleryViewProps> = ({ product }) => {
  return (
    <div>
      <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
        Product Gallery
      </label>
      <div className="border border-[#172D6D] rounded-lg p-4 bg-black/20">
        {product.productImages && product.productImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.productImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-[#172D6D]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/sample-img.jpg'; // Fallback image
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No images available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductGalleryView
