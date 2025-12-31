import Image from "next/image";
import React from "react";

interface ProductGalleryViewProps {
  images: string[];
  type: "simple" | "variable";
}

const ProductGalleryView: React.FC<ProductGalleryViewProps> = ({
  images,
  type,
}) => {
  return (
    <div>
      <label className="block font-medium text-[#FFFFFF] text-[17px] mb-2">
        {type === "simple" ? "Product" : "Base"} Images
      </label>
      <div className="border border-[#6E6E6E] rounded-lg p-4 bg-black/20">
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image: string, index: number) => (
              <div key={index} className="relative h-32">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full  object-contain rounded-lg border border-[#6E6E6E]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/sample-img.jpg"; // Fallback image
                  }}
                  fill
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
  );
};

export default ProductGalleryView;
