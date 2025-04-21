import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarLeft"; // adjust path as needed
import axios from "axios";
import { motion } from "framer-motion";

const Profile = () => {
  const [user, setUser] = useState({});
  const [createdCount, setCreatedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [activeElections, setActiveElections] = useState([]);
  const [communitiesWithElections, setCommunitiesWithElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { token: `Bearer ${token}` };

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch main user data and communities with elections
        const userResponse = await axios.get("http://localhost:5001/activeElection", { headers });
        
        if (userResponse.data) {
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
                    communityName: community.community_name
                  });
                });
              }
            });
            
            setActiveElections(allActiveElections);
          }
        }

        // Fetch voted count separately if needed
        const votedRes = await axios.get("http://localhost:5001/voted", { headers });
        setVotedCount(votedRes.data?.count || 0);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile data", err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const countVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.3
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* Adjust mt-16 to match your navbar height */}
      <motion.div 
        className="ml-64 mt-16 p-6 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Info */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2">👤 Profile</h2>
          <p><span className="font-semibold">Name:</span> {user.username}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          {user.createdAt && (
            <p><span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            variants={itemVariants}
          >
            <motion.p 
              className="text-3xl font-semibold text-blue-600"
              variants={countVariants}
            >
              🏛️ {createdCount}
            </motion.p>
            <p className="text-gray-600">Communities Created</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            variants={itemVariants}
          >
            <motion.p 
              className="text-3xl font-semibold text-green-600"
              variants={countVariants}
            >
              🤝 {joinedCount}
            </motion.p>
            <p className="text-gray-600">Communities Joined</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            variants={itemVariants}
          >
            <motion.p 
              className="text-3xl font-semibold text-purple-600"
              variants={countVariants}
            >
              🗳️ {votedCount}
            </motion.p>
            <p className="text-gray-600">Votes Cast</p>
          </motion.div>
        </motion.div>

        {/* Communities with Active Elections */}
        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4">Your Communities with Active Elections</h2>
          {communitiesWithElections.length > 0 ? (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {communitiesWithElections.map((community, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-4 rounded-lg shadow"
                  variants={itemVariants}
                >
                  <h3 className="font-semibold text-lg text-blue-700">{community.community_name}</h3>
                  <p className="text-sm text-gray-500 mb-2">Community Key: {community.community_key}</p>
                  
                  {community.elections && community.elections.length > 0 ? (
                    <div className="pl-4 mt-2 border-l-2 border-blue-200">
                      <p className="font-medium mb-1">Active Elections:</p>
                      <ul className="space-y-2">
                        {community.elections.map((election, idx) => (
                          <motion.li 
                            key={idx} 
                            className="bg-blue-50 p-2 rounded"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * idx }}
                          >
                            <p className="font-medium">{election.title}</p>
                            {election.endDate && (
                              <p className="text-xs text-gray-600">
                                Ends: {new Date(election.endDate).toLocaleDateString()}
                              </p>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No active elections in this community.</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-gray-500">
              {loading ? "Loading communities..." : "No communities with active elections found."}
            </p>
          )}
        </motion.div>

        {/* All Active Elections List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold mb-4">All Your Active Elections</h2>
          {activeElections.length > 0 ? (
            <motion.ul 
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {activeElections.map((election, index) => (
                <motion.li
                  key={index}
                  className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="font-semibold">{election.title}</p>
                  <p className="text-sm text-gray-600">
                    Community: {election.communityName}
                  </p>
                  {election.endDate && (
                    <p className="text-sm text-gray-500">
                      Ends on: {new Date(election.endDate).toLocaleDateString()}
                    </p>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-gray-500">
              {loading ? "Loading elections..." : "No active elections currently."}
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;