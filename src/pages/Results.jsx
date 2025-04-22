import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import ElectionABI from '../abi/ElectionABI.json';

const Results = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const community_key = localStorage.getItem('selectedCommunityKey');
        const token = localStorage.getItem('token');

        // Fetch elections from backend API
        const response = await axios.get('http://localhost:5001/getElections', {
          params: { community_key },
          headers: { token: `Bearer ${token}` },
        });

        const fetchedElections = response.data;
        console.log('Fetched Elections from API:', fetchedElections);

        const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/e0be1c8fa97c4895b24b08bc6cb0aaef');

        const updatedElections = await Promise.all(
          fetchedElections.map(async (electionData) => {
            const { _id: id, election_address: contractAddress, electionName, thumbnail } = electionData;

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
            console.log(`Election ${id} - Candidates with Vote Counts:`, candidates);

            // Calculate total votes
            const totalVotes = allVotes.reduce((sum, vote) => sum + (vote > 0 ? Number(vote) : 0), 0);
            console.log(`Election ${id} - Total Votes:`, totalVotes);

            return {
              id,
              title: electionName,
              thumbnail: thumbnail || '/default-thumbnail.jpg',
              contractAddress,
              totalVotes,
              candidates,
            };
          })
        );

        setElections(updatedElections);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load results: ' + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-white text-center">Loading results...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const CandidateRating = ({ name, voteCount, totalVotes }) => {
    const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : 0;
    return (
      <li className="result_item flex items-center justify-between p-2 bg-white rounded">
        <span>{name}: {voteCount} votes</span>
        <span>{percentage}%</span>
      </li>
    );
  };

  return (
    <section className="results w-8/12 mx-auto mb-3">
      <div className="container results_container flex flex-col">
        {elections.map((election) => (
          <article
            key={election.id}
            className="result bg-gray-100 rounded-lg shadow-lg p-2 w-10/12 mb-4 overflow-hidden flex flex-col"
          >
            <header className="result_header flex items-center justify-between bg-gray-200 border-2 border-gray-50 rounded-md">
              <h4 className="font-bold p-2">{election.title}</h4>
              <div className="result_header-image w-12 aspect-square overflow-hidden rounded-full m-2">
                <img src={election.thumbnail} alt={election.title} />
              </div>
            </header>
            <ul className="result_list flex flex-col gap-2 p-4 pt-2">
              {election.candidates.map((candidate, index) => (
                <CandidateRating
                  key={index}
                  name={candidate.username}
                  voteCount={candidate.voteCount}
                  totalVotes={election.totalVotes}
                />
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Results;