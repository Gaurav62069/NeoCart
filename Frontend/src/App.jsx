import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Core Components
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';

// Page Components
import HomePage from './pages/HomePage.jsx';
import CartPage from './pages/CartPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import ReturnsPage from './pages/ReturnsPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <div className="relative min-h-screen">
      
      {/* Toaster (Updated for Light/Dark mode) */}
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Base styles
          style: {
            borderRadius: '10px',
            background: 'var(--bg-base)', // Neumorphic background
            color: 'var(--text-primary)', // Neumorphic text
            boxShadow: 'var(--neumo-shadow)', // Neumorphic shadow
          },
          // Dark mode override
          dark: {
            background: '#3a3a44', // Darker background for toast
            color: '#f3f4f6',
          },
        }}
      />
      
      {/* Sidebar (Yeh Glassmorphism rahega) */}
      <Sidebar />
      
      {/* Navbar (Yeh Glassmorphism rahega) */}
      <Navbar />
      
      {/* Page routes */}
      {/* pt-4 hata diya hai taaki content viewport mein fit ho */}
      <main> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;