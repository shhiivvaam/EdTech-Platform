import React from 'react'

import logo1 from '../../../assets/TimeLineLogo/Logo1.svg';
import logo2 from '../../../assets/TimeLineLogo/Logo2.svg';
import logo3 from '../../../assets/TimeLineLogo/Logo3.svg';
import logo4 from '../../../assets/TimeLineLogo/Logo4.svg';
import timelineImage from '../../../assets/Images/TimelineImage.png'

const timeline = [
    {
        Logo: logo1,
        Heading: "Leadership",
        description: "Full commit to the success company",
    },
    {
        Logo: logo2,
        Heading: "Responsibility",
        description: "Students will always be our top priority",
    },
    {
        Logo: logo3,
        Heading: "Flexibility",
        description: "The ability to switch is an important skills",
    },
    {
        Logo: logo4,
        Heading: "Solve the problem",
        description: "Code your way to a solution",
    },
]

const TimelineSection = () => {
    return (
        <div>
            <div className='flex flex-row gap-15 items-center'>
                <div className='w-[45%] flex flex-col gap-5'>
                    {
                        timeline.map((element, index) => {
                            return(
                                <div key={index} className='flex flex-col gap-6'>
                                    {/* // TODO :  justify-center  neeche wala */}
                                    {/* //TODO : image k neeche dotted lines bhi add krni ha */}
                                    <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                        <img src={element.Logo} alt=''/>
                                    </div>
                                    <div>
                                        <h2 className='font-semibold text-[18px]'>{element.Heading}</h2>
                                        <p className='text-base'>{element.description}</p>
                                    </div>
                                </div>
                            );
                        } )
                    }
                </div>

                <div className='relative shadow-blue-200'>
                    {/* // TODO : add shadow behind the image and add some attractive effects */}
                    <img src={timelineImage} alt='' className='shadow-white object-cover h-fit'/>

                    {/* green section */}
                    <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                        <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                            <p className='text-3xl font-bold'>10</p>
                            <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                        </div>
                        <div className='flex gap-5 items-center px-7'>
                            <p className='text-3xl font-bold'>250</p>
                            <p className='text-caribbeangreen-300 text-sm'>Type of Course</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default TimelineSection