import React from 'react'


function Section05() {
    return (
        <div className='margin-y'>
            <div>
                <div className="title flex items-center justify-center ">
                    Bespoke Mode to Order
                </div>
            </div>
            <div className='margin-y grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className='bg-[#EBEBEB] rounded-[36px] p-10'>
                    <div>
                        <img src="/image/Icon/one.png" alt="Section05Icon1" width={40} height={40} />
                    </div>
                    <div className='text-left'>
                        <div className='text-[14px] my-2 sm:text-[16px] md:text-[18px] lg:text-[22px] xl:text-[28px] 2xl:text-[32px]'>
                            Design Consultation
                        </div>
                        <div className='description text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]'>
                            We collaborate with homeowners and designers to turn unique ideas into blueprints.
                        </div>
                    </div>
                </div>
                <div className='bg-[#EBEBEB] rounded-[36px] p-7'>
                    <div>
                        <img src="/image/Icon/two.png" alt="Section05Icon1" width={40} height={40} />
                    </div>
                    <div className='text-left'>
                        <div className='text-[14px] my-2 sm:text-[16px] md:text-[18px] lg:text-[22px] xl:text-[28px] 2xl:text-[32px]'>
                            Artisan Crafting
                        </div>
                        <div className='description text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]'>
                            Every curve and joint is meticulously handcrafted using sustainably sourced wood.
                        </div>
                    </div>
                </div>
                <div className='bg-[#EBEBEB] rounded-[36px] p-7'>
                    <div>
                        <img src="/image/Icon/three.png" alt="Section05Icon1" width={40} height={40} />
                    </div>
                    <div className='text-left'>
                        <div className='text-[14px] my-2 sm:text-[16px] md:text-[18px] lg:text-[22px] xl:text-[28px] 2xl:text-[32px]'>
                            Finishing Touches
                        </div>
                        <div className='description text-[14px]  sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px]'>
                            Each piece is polished, refined, and quality-checked to perfection.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Section05;