import React from 'react'
import Image from 'next/image'
function Section04() {
  return (
    <div className='margin-y'>
        <div className='flex flex-col md:flex-row lg:gap-6 gap-10 md:gap-4 xl:gap-8 2xl:gap-10'>
            <div data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="2000">
            <div className='flex flex-col gap-4  justify-center'>
                <div className='overflow-hidden rounded-lg group cursor-pointer'>
                    <Image src="/image/Home/Rectanglek.png" alt="Section04" width={1520} height={400} className='w-[300px] h-auto transition-all duration-700 hover:scale-110' />
                </div>
                <div className='description font-bold'>
                Dark Cupboards
                </div>
                <div className='description'>
                Every curve and joint is meticulously handcrafted using sustainably sourced wood.
                </div>
            </div>
            </div>
            <div data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="2000">
            <div className='flex flex-col gap-4'>
                <div className='overflow-hidden rounded-lg group cursor-pointer'>
                    <Image src="/image/Home/Rectanglekk.png" alt="Section04" width={1920} height={500} className='w-[1150px] h-auto transition-all duration-700 hover:scale-110' />
                </div>
                <div className='description font-bold'>
                Dark Cupboards
                </div>
                <div className='description'>
                Every curve and joint is meticulously handcrafted using sustainably sourced wood.
                </div>
            </div>
            </div>
            <div data-aos="fade-up"
            data-aos-delay="700"
            data-aos-duration="2000">
            <div className='flex flex-col gap-4 justify-center'>
                <div className='overflow-hidden rounded-lg group cursor-pointer'>
                    <Image src="/image/Home/Rectanglekkk.png" alt="Section04" width={1920} height={500} className='w-[450px] h-auto transition-all duration-700 hover:scale-110' />
                </div>
                <div className='description font-bold'>
                Dark Cupboards
                </div>
                <div className='description'>
                Every curve and joint is meticulously handcrafted using sustainably sourced wood.
                </div>
            </div>
            </div>
            <div data-aos="fade-up"
            data-aos-delay="1000"
            data-aos-duration="2000">
            <div className='flex flex-col gap-4'>
                <div className='overflow-hidden rounded-lg group cursor-pointer'>
                    <Image src="/image/Home/Rectanglekkkk.png" alt="Section04" width={1920} height={500} className='w-[250px] h-auto transition-all duration-700 hover:scale-110' />
                </div>
                <div className='description font-bold'>
                Dark Cupboards
                </div>
                <div className='description'>
                Every curve and joint is meticulously handcrafted using sustainably sourced wood.
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Section04