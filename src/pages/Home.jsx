// import React from "react";
// import Sidebar from "../components/SidebarLeft"; // adjust path if needed
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Home = () => {
//   const [createdCount, setCreatedCount] = useState(0);
//   const [joinedCount, setJoinedCount] = useState(0);
//   const [votedCount, setVotedCount] = useState(0);
//   const [activeElections, setActiveElections] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [createdRes, joinedRes, votedRes, activeRes] = await Promise.all([
//           axios.get("/api/elections/created"),
//           axios.get("/api/elections/joined"),
//           axios.get("/api/elections/voted"),
//           axios.get("/api/elections/active"),
//         ]);
  
//         setCreatedCount(createdRes.data?.count || 0);
//         setJoinedCount(joinedRes.data?.count || 0);
//         setVotedCount(votedRes.data?.count || 0);
//         setActiveElections(activeRes.data?.elections || []);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//       }
//     };
  
//     fetchData();
//   }, []);

//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="ml-64 mt-16 p-6 w-full">
//         {/* Stats Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8">
//           <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
//             <p className="text-xl font-semibold text-blue-600">🏛️ {createdCount}</p>
//             <p className="text-gray-600">Communities Created</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
//             <p className="text-xl font-semibold text-green-600">🤝 {joinedCount}</p>
//             <p className="text-gray-600">Communities Joined</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
//             <p className="text-xl font-semibold text-purple-600">🗳️ {votedCount}</p>
//             <p className="text-gray-600">Votes Cast</p>
//           </div>
//         </div>

//         {/* Active Elections Section */}
//         <div>
//           <h2 className="text-xl font-bold mb-4">Active Elections</h2>
//           {activeElections.length > 0 ? (
//             <ul className="space-y-3">
//               {activeElections.map((election) => (
//                 <li
//                   key={election.id}
//                   className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
//                 >
//                   <p className="font-semibold">{election.title}</p>
//                   <p className="text-sm text-gray-500">
//                     Ends on: {new Date(election.endDate).toLocaleDateString()}
//                   </p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No active elections right now.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React from "react";
import Sidebar from "../components/SidebarLeft";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [createdCount, setCreatedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [activeElections, setActiveElections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [createdRes, joinedRes, votedRes, activeRes] = await Promise.all([
          axios.get("/api/elections/created"),
          axios.get("/api/elections/joined"),
          axios.get("/api/elections/voted"),
          axios.get("/api/elections/active"),
        ]);

        setCreatedCount(createdRes.data?.count || 0);
        setJoinedCount(joinedRes.data?.count || 0);
        setVotedCount(votedRes.data?.count || 0);
        setActiveElections(activeRes.data?.elections || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="ml-64 mt-16 p-8 w-full">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
          {[
            { count: createdCount, label: "Communities Created", color: "black", icon: "🏛️" },
            { count: joinedCount, label: "Communities Joined", color: "black", icon: "🤝" },
            { count: votedCount, label: "Votes Cast", color: "black", icon: "🗳️" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 border-t-4 border-${item.color}-500`}
            >
              <p className={`text-3xl font-bold text-${item.color}-600 mb-2`}>
                {item.icon} {item.count}
              </p>
              <p className="text-gray-700 font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Active Elections Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">🟢 Active Elections</h2>
          {activeElections.length > 0 ? (
            <ul className="space-y-4">
              {activeElections.map((election) => (
                <li
                  key={election.id}
                  className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{election.title}</p>
                      <p className="text-sm text-gray-500">
                        Ends on:{" "}
                        <span className="font-medium">
                          {new Date(election.endDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <div className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                      Active
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center mt-6 italic">No active elections right now.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

