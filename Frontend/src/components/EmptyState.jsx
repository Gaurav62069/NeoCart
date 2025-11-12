import React from 'react';
import { Link } from 'react-router-dom';

function EmptyState({ icon, title, message, buttonText, buttonTo }) {
  return (
    <div className="container mx-auto p-4 flex justify-center animate-[fadeInUp_0.5s_ease-out_forwards]">
      <div className="card-neumo !p-8 max-w-md w-full flex flex-col items-center text-center">
        
        {/* Inset (Daba hua) Icon */}
        <div className="w-24 h-24 rounded-full shadow-neumo-inset flex items-center justify-center text-[var(--text-secondary)] opacity-70">
          {icon}
        </div>

        <h2 className="text-3xl font-bold text-[var(--text-primary)] mt-6">
          {title}
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 mb-6">
          {message}
        </p>

        {/* Primary Button */}
        <Link to={buttonTo}>
          <button className="btn-neumo !text-cyan-500 font-bold">
            {buttonText}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default EmptyState;