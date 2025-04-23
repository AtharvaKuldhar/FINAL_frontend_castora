import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { field_slice_actions } from '../store/field_slice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';
import { Menu, X, Plus, Check, Loader2, Shield, Database } from 'lucide-react';
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
        'https://e-voting-blockchain-5n6q.onrender.com/admin/createCommunity',
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
    <div className="flex min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-green-400 relative">
      {/* Matrix-like background effect */}
      <div 
        className="absolute inset-0 z-0 opacity-10" 
        style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(32, 202, 90, 0.4) 25%, rgba(32, 202, 90, 0.4) 26%, transparent 27%, transparent 74%, rgba(32, 202, 90, 0.4) 75%, rgba(32, 202, 90, 0.4) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 202, 90, 0.4) 25%, rgba(32, 202, 90, 0.4) 26%, transparent 27%, transparent 74%, rgba(32, 202, 90, 0.4) 75%, rgba(32, 202, 90, 0.4) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Sidebar - Desktop */}
      <div className="hidden md:block md:w-64 bg-gray-950 border-r border-green-800 z-10">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-green-800"
          >
            <div className="flex justify-end p-4">
              <button onClick={toggleSidebar} className="text-green-400 hover:text-green-300">
                <X size={24} />
              </button>
            </div>
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        <header className="bg-gray-950 bg-opacity-90 p-4 border-b border-green-800 flex justify-between items-center shadow-lg shadow-green-900/10">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="md:hidden text-green-400 hover:text-green-300">
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-mono text-green-400 tracking-wider flex items-center">
              <Shield size={20} className="mr-2 text-green-500" /> 
              ChainVote
            </h1>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block bg-green-500/10 rounded-full p-3 mb-4 border border-green-500/30">
                <Database size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-mono text-green-400 mb-2">
                {'>'} CREATE_COMMUNITY
              </h2>
              <div className="w-16 h-1 bg-green-500 mx-auto mb-4"></div>
              <p className="text-green-300 opacity-80 font-mono text-sm md:text-base">
                Set up your community by defining a name, password, and custom fields for voters.
              </p>
            </div>

            {/* Success Modal */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 border-2 border-green-500 p-6 rounded-lg shadow-lg mb-8 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-green-500/5 z-0"></div>
                <div className="relative z-10">
                  <div className="flex justify-center mb-4 text-green-400">
                    <Check size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-green-400 mb-2">{success.message}</h3>
                  <p className="text-green-300 mb-4 font-mono">Community Key: <span className="bg-gray-800 px-2 py-1 rounded">{success.key}</span></p>
                  <button
                    onClick={handleSuccessClose}
                    className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition-all shadow-lg hover:shadow-green-900/50"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6 bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-xl border border-green-900/50">
              {/* Community Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-300 flex items-center">
                  <span className="text-green-500 mr-2">#</span> Community Name *
                </label>
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  className="w-full border border-green-700 rounded-md px-4 py-2 bg-gray-800 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 transition font-mono"
                  required
                  placeholder="CommunityName"
                  aria-describedby={error && error.includes('name') ? 'error-message' : undefined}
                />
              </div>

              {/* Community Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-300 flex items-center">
                  <span className="text-green-500 mr-2">#</span> Community Password *
                </label>
                <input
                  type="password"
                  value={communityPassword}
                  onChange={(e) => setCommunityPassword(e.target.value)}
                  className="w-full border border-green-700 rounded-md px-4 py-2 bg-gray-800 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 transition font-mono"
                  required
                  placeholder="********"
                  aria-describedby={error && error.includes('password') ? 'error-message' : undefined}
                />
              </div>

              {/* Dynamic Fields */}
              <div className="space-y-4">
                <h3 className="text-xl font-mono text-green-400 border-b border-green-700 pb-2 flex items-center">
                  <span className="bg-green-500/20 rounded-md px-2 py-1 mr-2 text-sm">&lt;/&gt;</span>
                  Custom_Fields
                </h3>

                {fields.length === 0 ? (
                  <div className="text-sm text-gray-400 italic font-mono p-4 border border-dashed border-green-800/50 rounded-md text-center">
                    No fields added. Click "Add Field" to start.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {fields.map((field, idx) => (
                      <div 
                        key={field.id}
                        className="p-4 border border-green-700/50 rounded-lg bg-gray-800/50 space-y-4 backdrop-blur-sm relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-full z-0"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded">field_{idx + 1}</span>
                            <button 
                              onClick={() => dispatch(field_slice_actions.removeField(field.id))}
                              className="text-red-500 hover:text-red-400 bg-red-500/10 p-1 rounded-full hover:bg-red-500/20 transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-green-300">
                              Field Name
                            </label>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => handleUpdate(field.id, 'name', e.target.value)}
                              className="w-full border border-green-700/70 rounded-md px-4 py-2 bg-gray-800/80 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 transition font-mono"
                              required
                              placeholder="Enter field name"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-green-300">
                              Field Type
                            </label>
                            <select
                              value={field.type}
                              onChange={(e) => handleUpdate(field.id, 'type', e.target.value)}
                              className="w-full border border-green-700/70 rounded-md px-4 py-2 bg-gray-800/80 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition font-mono appearance-none"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%2334D399%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                            >
                              {dataTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-green-300">
                              Sample Value
                            </label>
                            <input
                              type={field.type === 'numeric' ? 'number' : 'text'}
                              value={sampleData[field.id] || ''}
                              onChange={(e) => handleSampleDataChange(field.id, e.target.value, field.type)}
                              className="w-full border border-green-700/70 rounded-md px-4 py-2 bg-gray-800/80 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 transition font-mono"
                              placeholder={field.type === 'numeric' ? '123' : 'Sample value'}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/30 border-l-4 border-red-600 text-red-200 p-4 rounded-md font-mono text-sm"
                >
                  <div className="flex">
                    <span className="font-bold mr-2">[ERROR]:</span> {error}
                  </div>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => dispatch(field_slice_actions.addField())}
                  className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-green-400 font-mono border border-green-600 px-4 py-2 rounded-md transition-all shadow hover:shadow-green-900/30"
                >
                  <Plus size={18} className="mr-2" /> Add Field
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-3 px-6 rounded-md transition-all shadow-lg hover:shadow-green-900/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Create Community'
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>

        <footer className="bg-gray-950 bg-opacity-90 p-4 border-t border-green-800/50 text-center">
          <div className="flex justify-center items-center space-x-4">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-500 text-xs font-mono">&lt;/CYBR_COMM_CREATOR v1.0&gt;</p>
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default CreateCommunity;