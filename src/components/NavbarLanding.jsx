import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { IoIosMoon } from "react-icons/io";
import { IoMdSunny } from "react-icons/io";
import { HiOutlineBars3 } from 'react-icons/hi2';

const NavbarLanding = () => {
    return (
        <nav className='w-full flex sticky items-center top-0 left-0 bg-blue-600 p-4 z-10'>
            <div className=' flex w-full text-center '>
                <Link to="/" className="font-serif font-bold text-white text-2xl">
                CASTORA
                </Link>
                <div className='flex-grow'></div>
                <div className="flex items-center ml-auto gap-4">
                    <menu className='flex gap-4 text-white'>
                        <NavLink  to= "/login">LogIn</NavLink>
                        <NavLink to="/register">Register</NavLink>
                        <NavLink to="/about">About</NavLink>
                    </menu>
                    
                    {/* <button className='bg-transparent font-stretch-100% flex duration-200 ease-in-out hover:opacity-5'><HiOutlineBars3 /></button> */}
                </div>
            </div>
        </nav>
      )
}
    
    export default NavbarLanding
