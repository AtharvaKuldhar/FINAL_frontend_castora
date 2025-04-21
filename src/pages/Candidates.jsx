import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Candidate from '../components/Candidate';
import ConfirmVote from '../components/ConfirmVote';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Candidates = () => {
  const { id } = useParams();
  const selectedVoteCandidate = useSelector((state) => state.vote.selectedVoteCandidate);
  const [candidates, setCandidates] = useState([]);
  const [electionAddress, setElectionAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // POST request to /getSelectedCandidates
        const response = await axios.post(
          '/getSelectedCandidates',
          { electionId: id },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    fetchCandidates();
  }, [id]);

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
        <div className="grid grid-cols-3 gap-4">
          {candidates.length > 0 ? (
            candidates.map((candidate) => <Candidate key={candidate._id} {...candidate} />)
          ) : (
            <p className="text-white text-center">No candidates found for this election.</p>
          )}
        </div>
      )}
      {selectedVoteCandidate && <ConfirmVote />}
    </section>
  );
};

export default Candidates;