import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SidebarLeft";
import axios from "axios";
import { Menu, X, Activity, Users, Vote, Calendar, ChevronRight, Shield, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const [createdCount, setCreatedCount] = useState(null);
  const [joinedCount, setJoinedCount] = useState(null);
  const [votedCount, setVotedCount] = useState(null);
  const [activeElections, setActiveElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loadingElections, setLoadingElections] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [createdRes, joinedRes, votedRes] = await Promise.all([
          axios.get("/api/elections/created"),
          axios.get("/api/elections/joined"),
          axios.get("/api/elections/voted"),
        ]);

        setCreatedCount(createdRes.data?.count || 0);
        setJoinedCount(joinedRes.data?.count || 0);
        setVotedCount(votedRes.data?.count || 0);
        
        // Slight delay to simulate loading state for stats
        setTimeout(() => {
          setLoading(false);
        }, 800);
        
        // Separate loading state for elections with a delay for visual effect
        setLoadingElections(true);
        const activeRes = await axios.get("/api/elections/active");
        setTimeout(() => {
          setActiveElections(activeRes.data?.elections || []);
          setLoadingElections(false);
        }, 1200);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
        setLoadingElections(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateToElection = (id) => {
    navigate(`/elections/${id}`);
  };

  // Stats card animation variants
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

  // Election item animation variants
  const electionVariants = {
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
            <div className="text-center mb-8">
              <div className="inline-block bg-green-500/10 rounded-full p-3 mb-4 border border-green-500/30">
                <Activity size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-mono text-green-400 mb-2">
                {'>'} DASHBOARD_HOME
              </h2>
              <div className="w-16 h-1 bg-green-500 mx-auto mb-4"></div>
              <p className="text-green-300 opacity-80 font-mono text-sm md:text-base">
                System overview and active elections monitoring platform
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { 
                  count: createdCount, 
                  label: "Communities Created", 
                  icon: <Activity className="w-6 h-6" />,
                  color: "from-blue-500/20 to-green-500/20",
                  borderColor: "blue-500/50"
                },
                { 
                  count: joinedCount, 
                  label: "Communities Joined", 
                  icon: <Users className="w-6 h-6" />,
                  color: "from-green-500/20 to-teal-500/20",
                  borderColor: "green-500/50"
                },
                { 
                  count: votedCount, 
                  label: "Votes Cast", 
                  icon: <Vote className="w-6 h-6" />,
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
                  className={`bg-gradient-to-br ${item.color} border border-${item.borderColor} rounded-lg p-5 shadow-lg relative overflow-hidden`}
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-green-400 mb-2" />
                      <span className="text-sm font-mono text-green-300">Loading data...</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-full z-0"></div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-900 p-3 rounded-lg">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold font-mono">
                            {item.count !== null ? item.count : '-'}
                          </div>
                          <div className="text-xs sm:text-sm text-green-300 font-mono">
                            {item.label}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Active Elections Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gray-900 bg-opacity-80 rounded-lg shadow-xl border border-green-900/50 p-6 mb-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-500/10 p-2 rounded-md mr-3">
                  <Calendar className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-xl font-mono text-green-400 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Active Elections
                </h3>
              </div>

              {loadingElections ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-t-2 border-green-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                    </div>
                  </div>
                  <p className="mt-4 text-green-300 font-mono text-sm">Scanning active elections...</p>
                </div>
              ) : activeElections.length > 0 ? (
                <div className="space-y-4">
                  {activeElections.map((election, idx) => (
                    <motion.div
                      key={election.id}
                      custom={idx}
                      initial="hidden"
                      animate="visible"
                      variants={electionVariants}
                      onClick={() => navigateToElection(election.id)}
                      className="border border-green-800/30 bg-gray-800/40 hover:bg-gray-800/60 rounded-lg p-4 cursor-pointer transition-all backdrop-blur-sm relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full z-0"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium text-green-300 mb-1">
                            {election.title}
                          </h4>
                          <ChevronRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="text-sm text-green-400/80 font-mono">
                            <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded mr-2">
                              Ends on:
                            </span>
                            {new Date(election.endDate).toLocaleDateString()}
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-green-800/30 rounded-lg bg-gray-900/50">
                  <div className="inline-block p-3 bg-gray-800 rounded-full mb-4">
                    <Calendar className="w-6 h-6 text-green-500/70" />
                  </div>
                  <p className="text-green-300 font-mono">No active elections right now.</p>
                  <p className="text-green-500/50 text-sm mt-2 font-mono">Check back later or create a new one.</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        <footer className="bg-gray-950 bg-opacity-90 p-4 border-t border-green-800/50 text-center">
          <div className="flex justify-center items-center space-x-4">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-500 text-xs font-mono">&lt;/CYBR_COMM_DASHBOARD v1.0&gt;</p>
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

export default Home;