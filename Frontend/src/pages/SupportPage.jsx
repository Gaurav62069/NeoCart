import React from 'react';
import { Link } from 'react-router-dom';

function SupportPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Customer Support</h1>
      
      {/* --- Neumorphic Card --- */}
      <div className="card-neumo !p-8 space-y-6">
        
        {/* Contact Form (Future Idea) */}
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Contact Us</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Have a question? Fill out the form below (coming soon) or reach us via email or phone.
          </p>
          {/* --- Neumorphic Placeholder --- */}
          <div className="p-4 rounded-lg shadow-neumo-inset text-center text-[var(--text-secondary)]">
            Contact Form Coming Soon
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Email Support</h3>
          <p className="text-[var(--text-secondary)]">
            You can reach our support team 24/7 at:
            <a href="mailto:support@ecom.com" className="text-blue-400 hover:underline ml-2">
              support@ecom.com
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Phone Support</h3>
          <p className="text-[var(--text-secondary)]">
            Our phone lines are open from 9 AM to 6 PM (Mon-Fri).
            <br />
            Call us at: <span className="text-blue-400 font-semibold ml-1">+91 12345 67890</span>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Quick Links</h3>
          <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1">
            <li>
              <Link to="/orders" className="text-blue-400 hover:underline">
                Track your order
              </Link>
            </li>
            <li>
              <Link to="/returns" className="text-blue-400 hover:underline">
                Learn about returns
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-blue-400 hover:underline">
                Read our Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default SupportPage;
