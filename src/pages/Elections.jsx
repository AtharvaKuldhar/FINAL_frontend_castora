// import React, { useState } from 'react';
// import { elections as dummyElections } from '../data';
// import Election from '../components/Election';
// import Sidebar from '../components/SidebarLeft';

// const Elections = () => {
//   const [elections, setElections] = useState(dummyElections);
//   const [filter, setFilter] = useState('ongoing'); // 'ongoing' | 'past'

//   const filteredElections = elections.filter(e => e.status === filter);

//   return (
//     <section className="flex min-h-screen">
//       {/* Sidebar stays on the left */}
//       <div className="w-64 border-r border-gray-200">
//         <Sidebar />
//       </div>

//       {/* Main content next to the sidebar */}
//       <div className="flex-1 p-6">
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold">
//               {filter === 'ongoing' ? 'Ongoing Elections' : 'Past Elections'}
//             </h1>
//             <div className="mt-4 space-x-3">
//               <button
//                 onClick={() => setFilter('ongoing')}
//                 className={`px-4 py-2 rounded-lg transition ${
//                   filter === 'ongoing'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 hover:bg-gray-300'
//                 }`}
//               >
//                 Ongoing
//               </button>
//               <button
//                 onClick={() => setFilter('past')}
//                 className={`px-4 py-2 rounded-lg transition ${
//                   filter === 'past'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 hover:bg-gray-300'
//                 }`}
//               >
//                 Past
//               </button>
//             </div>
//           </div>
//           <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
//             Create New Election
//           </button>
//         </header>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredElections.length > 0 ? (
//             filteredElections.map(election => (
//               <Election key={election.id} {...election} />
//             ))
//           ) : (
//             <p className="text-gray-500 col-span-full">
//               No {filter} elections found.
//             </p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Elections;


import React, { useState,useEffect } from 'react';
import Election from '../components/Election';
import Sidebar from '../components/SidebarLeft';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [filter, setFilter] = useState('ongoing'); // 'ongoing' | 'past'
  const [loading, setLoading] = useState(true);
  const filteredElections = elections.filter(e => e.status === filter);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'ongoing' ? '/activeElection' : '/pastElections';
      const res = await axios.post(
        `http://localhost:5001${endpoint}`,
        {},
        {
          headers: {
            token: localStorage.getItem('token'), // assuming you're storing JWT token
          },
        }
      );
      const allElections = res.data.flatMap(community => community.elections.map(election => ({
        ...election,
        community_name: community.community_name,
      })));

      setElections(allElections);
    } catch (err) {
      console.error('Error fetching elections:', err);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, [filter]);

  return (
    <section className="flex min-h-screen">
      {/* Sidebar stays on the left */}
      <div className="w-64 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content next to the sidebar */}
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {filter === 'ongoing' ? 'Ongoing Elections' : 'Past Elections'}
            </h1>
            <div className="mt-4 space-x-3">
              <button
                onClick={() => setFilter('ongoing')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'ongoing'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'past'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Past
              </button>
            </div>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.length > 0 ? (
            filteredElections.map(election => (
              <Election key={election.id} {...election} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No {filter} elections found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Elections;
