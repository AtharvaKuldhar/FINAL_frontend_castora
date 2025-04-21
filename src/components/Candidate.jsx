import React from 'react'
import HorizontalCard from './HorizontalCard'
import ConfirmVote from './ConfirmVote'
import {UiActions} from '../store/ui_slice'
import { useDispatch } from 'react-redux'
import { voteActions } from '../store/vote_slice'
const Candidate = ({image,id,fullName,motto}) => {

  const dispatch = useDispatch()

  const openCandidateModal = () => {
    
    dispatch(UiActions.openVoteCandidateModal())
    dispatch(voteActions.changeSelectedVoteCandidate(id))
  }

  return (
    <HorizontalCard className="w-100 h-110 overflow-hidden items-center">
        <div className="aspect-square overflow-hidden mb-2 mx-auto ">
            <img className='h-100 w-100 object-cover' src = {image} alt ={fullName}></img>
        </div>
        <h5 className='text-center font-bold'>{fullName?.length > 20? fullName.substring(0,20) + "..." : fullName}</h5>
        <small className='block font-light m-4 '>{motto?.length > 20? motto.substring(0,20) + "..." : motto}</small>
        <button className=' bg-blue-500 font-bold text-center text-white px-4 py-2 rounded-2xl
        transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105'
        onClick={openCandidateModal}>Vote</button>
    </HorizontalCard>
  )
}

export default Candidate