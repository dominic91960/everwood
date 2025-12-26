import React from "react";
import Image from "next/image";

import { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  purchasedTimes: number;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  purchasedTimes,
}) => {
  return (
    <article className="bg-foreground/5 border-foreground/10 relative flex aspect-[3/4] flex-col gap-[0.5em] overflow-hidden rounded-[1em] border p-[1em] text-[13px] sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[20px] 2xl:h-full 2xl:text-[21px]">
      <p className="relative shrink-0 text-center">{product.title}</p>
      <div className="relative mx-auto w-4/5 grow">
        <Image
          src={product.productImages[0]}
          alt={product.title}
          fill
          className="object-contain object-center"
        />
      </div>

      <div className="relative flex shrink-0 flex-col items-center gap-[0.2em]">
        <p>Rs. {product.discountPrice.toFixed(2)}</p>
        <p className="bg-gradient-to-br from-[#40A6F7] to-[#028EFC] bg-clip-text text-transparent">
          {purchasedTimes} Purchases
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
