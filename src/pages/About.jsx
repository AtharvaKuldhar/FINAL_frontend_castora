import React from "react";
import Sidebar from "../components/SidebarLeft";

const About = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 mt-16 p-8 w-full">
        <div className="bg-white p-8 rounded-xl shadow space-y-10">
          <section>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">About This Platform</h1>
            <p className="text-gray-700 text-lg">
              This platform empowers users to create or join communities and participate in fair, transparent voting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🧠 How It Works</h2>
            <div className="border-l-4 border-blue-500 pl-6 space-y-4">
              <div>
                <h3 className="font-semibold text-blue-600">1. Register & Login</h3>
                <p>Create an account with your name, email, and password.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600">2. Create or Join Communities</h3>
                <p>Create your own community or join others to participate in elections.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600">3. Admins Set Up Elections</h3>
                <p>Admins configure elections and select eligible voters.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600">4. Users Vote</h3>
                <p>Selected users can vote during active elections. Admins cannot vote.</p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-600">5. Results Are Published</h3>
                <p>Once voting ends, results are shown with full transparency.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">💡 Frequently Asked Questions (FAQs)</h2>
            <div className="space-y-3">
              <details className="bg-gray-100 p-4 rounded-md">
                <summary className="font-medium text-blue-600 cursor-pointer">Can an admin vote in their own community?</summary>
                <p className="mt-2 text-gray-700">No. Admins are responsible for managing elections and selecting voters but cannot vote themselves.</p>
              </details>
              <details className="bg-gray-100 p-4 rounded-md">
                <summary className="font-medium text-blue-600 cursor-pointer">How do I know if I'm selected to vote?</summary>
                <p className="mt-2 text-gray-700">If you're selected by the admin, the election will appear in your active elections list.</p>
              </details>
              <details className="bg-gray-100 p-4 rounded-md">
                <summary className="font-medium text-blue-600 cursor-pointer">Can I leave a community after joining?</summary>
                <p className="mt-2 text-gray-700">Yes, you can leave communities anytime from the community page.</p>
              </details>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📬 Contact Us</h2>
            <p className="text-gray-700 mb-2">
              Have suggestions, questions, or feedback? We’d love to hear from you.
            </p>
            <p className="text-gray-600">
              Email us at <span className="text-blue-500 font-medium">castora@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
