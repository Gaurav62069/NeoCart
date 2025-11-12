import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUI } from '../context/UIContext.jsx';

// Admin Email
const ADMIN_EMAIL = "62069gaurav@gmail.com"; 

const SidebarLink = ({ to, text, icon, onClick, isDanger, isPrimary }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-lg 
            hover:shadow-none transition-all duration-200 cursor-pointer border border-transparent 
            ${isDanger ? 'text-red-500' : 'text-[var(--text-primary)]'}
            ${isPrimary ? 'text-yellow-500' : ''}
            hover:border-[var(--hover-border-color)]`} 
  >
    <span className="w-6 text-center">{icon}</span>
    <span className="text-lg">{text}</span>
  </Link>
);

function Sidebar() {
  // --- 1. YAHAN ADMINVIEW STATE KO IMPORT KIYA GAYA HAI ---
  const { user, logoutAction, adminView, setAdminView } = useAuth();
  
 
  const { isSidebarOpen, closeSidebar } = useUI();
  const navigate = useNavigate();

  // Role display logic (Aapka code bilkul sahi hai)
  const isVerifiedWholesaler = user && user.role === 'wholesaler' && user.is_verified;
  const isAdmin = user && user.email === ADMIN_EMAIL;

  // Show 'Wholesaler' view if user is a verified wholesaler OR is the admin
  // YEH AB 'displayRole' NAHI, 'CURRENT VIEW' DIKHANE KE LIYE HAI
  const currentViewRole = (isAdmin ? adminView : (isVerifiedWholesaler ? 'wholesaler' : 'retailer'));

  const handleLogout = () => {
    closeSidebar();
    logoutAction();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {/* 1. Backdrop */}
      <div
        onClick={closeSidebar}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. Sidebar Panel (Pure Neumorphic) */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-xs z-50 transform transition-transform duration-300 ease-in-out
                bg-[var(--bg-base)] shadow-neumo
                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--neumo-dark-shadow)]">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">My Account</h2>
            <button
              onClick={closeSidebar}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info (Inset Shadow) */}
          <div className="p-4 shadow-neumo-inset">
            <div className="flex items-center gap-4">
              {/* Neumorphic DP */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden
                            p-1 shadow-neumo-inset bg-purple-600">
                {user.dp_url ? (
                  <img 
                    src={user.dp_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  (user.email ? user.email.charAt(0) : 'A').toUpperCase()
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--text-primary)] truncate">{user.name || (user.email ? user.email.split('@')[0] : 'User')}</p>
                <p className="text-sm text-[var(--text-secondary)] truncate">{user.email || 'No email provided'}</p>
              </div>
            </div>
            
            {/* "Current View" */}
            <div className="mt-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Current View: <strong className="capitalize text-blue-500">{currentViewRole}</strong>
              </p>
            </div>
          </div>


          {/* Navigation Links (Neumorphic hover) */}
          <nav className="flex-grow p-4 space-y-2">
            
            {/* "Admin" link */}
            {isAdmin && (
              <SidebarLink 
                to="/admin" 
                text="Admin Panel" 
                icon={"👑"} 
                onClick={closeSidebar} 
                isPrimary={true} // Makes it yellow
              />
            )}

            <SidebarLink to="/profile" text="Profile & Address" icon={"👤"} onClick={closeSidebar} />
            <SidebarLink to="/orders" text="Order History" icon={"📦"} onClick={closeSidebar} />
            <SidebarLink to="/support" text="Customer Support" icon={"📞"} onClick={closeSidebar} />
            <SidebarLink to="/returns" text="How to Return" icon={"↩️"} onClick={closeSidebar} />
            <SidebarLink to="/terms" text="Terms & Conditions" icon={"📜"} onClick={closeSidebar} />
          </nav>

          {/* Footer (Neumorphic Logout Button) */}
          <div className="p-4 border-t border-[var(--neumo-dark-shadow)]">
            
            {/* --- 2. ADMIN VIEW TOGGLE YAHAN ADD KIYA GAYA HAI --- */}
            {isAdmin && (
              <div className="p-3 mb-4 card-neumo-inset rounded-lg">
                <span className="font-bold text-[var(--hover-border-color)] text-sm block mb-2">
                  ADMIN VIEW
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setAdminView('retailer')}
                    className={`flex-1 text-xs py-1 px-2 rounded-md transition-all ${
                      adminView === 'retailer' 
                      ? 'btn-neumo-active !bg-[var(--hover-border-color)] text-white ' 
                      : 'btn-neumo text-[var(--text-secondary)]'
                    }`}
                  >
                    Retailer
                  </button>
                  <button 
                    onClick={() => setAdminView('wholesaler')}
                    className={`flex-1 text-xs py-1 px-2 rounded-md transition-all ${
                      adminView === 'wholesaler' 
                      ? 'btn-neumo-active !bg-[var(--hover-border-color)] text-white ' 
                      : 'btn-neumo text-[var(--text-secondary)]'
                    }`}
                  >
                    Wholesaler
                  </button>
                </div>
              </div>
            )}
            {/* --- END ADMIN VIEW TOGGLE --- */}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 btn-neumo
                      !bg-red-600 hover:!bg-red-700 !text-white font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;