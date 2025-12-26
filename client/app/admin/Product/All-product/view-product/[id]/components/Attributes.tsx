import React from 'react'
import { Product } from '@/lib/api/productApi'

interface AttributesProps {
  product: Product
}

const Attributes: React.FC<AttributesProps> = ({ product }) => {
  return (
    <div>
      <h3 className="text-white text-[24px] font-semibold mb-6 break-words">Attributes</h3>
      <div className="rounded-3xl border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-6 overflow-hidden">
        <div className="space-y-6">
          {product.attributes && product.attributes.length > 0 ? (
            product.attributes.map((attr, index) => (
              <div key={attr.attribute._id}>
                <label className="block text-white text-sm font-medium mb-2">
                  {attr.attribute.name}
                </label>
                
                {/* Display selected variations as tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {attr.selectedVariations.length > 0 ? (
                    attr.selectedVariations.map((variation, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                      >
                        {variation}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No variations selected</span>
                  )}
                </div>

                {/* Show all available variations for reference */}
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-[#172D6D] bg-black/30 text-white appearance-none focus:outline-none focus:border-[#3B82F6] transition-colors"
                    disabled
                    value=""
                  >
                    <option value="">Available {attr.attribute.name} options</option>
                    {attr.attribute.variations.map((variation) => (
                      <option key={variation} value={variation}>
                        {variation}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>No attributes configured for this product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Attributes 