import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// FormInput component (Neumorphic)
const FormInput = ({ label, id, type, value, onChange, containerClass = '' }) => (
  <div className={containerClass}>
    <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
      {label}
    </label>
    <input 
      type={type} 
      id={id} 
      className="input-neumo"
      value={value}
      onChange={onChange}
      required
    />
  </div>
);


function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: ''
  });

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: '', // City and pincode are usually not stored in user profile
        pincode: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      shipping_details: formData,
      order_items: cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.product_name,
        image_url: item.image_url
      })),
      total_price: totalPrice
    };

    try {
      await axios.post('http://localhost:8000/api/orders/checkout', orderData);
      toast.success('Order Placed Successfully!');
      clearCart(); // Clear the cart from frontend state
      setTimeout(() => navigate('/orders'), 1500); // Redirect to order history
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.response?.data?.detail || "Failed to place order.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-5">Your cart is empty.</h1>
        <p className="text-[var(--text-secondary)]">Please add items to your cart before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-5">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT SIDE: Shipping Form (Neumorphic) --- */}
        <div className="flex-grow card-neumo">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            
            <FormInput 
              label="Full Name" id="name" type="text" 
              value={formData.name} onChange={handleInputChange} 
            />
            <FormInput 
              label="Email" id="email" type="email" 
              value={formData.email} onChange={handleInputChange}
            />
            <FormInput 
              label="Phone Number" id="phone" type="tel" 
              value={formData.phone} onChange={handleInputChange}
            />
            <FormInput 
              label="Address" id="address" type="text" 
              value={formData.address} onChange={handleInputChange}
            />
            
            <div className="flex gap-4">
              <FormInput 
                label="City" id="city" type="text" 
                value={formData.city} onChange={handleInputChange}
                containerClass="w-1/2"
              />
              <FormInput 
                label="Pincode" id="pincode" type="text" 
                value={formData.pincode} onChange={handleInputChange}
                containerClass="w-1/2"
              />
            </div>

            <button 
              type="submit"
              className="w-full mt-6 btn-neumo !text-cyan-500 py-3 font-bold text-lg"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* --- RIGHT SIDE: Order Summary (Neumorphic) --- */}
        <div className="w-full lg:w-1/3">
          <div className="card-neumo">
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Order Summary</h2>
            
            {/* Item list (Inset shadow) */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto p-2 rounded-lg shadow-neumo-inset">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-[var(--text-secondary)]">
                  <span className="truncate pr-2">{item.product_name} (x{item.quantity})</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr className="border-[var(--neumo-dark-shadow)] mb-4" />
            
            {/* Total */}
            <div className="flex justify-between text-2xl font-bold text-[var(--text-primary)]">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CheckoutPage;