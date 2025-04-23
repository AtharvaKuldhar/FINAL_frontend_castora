import { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import ElectionFactoryABI from '../abi/ElectionFactoryAbi.json';

const ELECTION_FACTORY_ADDRESS = '0xF8929fA7B2cC2d0c76f12e1D75e6A7511A506676';

export default function CreateElection() {
  const [electionName, setElectionName] = useState('');
  const [candidateDropdowns, setCandidateDropdowns] = useState(['', '']);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [error, setError] = useState('');
  const [applicableFields, setApplicableFields] = useState([{ field: '', value: '' }]);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
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
        setLoadingCandidates(false);
        return;
      }
      try {
        setLoadingCandidates(true);
        const response = await axios.post(
          'https://e-voting-blockchain-5n6q.onrender.com/getCandidates',
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
            candidate.user_id;
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
        setLoadingCandidates(false);
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
    setShowSuccess(false);
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
      
      setTxHash(tx.hash);
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
        'https://e-voting-blockchain-5n6q.onrender.com/createElection',
        payload,
        {
          headers: {
            token: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Success feedback
      setShowSuccess(true);
      setTimeout(() => {
        setElectionName('');
        setCandidateDropdowns(['', '']);
        setApplicableFields([{ field: '', value: '' }]);
        setDescription('');
        setShowSuccess(false);
      }, 5000);
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

  // Success message component
  const SuccessMessage = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-black border border-green-500 text-green-500 rounded-lg p-8 max-w-md w-full mx-4 animate-pulse shadow-lg shadow-green-500/50">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-bold mb-2">Election Created Successfully!</h3>
          <p className="mb-4">Your election has been created on the blockchain.</p>
          <p className="text-sm font-mono overflow-hidden overflow-ellipsis">
            TX Hash: {txHash}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-green-500 flex items-center justify-center p-4">
      {showSuccess && <SuccessMessage />}
      
      <div className="bg-black border border-green-500 rounded-lg shadow-lg shadow-green-500/30 p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center border-b border-green-500 pb-4">
          &lt; Create New Election /&gt;
        </h2>

        {error && (
          <div className="bg-red-900 text-red-300 border border-red-500 p-3 rounded mb-4 animate-pulse">{error}</div>
        )}

        {loadingCandidates ? (
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-green-400">Loading candidates...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Election Name
              </label>
              <input
                type="text"
                value={electionName}
                onChange={e => setElectionName(e.target.value)}
                placeholder="Enter election name"
                className="w-full p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter election description"
                className="w-full p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                rows="4"
              />
            </div>

            {/* Start Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                />
              </div>
            </div>

            {/* End Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Select Candidates <span className="text-green-400">(Max 5)</span>
              </label>
              {candidateDropdowns.map((value, index) => (
                <select
                  key={`candidate-${index}-${value}`}
                  value={value}
                  onChange={e => handleCandidateChange(index, e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-green-500 rounded-md mb-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
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
                className="mt-2 bg-gray-800 text-green-500 border border-green-500 px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-500 disabled:border-gray-500 transition-all"
              >
                + Add Candidate
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Applicable Fields <span className="text-green-400">(Optional)</span>
              </label>
              {applicableFields.map((field, index) => (
                <div key={`field-${index}`} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                  <input
                    type="text"
                    value={field.field}
                    onChange={e => handleFieldChange(index, 'field', e.target.value)}
                    placeholder="Field name"
                    className="w-full sm:w-1/2 p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={e => handleFieldChange(index, 'value', e.target.value)}
                    placeholder="Field value"
                    className="w-full sm:w-1/2 p-2 bg-gray-800 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                  />
                </div>
              ))}
              <button
                onClick={handleAddField}
                className="mt-2 bg-gray-800 text-green-500 border border-green-500 px-4 py-2 rounded-md hover:bg-gray-700 transition-all"
              >
                + Add Field
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Voters
              </label>
              <input
                type="number"
                value={users.length}
                disabled
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-gray-400"
              />
              <p className="text-xs mt-1 text-green-400">This is the number of eligible voters in this community</p>
            </div>

            <button
              onClick={handleCreateElection}
              disabled={loading}
              className={`w-full py-3 rounded-md font-bold transition-all duration-300 ${
                loading
                  ? "bg-gray-800 border border-green-500 text-green-500 relative overflow-hidden"
                  : "bg-green-600 hover:bg-green-700 text-black"
              }`}
            >
              {loading ? (
                <>
                  <span className="opacity-0">Creating Election...</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </>
              ) : (
                "Create Election"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}