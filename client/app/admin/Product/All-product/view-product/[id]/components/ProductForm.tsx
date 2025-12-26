import React from 'react'
import ProductDetails from './ProductDetails'
import PublishingMetadata from './PublishingMetadata'
import Attributes from './Attributes'

const ProductForm = () => {
  return (
    <div className="min-h-screen  text-white ">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-bold sm:text-[24px] md:text-[26px] lg:text-[28px] xl:text-[30px] text-[#E5E5E5]">
            Products
          </h1>
          <span className="text-[17px] text-[#E5E5E5] font-semibold sm:text-[18px] md:text-[19px] lg:text-[20px] xl:text-[20px] mt-2">
            Edit products
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl border border-[#172D6D] bg-black/30 backdrop-blur-[500px] p-6">
              <ProductDetails />
            </div>
            <div className='mt-6'>
              <Attributes />
            </div>
          </div>

          {/* Right Column - Publishing & Metadata */}
          <div className="lg:col-span-2 space-y-6">

            <PublishingMetadata />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductForm 