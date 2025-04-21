import React from "react";
import { motion } from "framer-motion";

const VerticalCard = ({ children }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md mx-auto text-left 
        space-y-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

export default VerticalCard;
