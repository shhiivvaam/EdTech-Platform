import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore'
import HightlightText from './HightlightText';

const tabsName = [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skill Paths",
    "Career Paths",
];

const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
        setCurrentTab(value);
        // const result = HomePageExplore.filter((ele) => ele.tag === value);
        // setCourses(result[0].courses);
        // setCurrentCard(result[0].courses[0].heading);
    }

    return (
        <div>
            <div className='text-4xl font-semibold text-center'>
                Unlock the
                <HightlightText text={"Power of Code"} />
            </div>
            <p className='text-center text-richblack-300 text-sm text-[16px] mt-3'>
                Learn to build anything you can imagine
            </p>

            {/* Dynamic Courses Tab */}
            <div className='mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 px-1 py-1'>
                {
                    tabsName.map((element, index) => {
                        return (
                            <div
                                className={`text-[16px] flex flex-row items-center gap-2
                            ${currentTab === element
                                        ?
                                        "bg-richblack-900 text-richblack-5 font-medium"
                                        :
                                        "text-richblack-200"
                                    }
                            rounded-full transition-all duration-200 cursor-pointer
                            hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2
                            `}
                                key={index}
                                onClick={() => setMyCards(element)}
                            >
                                {element}
                            </div>
                        );
                    })
                }
            </div>

            {/* Cards */}
            <div className='h-[150px]'></div>

            {/* course card ka group */}
            {/* // TODO : card complete krna hai ye */}
            {/* <div className='absolute flex flex-row gap-10 justify-between w-full'>
                {
                    courses.map((element, index) => {
                        return (
                            <CourseCard 
                                key={index}
                                cardData = {element}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}
                            />
                        );
                    })
                }
            </div> */}

        </div>
    )
}

export default ExploreMore