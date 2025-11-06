import React from "react";
import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    <div className="">
      <div className="bg-black">
        {/* Navigation Section */}
        <div className="containerpaddin container mx-auto py-6 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-8">
            {/* Logo */}
            <div className="shrink-0">
              <Image
                src="/image/Logo/Logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
              />
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 text-center">
              <Link
                href="/"
                className="text-white hover:text-gray-400 transition-colors duration-200 font-medium text-sm md:text-base"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-gray-400 transition-colors duration-200 font-medium text-sm md:text-base"
              >
                About
              </Link>
              <Link
                href="/Collection"
                className="text-white hover:text-gray-400 transition-colors duration-200 font-medium text-sm md:text-base"
              >
                Collection
              </Link>
              <Link
                href="/designyourown"
                className="text-white hover:text-gray-400 transition-colors duration-200 font-medium text-sm md:text-base"
              >
                Design Your Own
              </Link>
              <Link
                href="/appointment"
                className="text-white hover:text-gray-400 transition-colors duration-200 font-medium text-sm md:text-base"
              >
                Appointment
              </Link>
              <Link
                href="/Blog"
                className="text-white hover:text-gray-400 transition-colors duration-200 font-medium text-sm md:text-base"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>

        {/* EVERWOOD Text */}
        <div className="text-white text-[60px] sm:text-[120px] md:text-[180px] lg:text-[250px] xl:text-[250px] items-center justify-center flex font-bold overflow-hidden opacity-15">
          EVERWOOD
        </div>

        {/* Divider */}
        <div className="bg-white h-0.5 w-full"></div>

        {/* Footer Bottom */}
        <div className="containerpaddin container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 md:mt-8 pb-6 md:pb-8">
            <div className="text-white text-xs md:text-sm lg:text-base text-center md:text-left">
              @All rights reserved - 2025
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <Image
                src="/image/Footer/whatsapp.png"
                alt="Whatsapp"
                width={30}
                height={30}
                className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
              />
              <a
                href="https://www.facebook.com/everwoodcollection"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/image/Footer/facebook.png"
                  alt="Facebook"
                  width={30}
                  height={30}
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
              <a
                href="https://www.instagram.com/everwood.collection"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src="/image/Footer/instagram.png"
                  alt="Instagram"
                  width={30}
                  height={30}
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
