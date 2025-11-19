'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const products = [
    { 
        id: 1, 
        name: 'Yellow Chair', 
        price: '$126.00',
        category: 'Living',
        images: {
            black: '/image/category/SecondCaard/Rectangle 01.png',
            gray: '/image/category/SecondCaard/Rectangle 02.png',
           
        }
    },
    { 
        id: 2, 
        name: 'Modern Sofa', 
        price: '$326.00',
        category: 'Living',
        images: {
            black: '/image/category/ThirdCard/Chair 01.png',
            gray: '/image/category/ThirdCard/Chair 02.png',
            
        }
    },
    { 
        id: 3, 
        name: 'Bed Frame', 
        price: '$526.00',
        category: 'Bedroom',
        images: {
            black: '/image/category/FourthCard/Cupboard 01.png',
            gray: '/image/category/FourthCard/Cupboard 02.png',
            
        }
    },
    { 
        id: 4, 
        name: 'Wardrobe Set', 
        price: '$826.00',
        category: 'Wardrobes',
        images: {
            black: '/image/category/FifthCard/DrawersChest 01.png',
            gray: '/image/category/FifthCard/DrawersChest 02.png',
            
        }
    },
    { 
        id: 5, 
        name: 'Dining Chair', 
        price: '$156.00',
        category: 'Living',
        images: {
            black: '/image/category/SixthCard/SideBoard 01.png',
            gray: '/image/category/SixthCard/SideBoard 02.png',
            
        }
    },
    { 
        id: 6, 
        name: 'Bedroom Cabinet', 
        price: '$426.00',
        category: 'Bedroom',
        images: {
            black: '/image/category/SeventhCard/TV_console 01.png',
            gray: '/image/category/SeventhCard/TV_console 02.png',
            
        }
    },
    { 
        id: 7, 
        name: 'Dining Chair', 
        price: '$426.00',
        category: 'Bedroom',
        images: {
            black: '/image/category/EighthCard/Chair 03.png',
            gray: '/image/category/EighthCard/Chair 04.png',
            
        }
    },
    { 
        id: 8, 
        name: 'Bedroom Cabinet', 
        price: '$426.00',
        category: 'Bedroom',
        images: {
            black: '/image/category/NinethCard/Table 01.png',
            gray: '/image/category/NinethCard/Table 02.png',
            
        }
    },
]

function Section08({ selectedCategory }: { selectedCategory?: string } = {}) {
    const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

    const filteredProducts = selectedCategory && selectedCategory !== 'All' 
        ? products.filter(product => product.category === selectedCategory)
        : products;

    return (
        <div className='my-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {filteredProducts.map((product) => {
                    const isHovered = hoveredProduct === product.id;
                    
                    return (
                    <div 
                        key={product.id} 
                        className='relative w-full aspect-square overflow-hidden group'
                        onMouseEnter={() => setHoveredProduct(product.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                    >
                        <Image 
                            src={product.images.black} 
                            alt={product.name} 
                            fill
                            className={`object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                        />
                        <Image 
                            src={product.images.gray} 
                            alt={product.name} 
                            fill
                            className={`object-cover transition-opacity duration-500 absolute inset-0 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                        <div className='absolute bottom-0 left-0 right-0 flex flex-row items-center px-2 lg:px-1 xl:px-2 gap-4 lg:gap-2 xl:gap-4'>
                            <div className='text-[14px] sm:text-[20px] md:text-[14px] lg:text-[12px] xl:text-[14px] 2xl:text-[16px] font-semibold py-2'>
                                {product.name}
                            </div>
                            <div className='text-[16px] sm:text-[24px] md:text-[16px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] font-semibold py-2'>
                                {product.price}
                            </div>
                        </div>
                        <div className='absolute bottom-0 right-0 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-12'>
                            <Image src="/image/Icon/Buttonicongray.png" alt="Section08" width={80} height={80} className='w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[50px] md:h-[50px] lg:w-[40px] lg:h-[40px] xl:w-[50px] xl:h-[50px] 2xl:w-[60px] 2xl:h-[60px]' />
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Section08
