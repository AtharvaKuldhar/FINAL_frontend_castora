import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import VerticalCard from '../components/VerticalCard';

const Elections = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [electionsData, setElectionsData] = useState({ ongoing: [], past: [] });
  const [communityName, setCommunityName] = useState('');

  useEffect(() => {
    // Get data from localStorage
    const storedElections = localStorage.getItem('ElectionsData');
    const communityKey = localStorage.getItem('selectedCommunityKey');
    
    if (storedElections) {
      const parsedData = JSON.parse(storedElections);
      
      // Separate ongoing from past elections based on endDate
      const now = new Date();
      const ongoing = [];
      const past = [];
      
      parsedData.forEach(election => {
        const endDate = new Date(election.endDate);
        if (endDate > now) {
          ongoing.push(election);
        } else {
          past.push(election);
        }
      });
      
      setElectionsData({ ongoing, past });
      
      // Try to get community name if available
      if (parsedData.length > 0 && parsedData[0].communityName) {
        setCommunityName(parsedData[0].communityName);
      } else {
        setCommunityName(id || 'Community');
      }
    }
  }, [id]);

  // Get current elections based on active tab
  const currentElections = activeTab === 'ongoing' ? electionsData.ongoing : electionsData.past;

  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <div className="w-64 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 mt-20">
        <div className="text-center space-y-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-800">
            {communityName} Elections
          </h1>
          
          {/* Toggle buttons for ongoing/past elections */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-3 rounded-lg transition font-semibold ${
                activeTab === 'ongoing'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Ongoing Elections
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-3 rounded-lg transition font-semibold ${
                activeTab === 'past'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Past Elections
            </button>
          </div>
        </div>

        {/* Elections List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentElections.length === 0 ? (
            <p className="text-gray-500 text-lg text-center col-span-full">
              No {activeTab} elections found.
            </p>
          ) : (
            currentElections.map((election, index) => (
              <VerticalCard key={index} className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {election.title || election.name}
                </h2>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Start: {new Date(election.startDate).toLocaleDateString()}</p>
                  <p>End: {new Date(election.endDate).toLocaleDateString()}</p>
                  {election.description && (
                    <p className="text-gray-700">{election.description}</p>
                  )}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      // Store the selected election ID in localStorage
                      localStorage.setItem('selectedElectionId', election.id || election._id);
                      // Navigate to election details page
                      window.location.href = `/elections/vote`;
                    }}
                    className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                  >
                    {activeTab === 'ongoing' ? 'Enter Election' : 'View Results'}
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

export default Elections;