import React from 'react';
import { Link } from 'react-router-dom';

const Election = ({ id, title, description, thumbnail }) => {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl hover:-translate-y-1">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="p-4 space-y-3">
        <Link to={`/elections/${id}`}>
          <h4 className="text-xl font-semibold hover:text-blue-600 transition">
            {title}
          </h4>
        </Link>
        <p className="text-gray-600 text-sm">
          {description?.length > 255
            ? description.substring(0, 255) + '...'
            : description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/elections/${id}/candidates`}
            className="text-sm text-blue-500 hover:underline"
          >
            View
          </Link>
          <button className="bg-blue-500 font-medium text-white px-4 py-2 rounded-xl transition hover:bg-blue-600 hover:shadow-lg">
            Edit
          </button>
        </div>
      </div>
    </article>
  );
};

export default Election;
