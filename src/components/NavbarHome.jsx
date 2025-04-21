// import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { HiOutlineBars3 } from 'react-icons/hi2';

// const NavbarHome = () => {
//     return (
//         <nav className='w-full flex sticky top-0 left-0 bg-blue-600 p-4 z-10'>
//             <div className='flex w-full text-center'>
//                 <Link to="/" className="font-serif font-bold text-2xl text-white">
//                     CASTORA
//                 </Link>

//                 <div className='flex-grow'></div>

//                 <div className="flex items-center ml-auto gap-4">
//                     <div className='flex gap-4 list-none'>
//                         <NavLink 
//                           to="/about"
//                           className={({ isActive }) => isActive ? "text-white font-bold" : "text-gray-200"}
//                         >
//                           About
//                         </NavLink>
//                         <NavLink 
//                           to="/contactus"
//                           className={({ isActive }) => isActive ? "text-white font-bold" : "text-gray-200"}
//                         >
//                           Contact us
//                         </NavLink>
//                         <NavLink 
//                           to="/logout"
//                           className={({ isActive }) => isActive ? "text-white font-bold" : "text-gray-200"}
//                         >
//                           Logout
//                         </NavLink>
//                     </div>
                    
//                     {/* <button className='bg-transparent tracking-wide flex duration-200 ease-in-out hover:opacity-50'>
//                         <HiOutlineBars3 size={24} />
//                     </button> */}
//                 </div>
//             </div>
//         </nav>
//     );
// }

// export default NavbarHome;


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
        >
          Profile
        </Link>
        <Link
          to="/About"
          className="hover:text-emerald-400 transition px-3 py-1 rounded-lg focus:outline-none"
        >
          About
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;


