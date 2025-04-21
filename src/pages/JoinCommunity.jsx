import React, { useState } from 'react';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JoinCommunity = () => {
  const [communityId, setCommunityId] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [success, setSuccess] = useState(null); // New state for success message

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedCommunityId = communityId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedCommunityId || !trimmedPassword) {
      setError('Community ID and Password are required.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to join a community.');
        setLoading(false);
        return;
      }

      const verifyRes = await axios.post(
        'http://localhost:5001/join_community/test',
        { CollectionId: trimmedCommunityId, password: trimmedPassword },
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!verifyRes.data.isVerified) {
        setError(verifyRes.data.msg || 'Incorrect password or community not found.');
        setLoading(false);
        return;
      }

      const schemaRes = await axios.post(
        'http://localhost:5001/getSchema',
        { collection_key: trimmedCommunityId },
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
          name: field.charAt(0).toUpperCase() + field.slice(1),
        }));

      if (dynamicFields.length === 0) {
        handleFinalSubmit(e);
        return;
      }

      setFields(dynamicFields);
      setStep(2);
    } catch (err) {
      console.error('Error verifying or fetching schema:', err);
      setError(err.response?.data?.msg || 'Verification failed. Please check details.');
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
          CollectionId: communityId.trim(),
          data: dataToSend,
        },
        {
          headers: {
            'token': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Show success animation with community ID
      setSuccess({
        message: response.data.msg || 'Joined community successfully!',
        communityId: communityId.trim(),
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setCommunityId('');
        setPassword('');
        setFormData({});
        setFields([]);
        setStep(1);
        setIsSidebarOpen(false);
      }, 3000);
    } catch (err) {
      console.error('Error joining community:', err);
      setError(err.response?.data?.msg || 'Failed to join community.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setFields([]);
    setFormData({});
    setError('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block w-64 bg-white shadow-lg">
        <Sidebar />
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden z-50`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleSidebar}
            aria-label="Close sidebar"
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <Sidebar />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 relative">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Join a Community</h2>
            <button
              className="lg:hidden text-gray-600 hover:text-gray-800"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {step === 1 ? 'Enter the community ID and password to proceed.' : 'Provide your details to join.'}
          </p>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center rounded-2xl"
              >
                <motion.svg
                  className="h-16 w-16 text-green-500 mb-4"
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
                <p className="text-lg font-semibold text-gray-800">{success.message}</p>
                <p className="text-sm text-gray-500">Community ID: {success.communityId}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={step === 1 ? handleInitialSubmit : handleFinalSubmit}
            className="space-y-5"
            aria-live="polite"
          >
            <div>
              <label htmlFor="communityId" className="block text-sm font-medium text-gray-700 mb-1">
                Community ID <span className="text-red-500">*</span>
              </label>
              <input
                id="communityId"
                type="text"
                placeholder="e.g. 1234ABCD"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                required
                disabled={step === 2}
                aria-describedby={error ? 'error-message' : undefined}
              />
            </div>

            {step === 1 && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Community Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  aria-describedby={error ? 'error-message' : undefined}
                />
              </div>
            )}

            {step === 2 && fields.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700">Your Details</h4>
                {fields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.name}
                    </label>
                    <input
                      id={field.id}
                      type="text" // Assuming text; can be dynamic based on schema
                      placeholder={`Enter ${field.name}`}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div id="error-message" className="text-red-500 text-sm" role="alert">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2.5 rounded-lg transition"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition flex items-center justify-center"
                disabled={loading}
                aria-label={step === 1 ? 'Verify Community' : 'Join Community'}
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
                    {step === 1 ? 'Verifying...' : 'Joining...'}
                  </>
                ) : step === 1 ? (
                  'Next'
                ) : (
                  'Join Community'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default JoinCommunity;