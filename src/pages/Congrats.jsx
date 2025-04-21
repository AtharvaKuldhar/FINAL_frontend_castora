import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Congrats = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/communities/default");
    }, 10000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="fixed inset-0 flex items-center justify-center backdrop-blur-lg p-6 bg-black/40 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl px-8 py-10 text-center max-w-md w-full"
      >
        <motion.div
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <CheckCircle2 size={80} className="text-green-500" />
        </motion.div>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Thank You for Voting!
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600"
        >
          Your vote has been successfully recorded. Redirecting you back to the community...
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Congrats;
