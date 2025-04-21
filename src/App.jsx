import { useState } from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';

import RootLayout from './pages/RootLayout.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Register from './pages/Register.jsx';
import Elections from './pages/Elections.jsx';
import ElectionDetails from './pages/ElectionDetails.jsx';
import Candidates from './pages/Candidates.jsx';
import Congrats from './pages/Congrats.jsx';
import Results from './pages/Results.jsx';
import Login from './pages/Login.jsx';
import Landing from './pages/Landing.jsx';
import About from './pages/About.jsx';
import Home from './pages/Home.jsx';
import MyCommunities from './pages/MyCommunities.jsx';
import CreateCommunity from './pages/CreateCommunity.jsx';
import CreateElection from './pages/CreateElections.jsx';
import JoinCommunity from './pages/JoinCommunity.jsx';
import Profile from './pages/Profile.jsx';
import ManageCommunity from './pages/ManageCommunity.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/landing" replace />
      },
      {
        path: 'landing',
        element: <Landing />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'results',
        element: <Results />
      },
      {
        path: 'communities/:id/createelections',
        element: <CreateElection />
      },
      {
        path: 'communities/:id/elections',
        element: <Elections />
      },
      {
        path: 'elections/:id',
        element: <ElectionDetails />
      },
      {
        path: 'elections/:id/candidates',
        element: <Candidates />
      },
      {
        path: 'congrats',
        element: <Congrats />
      },
      {
        path: 'communities/:id',
        element: <MyCommunities />
      },
      {
        path: 'communities/:id/manage',
        element: <ManageCommunity />
      },
      {
        path: 'communities/:id/create',
        element: <CreateCommunity />
      },
      {
        path: 'communities/:id/join',
        element: <JoinCommunity />
      },
      {
        path: 'profile/:id',
        element: <Profile />
      }
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
