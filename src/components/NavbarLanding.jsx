import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarLanding = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  // return (
  //   <>
  //     {/* Navbar */}
  //     <header
  //       className={`fixed w-full z-50 transition-all duration-300 ${
  //         scrolled
  //           ? 'bg-white shadow-[0_4px_6px_rgba(0,255,0,0.3)]'
  //           : 'bg-transparent'
  //       }`}
  //     >
  //       <div className="container mx-auto px-4 py-4">
  //         <div className="flex justify-between items-center">
  //           <div
  //             className="text-2xl font-bold text-indigo-900 cursor-pointer"
  //             onClick={() => navigate('/')}
  //           >
  //             Chain<span className="text-blue-500">Vote</span>
  //           </div>
  //           <nav className="hidden md:block">
  //             <ul className="flex space-x-8">
  //               <li>
  //                 <button
  //                   onClick={() => scrollToSection('features')}
  //                   className="text-indigo-900 hover:text-blue-500 transition"
  //                 >
  //                   Features
  //                 </button>
  //               </li>
  //               <li>
  //                 <button
  //                   onClick={() => scrollToSection('how-it-works')}
  //                   className="text-indigo-900 hover:text-blue-500 transition"
  //                 >
  //                   How It Works
  //                 </button>
  //               </li>
  //               <li>
  //                 <button
  //                   onClick={goToLogin}
  //                   className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
  //                 >
  //                   Log In
  //                 </button>
  //               </li>
  //             </ul>
  //           </nav>
  //           <div className="md:hidden">
  //             <button
  //               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  //               className="text-indigo-900 text-2xl focus:outline-none"
  //             >
  //               {mobileMenuOpen ? '✕' : '☰'}
  //             </button>
  //           </div>
  //         </div>

  //         {/* Mobile Nav */}
  //         {mobileMenuOpen && (
  //           <nav className="mt-4 md:hidden bg-indigo-50 rounded-lg shadow-xl">
  //             <ul className="flex flex-col py-3">
  //               <li>
  //                 <button
  //                   onClick={() => scrollToSection('features')}
  //                   className="text-indigo-900 py-2 px-4 block hover:bg-indigo-100 rounded-md mx-2"
  //                 >
  //                   Features
  //                 </button>
  //               </li>
  //               <li>
  //                 <button
  //                   onClick={() => scrollToSection('how-it-works')}
  //                   className="text-indigo-900 py-2 px-4 block hover:bg-indigo-100 rounded-md mx-2"
  //                 >
  //                   How It Works
  //                 </button>
  //               </li>
  //               <li className="mt-2 mx-2">
  //                 <button
  //                   onClick={goToLogin}
  //                   className="bg-indigo-600 text-white w-full py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
  //                 >
  //                   Log In
  //                 </button>
  //               </li>
  //             </ul>
  //           </nav>
  //         )}
  //       </div>
  //     </header>

  //     {/* Spacer */}
  //     <div className="h-[94px] bg-white" />
  //   </>
  // );
}

export default NavbarLanding;
