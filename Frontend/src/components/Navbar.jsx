import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

// Contexts
import { useAuth } from '../context/AuthContext.jsx'; 
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx'; 

// --- NavIcon Component (Desktop ke liye) ---
const NavIcon = ({ to, children, count, title, hoverColor, size = "h-6 w-6", onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const fillValue = isHovered ? hoverColor : "none";
    const strokeValue = isHovered ? 'none' : 'currentColor'; 
    const strokeWidthValue = isHovered ? '0' : '2'; 

    const baseClasses = "btn-neumo !p-0 w-10 h-10 flex items-center justify-center rounded-full relative";
    const Component = to ? Link : 'button';

    return (
        <Component 
            {...(to ? {to: to} : {onClick: onClick})}
            title={title}
            className={baseClasses} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {React.cloneElement(children, { 
                fill: fillValue, 
                stroke: strokeValue,
                strokeWidth: strokeWidthValue,
                className: `${size} text-[var(--text-primary)] transition-colors duration-200`,
            })}
            
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
        </Component>
    );
};
// --- NavIcon Component End ---


// --- MobileNavLink Component ---
// Yeh component mobile menu ke andar links ke liye hai
const MobileNavLink = ({ to, title, count, onClick, children }) => {
  const Component = to ? Link : 'button';
  const props = to ? { to } : {};

  return (
    <Component
      {...props}
      onClick={onClick}
      className="flex items-center gap-4 p-4 w-full text-left text-lg font-semibold text-[var(--text-primary)] rounded-lg hover:bg-[var(--neumo-light-shadow)] dark:hover:bg-[var(--neumo-dark-shadow)] transition-colors duration-200 active:scale-95"
    >
      {/* Icon */}
      <div className="w-6 text-[var(--text-secondary)]">
        {children}
      </div>
      {/* Title */}
      <span>{title}</span>
      {/* Count Badge */}
      {count > 0 && (
        <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {count}
        </span>
      )}
    </Component>
  );
};
// --- MobileNavLink Component End ---


function Navbar() {
  const { user } = useAuth(); 
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { openSidebar } = useUI();
  const { theme, toggleTheme } = useTheme(); 

  // --- Mobile menu ke liye State ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Handlers jo menu ko band karte hain ---
  const handleProfileClick = () => {
    setIsMenuOpen(false); // Pehle mobile menu band karo
    openSidebar();        // Phir profile sidebar kholo
  };
  
  const handleThemeClick = () => {
    setIsMenuOpen(false); // Pehle mobile menu band karo
    toggleTheme();        // Phir theme badlo
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Link par click karke menu band karo
  };

  return (
    <> {/* Fragment use kiya taaki Navbar aur Mobile Menu dono return kar sakein */}
      {/* --- 1. NAVBAR --- */}
      <nav 
        className={`sticky top-0 z-30 w-full py-3 mb-5
                    bg-[var(--bg-base)] shadow-neumo transition-all duration-300
                    border-[0.2px] border-transparent 
                    hover:shadow-none hover:border-b-[var(--hover-border-color)]`}
      >
        <div className="flex items-center justify-between container mx-auto px-4">
          
          {/* --- LEFT SIDE --- */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2" title="NeoCart Home">
              {/* Logo SVG */}
              <svg className="h-9 w-auto text-[var(--logo-color)] transition-colors duration-300" viewBox="0 0 28 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 19V5 H7 V13.5 L13 5 V19 H10 V10.5 L4 19 Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12.5 9H22.4613L21.493 14.7126H13.6331L12.5 9ZM14.3302 5H18.784C19.8653 5 20.4851 5.9221 20.1584 6.88871L19.5702 8.5H13.6663L14.3302 5Z" />
                <path d="M14.5 17C15.3284 17 16 17.6716 16 18.5C16 19.3284 15.3284 20 14.5 20C13.6716 20 13 19.3284 13 18.5C13 17.6716 13.6716 17 14.5 17Z" />
                <path d="M19.5 17C20.3284 17 21 17.6716 21 18.5C21 19.3284 20.3284 20 19.5 20C18.6716 20 18 19.3284 18 18.5C18 17.6716 18.6716 17 19.5 17Z" />
              </svg>
              <span className="text-2xl font-bold text-[var(--logo-color)] transition-colors duration-300">
                NeoCart
              </span>
            </Link>
            {/* Home Icon (Mobile par hide kiya) */}
            <div className="hidden sm:block">
              <NavIcon to="/" title="Home" count={0} hoverColor="#2563EB">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4h.01M12 17h.01" />
                </svg>
              </NavIcon>
            </div>
          </div>

          {/* --- RIGHT SIDE (Responsive) --- */}
          <div>
            {/* 1. Desktop Icons (Mobile par hide honge) */}
            <div className="hidden md:flex items-center gap-4">
              
              
              {/* Wishlist Icon */}
              <NavIcon to="/wishlist" title="Wishlist" count={wishlistItems.length} hoverColor="#F87171">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                  </svg>
              </NavIcon>

              {/* Cart Icon */}
              <NavIcon to="/cart" title="Cart" count={cartItems.length} hoverColor="#4ADE80">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
              </NavIcon>
              
              {/* Theme Toggle Button */}
              <NavIcon onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} count={0} hoverColor={theme === 'dark' ? "#FBBF24" : "#6B7280"}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {theme === 'dark' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
              </NavIcon>
              
              {/* User Profile / Login Button */}
              {user ? (
                <button onClick={openSidebar} className="btn-neumo !p-0 w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-primary)] font-bold text-lg overflow-hidden" title="My Account">
                  {user.dp_url ? (
                    <img src={user.dp_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    // Profile Icon (agar DP nahi hai)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login"><button className="btn-neumo !py-2 !px-4">Login</button></Link>
                  <Link to="/signup"><button className="btn-neumo !py-2 !px-4 !text-cyan-500">Sign Up</button></Link>
                </div>
              )}
            </div>

            {/* 2. Mobile Hamburger Button (Sirf mobile par dikhega) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="btn-neumo !p-3"
                title="Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </nav>

      {/* --- 2. Mobile Menu Overlay --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--bg-base)] p-4 flex flex-col animate-[fadeInUp_0.3s_ease-out]">
          
          {/* 1. Header (Menu title aur Close button) */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-[var(--logo-color)]">Menu</span>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="btn-neumo !p-3"
              title="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 2. Navigation Links (Vertical) */}
          <nav className="flex flex-col gap-2">
            
            {/* Profile/Login sabse upar */}
            {user ? (
              <MobileNavLink
                onClick={handleProfileClick}
                title="My Account"
              >
                {user.dp_url ? (
                  <img src={user.dp_url} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </MobileNavLink>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={handleLinkClick} title="Login">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </MobileNavLink>
                <MobileNavLink to="/signup" onClick={handleLinkClick} title="Sign Up">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </MobileNavLink>
              </>
            )}

            <hr className="border-[var(--neumo-dark-shadow)] my-2" />

            {/* Baaki links */}
            <MobileNavLink to="/wishlist" onClick={handleLinkClick} title="Wishlist" count={wishlistItems.length}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            </MobileNavLink>

            <MobileNavLink to="/cart" onClick={handleLinkClick} title="Cart" count={cartItems.length}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </MobileNavLink>
            
            <MobileNavLink to="/" onClick={handleLinkClick} title="Home">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4h.01M12 17h.01" />
              </svg>
            </MobileNavLink>

            <MobileNavLink onClick={handleThemeClick} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </MobileNavLink>

          </nav>
        </div>
      )}
    </>
  );
}
export default Navbar;