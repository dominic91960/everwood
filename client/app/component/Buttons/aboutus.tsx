import React from "react";
import Link from "next/link";

function aboutus() {
  return (
    <div className="py-0 lg:py-0">
      <Link href="/about">
        <button className="group bg-button text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90">
          <div className="flex flex-row items-center justify-center ">
            <div className="text-white description px-4">About Us</div>
            <div className="text-white text-sm pr-1 py-1">
              <img
                src="/image/Icon/Buttonicon.png"
                alt="arrow-right"
                width={40}
                height={40}
                className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[45px] 2xl:h-[45px]"
              />
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
}

export default aboutus;
