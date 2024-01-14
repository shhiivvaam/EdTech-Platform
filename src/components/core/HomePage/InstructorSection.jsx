import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HightlightText from './HightlightText'
import CTAButton from '../HomePage/Button'
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
    return (
        <div className='mt-16'>
            <div className='flex flex-row gap-20 items-center'>
                <div className='w-[50%]'>
                    <img
                        src={Instructor}
                        alt=''
                        className='shadow-white'
                    />
                </div>
                <div className='w-[50%] flex flex-col gap-10'>
                    {/* w-[50%]   add kr neeche */}
                    <div className='text-4xl font-semibold '>
                        Become an
                        <HightlightText text={"Instructor"} />
                    </div>
                    <p className='font-medium text-[16px] w-[80%] text-richblack-300'>
                        Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                    </p>

                    <div className='w-fit'>
                        <CTAButton active={true} linkto={'/signup'}>
                            <div className='flex flex-row gap-2 items-center'>
                                Start Teaching Today
                                <FaArrowRight />
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorSection