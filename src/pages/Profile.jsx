import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarLeft";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Activity, Users, Vote, Calendar, ChevronRight, Shield, Loader2, Mail, Clock } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({});
  const [createdCount, setCreatedCount] = useState(null);
  const [joinedCount, setJoinedCount] = useState(null);
  const [votedCount, setVotedCount] = useState(null);
  const [activeElections, setActiveElections] = useState([]);
  const [communitiesWithElections, setCommunitiesWithElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { token: `Bearer ${token}` };

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch main user data and communities with elections
        const userResponse = await axios.get("https://e-voting-blockchain-5n6q.onrender.com/activeElection", { headers });
        
        if (userResponse.data) {
          // Simulate loading with delay for visual effect
          setTimeout(() => {
            // Set user data
            setUser(userResponse.data.user || {});
            
            // Calculate created and joined communities from the user object directly
            if (userResponse.data.user && userResponse.data.user.communities) {
              // Count admin communities (created)
              const adminCommunities = userResponse.data.user.communities.admin || [];
              setCreatedCount(adminCommunities.length);
              
              // Count regular user communities (joined)
              const userCommunities = userResponse.data.user.communities.user || [];
              setJoinedCount(userCommunities.length);
            }
            
            // Set communities with elections data
            if (userResponse.data.communitiesWithElections) {
              setCommunitiesWithElections(userResponse.data.communitiesWithElections);
              
              // Extract all active elections across communities
              const allActiveElections = [];
              userResponse.data.communitiesWithElections.forEach(community => {
                if (community.elections && community.elections.length > 0) {
                  community.elections.forEach(election => {
                    allActiveElections.push({
                      ...election,
                      communityName: community.community_name,
                      communityKey: community.community_key
                    });
                  });
                }
              });
              
              setActiveElections(allActiveElections);
            }
          }, 800);
        }

        // Fetch voted count separately
        const votedRes = await axios.get("https://e-voting-blockchain-5n6q.onrender.com/voted", { headers });
        setVotedCount(votedRes.data?.count || 0);
        
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error("Failed to load profile data", err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // List item animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const sectionTabs = [
    { name: "Profile", icon: <User size={18} /> },
    { name: "Communities", icon: <Calendar size={18} /> },
    { name: "Elections", icon: <Activity size={18} /> }
  ];

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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-block bg-green-500/10 rounded-full p-3 mb-4 border border-green-500/30">
                <User size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-mono text-green-400 mb-2">
                {'>'} USER_PROFILE
              </h2>
              <div className="w-16 h-1 bg-green-500 mx-auto mb-4"></div>
              <p className="text-green-300 opacity-80 font-mono text-sm md:text-base">
                Access your personal data and activity logs
              </p>
            </div>

            {/* Mobile Tabs Navigation */}
            <div className="md:hidden flex justify-center mb-6">
              <div className="flex bg-gray-800/60 backdrop-blur-sm rounded-lg p-1 border border-green-800/40">
                {sectionTabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSectionIndex(index)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm transition-all ${
                      activeSectionIndex === index 
                        ? "bg-green-700/80 text-white" 
                        : "text-green-300 hover:bg-green-900/40"
                    }`}
                  >
                    <span className="mr-1">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Info Section */}
            <AnimatePresence mode="wait">
              {(activeSectionIndex === 0 || !("md:block" === "hidden")) && (
                <motion.div
                  key="profile-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gray-900 bg-opacity-80 rounded-lg shadow-xl border border-green-900/50 p-6 mb-8 ${
                    activeSectionIndex !== 0 && "md:block hidden"
                  }`}
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-green-500/10 p-2 rounded-md mr-3">
                      <User className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-mono text-green-400">
                      Profile Information
                    </h3>
                  </div>

                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-green-900/40 rounded w-1/4"></div>
                      <div className="h-4 bg-green-900/40 rounded w-1/3"></div>
                      <div className="h-4 bg-green-900/40 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <div className="space-y-4 font-mono">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-green-500" />
                        <span className="text-green-300">Username:</span>
                        <span className="text-white bg-gray-800 px-2 py-1 rounded">{user.username || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail size={16} className="text-green-500" />
                        <span className="text-green-300">Email:</span>
                        <span className="text-white bg-gray-800 px-2 py-1 rounded">{user.email || "N/A"}</span>
                      </div>
                      {user.createdAt && (
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-green-500" />
                          <span className="text-green-300">Joined:</span>
                          <span className="text-white bg-gray-800 px-2 py-1 rounded">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    {[
                      { 
                        count: createdCount, 
                        label: "Communities Created", 
                        icon: <Activity className="w-5 h-5" />,
                        color: "from-blue-500/20 to-green-500/20",
                        borderColor: "blue-500/50" 
                      },
                      { 
                        count: joinedCount, 
                        label: "Communities Joined", 
                        icon: <Users className="w-5 h-5" />,
                        color: "from-green-500/20 to-teal-500/20",
                        borderColor: "green-500/50"
                      },
                      { 
                        count: votedCount, 
                        label: "Votes Cast", 
                        icon: <Vote className="w-5 h-5" />,
                        color: "from-purple-500/20 to-blue-500/20",
                        borderColor: "purple-500/50"
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        custom={idx}
                        initial="hidden"
                        animate={loading ? "hidden" : "visible"}
                        variants={cardVariants}
                        className={`bg-gradient-to-br ${item.color} border border-${item.borderColor} rounded-lg p-4 shadow-lg`}
                      >
                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-3">
                            <Loader2 className="w-5 h-5 animate-spin text-green-400 mb-2" />
                            <span className="text-xs font-mono text-green-300">Loading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="bg-gray-900 p-2 rounded-lg">
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-xl font-bold font-mono">
                                {item.count !== null ? item.count : '-'}
                              </div>
                              <div className="text-xs text-green-300 font-mono">
                                {item.label}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Communities with Elections Section */}
              {(activeSectionIndex === 1 || !("md:block" === "hidden")) && (
                <motion.div
                  key="communities-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gray-900 bg-opacity-80 rounded-lg shadow-xl border border-green-900/50 p-6 mb-8 ${
                    activeSectionIndex !== 1 && "md:block hidden"
                  }`}
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-green-500/10 p-2 rounded-md mr-3">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-mono text-green-400">
                      Your Communities
                    </h3>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((_, idx) => (
                        <div key={idx} className="animate-pulse border border-green-800/30 rounded-lg p-4">
                          <div className="h-5 bg-green-900/40 rounded w-1/3 mb-3"></div>
                          <div className="h-4 bg-green-900/30 rounded w-1/4 mb-4"></div>
                          <div className="pl-4 border-l-2 border-green-900/30 mt-3">
                            <div className="h-4 bg-green-900/30 rounded w-1/5 mb-2"></div>
                            <div className="h-10 bg-green-900/20 rounded w-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : communitiesWithElections.length > 0 ? (
                    <div className="space-y-4">
                      {communitiesWithElections.map((community, index) => (
                        <motion.div
                          key={community.community_key || index}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          variants={itemVariants}
                          className="border border-green-800/30 bg-gray-800/40 rounded-lg p-4 backdrop-blur-sm relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full z-0"></div>
                          <div className="relative z-10">
                            <h4 className="font-medium text-lg text-green-300 flex items-center">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {community.community_name}
                            </h4>
                            <p className="text-xs text-green-400/70 font-mono mb-3">
                              KEY: <span className="bg-gray-900/80 px-2 py-0.5 rounded ml-1">{community.community_key}</span>
                            </p>
                            
                            {community.elections && community.elections.length > 0 ? (
                              <div className="pl-3 mt-3 border-l-2 border-green-700/50">
                                <p className="text-sm font-medium mb-2 text-green-400">Active Elections:</p>
                                <div className="space-y-2">
                                  {community.elections.map((election, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ x: -5, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: 0.1 * idx }}
                                      className="bg-green-900/20 p-2 rounded border border-green-800/30"
                                    >
                                      <p className="font-medium text-green-300">{election.title}</p>
                                      {election.endDate && (
                                        <p className="text-xs text-green-400/70 flex items-center mt-1">
                                          <Clock size={12} className="mr-1" />
                                          Ends: {new Date(election.endDate).toLocaleDateString()}
                                        </p>
                                      )}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-green-400/60 italic">No active elections in this community.</p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-green-800/30 rounded-lg">
                      <div className="inline-block p-3 bg-gray-800 rounded-full mb-4">
                        <Calendar className="w-6 h-6 text-green-500/70" />
                      </div>
                      <p className="text-green-300 font-mono">No communities with active elections found.</p>
                      <p className="text-green-500/50 text-sm mt-2 font-mono">Join or create a community to get started.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* All Elections Section */}
              {(activeSectionIndex === 2 || !("md:block" === "hidden")) && (
                <motion.div
                  key="elections-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-gray-900 bg-opacity-80 rounded-lg shadow-xl border border-green-900/50 p-6 mb-8 ${
                    activeSectionIndex !== 2 && "md:block hidden"
                  }`}
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-green-500/10 p-2 rounded-md mr-3">
                      <Activity className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-xl font-mono text-green-400">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Active Elections
                    </h3>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="animate-pulse border-l-4 border-green-800/50 bg-gray-800/30 rounded-lg p-4">
                          <div className="h-5 bg-green-900/40 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-green-900/30 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-green-900/30 rounded w-1/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : activeElections.length > 0 ? (
                    <div className="space-y-3">
                      {activeElections.map((election, index) => (
                        <motion.div
                          key={index}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          variants={itemVariants}
                          className="border-l-4 border-green-600/50 bg-gray-800/40 hover:bg-gray-800/60 rounded-lg p-4 cursor-pointer transition-all backdrop-blur-sm group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full z-0"></div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-green-300">
                                {election.title}
                              </h4>
                              <ChevronRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                            </div>
                            <p className="text-sm text-green-400/80 flex items-center mt-1">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {election.communityName}
                              <span className="text-xs bg-gray-900/80 px-1.5 py-0.5 rounded ml-2 text-green-400/60">
                                {election.communityKey}
                              </span>
                            </p>
                            {election.endDate && (
                              <p className="text-xs text-green-400/70 flex items-center mt-1">
                                <Clock size={12} className="mr-1" />
                                Ends: {new Date(election.endDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 border border-dashed border-green-800/30 rounded-lg">
                      <div className="inline-block p-3 bg-gray-800 rounded-full mb-4">
                        <Activity className="w-6 h-6 text-green-500/70" />
                      </div>
                      <p className="text-green-300 font-mono">No active elections currently.</p>
                      <p className="text-green-500/50 text-sm mt-2 font-mono">Create an election or join a community with ongoing elections.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="bg-gray-950 bg-opacity-90 p-4 border-t border-green-800/50 text-center">
          <div className="flex justify-center items-center space-x-4">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-500 text-xs font-mono">&lt;/USER_PROFILE v1.0&gt;</p>
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

export default Profile;