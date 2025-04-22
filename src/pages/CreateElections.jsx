import { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import ElectionFactoryABI from '../abi/ElectionFactoryABI.json';

const ELECTION_FACTORY_ADDRESS = '0x01863adD09dE27b3d74F05328316E793679342EC';

export default function CreateElection() {
  const [electionName, setElectionName] = useState('');
  const [candidateDropdowns, setCandidateDropdowns] = useState(['', '']);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicableFields, setApplicableFields] = useState([{ field: '', value: '' }]);
  const [description, setDescription] = useState('');
  // Add new state variables for start and end dates
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Set default start date to today and end date to 30 days later when component mounts
  useEffect(() => {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    // Format dates for input fields (YYYY-MM-DD)
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    // Format times for input fields (HH:MM)
    const formatTime = (date) => {
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };
    
    setStartDate(formatDate(today));
    setStartTime(formatTime(today));
    setEndDate(formatDate(thirtyDaysLater));
    setEndTime(formatTime(today));
  }, []);

  // Fetch candidates when component mounts
  useEffect(() => {
    const fetchCandidates = async () => {
      const communityKey = localStorage.getItem('selectedCommunityKey');
      const token = localStorage.getItem('token');
      if (!communityKey || !token) {
        setError('Please select a community and ensure you are logged in.');
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          'http://localhost:5001/getCandidates',
          { community_key: communityKey },
          { headers: { token: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const candidates = response.data.candidates || [];
        console.log('Raw candidates from API:', JSON.stringify(candidates, null, 2));
        if (!Array.isArray(candidates)) {
          throw new Error('Candidates data is not an array');
        }
        const validCandidates = candidates.filter(candidate => {
          const isValid = candidate && 
            typeof candidate._id === 'string' && 
            candidate._id && 
            candidate.username && 
            candidate.user_id; // Ensure user_id exists
          if (!isValid) {
            console.log('Filtered out candidate:', candidate);
          }
          return isValid;
        });
        setUsers(validCandidates);
        if (validCandidates.length === 0) {
          setError('No valid candidates found for this community. Ensure candidates have valid IDs and usernames.');
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  // Add a new candidate dropdown (max 5)
  const handleAddCandidate = () => {
    if (candidateDropdowns.length < 5) {
      setCandidateDropdowns([...candidateDropdowns, '']);
    }
  };

  // Update candidate selection
  const handleCandidateChange = (index, value) => {
    const updated = [...candidateDropdowns];
    updated[index] = value;
    setCandidateDropdowns(updated);
  };

  // Add a new applicable field
  const handleAddField = () => {
    setApplicableFields([...applicableFields, { field: '', value: '' }]);
  };

  // Update applicable field values
  const handleFieldChange = (index, key, value) => {
    const updated = [...applicableFields];
    updated[index][key] = value;
    setApplicableFields(updated);
  };

  // Function to combine date and time into ISO string
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    return dateObj.toISOString();
  };

  // Create election on blockchain and then save to backend
  const handleCreateElection = async () => {
    setLoading(true);
    setError('');
    try {
      // Validate dates and times
      if (!startDate || !startTime || !endDate || !endTime) {
        throw new Error('Please provide both start and end dates with times');
      }
      
      const startDateTime = combineDateTime(startDate, startTime);
      const endDateTime = combineDateTime(endDate, endTime);
      
      if (!startDateTime || !endDateTime) {
        throw new Error('Invalid date or time format');
      }
      
      const now = new Date();
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      
      if (startDateObj < now) {
        throw new Error('Start date cannot be in the past');
      }
      
      if (endDateObj <= startDateObj) {
        throw new Error('End date must be after start date');
      }

      // Validate MetaMask
      if (!window.ethereum) throw new Error('Please install MetaMask');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Validate inputs
      const selectedCandidateIds = candidateDropdowns.filter(c => c.trim() !== '');
      if (selectedCandidateIds.length < 2) throw new Error('Select at least two candidates');
      if (!electionName.trim()) throw new Error('Provide a valid election name');

      // Get the corresponding user_ids for blockchain interaction
      const selectedCandidates = selectedCandidateIds.map(id => {
        const user = users.find(u => u._id === id);
        return user ? user.user_id : null;
      }).filter(id => id);

      // Get all user_ids for voters
      const voters = users.map(u => u.user_id).filter(id => id && typeof id === 'string');
      if (!voters.length) throw new Error('No valid voters found');

      // Log inputs for debugging
      console.log('Election Inputs:', { 
        electionName, 
        voters, 
        selectedCandidates,
        originalCandidateIds: selectedCandidateIds,
        startDateTime,
        endDateTime
      });

      // Calculate deposit amount
      const depositAmount = ethers.parseEther(((voters.length + 1) * 0.01).toString());

      // Interact with ElectionFactory contract
      const contract = new ethers.Contract(ELECTION_FACTORY_ADDRESS, ElectionFactoryABI, signer);
      if (!contract.createElection) {
        throw new Error('createElection function not found in contract ABI');
      }

      // Create election on blockchain - passing user_id instead of _id
      const tx = await contract.createElection(electionName, voters, selectedCandidates, {
        value: depositAmount,
      });
      const receipt = await tx.wait();

      // Extract election address from event
      const electionCreatedEvent = receipt.logs.find(
        log => log.topics[0] === ethers.id('ElectionCreated(address,address,string)')
      );
      if (!electionCreatedEvent) throw new Error('ElectionCreated event not found');
      const electionAddress = ethers.getAddress('0x' + electionCreatedEvent.topics[2].slice(-40));

      // Prepare backend payload
      const filteredApplicableFields = applicableFields.filter(
        field => field.field.trim() && field.value.trim()
      );

      // For the backend, directly use the user_ids of selected candidates
      const payload = {
        electionName,
        community_key: localStorage.getItem('selectedCommunityKey'),
        candidate_id: selectedCandidates, // Using user_id directly
        contractAddress: electionAddress,
        status: 'upcoming',
        startDate: startDateTime,
        endDate: endDateTime,
        description,
        applicableFields: filteredApplicableFields,
        results: [],
      };
      console.log('Payload to /createElection:', JSON.stringify(payload, null, 2));

      // Send to backend
      const response = await axios.post(
        'http://localhost:5001/createElection',
        payload,
        {
          headers: {
            token: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Success feedback
      alert(`Election created successfully! TX Hash: ${tx.hash}`);
      setElectionName('');
      setCandidateDropdowns(['', '']);
      setApplicableFields([{ field: '', value: '' }]);
      setDescription('');
    } catch (err) {
      console.error('Error creating election:', err);
      if (err.response) {
        setError(`Error creating election: ${err.response.data?.msg || err.message} (Status: ${err.response.status})`);
      } else {
        setError(`Error creating election: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create New Election
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {loading && !users.length ? (
          <div className="text-center text-gray-600">
            <svg
              className="animate-spin h-5 w-5 mx-auto text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading candidates...
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Election Name
              </label>
              <input
                type="text"
                value={electionName}
                onChange={e => setElectionName(e.target.value)}
                placeholder="Enter election name"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter election description"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              />
            </div>

            {/* Start Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* End Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Candidates (Max 5)
              </label>
              {candidateDropdowns.map((value, index) => (
                <select
                  key={`candidate-${index}-${value}`}
                  value={value}
                  onChange={e => handleCandidateChange(index, e.target.value)}
                  className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a candidate --</option>
                  {users.map((user, userIndex) => (
                    <option
                      key={`user-${user._id}-${userIndex}`}
                      value={user._id}
                    >
                      {user.username}
                    </option>
                  ))}
                </select>
              ))}
              <button
                onClick={handleAddCandidate}
                disabled={candidateDropdowns.length >= 5}
                className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Add Another Candidate
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Applicable Fields (Optional)
              </label>
              {applicableFields.map((field, index) => (
                <div key={`field-${index}`} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={field.field}
                    onChange={e => handleFieldChange(index, 'field', e.target.value)}
                    placeholder="Field name (optional)"
                    className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={e => handleFieldChange(index, 'value', e.target.value)}
                    placeholder="Field value (optional)"
                    className="w-1/2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
              <button
                onClick={handleAddField}
                className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Add Another Field
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Voters
              </label>
              <input
                type="number"
                value={users.length}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100"
              />
            </div>

            <button
              onClick={handleCreateElection}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Creating Election...' : 'Create Election'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}