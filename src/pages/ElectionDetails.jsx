import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Election from '../components/Election';
import Sidebar from '../components/SidebarLeft';
import { ethers } from 'ethers';
import ElectionABI from '../abi/ElectionABI.json';
// import { Loader } from '../components/loader';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [filter, setFilter] = useState('ongoing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get elections data from localStorage
        const electionsData = JSON.parse(localStorage.getItem('ElectionsData')) || [];
        
        // Ensure data is an array
        const allElections = Array.isArray(electionsData) ? electionsData : [electionsData];

        // Filter elections based on status and current date
        const currentDate = new Date();
        const filteredElections = allElections.filter(election => {
          const startDate = new Date(election.startDate);
          const endDate = new Date(election.endDate);
          
          if (filter === 'ongoing') {
            return election.status === 'active' && 
                   currentDate >= startDate && 
                   currentDate <= endDate;
          } else {
            return currentDate > endDate;
          }
        }).map(election => ({
          ...election,
          community_name: election.community_name || 'Unknown',
          community_key: election.community_key || ''
        }));

        // Verify blockchain status if ethereum is available
        if (window.ethereum && filteredElections.length > 0) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            for (let election of filteredElections) {
              if (election.election_address) {
                const contract = new ethers.Contract(
                  election.election_address, 
                  ElectionABI, 
                  provider
                );
                const balance = await contract.getContractBalance();
                election.isActiveOnChain = balance > 0;
              }
            }
          } catch (chainError) {
            console.error('Blockchain verification error:', chainError);
            // Continue with the data we have
          }
        }

        setElections(filteredElections);
      } catch (err) {
        console.error('Error processing elections:', err);
        setError(err.message || 'Failed to load elections. Please try again later.');
        setElections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [filter]);

  const handleCreateElection = () => {
    navigate('/create-election');
  };

  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="hidden md:block md:w-64 border-r border-gray-200 bg-white">
        <Sidebar />
      </div>
      
      <div className="flex-1 p-4 md:p-6">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {filter === 'ongoing' ? 'Ongoing Elections' : 'Past Elections'}
            </h1>
            <div className="mt-3 md:mt-4 flex space-x-3">
              <button
                onClick={() => setFilter('ongoing')}
                disabled={loading}
                className={`px-3 py-1 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base ${
                  filter === 'ongoing' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={filter === 'ongoing'}
                aria-label="Show ongoing elections"
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilter('past')}
                disabled={loading}
                className={`px-3 py-1 md:px-4 md:py-2 rounded-lg transition text-sm md:text-base ${
                  filter === 'past' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={filter === 'past'} 
                aria-label="Show past elections"
              >
                Past
              </button>
            </div>
          </div>
          
          {filter === 'ongoing' && (
            <button 
              onClick={handleCreateElection}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center text-sm md:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Election
            </button>
          )}
        </header>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {elections.length > 0 ? (
              elections.map(election => (
                <Election 
                  key={election._id} 
                  {...election} 
                  isBlockchainVerified={election.isActiveOnChain} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 mx-auto text-gray-400 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <p className="text-gray-500 text-lg">
                  No {filter} elections found.
                </p>
                {filter === 'ongoing' && (
                  <button 
                    onClick={handleCreateElection}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Create your first election
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Elections;