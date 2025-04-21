import React from 'react';

const HorizontalCard = ({ children }) => {
  return (
    <div className="bg-gray-50 text-center border-r-gray-100 rounded-2xl top-0 py-2 shadow-xl
    transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105 p-4 max-w-xl mx-auto  space-y-4">
      {children}
    </div>
  );
};

export default HorizontalCard;
