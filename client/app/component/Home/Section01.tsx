'use client'
import React, { useState, useEffect } from 'react'

const wordToType = "Collection"

function Section01() {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < wordToType.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + wordToType[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 100) // Typing speed: 100ms per character

      return () => clearTimeout(timeout)
    }
  }, [currentIndex])

  return (
    <div data-aos="fade-up" data-aos-duration="2000">
      <div className='-mt-15'>
        <div className='title text-center leading-tight'>
          The Everwood <span className='font-bold'>{displayText}{currentIndex < wordToType.length && <span className="animate-pulse">|</span>}</span> <br />
          Bespoke Furniture
        </div>
      </div>
    </div>
  )
}

export default Section01