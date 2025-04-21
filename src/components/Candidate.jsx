import React from 'react';
import HorizontalCard from './HorizontalCard';
import { UiActions } from '../store/ui_slice';
import { voteActions } from '../store/vote_slice';
import { useDispatch } from 'react-redux';

const Candidate = ({ _id, fullName, election_address }) => {
  const dispatch = useDispatch();

  const openCandidateModal = () => {
    dispatch(UiActions.openVoteCandidateModal());
    dispatch(voteActions.changeSelectedVoteCandidate({ _id, fullName, election_address }));
  };

  return (
    <HorizontalCard className="w-full h-48 overflow-hidden items-center bg-gray-900 border border-gray-700">
      <h5 className="text-center font-bold text-white">
        {fullName?.length > 20 ? fullName.substring(0, 20) + '...' : fullName}
      </h5>
      <button
        className="bg-green-500 font-bold text-center text-white px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105"
        onClick={openCandidateModal}
      >
        Vote
      </button>
    </HorizontalCard>
  );
};

export default Candidate;