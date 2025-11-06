'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Bookacall from '../Buttons/bookacall'
import Tooltip from '../Tooltip/Tooltip'

const carouselImages = [
    '/image/Home/Herosub1k.png',
    '/image/Home/Herosub2kk.png',
    '/image/Home/Herosub1k.png',
    '/image/Home/Herosub2kk.png'
]

function Section02() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Auto-play carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev >= carouselImages.length - 2 ? 0 : prev + 1))
        }, 3000) // Change slide every 3 seconds

        return () => clearInterval(interval)
    }, [])

    const handlePrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 2 : prev - 1))
    }

    const handleNext = () => {
        setCurrentSlide((prev) => (prev >= carouselImages.length - 2 ? 0 : prev + 1))
    }
    return (
        <div data-aos="fade-up"
        data-aos-delay="300"
        data-aos-duration="2000" className='margin-y'>
            {/* Mobile: show tooltip block at the very top */}
            <div className='flex sm:hidden mb-2 w-full flex-col items-center justify-center text-center'>
                <Tooltip />
                <div className='text-small-text font-bold -mt-[35px]'>
                    200+ Happy Customers
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
                <div className='col-span-3 relative'>
                    <Image src="/image/Home/Heroimage.png" alt="Section02" width={1920} height={500} className='w-full h-auto object-cover' />
                    {/* Desktop/Tablet: overlay tooltip */}
                    <div className='hidden sm:block sm:absolute top-0 left-0'>
                        <Tooltip />
                        <div className='font-small-text sm:mt-[-45px]  md:mt-[-45px] lg:-mt-[45px] xl:-mt-[45px] 2xl:-mt-[35px] font-bold'>
                            200+ Happy Customers
                        </div>
                    </div>
                    {/* Mobile: place button below image, Desktop: keep absolute */}
                    <div className='hidden md:block absolute bottom-0 right-0'>
                        <Bookacall />
                    </div>
                    <div className='block md:hidden mt-2'>
                        <Bookacall />
                    </div>
                </div>


                <div className='col-span-2 flex flex-col justify-between gap-4'>
                    <div className='w-full'>
                        <video 
                            src="/image/Home/Herovideo.mp4" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            className='w-full h-full object-cover rounded-lg'
                        />
                    </div>

                    <div className='text-[14px] sm:text-[15px] md:text-[16px] lg:text-[12px] xl:text-[14px] 2xl:text-[22px]'>
                        The Everwood Collection brings together modern design and masterful craftsmanship to create timeless pieces that transform your home.
                    </div>
                    <div className='flex flex-row items-center justify-between w-full'>
                        <button onClick={handlePrevious} className='description hover:opacity-70 transition-opacity'>
                            01
                        </button>
                        <div className='grid grid-cols-3 items-center justify-between gap-2'>
                            {[0, 1, 2].map((index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-[2px] w-[70px] sm:w-[150px] md:w-[200px] lg:w-[100px] xl:w-[100px] 2xl:w-[150px] transition-colors ${
                                        currentSlide === index ? 'bg-black' : 'bg-[#D9D9D9]'
                                    }`}
                                ></button>
                            ))}
                        </div>
                        <button onClick={handleNext} className='description hover:opacity-70 transition-opacity'>
                            03
                        </button>
                    </div>
                    <div className='relative w-full overflow-hidden'>
                        <div className='flex transition-transform duration-700 ease-in-out' style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
                            {carouselImages.map((img, index) => (
                                <div key={index} className='min-w-[50%] px-2'>
                                    <Image src={img} alt={`Section02-${index}`} width={3920} height={1000} className='h-full w-full object-cover' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Section02