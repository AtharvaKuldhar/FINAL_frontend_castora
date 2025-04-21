// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
// import { NavLink } from 'react-router-dom';
// import { IoIosMoon } from "react-icons/io";
// import { IoMdSunny } from "react-icons/io";
// import { HiOutlineBars3 } from 'react-icons/hi2';
// import {AiOutlineClose } from 'react-icons/ai';
// import Image from '../assets/castora_logo.png'
// const Navbar = () => {
//     // const [darkTheme, setDarkTheme] = useState(false);
//     // const changeThemeHandler = () =>{
//     //     setDarkTheme(!darkTheme);
//     //     // if(localStorage.getItem('voting-app-theme') == 'dark'){
//     //     //     localStorage.setItem('voting-app-theme', '')
//     //     // }
//     //     // else{
//     //     //     localStorage.setItem('voting-app-theme', 'dark')
//     //     // }
//     //     // setDarkTheme(localStorage.getItem('voting-app-theme'))
//     // }

//     // useEffect(() =>{
//     //     if(darkTheme == 'dark'){
//     //     document.documentElement.classList.add('dark')
//     //     }
//     //     else{
//     //         document.body.classList.remove('dark');
//     //     }
//     // },[darkTheme])
//   return (
//     <nav className='w-full flex sticky items-center top-0 left-0 bg-blue-600 p-10 z-10'>
//         <div className=' flex w-full text-center '>
//             <Link to="/" className="font-serif font-bold text-2xl">
//             CASTORA
//             </Link>
//             <div className='flex-grow'></div>
//             <div className="flex items-center ml-auto gap-4">
//                 <menu className='flex gap-4'>
//                     <NavLink to= "/elections">Elections</NavLink>
//                     <NavLink to="/results">Results</NavLink>
//                     <NavLink to="/logout">Logout</NavLink>
//                 </menu>
//                 <button className='bg-transparent font-stretch-100% flex duration-200 ease-in-out hover:opacity-5'><HiOutlineBars3 /></button>
//             </div>
//         </div>
//     </nav>
//   )
// }

// export default Navbar


import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="w-full fixed top-0 left-0 h-16 bg-gray-950 text-white flex items-center justify-between px-6 shadow-md z-30">
      {/* Logo - Centered */}
      <Link to="/Home" className="text-2xl font-bold text-emerald-400 mx-auto sm:mx-0">
        CASTORA
      </Link>

      {/* Navigation Links */}
      <nav className="flex gap-8 items-center text-lg sm:ml-auto">
        <Link
          to="/Profile"
          className="hover:text-emerald-400 transition px-3 py-1 rounded-lg focus:outline-none"
          activeClassName="text-emerald-500 font-semibold"
        >
          👤 Profile
        </Link>
        <Link
          to="/About"
          className="hover:text-emerald-400 transition px-3 py-1 rounded-lg focus:outline-none"
          activeClassName="text-emerald-500 font-semibold"
        >
          ℹ️ About
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;

