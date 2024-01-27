import React, { useEffect, useState } from 'react'
import { Link, useLocation, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai';
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import { IoIosArrowDown } from 'react-icons/io'


// const subLinks = [
//     {
//         title: 'python',
//         link: 'catalog/python',
//     },
//     {
//         title: "web dev",
//         link: '/catalog/web-development'
//     },
// ]

const Navbar = () => {

    //? Fetching the data from the Redux Sections -> Slice
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();


    // catelogs show krne ka lia
    const [subLinks, setSubLinks] = useState([]);

    const fetchSublinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log('Printing SubLinks result: ', result);
            setSubLinks(result.data.data);
        } catch (error) {
            console.log(`Could not fetch the Catalog List`);
        }
    }

    useEffect(() => {
        fetchSublinks();
    }, [])


    function matchRoute(route) {
        return matchPath({ path: route }, location.pathname);
        // return route === location.pathname;
    }

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                {/* Image -> Logo */}
                <Link to='/'>
                    <img
                        src={logo}
                        alt=''
                        width={160} height={42}
                        loading='lazy'
                    />
                </Link>

                {/* Nav Links */}
                <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {
                            NavbarLinks.map((link, index) => {
                                return (
                                    <li key={index}>
                                        {
                                            link.title === "Catalog"
                                                ?
                                                (
                                                    <div className='group relative flex items-center gap-2'>
                                                        {/* // TODO : catelog ka code krna hai yaha */}
                                                        {/* <Link to={'/catalog'}> */}
                                                        <p>{link.title}</p>
                                                        {/* </Link> */}
                                                        {/* <Link to={link?.path}>
                                                            <p className={`
                                                                ${
                                                                    matchPath(link?.path)
                                                                    ? 
                                                                    'text-yellow-25'
                                                                    :
                                                                    'text-richblack-25'
                                                                }
                                                            `}>
                                                                {link.title}
                                                            </p>
                                                        </Link> */}
                                                        <IoIosArrowDown />

                                                        <div className='invisible absolute left-[50%] top-[50%] 
                                                            translate-x-[-50%] translate-y-[80%]
                                                            flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]'>
                                                            <div className='absolute left-[50%] top-0 h-6 w-6 
                                                                    translate-x-[80%] translate-y-[-40%]
                                                                    rotate-45 rounded bg-richblack-5'>
                                                            </div>
                                                            {
                                                                // subLinks.length  !== 0
                                                                // subLinks.length
                                                                subLinks.size
                                                                    ?
                                                                    (
                                                                        subLinks.map((subLink, index) => (
                                                                            <Link key={index} to={`${subLink.link}`}>
                                                                                <p>{subLink.title}</p>
                                                                            </Link>
                                                                        ))
                                                                    )
                                                                    :
                                                                    (
                                                                        <div>
                                                                            {/* // TODO : add styling if the course Category is not found.  */}
                                                                        </div>
                                                                    )
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (
                                                    <Link to={link?.path}>
                                                        <p className={`
                                                            ${matchRoute(link?.path)
                                                                ?
                                                                'text-yellow-25'
                                                                :
                                                                'text-richblack-25'
                                                            }
                                                        `}>
                                                            {link.title}
                                                        </p>
                                                    </Link>
                                                )
                                        }
                                    </li>
                                );
                            })
                        }
                    </ul>
                </nav>
                {/* // TODO: ye neeche wala section UI mai aa hi nhi rha hai->, find why  */}
                {/* Login Signup Buttons */}
                <div className='flex gap-x-4 items-center'>
                    {/* // TODO: styling baki ha aabhi */}
                    {
                        //? shoppingcart k lia
                        user && user?.accountType !== "Instructor" && (
                            <Link to={'/dashboard/cart'} className='relative'>
                                <AiOutlineShoppingCart />
                                {
                                    totalItems > 0 && (
                                        <span>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token !== null && (
                            <Link to={'/login'}>
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && (
                            <Link to={'/signUp'}>
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }
                    {
                        // TODO: profileDrop Down Section aabhi create krna baki h
                        token !== null && <ProfileDropDown />
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar