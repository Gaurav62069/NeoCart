import React from 'react';

function LogoSpinner() {
  return (
    // Hum CSS mein 'logo-spinner' class ko animate karenge
    <svg 
      className="logo-spinner h-16 w-auto text-[var(--logo-color)]" // Size badha diya
      viewBox="0 0 28 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 19V5 H7 V13.5 L13 5 V19 H10 V10.5 L4 19 Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M12.5 9H22.4613L21.493 14.7126H13.6331L12.5 9ZM14.3302 5H18.784C19.8653 5 20.4851 5.9221 20.1584 6.88871L19.5702 8.5H13.6663L14.3302 5Z" />
      <path d="M14.5 17C15.3284 17 16 17.6716 16 18.5C16 19.3284 15.3284 20 14.5 20C13.6716 20 13 19.3284 13 18.5C13 17.6716 13.6716 17 14.5 17Z" />
      <path d="M19.5 17C20.3284 17 21 17.6716 21 18.5C21 19.3284 20.3284 20 19.5 20C18.6716 20 18 19.3284 18 18.5C18 17.6716 18.6716 17 19.5 17Z" />
    </svg>
  );
}

export default LogoSpinner;