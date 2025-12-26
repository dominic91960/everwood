import React from 'react'

const ProductGallery = () => {
  // Mock product images - in real app this would come from API
  const productImages = [
    '/images/sample-img.jpg',
    '/images/sample-img.jpg',
    '/images/sample-img.jpg',
    '/images/sample-img.jpg'
  ];

  return (
    <div>
      <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
        Product Gallery
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-[#172D6D]"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                View Image
              </span>
            </div>
          </div>
        ))}
      </div>
      {productImages.length === 0 && (
        <div className="border-2 border-dashed rounded-lg border-[#172D6D] p-8 text-center">
          <div className="space-y-2">
            <div className="text-gray-400">
              <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-gray-400 font-medium">
              No images available
            </div>
            <div className="text-sm text-gray-500">
              This product has no gallery images
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductGallery 