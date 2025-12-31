import React from "react";
import { IUpdateSimpleProductPayload } from "@/types/product";

interface SimpleProductDetailsProps {
  productData: IUpdateSimpleProductPayload;
  onProductDataChange: (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
}

const SimpleProductDetails: React.FC<SimpleProductDetailsProps> = ({
  productData,
  onProductDataChange,
}) => {
  return (
    <div className="relative rounded-3xl border border-[#6E6E6E] bg-[#4A4A4A] backdrop-blur-[500px] p-6 space-y-6">
      <div>
        <label
          htmlFor="product-sku"
          className="block  font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          SKU
        </label>
        <input
          id="product-sku"
          name="sku"
          type="text"
          value={productData.sku}
          onChange={onProductDataChange}
          className="w-full px-4 py-3  rounded-lg border border-[#6E6E6E] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 backdrop-blur-[500px]"
        />
      </div>

      <div>
        <label
          htmlFor="product-price"
          className="block  font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Price
        </label>
        <input
          id="product-price"
          name="price"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={productData.price}
          onChange={onProductDataChange}
          className="w-full px-4 py-3  rounded-lg border border-[#6E6E6E] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 backdrop-blur-[500px]"
        />
      </div>

      <div>
        <label
          htmlFor="product-discount-price"
          className="block  font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Discount Price
        </label>
        <input
          id="product-discount-price"
          name="discountPrice"
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={productData.discountPrice}
          onChange={onProductDataChange}
          className="w-full px-4 py-3  rounded-lg border border-[#6E6E6E] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 backdrop-blur-[500px]"
        />
      </div>

      <div>
        <label
          htmlFor="product-quantity"
          className="block  font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Quantity
        </label>
        <input
          id="product-quantity"
          name="quantity"
          type="number"
          placeholder="0"
          step="1"
          min="0"
          value={productData.quantity}
          onChange={onProductDataChange}
          className="w-full px-4 py-3  rounded-lg border border-[#6E6E6E] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm bg-black/30 backdrop-blur-[500px]"
        />
      </div>
    </div>
  );
};

export default SimpleProductDetails;
