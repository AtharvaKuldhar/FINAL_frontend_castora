import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    
    // Scroll to top on component mount to fix navbar issue
    window.scrollTo(0, 0);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch('https://e-voting-blockchain-5n6q.onrender.com/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: fullName, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-20 md:pt-24 px-4 pb-16 bg-black">
      <section className="w-full max-w-md p-6 md:p-8 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-[1.01]"
        style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
          border: '1px solid #333333',
        }}>
        <h2 className="text-3xl font-extrabold text-emerald-400 text-center mb-8 mt-2">Sign Up</h2>
        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300 font-medium" htmlFor="fullName">Full Name</label>
            <input
              className="bg-gray-600 border border-gray-700 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors duration-200 text-white"
              type="text"
              name="fullName"
              placeholder="Full Name"
              autoComplete="on"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300 font-medium" htmlFor="email">Email</label>
            <input
              className="bg-gray-600 border border-gray-700 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors duration-200 text-white"
              type="email"
              name="email"
              placeholder="Email Address"
              autoComplete="on"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300 font-medium" htmlFor="password">Password</label>
            <input
              className="bg-gray-600 border border-gray-700 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors duration-200 text-white"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300 font-medium" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="bg-gray-600 border border-gray-700 w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors duration-200 text-white"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="on"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link className="text-emerald-400 font-semibold hover:underline transition-all duration-200" to="/Login">
                Sign in
              </Link>
            </p>
          </div>

          <button 
            type="submit" 
            className="bg-emerald-500 hover:bg-emerald-600 font-bold text-white text-center py-3 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg mt-3"
          >
            Register
          </button>
        </form>
      </section>
    </div>
  );
};

export default Register;