import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import ElectionABI from '../abi/ElectionABI.json';

const Candidate = () => {
  const [candidates, setCandidates] = useState([]);
  const [electionAddress, setElectionAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmVote, setConfirmVote] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voterId, setVoterId] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Get election ID from localStorage (set in Elections component)
        const electionId = localStorage.getItem('selectedElectionId');
        if (!electionId) throw new Error('No election selected');

        // POST request to /getSelectedCandidates
        const response = await axios.post(
          'http://localhost:5001/getSelectedCandidates',
          { electionId },
          {
            headers: { token: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        const { electionData, candidates: apiCandidates } = response.data;

        // Validate response
        if (!electionData.election_address || !apiCandidates.length) {
          throw new Error('Invalid election data or no candidates found');
        }

        // Map candidates
        const mappedCandidates = apiCandidates.map((candidate) => ({
          _id: candidate.id,
          fullName: candidate.username,
          election_id: electionData._id,
          election_address: electionData.election_address,
        }));

        setCandidates(mappedCandidates);
        setElectionAddress(electionData.election_address);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch candidates: ' + err.message);
        setLoading(false);
      }
    };

    // Set voterId from localStorage
    const token = localStorage.getItem('token');
    axios
      .post('http://localhost:5001/verifier', { token })
      .then((response) => {
        if (response.status === 200) {
          setVoterId(response.data.verified.id); // Assuming backend sends { id: ... }
          console.log(response.data.verified.id)
          console.log(voterId);
        }
      })
      .catch((error) => {
        console.error('Verification failed:', error);
      });

    fetchCandidates();
  }, []);

  const openConfirmVote = (candidate) => {
    setSelectedCandidate(candidate);
    setConfirmVote(true);
  };

  const closeConfirmVote = () => {
    setConfirmVote(false);
    setSelectedCandidate(null);
  };

  const handleVote = async () => {
    if (!voterId) {
      setError('Voter ID not provided');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Initialize provider and company account
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const companyWallet = new ethers.Wallet(process.env.REACT_APP_RELAYER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(electionAddress, ElectionABI, companyWallet);

      // Check voter eligibility
      const isVoter = await contract.isVoter(voterId);
      const hasVoted = await contract.hasVoted(voterId);
      if (!isVoter) {
        setError('You are not an eligible voter');
        return;
      } else if (hasVoted) {
        setError('You have already voted');
        return;
      }

      // Check contract balance
      const balance = await contract.getContractBalance();
      if (balance.lt(ethers.utils.parseEther('0.01'))) {
        setError('Contract balance too low to vote');
        return;
      }

      // Submit vote transaction
      const tx = await contract.vote(voterId, selectedCandidate.fullName, {
        gasLimit: 200000,
      });
      await tx.wait();

      // Close modal and navigate to success page
      closeConfirmVote();
      window.location.href = '/congrats';
    } catch (err) {
      setError(err.message || 'Error submitting vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-5 bg-black min-h-screen">
      <header className="flex flex-col items-center text-center p-10 w-3/5 mx-auto mb-3">
        <h1 className="text-3xl font-bold text-white">Vote Your Candidates</h1>
        <p className="font-light text-gray-300">
          These are the candidates for the India election. Please vote once and wisely, as you won’t
          be allowed to vote in this election again.
        </p>
      </header>
      {loading ? (
        <p className="text-white text-center">Loading candidates...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex flex-col gap-4 mx-auto max-w-7xl">
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-row items-center justify-between h-20"
              >
                <h5 className="text-left font-bold text-white">
                  {candidate.fullName?.length > 20
                    ? candidate.fullName.substring(0, 20) + '...'
                    : candidate.fullName}
                </h5>
                <button
                  className="bg-green-500 font-bold text-white px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105"
                  onClick={() => openConfirmVote(candidate)}
                >
                  Vote
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No candidates found for this election.</p>
          )}
        </div>
      )}
      {confirmVote && (
        <section className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4">
          <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-md w-full p-6 border border-gray-700">
            <h5 className="text-lg font-semibold mb-4 text-center text-white">
              Please confirm your vote
            </h5>
            <h2 className="text-2xl font-bold text-center mb-4 text-white">
              {selectedCandidate.fullName}
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div className="flex justify-around">
              <button
                className="bg-gray-500 font-bold text-white px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
                onClick={closeConfirmVote}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleVote}
                className="bg-green-500 font-bold text-white px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
                disabled={loading || !voterId}
              >
                {loading ? 'Submitting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </section>
      )}
    </section>
  );
};

export default Candidate;