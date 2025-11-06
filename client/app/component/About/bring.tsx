'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";

const fullText = "Let's design something that's truly yours — book a personal consultation with our design experts."

function Bring() {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById('bring-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [hasStarted])

  useEffect(() => {
    if (hasStarted && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50) // Typing speed: 50ms per character

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, hasStarted])

  return (
    <div id="bring-section" className="margin-y">
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
              Bring Your Vision to Life
            </h2>

            {/* Subtitle/Description */}
            <p className="text-white text-[16px] sm:text-[18px] md:text-[22px] lg:text-[30px] 2xl:text-[36px] font-poppins max-w-6xl leading-relaxed">
              {displayText}
              {currentIndex < fullText.length && <span className="animate-pulse">|</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bring;
