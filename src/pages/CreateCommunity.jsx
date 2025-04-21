import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { field_slice_actions } from '../store/field_slice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const dataTypes = ['text', 'numeric'];

const CreateCommunity = () => {
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.fields.fields);
  const navigate = useNavigate();

  const [communityName, setCommunityName] = useState('');
  const [communityPassword, setCommunityPassword] = useState('');
  const [sampleData, setSampleData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const validateCommunityName = (name) => {
    return /^[a-zA-Z]+$/.test(name);
  };

  const handleUpdate = (id, key, value) => {
    dispatch(field_slice_actions.updateField({ id, key, value }));
  };

  const handleSampleDataChange = (id, value, type) => {
    if (type === 'numeric' && value !== '' && isNaN(value)) {
      return;
    }
    setSampleData({
      ...sampleData,
      [id]: value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (!communityName.trim() || !communityPassword.trim()) {
      setError('Community name and password are required');
      setLoading(false);
      return;
    }

    if (!validateCommunityName(communityName.trim())) {
      setError('Community name must contain only letters (no spaces or numbers)');
      setLoading(false);
      return;
    }

    if (fields.length === 0) {
      setError('At least one field is required');
      setLoading(false);
      return;
    }

    if (fields.some((field) => !field.name.trim())) {
      setError('All field names must be filled');
      setLoading(false);
      return;
    }

    const fieldsWithSampleData = fields.map((field) => ({
      data: field.name.trim(),
      type1: field.type,
      sample: sampleData[field.id] || '',
    }));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to create a community');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5001/admin/createCommunity',
        {
          cname: communityName.trim(),
          password: communityPassword.trim(),
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
        setSuccess({
          message: 'Community Created Successfully!',
          key,
        });
      } else {
        setError(response.data.msg || 'Community creation failed');
      }
    } catch (err) {
      console.error('Error creating community:', err);
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccess(null);
    setCommunityName('');
    setCommunityPassword('');
    setSampleData({});
    dispatch(field_slice_actions.resetFields());
    navigate(`/communities/${success.key}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 bg-white shadow-xl">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Create a Community</h2>
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
          </div>
          <p className="text-md text-gray-600">
            Set up your community by defining a name, password, and custom fields for voters.
          </p>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <motion.svg
                    className="h-20 w-20 text-green-500 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                  <h3 className="text-2xl font-bold text-gray-900">{success.message}</h3>
                  <p className="text-md text-gray-600">Community Key: <span className="font-semibold">{success.key}</span></p>
                  <button
                    onClick={handleSuccessClose}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition hover:scale-105"
                    aria-label="Continue to community"
                  >
                    Continue
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            {/* Community Name */}
            <div>
              <label htmlFor="communityName" className="block text-sm font-semibold text-gray-700 mb-2">
                Community Name <span className="text-red-500">*</span>
              </label>
              <input
                id="communityName"
                type="text"
                placeholder="e.g. BookClub"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 transition"
                required
                aria-describedby={error && error.includes('name') ? 'error-message' : undefined}
              />
            </div>

            {/* Community Password */}
            <div>
              <label htmlFor="communityPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Community Password <span className="text-red-500">*</span>
              </label>
              <input
                id="communityPassword"
                type="password"
                placeholder="Enter a secure password"
                value={communityPassword}
                onChange={(e) => setCommunityPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 transition"
                required
                aria-describedby={error && error.includes('password') ? 'error-message' : undefined}
              />
            </div>

            {/* Dynamic Fields */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900">Custom Fields for Voters</h4>
              {fields.length === 0 ? (
                <p className="text-gray-500 text-sm">No fields added. Click "Add Field" to start.</p>
              ) : (
                fields.map((field, idx) => (
                  <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label
                        htmlFor={`field-name-${field.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Field Name
                      </label>
                      <input
                        id={`field-name-${field.id}`}
                        type="text"
                        placeholder={`Field ${idx + 1} (e.g., Name)`}
                        value={field.name}
                        onChange={(e) => handleUpdate(field.id, 'name', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 transition"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`field-type-${field.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Field Type
                      </label>
                      <select
                        id={`field-type-${field.id}`}
                        value={field.type}
                        onChange={(e) => handleUpdate(field.id, 'type', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 transition"
                      >
                        {dataTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={`field-sample-${field.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Sample Value
                      </label>
                      <input
                        id={`field-sample-${field.id}`}
                        type={field.type === 'numeric' ? 'number' : 'text'}
                        placeholder={field.type === 'numeric' ? 'e.g., 123' : 'e.g., John Doe'}
                        value={sampleData[field.id] || ''}
                        onChange={(e) => handleSampleDataChange(field.id, e.target.value, field.type)}
                        className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 transition"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {error && (
              <div id="error-message" className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg" role="alert">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-6">
              <button
                type="button"
                onClick={() => dispatch(field_slice_actions.addField())}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition transform hover:scale-105 shadow-md"
                disabled={loading}
              >
                <span className="mr-2">+</span> Add Field
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl transition transform hover:scale-105 shadow-md flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Community'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default CreateCommunity;