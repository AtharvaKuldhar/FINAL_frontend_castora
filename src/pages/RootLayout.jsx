import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarLanding from '../components/NavbarLanding';
import NavbarHome from '../components/NavbarHome';

const RootLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Conditions
  const isLandingPage = path === '/';
  const useLandingNavbar = path === '/landing' || path === '/about';
  const useHomeNavbar = !isLandingPage && !useLandingNavbar;

  return (
    <>
      {useLandingNavbar && <NavbarLanding />}
      {useHomeNavbar && <NavbarHome />}
      
      {/* Only render <main> when not on "/" */}
      {!isLandingPage && (
        <main>
          <Outlet />
        </main>
      )}

      {/* Render outlet directly for landing page */}
      {isLandingPage && <Outlet />}
    </>
  );
};

export default RootLayout;
