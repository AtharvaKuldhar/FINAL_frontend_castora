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
  const [voteLoading, setVoteLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "VOTE YOUR CANDIDATES";

  // Typewriter effect for the header
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const electionId = localStorage.getItem('selectedElectionId');
        if (!electionId) throw new Error('No election selected');

        const response = await axios.post(
          'http://localhost:5001/getSelectedCandidates',
          { electionId },
          {
            headers: { token: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        const { electionData, candidates: apiCandidates } = response.data;
        console.log('Election Data:', electionData);
        console.log('Candidates:', apiCandidates);

        if (!electionData.election_address || !apiCandidates.length) {
          throw new Error('Invalid election data or no candidates found');
        }

        const mappedCandidates = apiCandidates.map((candidate) => ({
          _id: candidate.id,
          fullName: candidate.username,
          election_id: electionData._id,
          election_address: electionData.election_address,
        }));

        // Add slight delay for smoother transition
        setTimeout(() => {
          setCandidates(mappedCandidates);
          setElectionAddress(electionData.election_address);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError('Failed to fetch candidates: ' + err.message);
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    axios
      .post('http://localhost:5001/verifier', { token })
      .then((response) => {
        if (response.status === 200) {
          console.log('Verifier Response:', response.data);
          const voterId = response.data.verified.id.trim();
          setVoterId(voterId);
          console.log('Set Voter ID:', voterId);
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
      setVoteLoading(true);
      setError(null);

      const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/e0be1c8fa97c4895b24b08bc6cb0aaef');
      const companyWallet = new ethers.Wallet('27f4767ba4fd4d2009855fcc0e05f2c14d7edb859a74920bf8911c474da32fff', provider);
      const contract = new ethers.Contract(electionAddress, ElectionABI, companyWallet);
      console.log('Contract Address:', electionAddress);
      console.log('Voter ID:', voterId);

      const isVoter = await contract.isVoter(voterId);
      console.log('Is Voter:', isVoter);
      if (!isVoter) {
        setError('You are not an eligible voter');
        setVoteLoading(false);
        return;
      }

      const hasVoted = await contract.hasVoted(voterId);
      console.log('Has Voted:', hasVoted);
      if (hasVoted) {
        setError('You have already voted');
        setVoteLoading(false);
        return;
      }

      const balance = await contract.getContractBalance();
      console.log('Contract Balance:', balance, typeof balance);
      if (balance < ethers.parseEther('0.01')) {
        setError('Contract balance too low to vote');
        setVoteLoading(false);
        return;
      }

      const tx = await contract.vote(voterId, selectedCandidate._id, {
        gasLimit: 200000,
      });
      console.log('Transaction:', tx);
      await tx.wait();

      closeConfirmVote();
      window.location.href = '/congrats';
    } catch (err) {
      console.error('Vote Error:', err);
      setError(err.message || 'Error submitting vote');
      setVoteLoading(false);
    }
  };

  // Render candidates list with animations
  const renderCandidates = () => {
    if (candidates.length === 0) {
      return (
        <div className="text-green-500 text-center bg-gray-900 border border-green-500 p-4 max-w-md mx-auto rounded-lg animate-pulse">
          <div className="text-xl font-bold overflow-hidden relative">
            NO CANDIDATES FOUND
          </div>
        </div>
      );
    }

    return candidates.map((candidate, index) => (
      <div
        key={candidate._id}
        className={`w-full bg-gray-900 border border-green-500 rounded-lg p-4 flex flex-row items-center justify-between h-16 md:h-20 hover:bg-gray-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-center">
          <div className="h-8 w-8 mr-3 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">
            {index + 1}
          </div>
          <h5 className="text-left font-bold text-green-500">
            {candidate.fullName?.length > 20
              ? candidate.fullName.substring(0, 20) + '...'
              : candidate.fullName}
          </h5>
        </div>
        <button
          className="bg-green-500 font-bold text-black px-3 py-1 md:px-4 md:py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-green-400 active:bg-green-600 border border-green-700 transform hover:-translate-y-1 hover:shadow-md"
          onClick={() => openConfirmVote(candidate)}
        >
          VOTE
        </button>
      </div>
    ));
  };

  return (
    <section className="p-3 md:p-5 bg-black min-h-screen relative overflow-hidden">
      {/* Cyberpunk grid pattern using repeating element */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-95"></div>
        <div className="absolute inset-0" 
          style={{
            backgroundImage: "linear-gradient(to right, rgba(0, 255, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 0, 0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            animation: "gridMove 20s linear infinite"
          }}>
          <style jsx>{`
            @keyframes gridMove {
              0% { background-position: 0 0; }
              100% { background-position: 20px 20px; }
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      </div>
      
      <header className="flex flex-col items-center text-center p-4 md:p-10 w-full md:w-4/5 lg:w-3/5 mx-auto mb-3 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-green-500 mb-3">
          {typedText}<span className="animate-pulse">_</span>
        </h1>
        <p className="font-light text-green-300 text-sm md:text-base">
          &lt; These are the candidates for the India election. Please vote once and wisely, as you won't
          be allowed to vote in this election again. /&gt;
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64 relative z-10">
          <div className="flex flex-col items-center space-y-4">
            {/* Custom loading animation with Tailwind */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-t-2 border-green-500 rounded-full animate-spin"></div>
              <div className="absolute inset-1 border-r-2 border-green-300 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              <div className="absolute inset-2 border-b-2 border-green-400 rounded-full animate-spin" style={{animationDuration: '2s'}}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="text-green-500 animate-pulse">Connecting to blockchain...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center bg-gray-900 border border-red-500 p-4 max-w-md mx-auto rounded-lg relative z-10">
          <div className="text-xl font-bold mb-2 relative overflow-hidden">
            <span className="relative inline-block">ERROR</span>
          </div>
          <p className="mt-2">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mx-auto max-w-md md:max-w-2xl lg:max-w-4xl px-3 relative z-10">
          {renderCandidates()}
        </div>
      )}

      {/* Vote confirmation modal */}
      {confirmVote && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-md w-full p-6 border-2 border-green-500 transform transition-all duration-300 scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <h5 className="text-lg font-semibold text-center text-green-500">
                CONFIRM VOTE
              </h5>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="p-4 border border-green-500 rounded-lg mb-4 bg-black bg-opacity-50 relative overflow-hidden">
              {/* Scanline effect */}
              <div className="absolute inset-x-0 h-px bg-green-500 opacity-70 top-0 animate-[scanline_2s_linear_infinite]"></div>
              <style jsx>{`
                @keyframes scanline {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(100px); }
                }
              `}</style>
              
              <div className="flex items-center justify-center">
                <span className="text-green-500 mr-2">&gt;</span>
                <h2 className="text-xl md:text-2xl font-bold text-center text-green-500">
                  {selectedCandidate.fullName}
                </h2>
              </div>
              <div className="text-center text-green-300 text-sm mt-2">
                <p>ID: {selectedCandidate._id}</p>
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-center mb-4 p-2 border border-red-500 rounded animate-pulse">
                {error}
              </div>
            )}
            
            <div className="flex justify-around">
              <button
                className="bg-gray-700 font-bold text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-600 active:bg-gray-800 border border-gray-600 transform hover:-translate-y-1"
                onClick={closeConfirmVote}
                disabled={voteLoading}
              >
                CANCEL
              </button>
              <button
                onClick={handleVote}
                className="bg-green-500 font-bold text-black px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-green-400 active:bg-green-600 border border-green-700 transform hover:-translate-y-1"
                disabled={voteLoading || !voterId}
              >
                {voteLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    PROCESSING
                  </span>
                ) : (
                  <span>CONFIRM</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Candidate;