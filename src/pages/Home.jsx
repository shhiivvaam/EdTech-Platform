import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa';
import HightlightText from '../components/core/HomePage/HightlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection'
import Footer from '../components/common/Footer';
import ExploreMore from '../components/core/HomePage/ExploreMore'

const Home = () => {
    return (
        <div>
            {/* Section 1 */}
            <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between'>

                {/* button */}
                <Link to={"/signup"}>
                    <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                        <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900'>
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                {/* heading */}
                <div className='text-center text-4xl font-semibold mt-7'>
                    Empower your Future with
                    <HightlightText text={"Coding Skills"} />
                </div>

                {/* subheading */}
                <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                    <p>With our online courses, you can learn at your own pace, form anywhere in the world</p>
                </div>

                {/* buttons */}
                <div className='flex flex-row gap-7 mt-8'>
                    <CTAButton active={true} linkto={'/signup'}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto={'/signup'}>
                        Book A Demo
                    </CTAButton>
                </div>

                {/* video */}
                {/* // TODO : video k around shadow lagani ha */}
                <div className='mx-3 my-12 shadow-blue-200'>
                    <video muted loop autoPlay>
                        <source src={Banner} type='video/mp4' />
                    </video>
                </div>

                {/* Code Section1  */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        codeColor={'text-yellow-200'}
                        heading={
                            <div className="text-4xl font-semibold">
                                Unlock Your
                                <HightlightText text={"Coding Potential"} />
                                wth our Online Courses.
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by Industry Experts who have years of experience in coding and are passionate about sharing their knowledge to you."
                        }
                        ctabtn1={
                            {
                                btnText: "try it yourself",
                                linkto: '/signup',
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn More",
                                linkto: '/login',
                                active: false,
                            }
                        }
                        // `<!DOCTYPE html>\n
                        // <html>\n
                        // <head>
                        //     <title>Example</title>
                        //     <link rel="stylesheet" href="styles.css">
                        // </head>\n
                        // <body>\n
                        // <h1><ahref="/">Header</a>\n
                        // </h1>\n
                        // <nav>
                        // <a href="one/">One</a>
                        // <a href="two/">Two</a>
                        // <a href="three/">Three</a>\n
                        // </nav>`
                        codeblock={

                            `<!DOCTYPE html>
                            <html>
                            <head>
                                <title>Example</title>
                                <link rel="stylesheet" href="styles.css">
                            </head>
                            <body>
                            <h1><ahref="/">Header</a></h1>
                            <nav>
                            <a href="one/">One</a>
                            <a href="two/">Two</a>
                            <a href="three/">Three</a>
                            </nav>`
                        }
                    />
                </div>

                {/* Code Section2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        codeColor={'text-yellow-200'}
                        heading={
                            <div className="text-4xl font-semibold">
                                Start
                                <HightlightText text={"coding in seconds."} />
                                wth our Online Courses.
                            </div>
                        }
                        subheading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={
                            {
                                btnText: "Continue Lesson",
                                linkto: '/signup',
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn More",
                                linkto: '/login',
                                active: false,
                            }
                        }
                        // `<!DOCTYPE html>\n
                        // <html>\n
                        // <head>
                        //     <title>Example</title>
                        //     <link rel="stylesheet" href="styles.css">
                        // </head>\n
                        // <body>\n
                        // <h1><ahref="/">Header</a>\n
                        // </h1>\n
                        // <nav>
                        // <a href="one/">One</a>
                        // <a href="two/">Two</a>
                        // <a href="three/">Three</a>\n
                        // </nav>`
                        codeblock={

                            `<!DOCTYPE html>
                            <html>
                            <head>
                                <title>Example</title>
                                <link rel="stylesheet" href="styles.css">
                            </head>
                            <body>
                            <h1><ahref="/">Header</a></h1>
                            <nav>
                            <a href="one/">One</a>
                            <a href="two/">Two</a>
                            <a href="three/">Three</a>
                            </nav>`
                        }
                    />
                </div>

                {/* Explore More */}
                <ExploreMore/>

            </div>

            {/* Section 2 */}
            <div className='bg-pure-greys-5 text-richblack-700'>
                <div className='homepage_bg h-[310px]'>
                    <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                        <div className='h-[150px]'></div>
                        {/* Button */}
                        <div className='flex flex-row gap-7 text-white'>
                            <CTAButton active={true} linkto={'/signup'}>
                                <div className='flex items-center gap-3'>
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton active={false} linkto={'/signup'}>
                                <div>
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>

                    <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                        <div className='text-4xl font-semibold w-[45%]'>
                            Get the skills you need for a
                            <HightlightText text={'job that is in demand'} />
                        </div>
                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                            <div className='text-[16px]'>
                                The modern StudyNotion dictates its own terms. Today to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={'/signup'}>
                                <div>
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <TimelineSection />

                    {/* Learning Language Section */}
                    <LearningLanguageSection />
                </div>
            </div>

            {/* Section 3 */}
            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>

                {/* Instructor Section */}
                <InstructorSection />

                <h2 className='text-center text-4xl font-semibold mt-10'>
                    review from Other Learners
                </h2>

                {/* Review Slider */}

            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Home