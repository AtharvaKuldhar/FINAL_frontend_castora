import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import VerticalCard from '../components/VerticalCard';
import axios from 'axios';

const Elections = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromQuery === 'past' ? 'past' : 'ongoing');
  const [electionsData, setElectionsData] = useState({ ongoing: [], past: [] });
  const [communityName, setCommunityName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPublishingResults, setIsPublishingResults] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
    
    // Check if we're in publish results mode
    const viewMode = localStorage.getItem('viewMode');
    setIsPublishingResults(viewMode === 'publishResults');
    
    // Clear the viewMode flag once used
    if (viewMode === 'publishResults') {
      localStorage.removeItem('viewMode');
    }

    // Get data from localStorage
    const storedElections = localStorage.getItem('ElectionsData');
    const communityName = localStorage.getItem('selectedCommunityName');
    
    if (communityName) {
      setCommunityName(communityName);
    } else {
      setCommunityName(id || 'Community');
    }
    
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
          // Add resultsPublished property if it doesn't exist
          if (!election.hasOwnProperty('resultsPublished')) {
            election.resultsPublished = false;
          }
          past.push(election);
        }
      });
      
      setElectionsData({ ongoing, past });
    }
  }, [id, location.search]);

  // Get current elections based on active tab
  const currentElections = activeTab === 'ongoing' ? electionsData.ongoing : electionsData.past;

  const handlePublishResults = async (electionId) => {
    try {
      const token = localStorage.getItem('token');
      // Call the API to publish results
      await axios.post('http://localhost:5001/publishResults', 
        { electionId },
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Update the local state
      const updatedPastElections = electionsData.past.map(election => {
        if (election._id === electionId) {
          return { ...election, resultsPublished: true };
        }
        return election;
      });

      setElectionsData({
        ...electionsData,
        past: updatedPastElections
      });

      // Update the localStorage data
      const allElections = [...electionsData.ongoing, ...updatedPastElections];
      localStorage.setItem('ElectionsData', JSON.stringify(allElections));

      alert('Results published successfully!');
    } catch (error) {
      console.error('Error publishing results:', error);
      alert('Failed to publish results. Please try again.');
    }
  };

  const handleStartNewElection = () => {
    const communityKey = localStorage.getItem('selectedCommunityKey');
    if (communityKey) {
      navigate(`/communities/${communityName}/createelections`);
    } else {
      alert('Community key not found. Please select a community first.');
    }
  };

  const renderElectionCard = (election, index) => {
    const isPastElection = activeTab === 'past';
    
    // Determine the button action and text based on user role and election status
    let buttonText = '';
    let buttonAction = () => {};
    let buttonDisabled = false;
    
    if (isAdmin) {
      if (isPastElection) {
        buttonText = election.resultsPublished ? 'Results Published' : 'Publish Results';
        buttonDisabled = election.resultsPublished;
        buttonAction = () => handlePublishResults(election._id);
      } else {
        buttonText = 'Manage Election';
        buttonAction = () => {
          localStorage.setItem('selectedElectionId', election._id);
          navigate(`/elections/manage`);
        };
      }
    } else { // Voter view
      if (isPastElection) {
        buttonText = 'Show Results';
        buttonDisabled = !election.resultsPublished;
        buttonAction = () => {
          if (election.resultsPublished) {
            localStorage.setItem('selectedElectionId', election._id);
            navigate(`/elections/results`);
          }
        };
      } else {
        buttonText = 'Vote';
        buttonAction = () => {
          localStorage.setItem('selectedElectionId', election._id);
          navigate(`/elections/vote`);
        };
      }
    }

    return (
      <VerticalCard key={index} className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          {election.electionName}
        </h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>Start: {new Date(election.startDate).toLocaleDateString()}</p>
          <p>End: {new Date(election.endDate).toLocaleDateString()}</p>
          {election.description && (
            <p className="text-gray-700">{election.description}</p>
          )}
          {isPastElection && !isAdmin && (
            <p className="text-sm italic text-gray-500">
              {election.resultsPublished 
                ? "Results are available" 
                : "Results have not been published yet"}
            </p>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={buttonAction}
            disabled={buttonDisabled}
            className={`font-semibold px-6 py-3 rounded-xl transition duration-300 ease-in-out ${
              buttonDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:shadow-xl hover:-translate-y-1 hover:scale-105'
            }`}
          >
            {buttonText}
          </button>
        </div>
      </VerticalCard>
    );
  };

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
          
          {/* Toggle buttons for ongoing/past elections - hide if in publishing results mode */}
          {!isPublishingResults && (
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
          )}
          
          {/* Create New Election button - only show in ongoing tab for admin */}
          {isAdmin && activeTab === 'ongoing' && !isPublishingResults && (
            <div className="mt-6">
              <button
                onClick={handleStartNewElection}
                className="bg-green-600 text-white font-semibold px-8 py-3 rounded-xl transition duration-300 ease-in-out hover:bg-green-700"
              >
                Create New Election
              </button>
            </div>
          )}
        </div>

        {/* Elections List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentElections.length === 0 ? (
            <p className="text-gray-500 text-lg text-center col-span-full">
              No {activeTab} elections found.
            </p>
          ) : (
            currentElections.map((election, index) => renderElectionCard(election, index))
          )}
        </div>
      </div>
    </section>
  );
};

export default Elections;