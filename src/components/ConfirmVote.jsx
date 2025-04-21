import React, { useEffect, useState } from 'react';
import { candidates } from '../data';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/ui_slice';
import { useNavigate } from 'react-router-dom';
const ConfirmVote = () => {
    const navigate = useNavigate();
    const [modalCandidate, setModalCandidate] = useState({});
    
    const dispatch = useDispatch()
    const closeCandidateModal = () => {
        dispatch(UiActions.closeVoteCandidateModal())
    }
    const selectedVoteCandidate = useSelector(state => state.vote.selectedVoteCandidate)
    useEffect(() => {
    // Find candidate with id "c1"
      if(selectedVoteCandidate){
        const candidate = candidates.find(candidate => candidate.id === selectedVoteCandidate);
        if (candidate) {
            setModalCandidate(candidate);
        }
      }
    }, [selectedVoteCandidate]);

    return (
        <section className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full p-6">
        <h5 className="text-lg font-semibold mb-4 text-center">Please confirm your vote</h5>
        {modalCandidate.image && (
          <div className="flex justify-center mb-4">
            <img
              className="h-40 w-40 object-cover rounded-full"
              src={modalCandidate.image}
              alt={modalCandidate.fullName}
            />
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-2">{modalCandidate.fullName}</h2>
        <p className="text-gray-600 text-center mb-4">{modalCandidate.motto}</p>
        <div className="flex justify-around">
          <button className="bg-gray-500 font-bold text-white px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
          onClick={closeCandidateModal}>
            Cancel
          </button>
          <button onClick={() => {navigate('/congrats')}}className="bg-blue-500 font-bold text-white px-4 py-2 rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:scale-105">
            Confirm
          </button>
        </div>
      </div>
    </section>
    
    );
};

export default ConfirmVote;
