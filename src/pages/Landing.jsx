import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function ChainVoteLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate("/login");
  };
  const goToRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="font-sans text-indigo-900">
      {/* Header */}
      {/* <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-indigo-900">
              Chain<span className="text-blue-500">Vote</span>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li><button onClick={() => scrollToSection('features')} className="text-indigo-900 hover:text-blue-500 transition">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-indigo-900 hover:text-blue-500 transition">How It Works</button></li>
                <li><button onClick={goToLogin} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md">Log In</button></li>
              </ul>
            </nav>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-indigo-900 text-2xl focus:outline-none">
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <nav className="mt-4 md:hidden bg-indigo-50 rounded-lg shadow-xl">
              <ul className="flex flex-col py-3">
                <li><button onClick={() => scrollToSection('features')} className="text-indigo-900 py-2 px-4 block hover:bg-indigo-100 rounded-md mx-2">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-indigo-900 py-2 px-4 block hover:bg-indigo-100 rounded-md mx-2">How It Works</button></li>
                <li className="mt-2 mx-2"><button className="bg-indigo-600 text-white w-full py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Log In</button></li>
              </ul>
            </nav>
          )}
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-blue-100 text-indigo-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-indigo-900">Decentralized Voting for Your Community</h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-700 max-w-2xl mx-auto">
              ChainVote empowers communities to host transparent, secure elections using blockchain technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button onClick={goToRegister} className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition shadow-lg transform hover:-translate-y-1">
                Get Started
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-medium border border-indigo-400 hover:bg-indigo-600 transition shadow-md">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">Why Choose ChainVote?</h2>
            <p className="text-xl text-indigo-700">
              Our platform offers cutting-edge features that make community voting secure, transparent, and accessible to everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-indigo-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto">🔒</div>
              <h3 className="text-xl font-bold text-center mb-4 text-indigo-900">Blockchain Security</h3>
              <p className="text-indigo-700 text-center">
                Immutable records ensure votes cannot be tampered with, providing complete transparency and trust.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-green-500">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto">👥</div>
              <h3 className="text-xl font-bold text-center mb-4 text-indigo-900">Community Management</h3>
              <p className="text-indigo-700 text-center">
                Create custom communities, invite members, and manage permissions with ease.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-indigo-500">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto">📊</div>
              <h3 className="text-xl font-bold text-center mb-4 text-indigo-900">Real-time Results</h3>
              <p className="text-indigo-700 text-center">
                Watch as votes are tallied instantly, with visual dashboards showing election progress.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-blue-400">
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center text-white text-2xl mb-6 mx-auto">📱</div>
              <h3 className="text-xl font-bold text-center mb-4 text-indigo-900">Mobile Friendly</h3>
              <p className="text-indigo-700 text-center">
                Vote from anywhere using our responsive design that works on all devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">How ChainVote Works</h2>
            <p className="text-xl text-indigo-700">
              Get started with your community voting system in just a few simple steps
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">1</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-indigo-900">Create Your Community</h3>
                <p className="text-indigo-700 text-lg">
                  Sign up and create your own community with custom settings. Define membership requirements and governance rules.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">2</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-indigo-900">Invite Members</h3>
                <p className="text-indigo-700 text-lg">
                  Grow your community by inviting members through email or shareable links. Set different permission levels.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">3</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-indigo-900">Create an Election</h3>
                <p className="text-indigo-700 text-lg">
                  Set up elections with custom questions, candidate profiles, voting periods, and eligibility requirements.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-blue-400 text-white flex items-center justify-center text-xl font-bold shadow-lg">4</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-indigo-900">Secure Voting</h3>
                <p className="text-indigo-700 text-lg">
                  Members cast votes securely using our blockchain system, ensuring one person, one vote integrity.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-green-400 text-white flex items-center justify-center text-xl font-bold shadow-lg">5</div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-indigo-900">View Results</h3>
                <p className="text-indigo-700 text-lg">
                  Access transparent, verifiable results in real-time. Export data and analytics for your records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-100 text-indigo-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-900">Ready to Transform Your Community Governance?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 text-indigo-700">
            Join thousands of communities already benefiting from blockchain-based voting. Get started for free today.
          </p>
          <button onClick={goToRegister} className="bg-blue-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-600 transition shadow-lg transform hover:-translate-y-1 text-lg">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Chain<span className="text-blue-300">Vote</span></h3>
              <p className="text-indigo-100 mb-4">
                Empowering communities with transparent blockchain voting solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-indigo-200">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-indigo-100 hover:text-white transition">Community Creation</a></li>
                <li><a href="#" className="text-indigo-100 hover:text-white transition">Blockchain Security</a></li>
                <li><a href="#" className="text-indigo-100 hover:text-white transition">Election Management</a></li>
                <li><a href="#" className="text-indigo-100 hover:text-white transition">Result Analytics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-indigo-200">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-indigo-100 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-indigo-100 hover:text-white transition">Contact</a></li>
                <li><a href="#" className="text-indigo-100 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-indigo-100 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-indigo-500 text-indigo-200 text-sm">
            © 2025 ChainVote. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}