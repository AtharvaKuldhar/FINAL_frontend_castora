
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/SidebarLeft';
// import VerticalCard from '../components/VerticalCard';
// import axios from 'axios';

// const MyCommunities = () => {
//   const navigate = useNavigate();
//   const [role, setRole] = useState('admin'); // 'admin' | 'voter'
//   const [communities, setCommunities] = useState({ admin: [], user: [] });

//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:5001/myCommunity', {
//           headers: {
//             'token': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         console.log(response.data);
//         setCommunities(response.data);
//       } catch (error) {
//         console.error('Error fetching communities:', error);
//       }
//     };

//     fetchCommunities();
//   }, []);

//   const getDisplayedCommunities = () => {
//     if (role === 'admin') return communities.admin || [];
//     // Merge admin + user communities for voter role
//     return [...(communities.user || []), ...(communities.admin || [])];
//   };

//   const displayedCommunities = getDisplayedCommunities();

//   return (
//     <section className="flex min-h-screen bg-gray-50">
//       {/* Sidebar on the left */}
//       <div className="w-64 border-r border-gray-200">
//         <Sidebar />
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-6">
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-blue-700">
//               {role === 'admin' ? 'My Created Communities' : 'My Joined Communities'}
//             </h1>
//             <div className="mt-4 space-x-3">
//               <button
//                 onClick={() => setRole('admin')}
//                 className={`px-4 py-2 rounded-lg transition ${role === 'admin'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 hover:bg-gray-300'
//                   }`}
//               >
//                 Admin
//               </button>
//               <button
//                 onClick={() => setRole('voter')}
//                 className={`px-4 py-2 rounded-lg transition ${role === 'voter'
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-200 hover:bg-gray-300'
//                   }`}
//               >
//                 Voter
//               </button>
//             </div>
//           </div>
//         </header>

//         {displayedCommunities.length === 0 ? (
//           <p className="text-gray-500 text-lg">
//             No communities found for <span className="font-semibold">{role}</span> role.
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {displayedCommunities.map((community, index) => (
//               <VerticalCard key={index}>
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//                   {community.collectionName}
//                 </h2>
//                 <button
//                   onClick={() => {
//                     // Store selected community key in localStorage
//                     localStorage.setItem('selectedCommunityKey', community.key);

//                     // Navigate to the appropriate route
//                     navigate(
//                       role === 'admin'
//                         ? `/communities/${community.collectionName}/manage`
//                         : `/communities/${community.collectionName}/elections`
//                     );
//                   }}
//                   className="bg-blue-500 font-bold text-center text-white px-4 py-2 rounded-2xl
//       transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105"
//                 >
//                   {role === 'admin' ? 'Start Election' : 'Enter Election'}
//                 </button>
//               </VerticalCard>
//             ))}

//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default MyCommunities;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import VerticalCard from '../components/VerticalCard';
import axios from 'axios';

const MyCommunities = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin'); // 'admin' | 'voter'
  const [communities, setCommunities] = useState({ admin: [], user: [] });

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/myCommunity', {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data);
        setCommunities(response.data);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const getDisplayedCommunities = () => {
    if (role === 'admin') return communities.admin || [];
    return [...(communities.user || []), ...(communities.admin || [])];
  };

  const displayedCommunities = getDisplayedCommunities();

  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Sidebar on the left */}
      <div className="w-64 border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 mt-20"> {/* Added mt-20 here */}
        {/* Communities Section */}
        <div className="text-center space-y-8 mb-12">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === 'admin' ? 'My Created Communities' : 'My Joined Communities'}
          </h1>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setRole('admin')}
              className={`px-6 py-3 rounded-lg transition font-semibold ${role === 'admin'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              Admin
            </button>
            <button
              onClick={() => setRole('voter')}
              className={`px-6 py-3 rounded-lg transition font-semibold ${role === 'voter'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              Voter
            </button>
          </div>
        </div>

        {/* Communities List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCommunities.length === 0 ? (
            <p className="text-gray-500 text-lg text-center w-full">
              No communities found for <span className="font-semibold">{role}</span> role.
            </p>
          ) : (
            displayedCommunities.map((community, index) => (
              <VerticalCard key={index} className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {community.collectionName}
                </h2>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      localStorage.setItem('selectedCommunityKey', community.key);
                      navigate(
                        role === 'admin'
                          ? `/communities/${community.collectionName}/manage`
                          : `/communities/${community.collectionName}/elections`
                      );
                    }}
                    className="bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-105"
                  >
                    {role === 'admin' ? 'Start Election' : 'Enter Election'}
                  </button>
                </div>
              </VerticalCard>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MyCommunities;


