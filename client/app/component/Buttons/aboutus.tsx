import React from 'react'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

function aboutus() {
  return (
    <div className='py-0 lg:py-0'>
        <button className="group bg-button text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-opacity-90">
            <div className='flex flex-row items-center justify-center '>
                <div className='text-white description px-10'>
                    About us
                </div>
                <div className='text-white text-sm pr-1 py-1'>
                    <img src="/image/Icon/Buttonicon.png" alt="arrow-right" width={50} height={50}  />
                </div>
            </div>
    </button>
  </div>
);
}

export default aboutus;