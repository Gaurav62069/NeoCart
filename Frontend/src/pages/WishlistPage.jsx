import React from 'react';
import { useWishlist } from '../context/WishlistContext.jsx';
import EmptyState from '../components/EmptyState.jsx'; // 1. EmptyState import kiya

function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();

  // --- 2. Yahan Naya Empty State Use Hoga ---
  if (wishlistItems.length === 0) {
    return (
      <EmptyState
        title="Your Wishlist is Empty"
        message="You haven't saved any items yet. Start exploring and add what you love!"
        buttonText="Start Exploring"
        buttonTo="/"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        }
      />
    );
  }

  // --- Agar wishlist khaali nahi hai, toh yeh dikhega ---
  return (
    <div className="container mx-auto p-4 animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold mb-5 text-[var(--text-primary)]">Your Wishlist</h1>
      
      <div className="flex flex-col gap-4">
        {wishlistItems.map(item => (
          <div key={item.id} className="card-neumo !rounded-2xl !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <img 
                src={item.image_url} 
                alt={item.product_name} 
                className="w-20 h-20 object-cover rounded-lg shadow-neumo-inset p-1" 
              />
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">{item.product_name}</h2>
                <p className="text-lg font-bold text-[var(--text-primary)]">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => moveToCart(item)}
                className="btn-neumo !px-3 !py-1 !text-cyan-500 font-semibold"
              >
                Move to Cart
              </button>
              <button 
                onClick={() => removeFromWishlist(item.product_id)}
                className="btn-neumo !px-3 !py-1 !bg-red-600 hover:!bg-red-700 !text-white font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
