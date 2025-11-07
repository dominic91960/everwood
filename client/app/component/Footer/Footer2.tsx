import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Footer2() {
    return (
        <div className=''>
            <div className='bg-black py-10'>
                <div className='containerpaddin container mx-auto'>
                    <div className="bg-white h-[1px] w-full opacity-40"></div>
                    <div className='flex flex-col md:flex-row md:items-stretch items-center justify-between gap-6 md:gap-2'>
                        <div className='shrink-0 flex items-center justify-center md:justify-start self-stretch w-full md:w-auto mt-4 md:mt-0'>
                            <Image src='/image/Footer/LogoWhite.png' alt='Footer2' width={200} height={200} className='h-auto w-32 md:h-full md:w-auto object-contain aspect-square' />
                        </div>
                        <div className='hidden md:block w-[1px] bg-white opacity-40 self-stretch'></div>
                        <div className='flex flex-col justify-center w-full md:w-auto md:mt-10'>
                            <div className='flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8'>
                                <Link href='/' className='text-white hover:text-gray-400 transition-colors font-medium text-sm md:text-base'>
                                    Home
                                </Link>
                                <Link href='/about' className='text-white hover:text-gray-400 transition-colors font-medium text-sm md:text-base'>
                                    About
                                </Link>
                                <Link href='/Catalog' className='text-white hover:text-gray-400 transition-colors font-medium text-sm md:text-base'>
                                    Catalog
                                </Link>
                                <Link href='/designyourown' className='text-white hover:text-gray-400 transition-colors font-medium text-sm md:text-base'>
                                    Design Your Own
                                </Link>
                                <Link href='/contact' className='text-white hover:text-gray-400 transition-colors font-medium text-sm md:text-base'>
                                    Contact
                                </Link>
                                <Link href='/Blog' className='text-white hover:text-gray-400 transition-colors font-medium text-sm md:text-base'>
                                    Blog
                                </Link>
                            </div>
                            <div>
                                <div className="text-white text-[60px] sm:text-[90px] md:text-[100px] lg:text-[150px] xl:text-[150px] items-center justify-center flex font-bold overflow-hidden opacity-15">
                                    EVERWOOD
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 md:mb-10">
                                <Image
                                    src="/image/Footer/whatsapp.png"
                                    alt="Whatsapp"
                                    width={30}
                                    height={30}
                                    className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
                                />
                                <a
                                    href="https://www.facebook.com/everwoodcollection"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Image
                                        src="/image/Footer/facebook.png"
                                        alt="Facebook"
                                        width={30}
                                        height={30}
                                        className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                </a>
                                <a
                                    href="https://www.instagram.com/everwood.collection"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Image
                                        src="/image/Footer/instagram.png"
                                        alt="Instagram"
                                        width={30}
                                        height={30}
                                        className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white h-[1px] w-full opacity-40"></div>
                </div>
            </div>
        </div>
    )
}

export default Footer2