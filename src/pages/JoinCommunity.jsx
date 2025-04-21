// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import Sidebar from '../components/SidebarLeft';
// import axios from 'axios';

// const JoinCommunity = () => {
//   const [communityId, setCommunityId] = useState('');
//   const [password, setPassword] = useState('');
//   const [formData, setFormData] = useState({});
//   const [fields, setFields] = useState([]);
//   const [step, setStep] = useState(1); // 1 = enter ID & password, 2 = enter dynamic fields
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (id, value) => {
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleInitialSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!communityId.trim() || !password.trim()) {
//       setError('Community ID and Password are required.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');

//       // Step 1: Verify password
//       const verifyRes = await axios.post(
//         'http://localhost:5001/join_community/test',
//         { CollectionId: communityId, password },
//         {
//           headers: {
//             'token': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!verifyRes.data.isVerified) {
//         setError('Incorrect password or community not found.');
//         setLoading(false);
//         return;
//       }

//       // Step 2: Fetch schema
//       const schemaRes = await axios.post(
//         'http://localhost:5001/getSchema',
//         { collection_key: communityId },
//         {
//           headers: {
//             'token': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       const rawSchema = schemaRes.data.schema;
//       const dynamicFields = Object.keys(rawSchema).filter(
//         (key) => key !== '_id' && key !== 'user_id' && key !== '__v'
//       ).map((field, idx) => ({
//         id: idx.toString(),
//         key: field,
//         name: field,
//       }));

//       setFields(dynamicFields);
//       setStep(2);
//     } catch (err) {
//       console.error('Error verifying or fetching schema:', err);
//       setError('Verification failed. Please check details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFinalSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const token = localStorage.getItem('token');
//       const dataToSend = fields.map((field) => formData[field.id] || '');

//       const response = await axios.post(
//         'http://localhost:5001/join_community',
//         {
//           CollectionId: communityId,
//           data: dataToSend,
//         },
//         {
//           headers: {
//             'token': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       alert(response.data.msg || 'Joined community successfully!');
//     } catch (err) {
//       console.error('Error joining community:', err);
//       setError('Failed to join community.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-6">
//       <Sidebar />
//       <h2 className="text-2xl font-semibold text-center">Join Community</h2>

//       <form onSubmit={step === 1 ? handleInitialSubmit : handleFinalSubmit} className="space-y-4">
//         <div>
//           <label className="font-medium">Community ID<span className="text-red-500">*</span></label>
//           <input
//             type="text"
//             placeholder="Enter Community ID"
//             value={communityId}
//             onChange={(e) => setCommunityId(e.target.value)}
//             className="border border-gray-300 rounded-md p-2 w-full"
//             required
//             disabled={step === 2}
//           />
//         </div>

//         {step === 1 && (
//           <div>
//             <label className="font-medium">Password<span className="text-red-500">*</span></label>
//             <input
//               type="password"
//               placeholder="Enter Community Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="border border-gray-300 rounded-md p-2 w-full"
//               required
//             />
//           </div>
//         )}

//         {step === 2 && fields.length > 0 && (
//           <>
//             {fields.map((field) => (
//               <div key={field.id} className="flex flex-col">
//                 <label className="font-medium">{field.name}</label>
//                 <input
//                   type="text"
//                   placeholder={`Enter ${field.name}`}
//                   value={formData[field.id] || ''}
//                   onChange={(e) => handleChange(field.id, e.target.value)}
//                   className="border border-gray-300 rounded-md p-2"
//                   required
//                 />
//               </div>
//             ))}
//           </>
//         )}

//         {error && <div className="text-red-500 text-sm">{error}</div>}

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
//           disabled={loading}
//         >
//           {loading
//             ? step === 1
//               ? 'Verifying...'
//               : 'Joining...'
//             : step === 1
//               ? 'Verify Community'
//               : 'Join Community'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default JoinCommunity;


import React, { useState } from 'react';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';

const JoinCommunity = () => {
  const [communityId, setCommunityId] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!communityId.trim() || !password.trim()) {
      setError('Community ID and Password are required.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const verifyRes = await axios.post(
        'http://localhost:5001/join_community/test',
        { CollectionId: communityId, password },
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!verifyRes.data.isVerified) {
        setError('Incorrect password or community not found.');
        setLoading(false);
        return;
      }

      const schemaRes = await axios.post(
        'http://localhost:5001/getSchema',
        { collection_key: communityId },
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const rawSchema = schemaRes.data.schema;
      const dynamicFields = Object.keys(rawSchema)
        .filter((key) => !['_id', 'user_id', '__v'].includes(key))
        .map((field, idx) => ({
          id: idx.toString(),
          key: field,
          name: field,
        }));

      setFields(dynamicFields);
      setStep(2);
    } catch (err) {
      console.error('Error verifying or fetching schema:', err);
      setError('Verification failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const dataToSend = fields.map((field) => formData[field.id] || '');

      const response = await axios.post(
        'http://localhost:5001/join_community',
        {
          CollectionId: communityId,
          data: dataToSend,
        },
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert(response.data.msg || 'Joined community successfully!');
    } catch (err) {
      console.error('Error joining community:', err);
      setError('Failed to join community.');
    } finally {
      setLoading(false);
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
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Join Community</h2>
          <p className="text-sm text-gray-500 text-center">Enter the community ID and password to proceed.</p>

          <form onSubmit={step === 1 ? handleInitialSubmit : handleFinalSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Community ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1234ABCD"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                disabled={step === 2}
              />
            </div>

            {step === 1 && (
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Community Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            )}

            {step === 2 && fields.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-700">Enter Your Details</h4>
                {fields.map((field) => (
                  <div key={field.id}>
                    <label className="block font-medium text-gray-700 mb-1">{field.name}</label>
                    <input
                      type="text"
                      placeholder={`Enter ${field.name}`}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                ))}
              </div>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow transition"
              disabled={loading}
            >
              {loading
                ? step === 1
                  ? 'Verifying...'
                  : 'Joining...'
                : step === 1
                ? 'Join Community'
                : 'Join Community'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunity;
