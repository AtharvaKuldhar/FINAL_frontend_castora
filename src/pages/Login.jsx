

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault(); // prevent page reload
//     try {
//       const res = await fetch('http://localhost:5001/user/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Optional: Store JWT token
//         localStorage.setItem('token', data.token);
//         navigate('/home');
//       } else {
//         alert(data.msg || 'Login failed');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong');
//     }
//   };

//   return (
//     <div className="w-full h-screen flex justify-center items-center bg-gray-50">
//       <section className="register w-6/12 h-screen">
//         <div className="container register_container w-[35rem] m-3 bg-white p-10 rounded-lg shadow-lg">
//           <h2 className='text-3xl font-extrabold'>Login</h2>
//           <form className='register_form flex flex-col gap-4 mt-5' onSubmit={handleLogin}>
//             <div>
//               <h3>Email Address</h3>
//               <input
//                 className='bg-gray-200 w-full p-2 rounded-md'
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 autoComplete="on"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <h3>Password</h3>
//               <input
//                 className='bg-gray-200 w-full p-2 rounded-md'
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 autoComplete="on"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <p>
//               Don't have an account? <Link className='text-blue-400' to="/register">Signup</Link>
//             </p>

//             <button type="submit" className="btn primary bg-blue-500 font-bold text-center text-white px-4 py-2 rounded-2xl ">
//               Login
//             </button>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Clear form fields on component mount
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/home');
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <section className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className='text-3xl font-extrabold text-gray-800 text-center mb-6'>Login</h2>
        <form className='flex flex-col gap-6' onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700" htmlFor="email">Email</label>
            <input
              className='bg-gray-200 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              type="email"
              name="email"
              placeholder="Email Address"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700" htmlFor="password">Password</label>
            <input
              className='bg-gray-200 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link className="text-indigo-600 font-semibold hover:underline" to="/register">
                Signup
              </Link>
            </p>
          </div>

          <button type="submit" className="bg-gray-900 hover:bg-gray-800 font-bold text-white text-center py-3 rounded-lg transition duration-300">
            Login
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;

