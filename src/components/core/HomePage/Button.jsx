import React from 'react'
import { Link } from 'react-router-dom'


// children will the elements that will be passed inside the Button tag where ever used
// active : will be the parameter to se the color of the button to yellow or black
// linkto : is the link of the work to be performed after pressing the button
const Button = ({children, active, linkto}) => {
    return (
        <Link to={linkto}>
            <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active ? "bg-yellow-50 text-black" : "bg-richblack-800"}  hover:scale-95 transition-all duration-200`}>
                {children}
            </div>
        </Link>
    )
}

export default Button