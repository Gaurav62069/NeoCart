// src/pages/NotFoundPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div 
      className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh] text-center animate-[fadeInUp_0.5s_ease-out_forwards]"
    >
      <h1 className="text-9xl font-bold text-[var(--hover-border-color)]">404</h1>
      <h2 className="text-3xl font-semibold text-[var(--text-primary)] mt-4 mb-2">
        Page Not Found
      </h2>
      <p className="text-lg text-[var(--text-secondary)] mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      
      {/* Yeh button aapke Neumorphic style ka istemal karega */}
      <Link
        to="/"
        className="btn-neumo !text-[var(--hover-border-color)] font-bold text-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFoundPage;