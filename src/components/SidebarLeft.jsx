

// import React from "react";
// import { NavLink, useLocation } from "react-router-dom";

// const Sidebar = () => {
//   const location = useLocation();

//   return (
//     <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-blue-600 text-white p-5 shadow-xl z-20">
//       <nav className="flex flex-col gap-4">
//         <NavLink
//           to="/communities/default/create"
//           className={`p-3 rounded-lg text-lg ${
//             location.pathname === "/communities/default/create"
//               ? "bg-white text-blue-600 font-bold"
//               : "hover:bg-blue-500"
//           }`}
//         >
//           ➕ Create Community
//         </NavLink>
//         <NavLink
//           to="/communities/default/join"
//           className={`p-3 rounded-lg text-lg ${
//             location.pathname === `/communities/default/join`
//               ? "bg-white text-blue-600 font-bold"
//               : "hover:bg-blue-500"
//           }`}
//         >
//           🤝 Join Community
//         </NavLink>
//         <NavLink
//           to="/communities/default"
//           className={`p-3 rounded-lg text-lg ${
//             location.pathname === `/communities/default`
//               ? "bg-white text-blue-600 font-bold"
//               : "hover:bg-blue-500"
//           }`}
//         >
//           🏠 My Communities
//         </NavLink>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;


import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Clear local storage or token (if you're using authentication)
    localStorage.removeItem("authToken"); // Example, replace with your token handling

    // Redirect to the landing or login page
    navigate("/landing"); // Or any route you prefer after logout
  };

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-900 text-white p-5 shadow-xl flex flex-col z-20">
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/Home"
          end
          className={({ isActive }) =>
            `p-3 rounded-lg text-lg transition ${
              isActive
                ? "bg-emerald-500 text-white font-semibold"
                : "hover:bg-gray-700 hover:text-emerald-400"
            }`
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/communities/default/create"
          className={({ isActive }) =>
            `p-3 rounded-lg text-lg transition ${
              isActive
                ? "bg-emerald-500 text-white font-semibold"
                : "hover:bg-gray-700 hover:text-emerald-400"
            }`
          }
        >
          ➕ Create Community
        </NavLink>

        <NavLink
          to="/communities/default/join"
          className={({ isActive }) =>
            `p-3 rounded-lg text-lg transition ${
              isActive
                ? "bg-emerald-500 text-white font-semibold"
                : "hover:bg-gray-700 hover:text-emerald-400"
            }`
          }
        >
          🤝 Join Community
        </NavLink>

        <NavLink
          to="/communities/default"
          end
          className={({ isActive }) =>
            `p-3 rounded-lg text-lg transition ${
              isActive
                ? "bg-emerald-500 text-white font-semibold"
                : "hover:bg-gray-700 hover:text-emerald-400"
            }`
          }
        >
          🏠 My Communities
        </NavLink>
        <NavLink
          to="/profile/default"
          className={`p-3 rounded-lg text-lg ${
            location.pathname === `/profile/default`
              ? "bg-white text-blue-600 font-bold"
              : "hover:bg-blue-500"
          }`}
        >
          My Profile
        </NavLink>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full p-3 text-lg transition block text-center hover:bg-gray-700 hover:text-rose-400 rounded-lg"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;





