"use client";

import React from "react";

import { IBaseProductPayload } from "@/types/product";
import { IProductCategory } from "@/types/product-category";

interface IProductDetails extends IBaseProductPayload {
  type: "simple" | "variable";
}

interface ProductDetailsProps {
  categoryData: IProductCategory[];
  productData: IProductDetails;
  onProductDataChange: (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
}

const BaseProductDetails: React.FC<ProductDetailsProps> = ({
  categoryData,
  productData,
  onProductDataChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Product Type */}
      <div>
        <label
          htmlFor="product-type"
          className="block font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Product Type
        </label>
        <select
          id="product-type"
          name="type"
          value={productData.type}
          className="w-full px-3 py-3 rounded-lg border border-[#6E6E6E]  focus:outline-none  focus:ring-blue-500 focus:border-[#6E6E6E] text-white placeholder:text-sm text-sm  bg-black/30 backdrop-blur-[500px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <option value="simple">Simple</option>
          <option value="variable">Variable</option>
        </select>
      </div>

      {/* Product Title */}
      <div>
        <label
          htmlFor="product-title"
          className="block font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Product Title
        </label>
        <input
          id="product-title"
          name="title"
          type="text"
          value={productData.title}
          onChange={onProductDataChange}
          placeholder="Enter product title"
          className="w-full px-4 py-3  rounded-lg border border-[#6E6E6E] text-white text-sm bg-black/30 backdrop-blur-[500px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Product Short Description */}
      <div>
        <label
          htmlFor="product-small-description"
          className="block font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Product Short Description
        </label>
        <textarea
          id="product-small-description"
          name="smallDescription"
          rows={3}
          value={productData.smallDescription}
          onChange={onProductDataChange}
          placeholder="Enter short description"
          className="w-full px-4 py-3 b rounded-lg border border-[#6E6E6E] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none bg-black/30 backdrop-blur-[500px]"
        />
      </div>

      {/* Product Description */}
      <div>
        <label
          htmlFor="product-description"
          className="block font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Product Description
        </label>
        <textarea
          id="product-description"
          name="description"
          rows={6}
          value={productData.description}
          onChange={onProductDataChange}
          placeholder="Enter detailed description"
          className="w-full px-4 py-3  rounded-lg border border-[#6E6E6E] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm resize-none bg-black/30 backdrop-blur-[500px]"
        />
      </div>

      {/* Product Categories */}
      <div>
        <p className="font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Categories
        </p>
        {categoryData.map((category) => (
          <div key={category._id} className="flex items-center">
            <input
              type="checkbox"
              id={`category-${category._id}`}
              name={`category-${category._id}`}
              checked={productData.categories.includes(category._id)}
              onChange={onProductDataChange}
              className="w-4 h-4 text-white bg-transparent border border-white rounded focus:ring-white focus:ring-1 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:text-black checked:after:absolute checked:after:text-xs checked:after:font-bold checked:after:leading-none checked:after:top-0.5 checked:after:left-0.5 relative disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label
              htmlFor={`category-${category._id}`}
              className="ml-2 text-sm text-white cursor-pointer w-fit select-none"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="product-publish-status"
          className="block font-medium text-[#FFFFFF] text-[17px] mb-2"
        >
          Publish Status
        </label>
        <select
          id="product-publish-status"
          name="status"
          value={productData.status}
          onChange={onProductDataChange}
          className="w-full px-3 py-3 rounded-lg border border-[#6E6E6E]  focus:outline-none  focus:ring-blue-500 focus:border-[#6E6E6E] text-white placeholder:text-sm text-sm  bg-black/30 backdrop-blur-[500px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Feature Product Checkbox */}
      <div className="flex items-center gap-2">
        <input
          id="is-product-featured"
          name="isFeatured"
          type="checkbox"
          checked={productData.isFeatured}
          onChange={onProductDataChange}
          className="w-5 h-5 text-neutral-700 bg-transparent border-2 border-[#6E6E6E] rounded focus:ring-blue-500 focus:ring-2"
        />
        <label
          htmlFor="is-product-featured"
          className="font-medium text-[#FFFFFF] text-[17px] w-fit select-none cursor-pointer"
        >
          Featured product
        </label>
      </div>
    </div>
  );
};

export default BaseProductDetails;
