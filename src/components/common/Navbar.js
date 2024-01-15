import React from 'react'
import { Link, useLocation, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Light.png'
import { NavbarLinks } from '../../data/navbar-links'

const Navbar = () => {
    const location = useLocation();
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
                                                    <div>
                                                        {/* // TODO : catelog ka code krna hai yaha */}
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

                {/* Login Signup Buttons */}
                <div>
                </div>
            </div>
        </div>
    )
}

export default Navbar