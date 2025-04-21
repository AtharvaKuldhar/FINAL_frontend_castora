import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/ui_slice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ethers } from 'ethers';
import ElectionABI from '../abi/ElectionABI.json';

const ConfirmVote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedVoteCandidate = useSelector((state) => state.vote.selectedVoteCandidate);
  const [modalCandidate, setModalCandidate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voterId, setVoterId] = useState('');

  useEffect(() => {
    const fetchCandidateAndVerifyVoter = async () => {
      if (selectedVoteCandidate?._id) {
        try {
          // Fetch candidate details
          const response = await axios.get(`/api/candidates/${selectedVoteCandidate._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setModalCandidate({
            ...response.data.candidate,
            election_address: selectedVoteCandidate.election_address,
            fullName: selectedVoteCandidate.fullName,
          });

          // Check voter eligibility
          const voter = localStorage.getItem('voterId') || '';
          if (!voter) {
            setError('Voter ID not provided');
            return;
          }
          const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
          const contract = new ethers.Contract(
            selectedVoteCandidate.election_address,
            ElectionABI,
            provider
          );
          const isVoter = await contract.isVoter(voter);
          const hasVoted = await contract.hasVoted(voter);
          if (!isVoter) {
            setError('You are not an eligible voter');
          } else if (hasVoted) {
            setError('You have already voted');
          }
        } catch (err) {
          setError('Failed to fetch candidate or verify voter: ' + err.message);
        }
      }
    };
    setVoterId(localStorage.getItem('voterId') || '');
    fetchCandidateAndVerifyVoter();
  }, [selectedVoteCandidate]);

  const handleVote = async () => {
    if (!voterId) {
      setError('Voter ID not provided');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Initialize relayer wallet
      const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
      const relayerWallet = new ethers.Wallet(process.env.REACT_APP_RELAYER_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        modalCandidate.election_address,
        ElectionABI,
        relayerWallet
      );

      // Submit vote transaction
      const tx = await contract.vote(voterId, modalCandidate.fullName, {
        gasLimit: 200000,
      });
      await tx.wait();

      navigate('/congrats');
    } catch (err) {
      setError(err.message || 'Error submitting vote');
    } finally {
      setLoading(false);
    }
  };

  const closeCandidateModal = () => {
    dispatch(UiActions.closeVoteCandidateModal());
  };

  return (
    <section className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4">
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden max-w-md w-full p-6 border border-gray-700">
        <h5 className="text-lg font-semibold mb-4 text-center text-white">Please confirm your vote</h5>
        <h2 className="text-2xl font-bold text-center mb-4 text-white">{modalCandidate.fullName}</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex justify-around">
          <button
            className="bg-gray-500 font-bold text-white px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
            onClick={closeCandidateModal}
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
  );
};

export default ConfirmVote;