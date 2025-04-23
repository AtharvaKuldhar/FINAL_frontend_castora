import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';
import { ethers } from 'ethers';
import ElectionABI from '../abi/ElectionABI.json';

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
  const [isLoading, setIsLoading] = useState(false);
  const [createElectionLoading, setCreateElectionLoading] = useState(false);

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
      setIsLoading(true);
      // Ensure MetaMask is detected
      if (!window.ethereum) {
        alert('MetaMask is not detected. Please ensure it is installed and enabled.');
        setIsLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Request account access to ensure MetaMask is active
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log('Connected MetaMask address:', signerAddress);

      // Use the imported ElectionABI directly
      const contractAddress = currentElections.find(e => e._id === electionId)?.election_address;
      if (!contractAddress) throw new Error('Contract address not found');
      const contract = new ethers.Contract(contractAddress, ElectionABI, signer);

      // Verify admin address
      const contractAdmin = await contract.admin();
      console.log('Contract admin address:', contractAdmin);
      if (signerAddress.toLowerCase() !== contractAdmin.toLowerCase()) {
        throw new Error('Connected MetaMask address does not match the contract admin address.');
      }

      // Withdraw funds using MetaMask
      const tx = await contract.withdrawAllFunds({ gasLimit: 200000 });
      await tx.wait();
      console.log(`Funds withdrawn from ${contractAddress}:`, tx.hash);

      // Call the API to publish results after withdrawal
      const token = localStorage.getItem('token');
      await axios.post('https://e-voting-blockchain-5n6q.onrender.com/publishResults', 
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

      alert('Results published and funds withdrawn successfully!');
    } catch (error) {
      console.error('Error publishing results or withdrawing funds:', error);
      if (error.code === 'ACTION_REJECTED') {
        alert('Transaction rejected by MetaMask. Please try again.');
      } else if (error.message.includes('admin address')) {
        alert('Error: The connected MetaMask address does not match the contract admin address. Please use the admin account that created the election.');
      } else {
        alert('Failed to publish results or withdraw funds. Please ensure you are the admin and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewElection = () => {
    const communityKey = localStorage.getItem('selectedCommunityKey');
    if (communityKey) {
      setCreateElectionLoading(true);
      // Simulate loading for 1.5 seconds before navigating
      setTimeout(() => {
        setCreateElectionLoading(false);
        navigate(`/communities/${communityName}/createelections`);
      }, 1500);
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
    let buttonColor = 'bg-green-600 hover:bg-green-700';
    
    if (isAdmin) {
      if (isPastElection) {
        buttonText = election.resultsPublished ? 'Results Published' : 'Publish Results';
        buttonDisabled = election.resultsPublished;
        buttonAction = () => handlePublishResults(election._id);
        buttonColor = election.resultsPublished ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700';
      } else {
        buttonText = 'Manage Election';
        buttonAction = () => {
          localStorage.setItem('selectedElectionId', election._id);
          navigate(`/elections/manage`);
        };
        buttonColor = 'bg-purple-600 hover:bg-purple-700';
      }
    } else { // Voter view
      if (isPastElection) {
        buttonText = 'Show Results';
        buttonDisabled = !election.resultsPublished;
        buttonAction = () => {
          if (election.resultsPublished) {
            localStorage.setItem('selectedElectionId', election._id);
            navigate(`/results`);
          }
        };
        buttonColor = election.resultsPublished ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600';
      } else {
        buttonText = 'Vote';
        buttonAction = () => {
          localStorage.setItem('selectedElectionId', election._id);
          navigate(`/elections/vote`);
        };
        buttonColor = 'bg-green-600 hover:bg-green-700';
      }
    }

    const cardBackgroundClass = isPastElection ? 'bg-gray-800' : 'bg-gray-900';
    const textColorClass = 'text-gray-100';

    return (
      <div key={index} className={`${cardBackgroundClass} rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-t-4 border-green-500 max-w-sm mx-auto`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold ${textColorClass} mb-4 text-center`}>
            {election.electionName}
          </h2>
          <div className="text-gray-300 space-y-2">
            <p className="flex items-center">
              <span className="text-green-400 mr-2">▶</span> 
              Start: {new Date(election.startDate).toLocaleDateString()}
            </p>
            <p className="flex items-center">
              <span className="text-red-400 mr-2">◼</span> 
              End: {new Date(election.endDate).toLocaleDateString()}
            </p>
            {election.description && (
              <p className="text-gray-300 mt-2 border-l-2 border-green-500 pl-3">
                {election.description}
              </p>
            )}
            {isPastElection && !isAdmin && (
              <p className="text-sm italic text-gray-400">
                {election.resultsPublished 
                  ? "✓ Results are available" 
                  : "⏱ Results have not been published yet"}
              </p>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={buttonAction}
              disabled={buttonDisabled || isLoading}
              className={`font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out ${
                buttonDisabled 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : `${buttonColor} text-white hover:shadow-lg hover:-translate-y-1`
              }`}
            >
              {isLoading ? 
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span> : 
                buttonText
              }
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-col md:flex-row min-h-screen bg-gray-900">
      {/* Mobile sidebar toggle - could be expanded into a working drawer */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">{communityName}</h1>
        <button className="text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar on the left - hidden on mobile */}
      <div className="hidden md:block md:w-64 border-r border-gray-700 bg-gray-900">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 mt-0 md:mt-20 bg-gray-900 text-white">
        <div className="text-center space-y-8 mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-green-400 glow">
            {communityName} <span className="text-white">Elections</span>
          </h1>
          
          {/* Toggle buttons for ongoing/past elections - hide if in publishing results mode */}
          {!isPublishingResults && (
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg transition font-semibold ${
                  activeTab === 'ongoing'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Ongoing Elections
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg transition font-semibold ${
                  activeTab === 'past'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                disabled={createElectionLoading}
                className="bg-green-600 text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-lg transition duration-300 ease-in-out hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mx-auto"
              >
                {createElectionLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="mr-2">+</span>
                    Create New Election
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Elections List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentElections.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 text-lg text-center mb-4">
                No {activeTab} elections found.
              </div>
              <div className="text-green-500 text-4xl animate-pulse">⚠</div>
            </div>
          ) : (
            currentElections.map((election, index) => renderElectionCard(election, index))
          )}
        </div>
      </div>
    </section>
  );
};

export default Elections;