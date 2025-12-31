import React from "react";
import { TProduct } from "@/types/product";

interface PublishingMetadataViewProps {
  product: TProduct;
}

const PublishingMetadataView: React.FC<PublishingMetadataViewProps> = ({
  product,
}) => {
  return (
    <div className="space-y-4">
      {/* Publish Section */}
      <div className="p-4 rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px]">
        <h3 className="font-medium text-[#FFFFFF] text-[17px] mb-4">Publish</h3>
        <div className="space-y-4">
          <div>
            <select
              className="w-full px-3 py-3 rounded-lg border border-[#6E6E6E] focus:outline-none focus:ring-blue-500 focus:border-[#6E6E6E] text-white placeholder:text-sm text-sm bg-black/30 backdrop-blur-[500px]"
              disabled
              value={
                product.status
                  ? product.status.charAt(0).toUpperCase() +
                    product.status.slice(1)
                  : "Draft"
              }
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">Category</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-lg font-medium text-white mb-3">
              Product Categories
            </h4>
            <div className="border border-[#6E6E6E] p-4 rounded-lg bg-black/20">
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-2">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map((category) => (
                      <div key={category._id} className="flex items-center">
                        <div className="w-4 h-4 bg-white rounded flex items-center justify-center mr-2">
                          <span className="text-black text-xs">✓</span>
                        </div>
                        <span className="text-sm text-white">
                          {category.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No categories assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info Section */}
      {/* <div className="border border-[#6E6E6E] bg-black/30 backdrop-blur-[500px] p-4 rounded-3xl">
        <h3 className="text-lg font-medium text-white mb-4">Product Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Product ID
            </label>
            <input
              type="text"
              value={product._id}
              className="w-full px-3 py-2 text-sm border border-[#6E6E6E] rounded-lg text-white bg-black/20"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Created At
            </label>
            <input
              type="text"
              value={new Date(product.createdAt).toLocaleDateString()}
              className="w-full px-3 py-2 text-sm border border-[#6E6E6E] rounded-lg text-white bg-black/20"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
              Last Updated
            </label>
            <input
              type="text"
              value={new Date(product.updatedAt).toLocaleDateString()}
              className="w-full px-3 py-2 text-sm border border-[#6E6E6E] rounded-lg text-white bg-black/20"
              readOnly
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PublishingMetadataView;
