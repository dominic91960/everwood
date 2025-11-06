'use client'
import React, { useState } from 'react'
import Tooltip from '../Tooltip/Tooltip'

const testimonials = [
    {
        id: 1,
        quote: "The craftsmanship is exceptional — our dining table feels like a true heirloom. Every detail, from the joints to the finish, reflects care and artistry. Everwood turned our idea into something timeless and personal.",
        name: "Amara D.",
        position: "Software Engineer"
    },
    {
        id: 2,
        quote: "Working with Everwood was a dream. They listened to our vision and created a custom bookshelf that perfectly fits our space. The quality of the wood and attention to detail exceeded our expectations.",
        name: "Michael R.",
        position: "Architect"
    },
    {
        id: 3,
        quote: "We couldn't be happier with our bedroom set. The sustainable materials and beautiful design make it both eco-friendly and elegant. Everwood's team made the entire process seamless and enjoyable.",
        name: "Sarah & James L.",
        position: "Homeowners"
    }
]

function Section09() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    }

    const currentTestimonial = testimonials[currentIndex]

    return (
        <div className='margin-y'>
            <div className='subtitle items-center justify-center text-center'>
                What Our Clients Say
            </div>
            <div className='margin-y'>
                <div className='bg-[#EBEBEB] rounded-[36px] p-10 px-15'>
                    <div className='description items-center justify-center text-center'>
                        "{currentTestimonial.quote}"
                    </div>

                    <div className='description items-center justify-center text-center mt-4 font-bold'>
                        {currentTestimonial.name}
                    </div>
                    <div className='description items-center justify-center text-center mt-4 '>
                        {currentTestimonial.position}
                    </div>
                    <div className='flex flex-col mt-4 lg:mt-0 lg:flex-row justify-between items-center'>
                        <div>
                            <Tooltip />
                        </div>
                        <div className='flex gap-4'>
                            {/* Left Arrow */}
                            <button 
                                onClick={handlePrevious}
                                className='w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            {/* Right Arrow */}
                            <button 
                                onClick={handleNext}
                                className='w-12 h-12 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Section09