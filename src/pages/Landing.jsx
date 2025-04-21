// import React from 'react';
// import votingImage from '../assets/VotingLanding.png'
// import image from '../assets/BrAmbedkar.png'
// import ContactUsImage from '../assets/ContactUs.png'
// function Landing() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-300">
      

//       <main className="flex flex-col items-center justify-center flex-grow px-4 py-8 space-y-16">
//         <section className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 w-full max-w-6xl">
//           <div className="flex-1 text-center md:text-left">
//             <h2 className="text-5xl font-extrabold text-blue-700 mb-4">Your Voice, Your Power</h2>
//             <p className="text-lg text-gray-700 mb-6">Join vibrant communities where your opinion matters. Cast your vote on pressing issues and see real-time results.</p>
//             <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl transition duration-300">Get Started</button>
//           </div>
//           <img 
//             src={votingImage} 
//             alt="Voting Community" 
//             className="w-full md:w-1/2 rounded-2xl shadow-lg"
//           />
//         </section>
//         <br/>
//         <br />
//         <section className="flex flex-col items-center text-center space-y-4">
//           <img 
//             src={image}
//             alt="Dr. B.R. Ambedkar" 
//             className="w-32 h-32 rounded-full shadow-md"
//           />
//           <blockquote className="text-2xl font-semibold italic text-gray-800">"The vote is a weapon and we must use it wisely."</blockquote>
//           <p className="text-gray-600">— Dr. B.R. Ambedkar</p>
//         </section>
//         <br/>
//         <br/>
//         <section className="flex gap-20  items-center text-center space-y-4">
//           <div>
//           <h3 className="text-4xl font-bold text-blue-700">Stay Connected with Us!</h3>
//           <p className="text-lg text-gray-700">Have questions or need help? Reach out to us:</p>
//           <p className="text-2xl font-semibold text-blue-600">📞 +1 (123) 456-7890</p>
//           <p className="text-2xl font-semibold text-blue-600">✉️ contact@votesphere.com</p>
//           </div>
//           <div>
//           <img 
//             src={ContactUsImage}
//             alt="Contact Us" 
//             className="w-full max-w-md rounded-2xl shadow-lg"
//           />
//           </div>
          
//         </section>
//       </main>

//       <footer className="w-full bg-blue-500 text-white text-center p-4">
//         <p>&copy; 2025 VoteSphere. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }
// export default Landing;

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import votingImage from '../assets/VotingLanding.png';
import image from '../assets/BrAmbedkar.png';
import ContactUsImage from '../assets/ContactUs.png';

function Landing() {
  const navigate = useNavigate(); // Initialize navigate function

  const handleGetStarted = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-16 space-y-16"> {/* Increased padding-top */}
        
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8 w-full max-w-6xl mx-auto">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Voice, Your Power</h2>
            <p className="text-lg text-gray-600 mb-6">Join vibrant communities where your opinion matters. Cast your vote on pressing issues and see real-time results.</p>
            <button
              onClick={handleGetStarted} // Trigger handleGetStarted on click
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition duration-300"
            >
              Get Started
            </button>
          </div>
          <img 
            src={votingImage} 
            alt="Voting Community" 
            className="w-full md:w-1/2 rounded-2xl shadow-lg mt-20 md:mt-0 mx-auto"  // Centering image horizontally
          />
        </section>

        {/* Quote Section */}
        <section className="flex flex-col items-center text-center space-y-6">
          <img 
            src={image}
            alt="Dr. B.R. Ambedkar" 
            className="w-32 h-32 rounded-full shadow-md mb-4"
          />
          <blockquote className="text-xl font-semibold italic text-gray-700">
            "The vote is a weapon and we must use it wisely."
          </blockquote>
          <p className="text-gray-600">— Dr. B.R. Ambedkar</p>
        </section>

        {/* Contact Section */}
        <section className="flex flex-col md:flex-row gap-8 items-center text-center space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Stay Connected with Us!</h3>
            <p className="text-lg text-gray-600 mb-4">Have questions or need help? Reach out to us:</p>
            <p className="text-xl font-semibold text-gray-800">📞 +1 (123) 456-7890</p>
            <p className="text-xl font-semibold text-gray-800">✉️ contact@votesphere.com</p>
          </div>
          <div>
            <img 
              src={ContactUsImage}
              alt="Contact Us" 
              className="w-full max-w-md rounded-2xl shadow-md mx-auto" // Centering image horizontally
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; 2025 VoteSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}


export default Landing;


