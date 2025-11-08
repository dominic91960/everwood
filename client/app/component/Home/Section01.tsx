"use client";
import React, { useState, useEffect } from "react";

const wordToType = "Collection";

function Section01() {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < wordToType.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + wordToType[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100); // Typing speed: 100ms per character

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    // <div data-aos="fade-up" data-aos-duration="2000">
    <div className="-mt-15 lg:mt-[-50px]">
      <div className="title text-center leading-tight font-poppins">
        <div className="reveal-text">
          <span className="font-semibold">The Everwood Collection</span>
        </div>

        <div className="h-[2px] w-4/5 lg:w-2/3 mx-auto bg-black  my-1"></div>
        <div className="reveal-text-down text-[20px] lg:text-[40px]">
          <span>Bespoke Furniture</span>
        </div>
      </div>
    </div>
    //   </div>
  );
}

export default Section01;
