import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/SidebarLeft';

const ManageCommunity = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For navigation
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      const communityKey = localStorage.getItem('selectedCommunityKey');
      const token = localStorage.getItem('token');

      if (!communityKey) {
        setError('No community key found in localStorage. Please select a community again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5001/getCandidates', {
          community_key: communityKey
        }, {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setMembers(response.data.candidates || []);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Handle "Continue" button click
  const handleContinue = () => {
    // Redirect to the create election page
    navigate(`/communities/${id}/createelections`);
  };

  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Manage Community: {id}
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading candidates...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500">No candidates found in this community.</p>
        ) : (
          <ul className="space-y-4">
            {members.map((member, index) => (
              <li
                key={member._id || index}
                className="bg-white p-4 rounded-xl shadow border border-gray-200"
              >
                <p className="text-lg font-semibold text-gray-800">
                  {member.username || 'Unnamed'}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Continue Button */}
        <div className="mt-6">
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Continue to Create Election
          </button>
        </div>
      </div>
    </section>
  );
};

export default ManageCommunity;
