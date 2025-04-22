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
        // Fetch elections from backend
        const response = await axios.post(
          'http://localhost:5001/getElections',
          {},
          {
            headers: { token: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        const fetchedElections = response.data.electionData ? [response.data] : response.data.elections || [];
        console.log('Fetched Elections:', fetchedElections);

        const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/e0be1c8fa97c4895b24b08bc6cb0aaef');
        const updatedElections = await Promise.all(
          fetchedElections.map(async (electionData) => {
            const { _id: id, election_address: contractAddress, electionName, thumbnail, candidates } = electionData;
            const contract = new ethers.Contract(contractAddress, ElectionABI, provider);
            const allVotes = await contract.getAllVotes();
            const totalVotes = allVotes.reduce((sum, vote) => sum + (vote > 0 ? Number(vote) : 0), 0);

            // Fetch votes for each candidate
            const updatedCandidates = await Promise.all(
              candidates.map(async (candidate) => {
                const voteCount = await contract.getVotes(candidate.username);
                return { ...candidate, voteCount: Number(voteCount) };
              })
            );

            return {
              id,
              title: electionName,
              thumbnail: thumbnail || '/default-thumbnail.jpg',
              contractAddress,
              totalVotes,
              candidates: updatedCandidates,
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
          <article key={election.id} className="result bg-gray-100 rounded-lg shadow-lg p-2 w-10/12 mb-4 overflow-hidden flex flex-col">
            <header className="result_header flex items-center justify-between bg-gray-200 border-2 border-gray-50 rounded-md">
              <h4 className="font-bold p-2">{election.title}</h4>
              <div className="result_header-image w-12 aspect-square overflow-hidden rounded-full m-2">
                <img src={election.thumbnail} alt={election.title} />
              </div>
            </header>
            <ul className="result_list flex flex-col gap-2 p-4 pt-2">
              {election.candidates.map((candidate) => (
                <CandidateRating
                  key={candidate.id}
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