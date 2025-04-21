import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import VerticalCard from '../components/VerticalCard';
import axios from 'axios';

const MyCommunities = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin'); // 'admin' | 'voter'
  const [communities, setCommunities] = useState({ admin: [], user: [] });

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/myCommunity', {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const getDisplayedCommunities = () => {
    if (role === 'admin') return communities.admin || [];
    return [...(communities.user || []), ...(communities.admin || [])];
  };

  const displayedCommunities = getDisplayedCommunities();

  const handleEnterElection = async (community) => {
    try {
      const token = localStorage.getItem('token');
      // Call the backend to fetch elections
      const response = await axios.get('http://localhost:5001/getElections', {
        headers: {
          'token': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          community_key: community.key, // Pass community_key as query param
        },
      });

      // Store the elections data in localStorage
      localStorage.setItem('ElectionsData', JSON.stringify(response.data));

      // Store selected community key and name in localStorage
      localStorage.setItem('selectedCommunityKey', community.key);
      localStorage.setItem('selectedCommunityName', community.collectionName);

      // Navigate to the elections page
      if (role === 'admin') {
        // Admin creates elections
        navigate(`/communities/${community.collectionName}/createelections`);
      } else {
        // Voter views elections
        navigate(`/election`);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
      alert('Failed to fetch elections. Please try again.');
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <div className="w-64 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 mt-20">
        {/* Communities Section */}
        <div className="text-center space-y-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === 'admin' ? 'My Created Communities' : 'My Joined Communities'}
          </h1>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setRole('admin')}
              className={`px-6 py-3 rounded-lg transition font-semibold ${role === 'admin'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              Admin
            </button>
            <button
              onClick={() => setRole('voter')}
              className={`px-6 py-3 rounded-lg transition font-semibold ${role === 'voter'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              Voter
            </button>
          </div>
        </div>

        {/* Communities List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCommunities.length === 0 ? (
            <p className="text-gray-500 text-lg text-center w-full">
              No communities found for <span className="font-semibold">{role}</span> role.
            </p>
          ) : (
            displayedCommunities.map((community, index) => (
              <VerticalCard key={index} className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {community.collectionName}
                </h2>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handleEnterElection(community)}
                    className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                  >
                    {role === 'admin' ? 'Start Election' : 'Enter Election'}
                  </button>
                </div>
              </VerticalCard>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MyCommunities;