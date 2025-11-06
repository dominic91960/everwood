'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const fullText = "We create enduring furniture using only responsibly sourced wood — blending beauty, integrity, and sustainability."

function Section06() {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isTyping) {
          setIsTyping(true)
          let index = 0
          const interval = setInterval(() => {
            setDisplayText(fullText.slice(0, index + 1))
            index++
            if (index === fullText.length) {
              clearInterval(interval)
            }
          }, 50) // Typing speed: 50ms per character

          return () => clearInterval(interval)
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById('typewriter-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [isTyping])

  return (
    <div id="typewriter-section" className='margin-y relative'>
      <Image src="/image/Home/sofark.png" alt="Section06" width={1920} height={500} className='w-full h-[500px] object-cover rounded-[36px]' />
      <div className='absolute top-0 left-0 right-0 flex flex-col items-center justify-center h-full text-center text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] 2xl:text-[44px] text-white px-4'>
        <div>
          {displayText}<span className="animate-pulse">|</span>
        </div>
      </div>
    </div>
  )
}

export default Section06