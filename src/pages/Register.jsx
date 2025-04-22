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
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/user/register', {
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
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <section className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-emerald-400 text-center mb-6">Sign Up</h2>
        <form className="flex flex-col gap-6" onSubmit={handleRegister}>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700" htmlFor="fullName">Full Name</label>
            <input
              className="bg-gray-200 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              type="text"
              name="fullName"
              placeholder="Full Name"
              autoComplete="on"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700" htmlFor="email">Email</label>
            <input
              className="bg-gray-200 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              type="email"
              name="email"
              placeholder="Email Address"
              autoComplete="on"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700" htmlFor="password">Password</label>
            <input
              className="bg-gray-200 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="on"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="bg-gray-200 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="on"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link className="text-emerald-400 font-semibold hover:underline" to="/Login">
                Sign in
              </Link>
            </p>
          </div>

          <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 font-bold text-white text-center py-3 rounded-lg transition duration-300">
            Register
          </button>
        </form>
      </section>
    </div>
  );
};

export default Register;
