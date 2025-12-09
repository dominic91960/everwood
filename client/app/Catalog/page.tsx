'use client'
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Footer2 from '../component/Footer/Footer2'
import Image from 'next/image'
import Section08 from '../component/Home/Section08'
import { Navbar2 } from '../component/Navbar/Navbar2'

function CatalogPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const categoryMap = useMemo(
        () =>
            new Map(
                ['All', 'Living', 'Bedroom', 'Wardrobes', 'Kitchen'].map((label) => [
                    label.toLowerCase(),
                    label,
                ])
            ),
        []
    )
    const [activeCategory, setActiveCategory] = useState('All')

    useEffect(() => {
        const param = searchParams.get('category')
        if (!param) {
            setActiveCategory('All')
            return
        }

        const matchedCategory = categoryMap.get(param.toLowerCase())
        if (matchedCategory) {
            setActiveCategory(matchedCategory)
        } else {
            setActiveCategory('All')
        }
    }, [categoryMap, searchParams])

    const handleCategorySelect = useCallback(
        (category: string) => {
            setActiveCategory(category)

            const params = new URLSearchParams(searchParams.toString())
            if (category === 'All') {
                params.delete('category')
            } else {
                params.set('category', category.toLowerCase())
            }

            const query = params.toString()
            router.replace(`/Catalog${query ? `?${query}` : ''}`, { scroll: false })
        },
        [router, searchParams]
    )
    return (
        <div className="font-poppins">
            <Navbar2 />

            <div className='containerpaddin container mx-auto'>
                <div className='margin-y'>
                    <div data-aos="fade-up"
                        suppressHydrationWarning
                        data-aos-delay="100"
                        data-aos-duration="2000">
                        <div className="lg:flex flex-row items-center justify-between gap-4">
                            <div className="subtitle text-left">
                                Curated Creations for the   <span className="hidden lg:block" />Modern Home
                            </div>
                            <div className="description w-auto ">
                                Every piece in The Everwood Collection tells a story of beauty, purpose, <span className="hidden lg:block" /> and enduring quality. Designed with modern sophistication and built  <span className="hidden lg:block" /> by skilled artisans, our collections bring warmth and character into
                                <span className="hidden lg:block" />every space.
                            </div>
                        </div>
                    </div>

                    <div className='margin-y'>
                        <div 
                            suppressHydrationWarning
                            data-aos="fade-up"
                            data-aos-delay="500"
                            data-aos-duration="2000"
                        >
                            <div>
                                <Image 
                                    src="/image/Collection/Collection4.png"
                                    alt="Collection 4"
                                    width={2000}
                                    height={1200}
                                    quality={80}
                                />
                            </div>
                        </div>
                    </div>
                    <div data-aos="fade-up"
                    suppressHydrationWarning
                    data-aos-delay="100"
                    data-aos-duration="2000">
                    <div className='margin-y'>
                        <div className="lg:flex flex-row items-center justify-between gap-4">
                            {/*<div className="subtitle text-left">
                                Curated Collections
                            </div>*/}
                            <div className='flex flex-row flex-wrap justify-center gap-2 md:gap-4 w-full mt-4 lg:mt-0'>
                                <button 
                                    onClick={() => handleCategorySelect('All')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                        activeCategory === 'All' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    All
                                </button>
                                <button 
                                    onClick={() => handleCategorySelect('Living')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                        activeCategory === 'Living' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    Living
                                </button>
                                <button 
                                    onClick={() => handleCategorySelect('Bedroom')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                        activeCategory === 'Bedroom' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    Bedroom
                                </button>
                                <button 
                                    onClick={() => handleCategorySelect('Wardrobes')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                        activeCategory === 'Wardrobes' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    Wardrobes
                                </button>
                                <button 
                                    onClick={() => handleCategorySelect('Kitchen')}
                                    className={`py-2 px-4 md:px-8 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                                        activeCategory === 'Kitchen' 
                                            ? 'bg-button text-white' 
                                            : 'text-button hover:bg-button hover:text-white'
                                    }`}
                                >
                                    Kitchen
                                </button>
                            </div>
                        </div>
                        <Section08 selectedCategory={activeCategory} />
                    </div>
                    </div>
                </div>
            </div>
            <Footer2 />
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-[200px]" />}>
            <CatalogPageContent />
        </Suspense>
    )
}
