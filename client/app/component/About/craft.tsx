import React from "react";
import Image from "next/image";

function Craft() {
  return (
    <div className="margin-y">
      <div
        // data-aos="fade-up"
        // data-aos-duration="3000"
        className="containerpaddin container mx-auto"
      >
        <div className="small-text text-[#0C0C0C80] font-poppins">
          What We Do
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-12 items-start">
          {/* Left Side - Content */}
          <div
            data-aos="fade-up"
            data-aos-duration="3000"
            className="flex flex-col gap-4 lg:gap-2"
          >
            <div className="flex flex-col gap-0 xl:gap-15 ">
              {/* Main Title */}
              <h2 className="subtitle font-poppins leading-tight">
                Crafting Bespoke Furniture for Modern Living
              </h2>

              {/* Description */}
              <p className="description pt-0 xl:pt-5 text-[#0C0C0C]/70 font-poppins leading-relaxed">
                At Everwood, we design and craft bespoke furniture that marries
                sophistication with enduring quality. Each creation is built
                using sustainably sourced wood and shaped by expert local
                artisans who bring decades of experience to every joint, curve,
                and finish. Our pieces are designed to complement your space and
                stand the test of time — both in form and function.
              </p>
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 w-full 2xl:w-[90%] h-[40vh] sm:h-[50vh] md:h-[50vh] lg:h-[70vh] xl:h-[50vh] 2xl:h-[50vh]">
            {/* Left Image  */}
            <div
              data-aos="fade-left"
              data-aos-duration="3000"
              className="relative flex-1"
            >
              <Image
                src="/image/about/crafting/Rectangle 59.png"
                alt="Wooden chair with built-in shelving"
                fill
                className=""
              />
            </div>

            {/* Right Image  */}
            <div
              data-aos="fade-right"
              data-aos-duration="3000"
              className="relative flex-1"
            >
              <Image
                src="/image/about/crafting/Rectangle 60.png"
                alt="Tall wooden cabinet storage unit"
                fill
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Craft;
