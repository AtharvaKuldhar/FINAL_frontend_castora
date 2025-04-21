import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavbarLanding from '../components/NavbarLanding';
import NavbarHome from '../components/NavbarHome';
const RootLayout = () => {
  const location = useLocation();
  console.log("Current Path:", location.pathname); 

  const isLandingOrAbout = location.pathname === '/' || location.pathname === '/about';
  const isHome = location.pathname === '/home';
  return (
    <>
      {isLandingOrAbout ? <NavbarLanding /> : <NavbarHome />}
        <main>
          <Outlet/>
        </main>
    </>
  )
}

export default RootLayout