import React from 'react'
import CTAButton from '../HomePage/Button'
import { FaArrowRight } from 'react-icons/fa'
import { TypeAnimation } from 'react-type-animation';

// position: where to place the code content in the left or right of the Alignment
// ctabtn : it is for the contenc of the two buttons, that is to be colored with yellow and block, which will use the same reusable component
// codeblock: it is the actual code content
// backgroundGradient : it is for the backgroundEffect to be placed in the background of the CodeBlocks components
// codeColor : it is the color with with the codes of the CodeSection will be coloured
const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
    return (
        <div className={`flex ${position} my-20 justify-between gap-10`}>
            {/* Section 1 */}
            <div className='w-[50%] flex flex-col gap-8'>
                {heading}
                <div className='text-richblack-300 font-bold'>
                    {subheading}
                </div>

                <div className='flex gap-7 mt-7'>
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn1.btnText}
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                    <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                        <div className='flex gap-2 items-center'>
                            {ctabtn2.btnText}
                        </div>
                    </CTAButton>
                </div>
            </div>

            {/* Section 2 */}
            <div className='h-fit flex flex-row text-[10px] w-[100%] py-4 lg:w-[500px]'>
                {/* // TODO: Gradient Color lagana hai */}
                {/* BG Gradient */}
                {backgroundGradient}
                <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>

                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                    <TypeAnimation
                        sequence={[codeblock, 2000, ""]}
                        repeat={Infinity}
                        cursor={true}
                        omitDeletionAnimation={true}
                        style={
                            {
                                whiteSpace: "pre-line",
                                display: 'block',
                            }
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default CodeBlocks