import React from "react";
import { TProduct } from "@/types/product";

interface AttributesViewProps {
  product: TProduct;
}

const AttributesView: React.FC<AttributesViewProps> = ({ product }) => {
  return (
    <div className="rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6 overflow-hidden mt-6">
      <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
        Attributes
      </label>
      <div className="space-y-6">
        {product.type === "simple" &&
        product.attributes &&
        product.attributes.length > 0 ? (
          product.attributes.map((attr) => (
            <div key={attr.attribute._id}>
              <label className="block text-white text-sm font-medium mb-1">
                {attr.attribute.name}
              </label>

              {/* Display selected variations as tags */}
              <div className="mb-4">
                {attr.selectedVariations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {attr.selectedVariations.map((variation, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                      >
                        {variation}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    <p>No variations selected for this attribute</p>
                  </div>
                )}
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
  );
};

export default AttributesView;
