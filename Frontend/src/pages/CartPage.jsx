import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx'; 
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx'; // 1. EmptyState import kiya

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    subtotal, 
    discount, 
    coupon, 
    applyCoupon 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    applyCoupon(couponCode);
  };

  // --- 2. Yahan Naya Empty State Use Hoga ---
  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your Cart is Empty"
        message="Looks like you haven't added anything to your cart yet. Let's find something!"
        buttonText="Start Shopping"
        buttonTo="/"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
    );
  }

  // --- Agar cart khaali nahi hai, toh yeh dikhega ---
  return (
    <div className="container mx-auto p-4 animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold mb-5 text-[var(--text-primary)]">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items (Left Side) */}
        <div className="flex-grow">
          <div className="flex flex-col gap-4">
            {cartItems.map(item => (
              <div key={item.id} className="card-neumo !rounded-2xl !p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <img src={item.image_url} alt={item.product_name} className="w-20 h-20 object-cover rounded-lg shadow-neumo-inset p-1" />
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">{item.product_name}</h2>
                    <p className="text-lg font-bold text-[var(--text-primary)]">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.product_id, -1)}
                      className="btn-neumo !p-0 w-8 h-8 rounded-full font-bold"
                    >
                      -
                    </button>
                    <span className="text-lg text-[var(--text-primary)] w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product_id, 1)}
                      className="btn-neumo !p-0 w-8 h-8 rounded-full font-bold"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.product_id)}
                    className="btn-neumo !px-3 !py-1 !bg-red-600 hover:!bg-red-700 !text-white"
                  >
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (Right Side) */}
        <div className="w-full lg:w-1/3">
          <div className="card-neumo !p-6">
            
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Apply Coupon</h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
                className="input-neumo"
                disabled={!!coupon} 
              />
              <button 
                onClick={handleApplyCoupon}
                className={`btn-neumo !px-4 font-bold ${
                  coupon 
                  ? 'shadow-neumo-inset bg-[var(--bg-base)] text-[var(--text-secondary)] cursor-not-allowed' 
                  : '!bg-green-600 hover:!bg-green-700 !text-white'
                }`}
                disabled={!!coupon}
              >
                Apply
              </button>
            </div>
            <hr className="border-[var(--neumo-dark-shadow)] mb-4" />
            
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Order Summary</h2>
            
            <div className="flex justify-between text-lg text-[var(--text-secondary)] mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span> 
            </div>
            
            <div className="flex justify-between text-lg text-[var(--text-secondary)] mb-2">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-lg text-green-500 mb-4">
                <span>Discount ({coupon.code})</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            )}
            
            <hr className="border-[var(--neumo-dark-shadow)] mb-4" />
            
            <div className="flex justify-between text-2xl font-bold text-[var(--text-primary)]">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            
            <Link to="/checkout" className="block w-full"> 
              <button className="w-full mt-6 btn-neumo !text-cyan-500 font-bold text-lg">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CartPage;
