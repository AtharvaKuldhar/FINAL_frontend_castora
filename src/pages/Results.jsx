import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import ElectionABI from '../abi/ElectionABI.json';
import { FaTrophy, FaTerminal, FaChevronDown, FaChevronUp, FaVoteYea, FaEthereum } from 'react-icons/fa';
import { MdCelebration } from 'react-icons/md';

const Results = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedElection, setExpandedElection] = useState(null);

  // Apply global dark theme to body
  useEffect(() => {
    // Add black background to body and html
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#1EFF1E';
    document.documentElement.style.backgroundColor = '#000000';
    
    // Clean up on unmount
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const community_key = localStorage.getItem('selectedCommunityKey');
        const token = localStorage.getItem('token');

        // Fetch elections from backend API
        const response = await axios.get('https://e-voting-blockchain-5n6q.onrender.com/getElections', {
          params: { community_key },
          headers: { token: `Bearer ${token}` },
        });

        const fetchedElections = response.data;
        console.log('Fetched Elections from API:', fetchedElections);

        const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/e0be1c8fa97c4895b24b08bc6cb0aaef');

        const updatedElections = await Promise.all(
          fetchedElections.map(async (electionData) => {
            const { _id: id, election_address: contractAddress, electionName } = electionData;

            // Connect to the smart contract
            const contract = new ethers.Contract(contractAddress, ElectionABI, provider);

            // Call getAllVotes to fetch the vote counts
            const allVotes = await contract.getAllVotes();
            console.log(`Election ${id} - All Votes from Blockchain:`, allVotes);

            // Fetch candidate names using the candidates function
            const candidates = await Promise.all(
              allVotes.map(async (_, index) => {
                const candidateName = await contract.candidates(index);
                return { username: candidateName, voteCount: Number(allVotes[index]) };
              })
            );

            // Function to fetch candidates with their vote counts from the backend
            const fetchCandidatesWithVotes = async (electionId, candidates) => {
              try {
                const response = await axios.post('https://e-voting-blockchain-5n6q.onrender.comgetSelectedCandidates', {
                  electionId: electionId
                }, {
                  headers: {
                    'token': `Bearer ${token}`
                  }
                });

                const backend_res = response.data.candidates;

                // Map over the candidates and match with the provided voteCounts array
                const result = backend_res.map(candidate => {
                  const voteData = candidates.find(vote => vote.username === candidate.id); 
                  return {
                    username: candidate.username,
                    voteCount: voteData ? voteData.voteCount : 0 // Default to 0 if no vote count is found
                  };
                });

                return result; // Return the final array with username and voteCount
              } catch (error) {
                console.error("Error fetching candidates:", error);
                throw new Error("Error fetching candidates.");
              }
            };

            const finalCandidates = await fetchCandidatesWithVotes(id, candidates);
            console.log(`Election ${id} - Candidates with Vote Counts:`, finalCandidates);

            // Calculate total votes
            const totalVotes = allVotes.reduce((sum, vote) => sum + (vote > 0 ? Number(vote) : 0), 0);
            console.log(`Election ${id} - Total Votes:`, totalVotes);

            // Sort candidates by voteCount in descending order
            const sortedCandidates = [...finalCandidates].sort((a, b) => b.voteCount - a.voteCount);
            
            // Determine if there's a winner (has the highest vote count and not tied with others)
            const hasWinner = sortedCandidates.length > 0 && 
                             sortedCandidates[0].voteCount > 0 && 
                             (sortedCandidates.length === 1 || sortedCandidates[0].voteCount > sortedCandidates[1].voteCount);
            
            const winner = hasWinner ? sortedCandidates[0] : null;

            return {
              id,
              title: electionName,
              contractAddress,
              totalVotes,
              candidates: sortedCandidates,
              winner
            };
          })
        );

        setElections(updatedElections);
        // If there are elections, set the first one as expanded by default
        if (updatedElections.length > 0) {
          setExpandedElection(updatedElections[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load results: ' + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedElection(expandedElection === id ? null : id);
  };

  // Interactive typing effect for console lines
  const TypedLine = ({ text }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    
    useEffect(() => {
      if (index < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + text.charAt(index));
          setIndex(index + 1);
        }, 20); // Speed of typing
        return () => clearTimeout(timer);
      }
    }, [index, text]);
    
    return <span>{displayText}<span className="animate-pulse">_</span></span>;
  };

  // Function to determine green shade based on percentage
  const getGreenShade = (percentage) => {
    if (percentage >= 75) return 'from-green-500 to-green-400';
    if (percentage >= 50) return 'from-green-400 to-green-300';
    if (percentage >= 25) return 'from-green-300 to-green-200';
    return 'from-green-200 to-green-100';
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-green-500 font-mono">
      <motion.div
        className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-md text-center"
      >
        <TypedLine text="Connecting to blockchain..." />
        <div className="mt-2 text-xs text-green-400 opacity-70">
          <TypedLine text="Fetching election data and vote counts..." />
        </div>
      </motion.div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-400 text-center font-mono p-6 bg-black border border-red-500 rounded-md mx-auto max-w-md shadow-[0_0_15px_rgba(255,0,0,0.2)]"
      >
        <FaTerminal className="inline mr-2 text-xl" /> 
        <span className="text-red-500 font-bold">ERROR:</span> {error}
        <div className="mt-4 p-2 border-t border-red-800 text-xs">
          <TypedLine text="Try refreshing the page or checking your connection..." />
        </div>
      </motion.div>
    </div>
  );

  const CandidateRating = ({ name, voteCount, totalVotes, isWinner, delay }) => {
    const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
    const greenShade = getGreenShade(parseFloat(percentage));
    
    return (
      <motion.li 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`result_item rounded-md overflow-hidden mb-3 ${isWinner ? 'border border-green-400 shadow-[0_0_10px_rgba(0,255,0,0.15)]' : ''} bg-gray-900 hover:bg-gray-800 transition-colors`}
      >
        <div className="p-3 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-2 md:mb-0">
            {isWinner && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.3 }}
                className="mr-2 text-green-400"
              >
                <FaTrophy size={18} />
              </motion.div>
            )}
            <span className="font-mono text-green-300">{name}: <span className="text-white">{voteCount}</span> votes</span>
          </div>
          <div className="w-full md:w-16 text-right font-mono text-green-400">{percentage}%</div>
        </div>
        <div className="bg-gray-800 w-full h-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: delay + 0.2 }}
            className={`h-full bg-gradient-to-r ${greenShade}`}
          />
        </div>
      </motion.li>
    );
  };

  return (
    <div className="min-h-screen bg-black text-green-500 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-8">
          <FaEthereum className="text-green-400 text-3xl mr-3" />
          <h1 className="text-2xl md:text-3xl font-mono text-center">
            <span className="text-green-300">&gt;</span> <TypedLine text="Blockchain Election Results" /> <span className="animate-pulse">_</span>
          </h1>
        </div>
        
        <div className="mb-4 font-mono text-xs text-green-600 border-b border-green-900 pb-2">
          <div className="flex justify-between">
            <span>TOTAL ELECTIONS: {elections.length}</span>
            <span>BLOCKCHAIN: SEPOLIA</span>
          </div>
        </div>
        
        <AnimatePresence>
          {elections.map((election, index) => (
            <motion.article
              key={election.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 border border-green-800 rounded-md shadow-lg mb-6 overflow-hidden hover:shadow-[0_0_15px_rgba(0,255,0,0.1)] transition-shadow"
            >
              <motion.div 
                className="cursor-pointer"
                onClick={() => toggleExpand(election.id)}
              >
                <header className="result_header flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-green-700">
                  <div className="flex items-center">
                    <FaVoteYea className="text-green-500 mr-3" />
                    <h2 className="font-mono text-lg md:text-xl text-green-400">{election.title}</h2>
                    {election.winner && (
                      <div className="ml-3 px-2 py-1 bg-green-900/30 rounded text-xs flex items-center">
                        <FaTrophy className="text-yellow-500 mr-1" size={12} />
                        <span className="text-green-300">Winner</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="bg-black px-3 py-1 rounded-sm text-sm font-mono border border-green-700 mr-3 hidden sm:block">
                      {election.totalVotes} votes
                    </span>
                    {expandedElection === election.id ? (
                      <FaChevronUp className="text-green-500" />
                    ) : (
                      <FaChevronDown className="text-green-500" />
                    )}
                  </div>
                </header>
              </motion.div>
              
              <AnimatePresence>
                {expandedElection === election.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4">
                      {election.winner && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="bg-green-900/20 border-l-2 border-green-500 p-3 rounded-sm mb-4 flex items-center"
                        >
                          <MdCelebration className="text-green-400 mr-2 text-xl" />
                          <span className="font-mono text-green-300">
                            <TypedLine text={`> ${election.winner.username} wins with ${election.winner.voteCount} votes!`} />
                          </span>
                        </motion.div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4"
                      >
                        <h3 className="font-mono text-green-400 mb-2 text-sm border-b border-green-900 pb-1">
                          <span className="text-green-600">&gt;</span> CANDIDATE RESULTS:
                        </h3>
                        <ul className="result_list">
                          {election.candidates.map((candidate, idx) => (
                            <CandidateRating
                              key={idx}
                              name={candidate.username}
                              voteCount={candidate.voteCount}
                              totalVotes={election.totalVotes}
                              isWinner={election.winner && election.winner.username === candidate.username}
                              delay={0.1 * idx}
                            />
                          ))}
                        </ul>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 pt-2 border-t border-green-900/50 text-xs font-mono text-green-600 flex flex-col sm:flex-row sm:justify-between"
                      >
                        <div className="mb-2 sm:mb-0">
                          <span className="text-green-700">Contract:</span> {election.contractAddress.slice(0, 10)}...{election.contractAddress.slice(-8)}
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-700 mr-1">Total Votes:</span> {election.totalVotes}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </AnimatePresence>
        
        {elections.length === 0 && !loading && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-mono p-8 border border-green-800 rounded-md"
          >
            <div className="text-green-400 mb-2">
              <FaTerminal size={24} className="inline" />
            </div>
            <p>No election data found.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Results;