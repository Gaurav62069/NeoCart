import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useCart } from './CartContext.jsx';
import { useWishlist } from './WishlistContext.jsx';
import FullPageLoader from '../components/FullPageLoader.jsx';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // --- 1. ADMIN VIEW STATE YAHAN ADD KIYA GAYA HAI ---
  // Default view 'retailer' rakha hai
  const [adminView, setAdminView] = useState('retailer'); 

  const { setCartItems } = useCart();
  const { setWishlistItems } = useWishlist();

  useEffect(() => {
    const loadUserFromToken = async () => {
      if (token) {
        try {
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Aapka cache-busting code (Bilkul sahi hai)
          const response = await axios.get(
            'http://localhost:8000/api/users/me', 
            {
              params: {
                _: Date.now() 
              },
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': '0',
              },
            }
          );
          
          setUser(response.data); 
          setCartItems(response.data.cart_items || []);
          setWishlistItems(response.data.wishlist_items || []);

        } catch (error) {
          console.error("Invalid token or user fetch failed:", error);
          localStorage.removeItem('token');
          setUser(null);
          setCartItems([]);
          setWishlistItems([]);
          delete axios.defaults.headers.common['Authorization'];
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setCartItems([]);
        setWishlistItems([]);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, [token, setCartItems, setWishlistItems]); // Dependencies bilkul sahi hain

  const loginAction = (newToken) => {
    try {
      jwtDecode(newToken);
    } catch (e) {
      console.error("Error decoding token:", e);
    }
    setLoading(true);
    setToken(newToken);
  };

  const logoutAction = () => {
    setLoading(true);
    setToken(null);
  };

  // Context ki value mein naya state add karo
  const value = {
    user,
    token,
    loginAction,
    logoutAction,
    loading,
    
    // --- 2. ADMIN STATE KO CONTEXT MEIN PASS KIYA GAYA ---
    adminView, 
    setAdminView
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);