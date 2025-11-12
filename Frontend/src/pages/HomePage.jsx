import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductCardSkeleton from '../components/ProductCardSkeleton.jsx';
import { useInView } from 'react-intersection-observer';

// Pagination settings
const INITIAL_LOAD_LIMIT = 8;
const SCROLL_LOAD_LIMIT = 4;

// Debounce Function
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [isFetchingMore, setIsFetchingMore] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 

  // --- STATE CONTEXT SE AAYEGA ---
  // adminView state ko context se lo
  const { user, adminView } = useAuth(); 
  
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { ref, inView } = useInView({
    rootMargin: '200px',
    triggerOnce: false,
  });

  // Role logic (bilkul sahi)
  const isVerifiedWholesaler = user && user.role === 'wholesaler' && user.is_verified;
  const isAdmin = user && user.email === '62069gaurav@gmail.com';

  // --- DISPLAY ROLE LOGIC AB CONTEXT STATE KA ISTEMAL KAREGA ---
  const displayRole = isAdmin 
    ? adminView  // Yeh ab AuthContext se aa raha hai
    : (isVerifiedWholesaler ? 'wholesaler' : 'retailer');

  
  // API Function (Isme koi change nahi)
  const fetchProducts = useCallback(async (isInitialLoad, currentSearchTerm) => {
    const limit = isInitialLoad ? INITIAL_LOAD_LIMIT : SCROLL_LOAD_LIMIT;
    const skip = isInitialLoad ? 0 : products.length;

    if (!hasMore && !isInitialLoad) return;

    if (isInitialLoad) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const params = {
        user_role: displayRole, 
        skip: skip,
        limit: limit,
      };
      if (currentSearchTerm) {
        params.search = currentSearchTerm;
      }
      
      const response = await axios.get('http://localhost:8000/api/products', { params });

      setProducts(prev => isInitialLoad ? response.data : [...prev, ...response.data]);

      if (response.data.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (error) {
      console.error("Error fetching products:", error);
      setHasMore(false); 
    } finally {
      if (isInitialLoad) setLoading(false);
      else setIsFetchingMore(false);
    }
  }, [displayRole, products.length, hasMore]); 

  
  // useEffect (Infinite Scroll Trigger)
  useEffect(() => {
    if (inView && !loading && !isFetchingMore && hasMore) {
      fetchProducts(false, debouncedSearchTerm);
    }
  }, [inView, loading, isFetchingMore, hasMore, fetchProducts, debouncedSearchTerm]);

  
  // useEffect (Reset on Role or Search Change)
  useEffect(() => {
    setProducts([]);
    setHasMore(true);
    fetchProducts(true, debouncedSearchTerm);
  }, [displayRole, debouncedSearchTerm]); // 'displayRole' change hone par trigger hoga (jab admin switch karega)


  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) { 
      setSearchTerm(''); 
    }
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* Heading and Searchbar (Isme koi change nahi) */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 animate-[fadeInUp_0.5s_ease-out_forwards]">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Our Products</h1>
        <div className="flex items-center justify-end gap-2">
          <div className={`transition-all duration-300 ease-in-out ${showSearchInput ? 'w-40 sm:w-64 opacity-100 visible' : 'w-0 opacity-0 invisible'}`}>
            <input 
              type="text"
              placeholder="Search products..."
              className="input-neumo !py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus={showSearchInput}
              tabIndex={showSearchInput ? 0 : -1}
            />
          </div>
          <button 
            onClick={toggleSearchInput}
            className="btn-neumo !p-3"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- ADMIN TOGGLE BUTTONS YAHAN SE HATA DIYE GAYE HAIN --- */}
      
      {/* Product Grid and Loader Logic (Isme koi change nahi) */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(INITIAL_LOAD_LIMIT)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="animate-[fadeInUp_0.5s_ease-out_forwards]" 
              style={{ animationDelay: `${index * 50}ms`, opacity: 0 }} 
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-red-500 animate-[fadeInUp_0.5s_ease-out_forwards]">
          {searchTerm ? "No products match your search." : "No products found."}
        </p>
      )}

      {/* Infinite Scroll Loader and Trigger (Isme koi change nahi) */}
      <div 
        ref={ref} 
        className="mt-8 py-4"
      >
        {hasMore && isFetchingMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(SCROLL_LOAD_LIMIT)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
        {!hasMore && !loading && (
          <p className="text-center text-lg text-[var(--text-secondary)]">
            You've reached the end!
          </p>
        )}
      </div>
      
    </div>
  );
}

export default HomePage;