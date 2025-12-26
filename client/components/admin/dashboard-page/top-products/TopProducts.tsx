"use client";

import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { TbError404 } from "react-icons/tb";

import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

type TopProductsProps = {
  topProducts: { product: Product; purchasedTimes: number }[];
};

const TopProducts: React.FC<TopProductsProps> = ({ topProducts }) => {
  return (
    <div className="flex flex-col rounded-[1em] bg-[#028EFC]/10 p-[1em]">
      <p className="mb-[1em] text-[12px] font-medium sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]">
        Top Products
      </p>
      {topProducts.length > 0 && (
        <Swiper
          pagination={{ enabled: true, clickable: true, dynamicBullets: true }}
          grabCursor
          modules={[Pagination]}
          speed={1000}
          slidesPerView={2}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
          className="w-full grow"
        >
          {topProducts.map(({ product, purchasedTimes }) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} purchasedTimes={purchasedTimes} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {topProducts.length === 0 && (
        <div className="border-foreground/10 bg-background/5 flex aspect-[10/5] grow flex-col items-center justify-center rounded-[1em] border sm:aspect-[10/4] 2xl:sm:aspect-[10/5]">
          <TbError404 className="text-[2em]" />
          <p className="mt-[0.5em] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] 2xl:text-[18px]">
            No popular products available right now.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopProducts;
