import React, { useState } from 'react'
import { elections as dummyElections } from '../data'
import ResultElection from '../components/ResultElection'

const Results = () => {
  const [elections, setElections] = useState(dummyElections);
  return (
    <section className="results w-8/12 mx-auto mb-3">
      <div className="container results_container flex flex-col">
        {
          elections.map(election => <ResultElection key={election.id} {...election}
          />)
        }

      </div>
    </section>
  )
}
export default Results