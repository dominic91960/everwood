import React from "react";
import Image from "next/image";
import Link from "next/link";

function Build2() {
  return (
    <div className="margin-y">
      <div
        data-aos="fade-up"
        data-aos-duration="3000"
        className="containerpaddin container mx-auto"
      >
        {/* Who We Are Label */}
        <div className="small-text text-[#0C0C0C80] font-poppins">
          Who We Are
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Title and Images */}
          <div className="flex flex-col ">
            {/* Main Title */}
            <h2 className="subtitle font-poppins leading-tight">
              Built from Passion, Crafted for Generations.
            </h2>

            {/* Images Container - Grid View */}
            <div className="w-full mt-4">
              <div className="relative w-full h-[25vh] sm:h-[40vh] md:h-[50vh] lg:h-[30vh] xl:h-[40vh] 2xl:h-[44vh]">
                <Image
                  src="/image/about/built/Groupchair.png"
                  alt="Furniture collection showcase"
                  fill
                  className=" "
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Description Paragraphs */}
            <div className="flex flex-col gap-4">
              <p className="description text-[#0C0C0C]/70 font-poppins leading-relaxed">
                Founded in 2025, The Everwood Collection was born from a shared
                passion for craftsmanship, timeless design, and the belief that
                furniture should be as unique as the homes it inhabits. We are a
                collective of designers and artisans dedicated to redefining
                modern furniture — blending traditional skill with contemporary
                vision.
              </p>

              {/*  divider line */}
              <div className="w-full h-[2px] bg-[#000000]/40 my-2"></div>

              <p className="description text-[#0C0C0C]/70 font-poppins leading-relaxed">
                We collaborate closely with homeowners, interior designers, and
                architects to create custom pieces that are as unique as the
                spaces they inhabit. Every product is made with sustainably
                sourced wood and a commitment to enduring quality — so your
                furniture becomes part of your story for years to come.
              </p>
            </div>

            {/* Our Collection Button */}
            <>
              {/* Mobile/SM: visible, full width */}
              <div className="py-4 lg:py-0 md:hidden w-full">
                <Link href="/Catalog">
                  <button className="w-full group bg-[#475158] text-white rounded-full transition-all duration-300 hover:scale-[1.01] hover:bg-opacity-90">
                    <div className="flex items-center w-full">
                      <div className="text-white description px-4 flex-1 text-center font-poppins">
                        Our Collection
                      </div>
                      <div className="text-white text-sm pr-1 py-1">
                        <img
                          src="/image/Icon/Buttonicon.png"
                          alt="arrow-right"
                          width={50}
                          height={50}
                          className="w-[36px] h-[36px] sm:w-[40px] sm:h-[40px]"
                        />
                      </div>
                    </div>
                  </button>
                </Link>
              </div>

              {/* MD and up: original button */}
              <div className="py-4 lg:py-0 hidden md:block">
                <Link href="/Catalog">
                  <button className="group md:mb-0 bg-[#475158] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90">
                    <div className="flex flex-row items-center justify-center">
                      <div className="text-white description sm:px-3 md:px-5 lg:px-2 xl:px-2 2xl:px-4 font-poppins">
                        Our Collection
                      </div>
                      <div className="text-white text-sm pr-1 py-1">
                        <img
                          src="/image/Icon/Buttonicon.png"
                          alt="arrow-right"
                          width={50}
                          height={50}
                          className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[45px] 2xl:h-[45px]"
                        />
                      </div>
                    </div>
                  </button>
                </Link>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Build2;
