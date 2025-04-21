// import { useState, useEffect } from "react";
// import axios from "axios";
// import { ethers } from "ethers";
// import ElectionFactoryABI from "../abi/ElectionFactoryABI.json";

// const ELECTION_FACTORY_ADDRESS = "0x203bFf4ba915Cc4Fe048a5527E5E34C4d35A5cF5";

// export default function CreateElection() {
//     const [electionName, setElectionName] = useState("");
//     const [candidateDropdowns, setCandidateDropdowns] = useState(["", ""]);
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Fetch users from backend
//     useEffect(() => {
//         const fetchCandidates = async () => {
//             const communityKey = localStorage.getItem('selectedCommunityKey');
//             const token = localStorage.getItem('token');

//             if (!communityKey) {
//                 setError('No community key found in localStorage. Please select a community again.');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.post('http://localhost:5001/getCandidates', {
//                     community_key: communityKey,
//                 }, {
//                     headers: {
//                         'token': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 setUsers(response.data.candidates || []);
//             } catch (err) {
//                 console.error('Error fetching candidates:', err);
//                 setError('Failed to load candidates.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCandidates();
//     }, []);

//     const handleAddCandidate = () => {
//         if (candidateDropdowns.length < 5) {
//             setCandidateDropdowns([...candidateDropdowns, ""]);
//         }
//     };

//     const handleCandidateChange = (index, value) => {
//         const updated = [...candidateDropdowns];
//         updated[index] = value;
//         setCandidateDropdowns(updated);
//     };

//     const handleCreateElection = async () => {
//         try {
//             if (!window.ethereum) return alert("Please install MetaMask");
    
//             const provider = new ethers.BrowserProvider(window.ethereum);
//             const signer = await provider.getSigner();
//             const admin = await signer.getAddress();
    
//             // Filter out empty candidates
//             const candidates = candidateDropdowns.filter(candidate => candidate.trim() !== "");
//             if (candidates.length < 2) {
//                 alert("Please select at least two candidates");
//                 return;
//             }
    
//             // Ensure election name is not empty
//             if (!electionName.trim()) {
//                 alert("Please provide a valid election name");
//                 return;
//             }
    
//             // Filter out invalid users (if any)
//             const voters = users.filter(user => user.id && user.id.trim() !== "");
    
//             // Calculate deposit amount
//             const depositAmount = ((voters.length + 1) * 0.01).toString();
    
//             // Encode the data for createElection(name, voters, candidates)
//             const iface = new ethers.Interface(ElectionFactoryABI);
//             const encodedData = iface.encodeFunctionData("createElection", [
//                 electionName,
//                 voters.map(u => u.id), // Assuming voters have an id field
//                 candidates
//             ]);
    
//             // Send transaction
//             const tx = await signer.sendTransaction({
//                 to: ELECTION_FACTORY_ADDRESS,
//                 data: encodedData,
//                 value: ethers.parseEther(depositAmount),
//             });
    
//             await tx.wait();
//             alert("Election created! TX Hash: " + tx.hash);
//         } catch (err) {
//             console.error(err);
//             alert("Error creating election: " + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     if (loading) {
//         return <div>Loading candidates...</div>;
//     }

//     return (
//         <div className="p-6 max-w-xl mx-auto">
//             <h2 className="text-2xl font-bold mb-4">Create Election</h2>

//             <input
//                 className="w-full mb-3 p-2 border rounded"
//                 placeholder="Election Name"
//                 onChange={e => setElectionName(e.target.value)}
//             />

//             <label className="font-semibold">Select Candidates:</label>
//             {candidateDropdowns.map((value, index) => (
//                 <select
//                     key={index}
//                     value={value}
//                     onChange={e => handleCandidateChange(index, e.target.value)}
//                     className="w-full mb-2 p-2 border rounded"
//                 >
//                     <option value="">-- Select a user --</option>
//                     {users.map(user => (
//                         <option key={user.id} value={user.id}>
//                             {user.username}
//                         </option>
//                     ))}
//                 </select>
//             ))}

//             <button
//                 className="mb-4 bg-gray-300 px-4 py-1 rounded"
//                 onClick={handleAddCandidate}
//                 disabled={candidateDropdowns.length >= 5}
//             >
//                 Add Another Candidate
//             </button>

//             <input
//                 className="w-full mb-3 p-2 border rounded"
//                 type="number"
//                 placeholder="Number of Voters"
//                 value={users.length}
//                 disabled
//             />

//             <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={handleCreateElection}
//                 disabled={loading}
//             >
//                 {loading ? "Creating..." : "Create Election"}
//             </button>

//             {error && <div className="text-red-500 mt-4">{error}</div>}
//         </div>
//     );
// }

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { ethers } from "ethers";
// import ElectionFactoryABI from "../abi/ElectionFactoryABI.json";

// const ELECTION_FACTORY_ADDRESS = "0x203bFf4ba915Cc4Fe048a5527E5E34C4d35A5cF5";

// export default function CreateElection() {
//     const [electionName, setElectionName] = useState("");
//     const [candidateDropdowns, setCandidateDropdowns] = useState(["", ""]);
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Fetch users from backend
//     useEffect(() => {
//         const fetchCandidates = async () => {
//             const communityKey = localStorage.getItem('selectedCommunityKey');
//             const token = localStorage.getItem('token');

//             if (!communityKey) {
//                 setError('No community key found in localStorage. Please select a community again.');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axios.post('http://localhost:5001/getCandidates', {
//                     community_key: communityKey,
//                 }, {
//                     headers: {
//                         'token': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });

//                 setUsers(response.data.candidates || []);
//             } catch (err) {
//                 console.error('Error fetching candidates:', err);
//                 setError('Failed to load candidates.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCandidates();
//     }, []);

//     const handleAddCandidate = () => {
//         if (candidateDropdowns.length < 5) {
//             setCandidateDropdowns([...candidateDropdowns, ""]);
//         }
//     };

//     const handleCandidateChange = (index, value) => {
//         const updated = [...candidateDropdowns];
//         updated[index] = value;
//         setCandidateDropdowns(updated);
//     };

//     const handleCreateElection = async () => {
//         try {
//             if (!window.ethereum) return alert("Please install MetaMask");

//             const provider = new ethers.BrowserProvider(window.ethereum);
//             const signer = await provider.getSigner();
//             const admin = await signer.getAddress();

//             // Filter out empty candidates
//             const candidates = candidateDropdowns.filter(candidate => candidate.trim() !== "");
//             if (candidates.length < 2) {
//                 alert("Please select at least two candidates");
//                 return;
//             }

//             // Ensure election name is not empty
//             if (!electionName.trim()) {
//                 alert("Please provide a valid election name");
//                 return;
//             }

//             // Filter out invalid users (if any)
//             const voters = users.filter(user => user.id && user.id.trim() !== "");

//             // Calculate deposit amount
//             const depositAmount = ((voters.length + 1) * 0.01).toString();

//             // Encode the data for createElection(name, voters, candidates)
//             const iface = new ethers.Interface(ElectionFactoryABI);
//             const encodedData = iface.encodeFunctionData("createElection", [
//                 electionName,
//                 voters.map(u => u.id), // Assuming voters have an id field
//                 candidates
//             ]);

//             // Send transaction
//             const tx = await signer.sendTransaction({
//                 to: ELECTION_FACTORY_ADDRESS,
//                 data: encodedData,
//                 value: ethers.parseEther(depositAmount),
//             });

//             await tx.wait();
//             alert("Election created! TX Hash: " + tx.hash);
//         } catch (err) {
//             console.error(err);
//             alert("Error creating election: " + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <div>Loading candidates...</div>;
//     }

//     return (
//         <div className="p-6 max-w-xl mx-auto mt-20">
//             <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create Election</h2>

//             <input
//                 className="w-full mb-3 p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Election Name"
//                 onChange={e => setElectionName(e.target.value)}
//             />

//             <label className="font-semibold text-gray-700 block mb-2">Select Candidates:</label>
//             {candidateDropdowns.map((value, index) => (
//                 <select
//                     key={index}
//                     value={value}
//                     onChange={e => handleCandidateChange(index, e.target.value)}
//                     className="w-full mb-3 p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                     <option value="">-- Select a user --</option>
//                     {users.map(user => (
//                         <option key={user.id} value={user.id}>
//                             {user.username}
//                         </option>
//                     ))}
//                 </select>
//             ))}

//             <button
//                 className="mb-4 bg-gray-200 px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-300 transition-all"
//                 onClick={handleAddCandidate}
//                 disabled={candidateDropdowns.length >= 5}
//             >
//                 Add Another Candidate
//             </button>

//             <input
//                 className="w-full mb-3 p-3 border rounded-lg bg-gray-100 text-gray-500"
//                 type="number"
//                 placeholder="Number of Voters"
//                 value={users.length}
//                 disabled
//             />

//             <button
//                 className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 transition-all hover:bg-blue-600"
//                 onClick={handleCreateElection}
//                 disabled={loading}
//             >
//                 {loading ? "Creating..." : "Create Election"}
//             </button>

//             {error && <div className="text-red-500 mt-4">{error}</div>}
//         </div>
//     );
// }


import { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import ElectionFactoryABI from '../abi/ElectionFactoryABI.json';

const ELECTION_FACTORY_ADDRESS = '0xD8Ec8F00F154e654d0F971dA7F47c9b6fEc38FdF';

export default function CreateElection() {
  const [electionName, setElectionName] = useState('');
  const [candidateDropdowns, setCandidateDropdowns] = useState(['', '']);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicableFields, setApplicableFields] = useState([{ field: '', value: '' }]);
  const [description, setDescription] = useState('');

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

  // Create election on blockchain and then save to backend
  const handleCreateElection = async () => {
    setLoading(true);
    setError('');
    try {
      // Validate MetaMask
      if (!window.ethereum) throw new Error('Please install MetaMask');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Validate inputs
      const candidates = candidateDropdowns.filter(c => c.trim() !== '');
      if (candidates.length < 2) throw new Error('Select at least two candidates');
      if (!electionName.trim()) throw new Error('Provide a valid election name');

      const voters = users.map(u => u._id).filter(id => id && typeof id === 'string');
      if (!voters.length) throw new Error('No valid voters found');

      // Log inputs for debugging
      console.log('Election Inputs:', { electionName, voters, candidates });

      // Calculate deposit amount
      const depositAmount = ethers.parseEther(((voters.length + 1) * 0.01).toString());

      // Interact with ElectionFactory contract
      const contract = new ethers.Contract(ELECTION_FACTORY_ADDRESS, ElectionFactoryABI, signer);
      if (!contract.createElection) {
        throw new Error('createElection function not found in contract ABI');
      }

      // Create election on blockchain
      const tx = await contract.createElection(electionName, voters, candidates, {
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
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const filteredApplicableFields = applicableFields.filter(
        field => field.field.trim() && field.value.trim()
      );

      const payload = {
        electionName,
        community_key: localStorage.getItem('selectedCommunityKey'),
        candidate_id: candidates.map(id => users.find(u => u._id === id)?.user_id).filter(id => id), // Use user_id
        contractAddress: electionAddress, // Send blockchain election address
        status: 'upcoming',
        startDate,
        endDate,
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