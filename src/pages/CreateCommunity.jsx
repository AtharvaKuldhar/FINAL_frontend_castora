

// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { field_slice_actions } from '../store/field_slice';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/SidebarLeft';
// import axios from 'axios';

// const dataTypes = ['string', 'numeric', 'alphanumeric'];

// const CreateCommunity = () => {
//   const dispatch = useDispatch();
//   const fields = useSelector((state) => state.fields.fields);
//   const navigate = useNavigate();

//   const [communityName, setCommunityName] = useState('');
//   const [communityPassword, setCommunityPassword] = useState('');
//   const [sampleData, setSampleData] = useState({});
//   const [error, setError] = useState(null);

//   const handleUpdate = (id, key, value) => {
//     dispatch(field_slice_actions.updateField({ id, key, value }));
//   };

//   const handleSampleDataChange = (id, value) => {
//     setSampleData({
//       ...sampleData,
//       [id]: value,
//     });
//   };

//   const handleSubmit = async () => {
//     if (!communityName.trim() || !communityPassword.trim()) {
//       setError('Community name and password are required');
//       return;
//     }

//     setError(null);

//     // Map fields to include sample data
//     const fieldsWithSampleData = fields.map((field) => ({
//       data: field.name,
//       type1: field.type,
//       sample: sampleData[field.id] || '', // Get the sample data for this field
//     }));

//     try {
//       const token = localStorage.getItem('token');

//       const response = await axios.post(
//         'http://localhost:5001/admin/createCommunity',
//         {
//           cname: communityName,
//           password: communityPassword,
//           field: fieldsWithSampleData,
//         },
//         {
//           headers: {
//             'token': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.status === 201 || response.status === 200) {
//         const key = response.data.key;
//         alert(`Community created successfully! Your key: ${key}`);
//         navigate(`/communities/${key}`);
//       } else {
//         alert(response.data.msg || 'Community creation failed');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong while creating the community');
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       <div className="w-64 border-r border-gray-200">
//         <Sidebar />
//       </div>

//       <div className="flex-1 p-8">
//         <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6 p-6">
//           <h2 className="text-2xl font-bold">Create Community</h2>

//           {/* Community Name */}
//           <div className="space-y-2">
//             <label htmlFor="communityName" className="block font-medium text-gray-700">
//               Community Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="communityName"
//               placeholder="Enter community name"
//               value={communityName}
//               onChange={(e) => setCommunityName(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>

//           {/* Community Password */}
//           <div className="space-y-2">
//             <label htmlFor="communityPassword" className="block font-medium text-gray-700">
//               Community Password <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="password"
//               id="communityPassword"
//               placeholder="Enter community password"
//               value={communityPassword}
//               onChange={(e) => setCommunityPassword(e.target.value)}
//               className="w-full border border-gray-300 rounded-md p-2"
//             />
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//           </div>

//           {/* Custom Fields */}
//           <div className="space-y-4">
//             <h4 className="text-lg font-semibold">
//               Add the information that you want the voter to enter when joining the community
//               (e.g., Name, Enrollment number, etc.)
//             </h4>
//             {fields.map((field, idx) => (
//               <div key={field.id} className="flex items-center gap-4">
//                 <input
//                   type="text"
//                   placeholder={`Field ${idx + 1}`}
//                   value={field.name}
//                   onChange={(e) => handleUpdate(field.id, 'name', e.target.value)}
//                   className="border border-gray-300 rounded-md p-2 flex-1"
//                 />
//                 <select
//                   value={field.type}
//                   onChange={(e) => handleUpdate(field.id, 'type', e.target.value)}
//                   className="border border-gray-300 rounded-md p-2"
//                 >
//                   {dataTypes.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//                 {/* Sample Value */}
//                 <input
//                   type="text"
//                   placeholder="Your Details"
//                   value={sampleData[field.id] || ''}
//                   onChange={(e) => handleSampleDataChange(field.id, e.target.value)}
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-between pt-4">
//             <button
//               onClick={() => dispatch(field_slice_actions.addField())}
//               className="bg-blue-500 font-bold text-white px-4 py-2 rounded-xl transition hover:bg-blue-600 hover:shadow-lg"
//             >
//               + Add Field
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="bg-green-500 font-bold text-white px-6 py-2 rounded-xl transition hover:bg-green-600 hover:shadow-lg"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateCommunity;


import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { field_slice_actions } from '../store/field_slice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';

const dataTypes = ['string', 'numeric', 'alphanumeric'];

const CreateCommunity = () => {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.fields.fields);
  const navigate = useNavigate();

  const [communityName, setCommunityName] = useState('');
  const [communityPassword, setCommunityPassword] = useState('');
  const [sampleData, setSampleData] = useState({});
  const [error, setError] = useState(null);

  const handleUpdate = (id, key, value) => {
    dispatch(field_slice_actions.updateField({ id, key, value }));
  };

  const handleSampleDataChange = (id, value) => {
    setSampleData({
      ...sampleData,
      [id]: value,
    });
  };

  const handleSubmit = async () => {
    if (!communityName.trim() || !communityPassword.trim()) {
      setError('Community name and password are required');
      return;
    }

    setError(null);
    const fieldsWithSampleData = fields.map((field) => ({
      data: field.name,
      type1: field.type,
      sample: sampleData[field.id] || '',
    }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/admin/createCommunity',
        {
          cname: communityName,
          password: communityPassword,
          field: fieldsWithSampleData,
        },
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        const key = response.data.key;
        alert(`Community created successfully! Your key: ${key}`);
        navigate(`/communities/${key}`);
      } else {
        alert(response.data.msg || 'Community creation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while creating the community');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-4 mt-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Create Community</h2>
          <p className="text-sm text-gray-500 text-center">Define custom fields that members must fill while joining.</p>

          {/* Community Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Community Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Science Batch A"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Community Password */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Community Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="e.g. csbatch@2025"
              value={communityPassword}
              onChange={(e) => setCommunityPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Dynamic Fields */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700">
              Voter Info Fields
            </h4>
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <input
                  type="text"
                  placeholder={`Field ${idx + 1}`}
                  value={field.name}
                  onChange={(e) => handleUpdate(field.id, 'name', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                <select
                  value={field.type}
                  onChange={(e) => handleUpdate(field.id, 'type', e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  {dataTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Sample Value"
                  value={sampleData[field.id] || ''}
                  onChange={(e) => handleSampleDataChange(field.id, e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <button
              onClick={() => dispatch(field_slice_actions.addField())}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-lg shadow transition"
            >
              + Add Field
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg shadow transition"
            >
              Create Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;

