'use client'
import React, { useState } from 'react'
import Footer from '../component/Footer/Footer'
import { Navbar2 } from '../component/Navbar/Navbar2'
import Image from 'next/image'
import Blog3 from '@/public/image/Blog/Blog3.png'
import Blog1 from '@/public/image/Blog/Blog1.png'
import Blog2 from '@/public/image/Blog/Blog2.png'
import BlogComponent from '../component/Blog/blog'

function page() {
    const [activeCategory, setActiveCategory] = useState('All')
    return (
        <div>
            <Navbar2 />
            <div className='containerpaddin container mx-auto'>
                <div className='margin-y'>
                    <div className="small-text">
                        Blog
                    </div>
                    <div className="lg:flex flex-row items-center justify-between gap-4">
                        <div className="subtitle text-left">
                            Design Notes & Inspirations  <span className="hidden lg:block" /> Our Creative Journey.
                        </div>

                        <div>
                            <div className="description w-auto ">
                                Explore our thoughts, inspirations, and behind-the-scenes stories on  <span className="hidden lg:block" /> craftsmanship, design, and sustainable living.<span className="hidden lg:block" />
                            </div>
                            <div className='flex flex-row gap-1 md:gap-6 w-full mt-4 overflow-x-auto md:overflow-x-visible scrollbar-hide'>
                                <button 
                                    onClick={() => setActiveCategory('All')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                                        activeCategory === 'All' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => setActiveCategory('Living')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                                        activeCategory === 'Living' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    Living
                                </button>
                                <button 
                                    onClick={() => setActiveCategory('Bedroom')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                                        activeCategory === 'Bedroom' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    Bedroom
                                </button>
                                <button 
                                    onClick={() => setActiveCategory('Wardrobes')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                                        activeCategory === 'Wardrobes' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    Wardrobes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap lg:flex-nowrap gap-4'>
                    <div className='w-full lg:w-auto'>
                        <Image src={Blog1} alt="Blog" className="w-full h-auto" />
                    </div>
                    <div className='w-[calc(50%-0.5rem)] lg:w-auto'>
                        <Image src={Blog2} alt="Blog" className="w-full h-auto" />
                    </div>
                    <div className='w-[calc(50%-0.5rem)] lg:w-auto'>
                        <Image src={Blog3} alt="Blog" className="w-full h-auto" />
                    </div>
                </div>
                <BlogComponent selectedCategory={activeCategory} />

                <div className='margin-y relative'>
                    <Image src="/image/Blog/Blog.png" alt="Section06" width={1920} height={500} className='w-full h-[400px] object-cover rounded-[36px]' />
                    <div className='absolute top-0 left-0 right-0 flex flex-col items-center justify-center h-full  px-4'>
                        <div className='text-center font-bold text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] 2xl:text-[44px] text-white'>
                        Design Something Uniquely Yours
                        </div>
                        <div className='text-center text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] 2xl:text-[44px] text-white'>
                        From concept to creation, our artisans bring your <br /> <span className="hidden lg:block" /> vision to life
                        </div>
                    </div>
                    
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default page