import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SidebarLeft';
import axios from 'axios';
import { Menu, X, Lock, Key, ChevronLeft, ChevronRight, FileText, Shield, Database, Check, Loader2 } from 'lucide-react';
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
  const [success, setSuccess] = useState(null);
  const [typingEffect, setTypingEffect] = useState(false);

  useEffect(() => {
    if (step === 1) {
      // Simulate typing effect for the title
      setTypingEffect(true);
      const timer = setTimeout(() => {
        setTypingEffect(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [step]);

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
        'https://e-voting-blockchain-5n6q.onrender.com/join_community/test',
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
        'https://e-voting-blockchain-5n6q.onrender.com/getSchema',
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
        'https://e-voting-blockchain-5n6q.onrender.com/join_community',
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
    setError('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
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

        <main className="flex-1 p-4 md:p-8 overflow-auto flex items-center justify-center">
          <motion.div 
            className="w-full max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center mb-8">
              <div className="inline-block bg-green-500/10 rounded-full p-3 mb-4 border border-green-500/30">
                <Key size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-mono text-green-400 mb-2 flex items-center justify-center">
                {'>'} 
                <span className="relative">
                  <span>{step === 1 ? 'JOIN_COMMUNITY' : 'ENTER_USER_DATA'}</span>
                  {typingEffect && (
                    <span className="absolute top-0 right-0 h-full w-1 bg-green-400 animate-blink"></span>
                  )}
                </span>
              </h2>
              <div className="w-16 h-1 bg-green-500 mx-auto mb-4"></div>
              <p className="text-green-300 opacity-80 font-mono text-sm md:text-base">
                {step === 1 
                  ? 'Enter community credentials to request access.'
                  : 'Complete your profile to join the community.'
                }
              </p>
            </div>

            {/* Progress indicator */}
            {fields.length > 0 && (
              <div className="mb-6 flex items-center justify-center">
                <div className={`h-1 w-1/4 ${step === 1 ? 'bg-green-500' : 'bg-green-700'} rounded-full mr-1`}></div>
                <div className={`h-1 w-1/4 ${step === 2 ? 'bg-green-500' : 'bg-green-700'} rounded-full ml-1`}></div>
              </div>
            )}

            {/* Form Card */}
            <motion.div 
              className="bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-xl border border-green-900/50 relative overflow-hidden"
              variants={itemVariants}
            >
              {/* Success Modal */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-20 rounded-lg backdrop-blur-sm"
                  >
                    <div className="bg-green-500/10 rounded-full p-4 mb-4 border border-green-500/30">
                      <Check size={40} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-green-400 mb-2 font-mono">{success.message}</h3>
                    <div className="bg-gray-800/80 rounded-md px-3 py-1 mb-4">
                      <p className="text-green-300 font-mono">ID: {success.communityId}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-2 w-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-bl-full z-0"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/5 rounded-tr-full z-0"></div>

              <form
                onSubmit={step === 1 ? handleInitialSubmit : handleFinalSubmit}
                className="space-y-5 relative z-10"
              >
                {step === 1 ? (
                  <>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-green-300 flex items-center">
                        <span className="text-green-500 mr-2">#</span> Community ID
                      </label>
                      <input
                        type="text"
                        value={communityId}
                        onChange={(e) => setCommunityId(e.target.value)}
                        className="w-full border border-green-700 rounded-md px-4 py-2 bg-gray-800 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 transition font-mono"
                        required
                        placeholder="Enter community ID"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-green-300 flex items-center">
                        <span className="text-green-500 mr-2">#</span> Access Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border border-green-700 rounded-md px-4 py-2 bg-gray-800 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 transition font-mono pr-10"
                          required
                          placeholder="********"
                        />
                        <Lock size={16} className="absolute right-3 top-3 text-green-500/70" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-green-500/20 rounded-md px-2 py-1 mr-2">
                        <Database size={16} className="text-green-400" />
                      </div>
                      <h4 className="text-lg font-mono text-green-400">User_Profile_Data</h4>
                    </div>
                    
                    {fields.map((field, idx) => (
                      <div key={field.id} className="space-y-1">
                        <label className="block text-sm font-medium text-green-300 flex items-center">
                          <span className="text-green-500 mr-2 font-mono text-xs">{idx + 1}:</span> {field.name}
                        </label>
                        <input
                          type="text"
                          value={formData[field.id] || ''}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          className="w-full border border-green-700 rounded-md px-4 py-2 bg-gray-800 text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-600 transition font-mono"
                          placeholder={`Enter ${field.name.toLowerCase()}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900/30 border-l-4 border-red-600 text-red-200 p-3 rounded-md font-mono text-sm"
                  >
                    <div className="flex">
                      <span className="font-bold mr-2">[ERROR]:</span> {error}
                    </div>
                  </motion.div>
                )}

                <div className="flex space-x-3 pt-2">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-green-400 font-mono border border-green-700/50 px-4 py-2 rounded-md transition-all shadow hover:shadow-green-900/30 flex items-center justify-center"
                    >
                      <ChevronLeft size={18} className="mr-1" /> Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-4 rounded-md transition-all shadow-lg hover:shadow-green-900/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        {step === 1 ? 'Verifying...' : 'Joining...'}
                      </>
                    ) : (
                      <>
                        {step === 1 ? (
                          <>Verify Access <ChevronRight size={18} className="ml-1" /></>
                        ) : (
                          <>Complete Join <Database size={18} className="ml-1" /></>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Community Security Notice */}
            <motion.div 
              className="mt-6 text-center text-green-400/70 font-mono text-xs flex items-center justify-center"
              variants={itemVariants}
            >
              <Shield size={12} className="mr-1" /> Secure Connection Established
              <div className="ml-2 h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            </motion.div>
          </motion.div>
        </main>

        <footer className="bg-gray-950 bg-opacity-90 p-4 border-t border-green-800/50 text-center">
          <div className="flex justify-center items-center space-x-4">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-500 text-xs font-mono">&lt;/CYBR_COMM v1.0&gt;</p>
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

export default JoinCommunity;