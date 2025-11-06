"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

function Bring() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "From concept to creation, we bring your ideas to life through timeless craft";
  const typingSpeed = 50; // milliseconds per character

  useEffect(() => {
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="margin-y">
      <div className="containerpaddin container mx-auto">
        {/* Banner with Background Image and Text Overlay */}
        <div className="relative w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-[24px] md:rounded-[32px]">
          {/* Background Image */}
          <Image
            src="/image/about/bring/bringbg.png"
            alt="Bring Your Vision to Life"
            fill
            className="object-cover"
            priority
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/15"></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-16 z-10">
            {/* Title */}
            <h2 className="text-white text-[28px] sm:text-[32px] md:text-[36px] lg:text-[42px] xl:text-[48px] 2xl:text-[50px]  font-poppins mb-4 leading-tight">
              Create Something Truly Your Own
            </h2>

            {/* Subtitle/Description with Typewriter Effect */}
            <p className="text-white text-[16px] sm:text-[18px] md:text-[22px] lg:text-[30px] 2xl:text-[36px] font-poppins max-w-6xl leading-relaxed min-h-[3em]">
              {displayedText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bring;
