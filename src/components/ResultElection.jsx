import { useState } from "react";
import React from 'react'
import { candidates } from '../data'
import CandidateRating from './CandidateRating';

const ResultElection = ({ id, thumbnail, title }) => {

    const [totalVotes, setTotalVotes] = useState(521);

    // get candidates that belong to this election iteration const electionCandidates = | I

    const electionCandidates = candidates.filter(candidate => {
        return candidate.election == id;
    })

    return (
        <article className="result bg-gray-100 rounded-lg shadow-lg p-2 w-10/12 mb-4 overflow-hidden flex flex-col">
            <header className="result_header flex items-center justify-between bg-gray-200 border-2 border-gray-50 rounded-md">
                <h4 className="font-bold p-2">{title}</h4>
                <div className="result_header-image w-12 aspect-square overflow-hidden rounded-full m-2"> <img src={thumbnail} alt={title} /> </div>
            </header>
            <ul className="result_list flex flex-col gap-2 p-4 pt-2">
                {
                    electionCandidates.map(candidate => <CandidateRating key={candidate.id} {...candidate} totalVotes={totalVotes} />
                    )
                }
            </ul>
        </article>

    )
}

export default ResultElection;
