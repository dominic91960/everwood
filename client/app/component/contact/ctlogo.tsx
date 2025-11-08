import React from "react";
import Image from "next/image";

function CtLogo() {
  return (
    <div className="margin-y">
      <div
        data-aos="fade-up"
        data-aos-duration="3000"
        className="containerpaddin container mx-auto max-w-7xl"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12">
          {/* Email Address Card */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EBEBEB] flex items-center justify-center mb-4 hover:scale-110 transition-all duration-300">
              <Image
                src="/image/contact/ctloog/mail.png"
                alt="Email"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </div>
            <div className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-medium text-black mb-2 font-poppins">
              Email Address
            </div>
            <div className="description text-[14px] sm:text-[15px] md:text-[16px] font-poppins text-[#878787]">
              <a
                href="mailto:hello@everwodcollection.com"
                className="description text-[14px] sm:text-[15px] md:text-[16px] font-poppins text-[#878787] hover:text-black transition-colors duration-300"
              >
                hello@everwodcollection.com
              </a>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EBEBEB] flex items-center justify-center mb-4 hover:scale-110 transition-all duration-300">
              <Image
                src="/image/contact/ctloog/phone-call.png"
                alt="Phone"
                width={24}
                height={24}
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
            </div>
            <div className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-medium font-poppins text-black mb-2">
              Contact Info
            </div>
            <div className="description text-[14px] sm:text-[15px] md:text-[16px] font-poppins text-[#878787]">
              <a
                href="tel:+7634565233334"
                className="description text-[14px] sm:text-[15px] md:text-[16px] font-poppins text-[#878787] hover:text-black transition-colors duration-300"
              >
                +76 3456523334
              </a>
            </div>
          </div>

          {/* Our Address Card */}
          {/* <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EBEBEB] flex items-center justify-center mb-4 hover:scale-110 transition-all duration-300">
              <Image
                src="/image/contact/ctloog/Location.png"
                alt="Location"
                width={24}
                height={24}
                className="w-6 h-7 sm:w-7 sm:h-8"
              />
            </div>
            <div className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] font-medium font-poppins text-black mb-2">
              Our Address
            </div>
            <div className="description text-[14px] sm:text-[15px] md:text-[16px] font-poppins text-center text-[#878787]">
              123, example, example road,
              <br className="hidden sm:block" /> example
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default CtLogo;
