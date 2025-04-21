import React from 'react'

const CandidateRating = ({ fullName, image, voteCount, totalVotes }) => {
    return (
        <li className="result_candidate flex items-center gap-4 w-full">
            <div className="result_candidate-image w-18 aspect-square rounded-2xl overflow-hidden">
                <img src={image} alt={fullName} />
            </div>
            <div className="result_candidate-info w-full flex flex-col gap-2">
                <div>
                    <h5 className='text-base font-bold'>{fullName}</h5>
                    <small>{`${voteCount} ${voteCount === 1 ? "vote" : "votes"}`}</small>
                </div>
                <div className="result_candidate-rating flex items-center justify-between w-full">
                    <div className="result_candidate-loader w-full h-2 bg-gray-300 mt-2 rounded-full overflow-hidden">
                        <span 
                            className='h-full block bg-blue-500 transition-all bg-gradient-to-r from-blue-500 to-purple-500' 
                            style={{ width: `${totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0}%` }}>
                        </span> 
                    </div>
                    <small className='w-15 px-2'>
                        {`${totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(2) : 0}%`}
                    </small>
                </div>
            </div>
        </li>
    )
}
export default CandidateRating;
