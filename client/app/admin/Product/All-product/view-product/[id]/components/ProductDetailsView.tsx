import React from "react";
import Image from "next/image";

import ProductGalleryView from "./ProductGalleryView";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TProduct } from "@/types/product";

interface ProductDetailsViewProps {
  product: TProduct;
}

const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      {/* Product Type */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Type
        </label>
        <input
          type="text"
          value={product.type}
          className="w-full px-4 py-3 capitalize rounded-lg border border-[#6E6E6E] text-white text-sm bg-black/20"
          readOnly
        />
      </div>

      {/* Product SKU */}
      {product.type === "simple" && (
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Product SKU
          </label>
          <input
            type="text"
            value={product.sku}
            className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] text-white text-sm bg-black/20"
            readOnly
          />
        </div>
      )}

      {/* Product Title */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Product Title
        </label>
        <input
          type="text"
          value={product.title}
          className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] text-white text-sm bg-black/20"
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
          className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] text-white placeholder-gray-400 text-sm resize-none bg-black/20"
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
          className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] text-white placeholder-gray-400 text-sm resize-none bg-black/20"
          readOnly
        />
      </div>

      {product.type === "simple" && (
        <>
          {/* Product Gallery */}
          <ProductGalleryView images={product.productImages} type="simple" />

          {/* Price Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
                Price
              </label>
              <input
                type="number"
                value={product.price}
                className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] text-white placeholder-gray-400 text-sm bg-black/20"
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
                Discount Price
              </label>
              <input
                type="number"
                value={product.discountPrice || ""}
                className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] text-white placeholder-gray-400 text-sm bg-black/20"
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
                Quantity
              </label>
              <input
                value={product.quantity || 0}
                className="w-full px-4 py-3 rounded-lg border border-[#6E6E6E] text-white placeholder-gray-400 text-sm bg-black/20"
                readOnly
              />
            </div>
          </div>
        </>
      )}

      {/* Variable product images */}
      {product.type === "variable" && (
        <ProductGalleryView images={product.baseImages} type="variable" />
      )}

      {/* Variable product variations */}
      {product.type === "variable" && (
        <div>
          <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
            Product Variations
          </label>
          <div className="border border-[#6E6E6E] rounded-lg p-4 bg-black/20">
            {product.variations.length === 0 ? (
              <p className="text-gray-400">No variations available</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[#FFFFFF]">SKU</TableHead>
                    <TableHead className="text-[#FFFFFF]">Attributes</TableHead>
                    <TableHead className="text-[#FFFFFF]">Price</TableHead>
                    <TableHead className="text-[#FFFFFF]">Discount</TableHead>
                    <TableHead className="text-[#FFFFFF]">Quantity</TableHead>
                    <TableHead className="text-[#FFFFFF]">Images</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.variations.map((variation) => (
                    <TableRow key={variation.sku}>
                      <TableCell className="text-white">
                        {variation.sku}
                      </TableCell>
                      <TableCell className="text-white">
                        {variation.attributes
                          .map(
                            ({ attribute, selectedVariation }) =>
                              `${attribute.name}: ${selectedVariation}`
                          )
                          .join(", ")}
                      </TableCell>
                      <TableCell className="text-white">
                        {variation.price}
                      </TableCell>
                      <TableCell className="text-white">
                        {variation.discountPrice ?? "-"}
                      </TableCell>
                      <TableCell className="text-white">
                        {variation.quantity}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {variation.variantImages &&
                          variation.variantImages.length > 0 ? (
                            variation.variantImages
                              .slice(0, 3)
                              .map((img, idx) => (
                                <div key={idx} className="relative w-10 h-10">
                                  <Image
                                    src={img}
                                    alt={`Variant ${variation.sku} image ${
                                      idx + 1
                                    }`}
                                    className="object-contain rounded border border-[#6E6E6E]"
                                    fill
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src = "/images/sample-img.jpg";
                                    }}
                                  />
                                </div>
                              ))
                          ) : (
                            <span className="text-gray-400">No images</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}

      {/* Feature Product Display */}
      <div>
        <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
          Feature Product
        </label>
        <div className="flex items-center space-x-3">
          <div
            className={`w-5 h-5 rounded border-2 border-[#6E6E6E] flex items-center justify-center ${
              product.isFeatured ? "bg-white" : "bg-transparent"
            }`}
          >
            {product.isFeatured && (
              <span className="text-black text-xs font-bold">✓</span>
            )}
          </div>
          <span className="text-white text-[17px] font-medium">
            {product.isFeatured ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsView;
