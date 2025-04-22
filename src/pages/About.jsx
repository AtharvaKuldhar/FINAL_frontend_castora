import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SidebarLeft';
import { motion } from 'framer-motion';
import { Info, Server, Users, FileText, MessageCircle, Shield, Check, HelpCircle, Mail } from 'lucide-react';

const About = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    // Simulate page load
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.2 });

    // Observe sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

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

  const stepsData = [
    {
      title: "Register & Login",
      description: "Create an account with your name, email, and password.",
      icon: <Users size={22} />
    },
    {
      title: "Create or Join Communities",
      description: "Create your own community or join others to participate in elections.",
      icon: <Server size={22} />
    },
    {
      title: "Admins Set Up Elections",
      description: "Admins configure elections and select eligible voters.",
      icon: <Shield size={22} />
    },
    {
      title: "Users Vote",
      description: "Selected users can vote during active elections. Admins cannot vote.",
      icon: <Check size={22} />
    },
    {
      title: "Results Are Published",
      description: "Once voting ends, results are shown with full transparency.",
      icon: <FileText size={22} />
    }
  ];

  const faqData = [
    {
      question: "Can an admin vote in their own community?",
      answer: "No. Admins are responsible for managing elections and selecting voters but cannot vote themselves."
    },
    {
      question: "How do I know if I'm selected to vote?",
      answer: "If you're selected by the admin, the election will appear in your active elections list."
    },
    {
      question: "Can I leave a community after joining?",
      answer: "Yes, you can leave communities anytime from the community page."
    },
    {
      question: "How secure is the voting process?",
      answer: "Our platform uses end-to-end encryption and blockchain-inspired verification to ensure votes are secure and cannot be tampered with."
    }
  ];

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

      {/* Sidebar */}
      <div className="hidden md:block md:w-64 bg-gray-950 border-r border-green-800 z-10">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 relative mb-4">
                <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <Shield size={24} className="text-green-400" />
              </div>
              <div className="font-mono text-lg text-green-400">Loading system data...</div>
              <div className="mt-2 font-mono text-xs text-green-500">ChainVote v1.0</div>
            </div>
          </div>
        ) : (
          <motion.div 
            className="flex-1 p-4 md:p-8 overflow-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div 
                className="text-center mb-12" 
                variants={itemVariants}
              >
                <div className="inline-block bg-green-500/10 rounded-full p-3 mb-4 border border-green-500/30">
                  <Info size={32} className="text-green-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-mono text-green-400 mb-2">
                  {'>'} ABOUT_ChainVote
                </h1>
                <div className="w-16 h-1 bg-green-500 mx-auto mb-4"></div>
                <p className="text-green-300 opacity-80 font-mono text-sm md:text-base max-w-xl mx-auto">
                  A secure, decentralized platform empowering users to create communities, 
                  participate in transparent voting processes, and ensure democratic integrity.
                </p>
              </motion.div>

              {/* About Section */}
              <motion.section 
                id="about-section"
                className={`mb-16 bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-xl border border-green-900/50 ${isVisible["about-section"] ? 'animate-fadeIn' : ''}`}
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-500/20 rounded-md px-2 py-1 mr-3">
                    <Shield size={20} className="text-green-400" />
                  </div>
                  <h2 className="text-xl font-mono text-green-400">Platform Overview</h2>
                </div>
                <div className="pl-2 border-l-2 border-green-500/30">
                  <p className="text-green-300 leading-relaxed">
                    ChainVote is designed with security and transparency at its core. Our platform 
                    leverages advanced cryptographic techniques to ensure votes cannot be tampered with, 
                    while maintaining an intuitive user experience. Community administrators can create 
                    custom fields to collect relevant voter information, design tailored ballots, and 
                    engage participants in a secure digital environment.
                  </p>
                </div>
              </motion.section>

              {/* How It Works */}
              <motion.section 
                id="how-section"
                className="mb-16"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-mono text-green-400 flex items-center">
                    <span className="bg-green-500/20 rounded-md px-2 py-1 mr-2 text-sm">&lt;/&gt;</span>
                    System_Flow
                  </h2>
                  <div className="h-px flex-1 mx-4 bg-green-700/30"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {stepsData.map((step, index) => (
                    <motion.div 
                      key={index}
                      className="p-4 border border-green-700/50 rounded-lg bg-gray-800/50 backdrop-blur-sm relative overflow-hidden"
                      initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                      animate={{ 
                        x: 0, 
                        opacity: 1,
                        transition: { delay: 0.2 + index * 0.1, duration: 0.5 }
                      }}
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/5 rounded-bl-full z-0"></div>
                      
                      <div className="flex items-start relative z-10">
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 mr-4">
                          {step.icon}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-green-500 font-mono mr-2">{index + 1}.</span>
                            <h3 className="font-semibold text-green-400 font-mono">{step.title}</h3>
                          </div>
                          <p className="mt-1 text-green-300/90">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* FAQs */}
              <motion.section 
                id="faq-section"
                className="mb-16 bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-xl border border-green-900/50"
                variants={itemVariants}
              >
                <div className="flex items-center mb-6">
                  <div className="bg-green-500/20 rounded-md px-2 py-1 mr-3">
                    <HelpCircle size={20} className="text-green-400" />
                  </div>
                  <h2 className="text-xl font-mono text-green-400">FAQ_Database</h2>
                </div>
                
                <div className="space-y-3">
                  {faqData.map((faq, index) => (
                    <motion.div 
                      key={index}
                      className={`border border-green-700/40 rounded-md overflow-hidden ${selectedFaq === index ? 'bg-green-900/20' : 'bg-gray-800/40'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.3 + index * 0.1, duration: 0.5 }
                      }}
                    >
                      <button
                        className="w-full text-left p-4 flex justify-between items-center focus:outline-none transition-colors"
                        onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                      >
                        <span className="font-medium text-green-400 font-mono flex items-center">
                          <span className="text-green-500 mr-2 font-mono">&gt;</span>
                          {faq.question}
                        </span>
                        <span className={`transform transition-transform duration-300 ${selectedFaq === index ? 'rotate-180' : ''}`}>
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </span>
                      </button>
                      
                      <motion.div 
                        className="overflow-hidden"
                        initial={false}
                        animate={{ 
                          height: selectedFaq === index ? 'auto' : 0,
                          opacity: selectedFaq === index ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-4 pt-0 border-t border-green-700/30">
                          <p className="text-green-300/90 font-mono">{faq.answer}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
              
              {/* Contact Section */}
              <motion.section 
                id="contact-section"
                className="mb-8 p-6 border border-green-700/50 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
                variants={itemVariants}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full z-0"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/5 rounded-tr-full z-0"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 mr-4">
                      <Mail size={20} className="text-green-400" />
                    </div>
                    <h2 className="text-xl font-mono text-green-400">Contact_Terminal</h2>
                  </div>
                  
                  <p className="text-green-300 mb-6 pl-14">
                    Have questions, suggestions, or feedback? We'd love to hear from you.
                  </p>
                  
                  <div className="pl-14 flex items-center">
                    <span className="text-green-500 mr-2 font-mono">$</span>
                    <span className="text-green-400 font-mono">ping</span>
                    <a href="mailto:castora@gmail.com" className="ml-2 text-green-300 hover:text-green-200 underline font-mono transition-colors">
                      chainvote@gmail.com
                    </a>
                    <div className="ml-2 h-4 w-1 bg-green-500 animate-blink"></div>
                  </div>
                </div>
              </motion.section>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="bg-gray-950 bg-opacity-90 p-4 border-t border-green-800/50 text-center">
          <div className="flex justify-center items-center space-x-4">
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-green-500 text-xs font-mono">&lt;/ChainVote v1.0&gt;</p>
            <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;