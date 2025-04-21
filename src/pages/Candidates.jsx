import React from 'react'
import { candidates as dummyCandidates} from '../data'
import { useParams } from 'react-router-dom'
import Candidate from '../components/Candidate'
import ConfirmVote from '../components/ConfirmVote'
import { useSelector } from 'react-redux'
const Candidates = () => {
  const {id} = useParams();

  const selectedVoteCandidate = useSelector(state => state.vote.selectedVoteCandidate)

   const candidates = dummyCandidates.filter(candidate => candidate.election === "e1");
   console.log("Filtered Candidates: ", candidates);
  return (
    <>
      <section className='p-5'>
        <header className=' flex flex-col items-center text-center p-10 w-60% mg-auto mb-3'>
          <h1 className='text-3xl font-bold'> Vote your Candidates</h1>
          <p className='font-light'>There are the Candidates for the selcted election. Please vote once and wisely, because you wont be allowed to vote in thei electiona again</p>
        </header>
        <div className='grid grid-cols-3 gap-4 '>
        {candidates.length > 0 ? (
            candidates.map(candidate => <Candidate key={candidate.id} {...candidate} />)
          ) : (
            <p>No candidates found for this election.</p>
          )}
        </div>
      </section>
      {selectedVoteCandidate && <ConfirmVote/>}
    </>
  )
}

export default Candidates