import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'nprogress/nprogress.css'
import './api/axiosConfig.js';
// Saare Context Providers
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { UIProvider } from './context/UIContext.jsx' // 1. Naya UIProvider import karein

import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <ThemeProvider>
      {/* 2. Poori app ko UIProvider se wrap karein */}
      <UIProvider>
        <CartProvider>
          <WishlistProvider>
            <AuthProvider> 
              <App />
            </AuthProvider>
          </WishlistProvider>
        </CartProvider>
      </UIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)