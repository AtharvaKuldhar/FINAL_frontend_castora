import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* Fixed Navbar */}
      <header
  className="
    w-full
    fixed top-0 left-0 h-16
    bg-black text-white
    flex items-center justify-between
    px-6
    shadow-[0_4px_6px_rgba(0,255,0,0.3)]
    z-30
  "
>

        <Link to="/Home" className="text-2xl font-bold text-emerald-400 mx-auto sm:mx-0">
          ChainVote
        </Link>

        <nav className="flex gap-8 items-center text-lg font-extrabold sm:ml-auto">
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

      {/* Spacer to push content below the navbar + 30px */}
      <div className="h-[94px] bg-black" />
    </>
  );
};

export default Navbar;
