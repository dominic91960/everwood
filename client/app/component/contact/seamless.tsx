import React from "react";

function Seamless() {
  return (
    <div className="margin-y">
      <div
        data-aos="fade-up"
        data-aos-duration="3000"
        className="containerpaddin container mx-auto"
      >
        <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
          {/* Main Text */}
          <div className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[34px] xl:text-[36px] 2xl:text-[36px] font-medium font-poppins text-black mb-8 leading-tight">
            A seamless way to begin your journey toward
            <br className="hidden sm:block" /> timeless, handcrafted design.
          </div>

          {/* Book Appointment Button */}
          <>
            {/* Mobile/SM: visible, full width */}
            <div className="py-0 lg:py-0 md:hidden w-full">
              <a
                href="https://calendar.app.google/2iiAARicQAcrX5m69"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group bg-[#475158] text-white rounded-full transition-all duration-300 hover:scale-[1.01] hover:bg-opacity-90 inline-block"
              >
                <div className="flex items-center w-full">
                  <div className="text-white description px-4 flex-1 text-center font-poppins">
                    Book Appointment
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
              </a>
            </div>
            {/* MD and up: original button */}
            <div className="py-4 lg:py-0 hidden md:block">
              <a
                href="https://calendar.app.google/2iiAARicQAcrX5m69"
                target="_blank"
                rel="noopener noreferrer"
                className="group md:mb-0 bg-[#475158] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90 inline-block"
              >
                <div className="flex flex-row items-center justify-center">
                  <div className="text-white description sm:px-3 md:px-5 lg:px-2 xl:px-2 2xl:px-4 font-poppins">
                    Book Appointment
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
              </a>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default Seamless;
