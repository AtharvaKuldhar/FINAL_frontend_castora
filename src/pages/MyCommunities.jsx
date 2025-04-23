import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';
import { Menu, X, Shield, Server, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyCommunities = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin'); // 'admin' | 'voter'
  const [communities, setCommunities] = useState({ admin: [], user: [] });
  const [communitiesWithPendingResults, setCommunitiesWithPendingResults] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://e-voting-blockchain-5n6q.onrender.com/myCommunity', {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setCommunities(response.data);
        
        // If user is admin, check for completed elections with unpublished results
        if (role === 'admin' && response.data.admin && response.data.admin.length > 0) {
          await checkForPendingResults(response.data.admin, token);
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, [role]);

  // Check for communities with completed elections that need results published
  const checkForPendingResults = async (adminCommunities, token) => {
    try {
      const pendingResultsCommunities = [];
      
      for (const community of adminCommunities) {
        // Fetch elections for this community
        const electionsResponse = await axios.get('https://e-voting-blockchain-5n6q.onrender.com/getElections', {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            community_key: community.key,
          },
        });
        
        // Check if any election is completed but results not published
        const now = new Date();
        const hasCompletedUnpublishedElections = electionsResponse.data.some(
          election => new Date(election.endDate) < now && !election.resultsPublished
        );
        
        if (hasCompletedUnpublishedElections) {
          pendingResultsCommunities.push(community.key);
        }
      }
      
      setCommunitiesWithPendingResults(pendingResultsCommunities);
    } catch (error) {
      console.error('Error checking for pending results:', error);
    }
  };

  const getDisplayedCommunities = () => {
    if (role === 'admin') return communities.admin || [];
    return [...(communities.user || []), ...(communities.admin || [])];
  };

  const displayedCommunities = getDisplayedCommunities();

  const handleEnterElection = async (community) => {
    try {
      const token = localStorage.getItem('token');
      // Call the backend to fetch elections
      const response = await axios.get('https://e-voting-blockchain-5n6q.onrender.com/getElections', {
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
      localStorage.setItem('role', role);

      // Navigate to the elections page
      if (role === 'admin') {
        // Navigate to ongoing elections tab
        navigate(`/election`);
      } else {
        // Voter views elections
        navigate(`/election`);
      }
    } catch (error) {
      console.error('Error fetching elections:', error);
      alert('Failed to fetch elections. Please try again.');
    }
  };

  const handlePublishResults = async (community) => {
    try {
      const token = localStorage.getItem('token');
      // Call the backend to fetch elections
      const response = await axios.get('https://e-voting-blockchain-5n6q.onrender.com/getElections', {
        headers: {
          'token': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          community_key: community.key,
        },
      });

      // Store the elections data in localStorage
      localStorage.setItem('ElectionsData', JSON.stringify(response.data));

      // Store selected community key and name in localStorage
      localStorage.setItem('selectedCommunityKey', community.key);
      localStorage.setItem('selectedCommunityName', community.collectionName);
      localStorage.setItem('role', role);
      localStorage.setItem('viewMode', 'publishResults'); // Special flag to indicate we're publishing results

      // Navigate directly to past elections tab
      navigate(`/election?tab=past`);
    } catch (error) {
      console.error('Error fetching elections for publishing results:', error);
      alert('Failed to fetch elections. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-green-400 relative">
      {/* Matrix-like background effect */}
      <div 
        className="absolute inset-0 z-0 opacity-10" 
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(32, 202, 90, 0.4) 25%, rgba(32, 202, 90, 0.4) 26%, transparent 27%, transparent 74%, rgba(32, 202, 90, 0.4) 75%, rgba(32, 202, 90, 0.4) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 202, 90, 0.4) 25%, rgba(32, 202, 90, 0.4) 26%, transparent 27%, transparent 74%, rgba(32, 202, 90, 0.4) 75%, rgba(32, 202, 90, 0.4) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Sidebar - Desktop */}
      <div className="hidden md:block md:w-64 bg-gray-950 border-r border-green-800 z-10">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-green-800"
          >
            <div className="flex justify-end p-4">
              <button onClick={toggleSidebar} className="text-green-400 hover:text-green-300">
                <X size={24} />
              </button>
            </div>
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        <header className="bg-gray-950 bg-opacity-90 p-4 border-b border-green-800 flex justify-between items-center shadow-lg shadow-green-900/10">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="md:hidden text-green-400 hover:text-green-300">
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-mono text-green-400 tracking-wider flex items-center">
              <Shield size={20} className="mr-2 text-green-500" /> 
              ChainVote
            </h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Communities Section Header */}
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center justify-center">
                <div className="h-px w-8 bg-green-500 mr-4"></div>
                <h1 className="text-2xl md:text-3xl font-bold font-mono text-green-400">
                  {role === 'admin' ? '> CREATED_COMMUNITIES' : '> JOINED_COMMUNITIES'}
                </h1>
                <div className="h-px w-8 bg-green-500 ml-4"></div>
              </div>
              
              <p className="text-green-300/70 font-mono text-sm">
                {role === 'admin' 
                  ? 'Access and manage your created communities and their elections'
                  : 'View and participate in communities you have joined'}
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex justify-center space-x-4 mb-10">
              <button
                onClick={() => setRole('admin')}
                className={`px-6 py-2 rounded-md transition font-mono text-sm border ${
                  role === 'admin'
                    ? 'bg-green-600/20 text-green-400 border-green-600'
                    : 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700 text-gray-400 hover:text-gray-300'
                }`}
              >
                ADMIN MODE
              </button>
              <button
                onClick={() => setRole('voter')}
                className={`px-6 py-2 rounded-md transition font-mono text-sm border ${
                  role === 'voter'
                    ? 'bg-green-600/20 text-green-400 border-green-600'
                    : 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700 text-gray-400 hover:text-gray-300'
                }`}
              >
                VOTER MODE
              </button>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCommunities.length === 0 ? (
                <div className="col-span-full bg-gray-900/60 border border-green-800/30 rounded-lg p-8 text-center">
                  <Server size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 font-mono">
                    No communities found for <span className="text-green-400 font-semibold">{role.toUpperCase()}</span> role
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {role === 'admin' ? 'Create a community to get started' : 'Join a community to get started'}
                  </p>
                </div>
              ) : (
                displayedCommunities.map((community, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/60 border border-green-800/30 rounded-lg overflow-hidden shadow-lg hover:shadow-green-900/20 transition-all relative"
                  >
                    {/* Card header with decorative elements */}
                    <div className="absolute top-0 right-0 w-16 h-16">
                      <div className="absolute right-0 w-16 h-16 bg-green-500/5"></div>
                      <div className="absolute right-0 w-8 h-8 bg-green-500/10"></div>
                      <div className="absolute right-0 w-4 h-4 bg-green-500/20"></div>
                    </div>
                    
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="bg-green-500/10 px-2 py-1 rounded text-xs font-mono text-green-300">ID:{index + 1}</div>
                        <div className="flex space-x-1">
                          {Array(3).fill(0).map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-green-400' : 'bg-green-800'}`}></div>
                          ))}
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-green-400 mb-3 font-mono text-center border-b border-green-800/30 pb-3">
                        {community.collectionName}
                      </h2>
                      
                      {role === 'admin' && communitiesWithPendingResults.includes(community.key) && (
                        <div className="mb-4 bg-yellow-900/30 border-l-4 border-yellow-600 text-yellow-500 py-2 px-3 rounded-md text-sm font-mono flex items-center">
                          <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                          <span>Results pending publication</span>
                        </div>
                      )}
                      
                      <div className="pt-2 space-y-3">
                        <div className="text-xs font-mono text-green-300/60 flex items-center">
                          <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                          <span>KEY: {community.key.substring(0, 8)}...</span>
                        </div>
                        
                        <button
                          onClick={() => handleEnterElection(community)}
                          className="w-full bg-gray-800 hover:bg-gray-700 border border-green-700 text-green-400 font-mono px-4 py-2 rounded flex items-center justify-between group transition-all"
                        >
                          <span>{role === 'admin' ? 'MANAGE ELECTIONS' : 'ENTER ELECTIONS'}</span>
                          <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        {role === 'admin' && communitiesWithPendingResults.includes(community.key) && (
                          <button
                            onClick={() => handlePublishResults(community)}
                            className="w-full bg-yellow-800/50 hover:bg-yellow-700/50 border border-yellow-600 text-yellow-400 font-mono px-4 py-2 rounded flex items-center justify-between group transition-all"
                          >
                            <span className="flex items-center">
                              <Activity size={16} className="mr-2" />
                              PUBLISH RESULTS
                            </span>
                            <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </main>

        <footer className="bg-gray-950 bg-opacity-90 p-4 border-t border-green-800/50 text-center">
          <div className="flex justify-center items-center space-x-4">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-500 text-xs font-mono">&lt;/CYBR_COMM_INTERFACE v1.0&gt;</p>
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MyCommunities;