import React from "react";
import Image from "next/image";

function Form() {
  return (
    <div className="margin-y">
      <div className="containerpaddin container mx-auto py-10 sm:py-0 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Left Side - Contact Form */}
          <div
            data-aos="fade-up"
            data-aos-duration="3000"
            data-aos-delay="100"
            className="flex flex-col order-2 lg:order-1"
          >
            {/* Form Fields */}
            <form className="flex flex-col gap-4">
              {/* First Row - First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/form/formlcon/user.png"
                      alt="Person"
                      width={18}
                      height={18}
                      className="w-4 h-4 "
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
                  />
                </div>

                {/* Last Name */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/form/formlcon/user.png"
                      alt="Person"
                      width={18}
                      height={18}
                      className="w-4 h-4 "
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
                  />
                </div>
              </div>

              {/* Second Row  */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone No */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/form/formlcon/phone.png"
                      alt="Phone"
                      width={18}
                      height={18}
                      className="w-4 h-4"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone No"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image
                      src="/image/contact/ctloog/mail.png"
                      alt="Email"
                      width={18}
                      height={18}
                      className="w-5 h-5 "
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-base"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="relative">
                <textarea
                  placeholder="Your Message"
                  rows={9}
                  className="w-full px-4 py-3 bg-[#F5F5F5] rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#475158]/20 font-poppins text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-4">
                {/* Submit Button */}
                <button
                  type="submit"
                  className="group bg-[#475158] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90"
                >
                  <div className="flex flex-row items-center justify-center">
                    <div className="text-white description px-4 sm:px-3 md:px-5 lg:px-2 xl:px-3 2xl:px-4 font-poppins">
                      Sent Your Message
                    </div>
                    <div className="text-white text-sm pr-1 py-1">
                      <img
                        src="/image/Icon/Buttonicon.png"
                        alt="arrow-right"
                        width={50}
                        height={50}
                        className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] lg:w-[30px] lg:h-[30px] xl:w-[40px] xl:h-[40px] 2xl:w-[55px] 2xl:h-[55px]"
                      />
                    </div>
                  </div>
                </button>

                {/* Social Media Icons */}
                <div className="flex flex-row gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center hover:scale-105 "
                  >
                    <Image
                      src="/image/contact/form/whatsapp.png"
                      alt="WhatsApp"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/everwood.collection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center hover:scale-105 "
                  >
                    <Image
                      src="/image/contact/form/instagram.png"
                      alt="Instagram"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  </a>
                  <a
                    href="https://www.facebook.com/everwoodcollection"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10  flex items-center justify-center hover:scale-105 "
                  >
                    <Image
                      src="/image/contact/form/facebook.png"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="w-8 h-8"
                    />
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side - Images */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 lg:gap-6 order-1 lg:order-2">
            {/* Top Image */}
            <div
              data-aos="fade-left"
              data-aos-duration="3000"
              className="w-full"
            >
              <Image
                src="/image/contact/form/Rectangle 65.png"
                alt="Modern Living Space"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>

            {/* Bottom Image */}
            <div
              data-aos="fade-right"
              data-aos-duration="3000"
              className="w-full"
            >
              <Image
                src="/image/contact/form/Rectangle 96.png"
                alt="Contemporary Dining Area"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
