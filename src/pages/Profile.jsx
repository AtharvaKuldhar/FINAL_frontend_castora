import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarLeft"; // adjust path as needed
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [createdCount, setCreatedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [activeElections, setActiveElections] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfileData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, createdRes, joinedRes, votedRes, activeRes] = await Promise.all([
          axios.get("http://localhost:5001/user", { headers }),  
          axios.get("http://localhost:5001/admin/createCommunity", { headers }), 
          axios.get("http://localhost:5001/join_community", { headers }),  
          axios.get("http://localhost:5001/voted", { headers }),  
          axios.get("http://localhost:5001/activeElection", { headers }),  
        ]);

        setUser(userRes.data || {});
        setCreatedCount(createdRes.data?.count || 0);
        setJoinedCount(joinedRes.data?.count || 0);
        setVotedCount(votedRes.data?.count || 0);
        setActiveElections(activeRes.data?.elections || []);
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 mt-16 p-6 w-full">
        {/* Profile Info */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-2">👤 Profile</h2>
          <p><span className="font-semibold">Name:</span> {user.username}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          {user.createdAt && (
            <p><span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-xl font-semibold text-blue-600">🏛️ {createdCount}</p>
            <p className="text-gray-600">Communities Created</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-xl font-semibold text-green-600">🤝 {joinedCount}</p>
            <p className="text-gray-600">Communities Joined</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <p className="text-xl font-semibold text-purple-600">🗳️ {votedCount}</p>
            <p className="text-gray-600">Votes Cast</p>
          </div>
        </div>

        {/* Active Elections */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Active Elections</h2>
          {activeElections.length > 0 ? (
            <ul className="space-y-3">
              {activeElections.map((election) => (
                <li
                  key={election.id}
                  className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
                >
                  <p className="font-semibold">{election.title}</p>
                  <p className="text-sm text-gray-500">
                    Ends on: {new Date(election.endDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No active elections currently.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
