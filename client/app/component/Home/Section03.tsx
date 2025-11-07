import React from 'react'
import Aboutus from '../Buttons/aboutus'

function Section03() {
    return (
        <div className='margin-y'>
            <div className="small-text">
                About us
            </div>
            <div className="lg:flex flex-row items-center justify-between gap-4">
                <div>
                    <div className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] 2xl:text-[40px] text-left">
                        Crafting furniture that feels
                    </div>
                    <div className='subtitle flex flex-col md:flex-row md:items-center gap-4 md:gap-6'>
                        <span>like home</span>
                        <Aboutus />
                    </div>
                </div>
                <div className="description w-auto ">
                    Founded in 2025, The Everwood Collection was born from a shared passion <span className="hidden lg:block" /> for craftsmanship, timeless design, and the belief that furniture should be as <span className="hidden lg:block" /> unique as the homes it inhabits.
                </div>
            </div>
        </div>
    )
}

export default Section03