import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const [subtotal, setSubtotal] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Calculate subtotal whenever cartItems change
  useEffect(() => {
    const calculateSubtotal = () => {
      const total = cartItems.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
      }, 0);
      setSubtotal(total);
    };
    calculateSubtotal();
  }, [cartItems]);

  // Calculate final price whenever subtotal or coupon changes
  useEffect(() => {
    if (coupon && coupon.discount_percent > 0) {
      const discountAmount = (subtotal * coupon.discount_percent) / 100;
      setDiscount(discountAmount);
      setTotalPrice(subtotal - discountAmount);
    } else {
      // If no coupon
      setDiscount(0);
      setTotalPrice(subtotal);
    }
  }, [subtotal, coupon]);

  // Apply Coupon
  const applyCoupon = async (code) => {
    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/cart/apply-coupon', {
        code: code
      });
      
      setCoupon(response.data);
      toast.success(`Coupon "${response.data.code}" applied!`);

    } catch (error) {
      console.error("Error applying coupon:", error);
      setCoupon(null); // Reset state on wrong coupon
      toast.error(error.response?.data?.detail || "Invalid coupon code.");
    }
  };

  // Add to Cart
  const addToCart = async (product) => {
    try {
      const itemData = {
        product_id: product.id,
        product_name: product.name,
        price: product.discount_price,
        image_url: product.image_url
      };
      const response = await axios.post('http://localhost:8000/api/cart/add', itemData);
      const updatedItem = response.data;
      const existingItem = cartItems.find((item) => item.product_id === updatedItem.product_id);
      
      if (existingItem) {
        setCartItems(
          cartItems.map((item) =>
            item.product_id === updatedItem.product_id ? updatedItem : item
          )
        );
        toast.success(`${product.name} quantity updated!`);
      } else {
        setCartItems([...cartItems, updatedItem]);
        toast.success(`${product.name} added to cart!`);
      }
      
    } catch (error) {
      toast.error('Failed to add item. Please login again.');
    }
  };

  // Update Quantity
  const updateQuantity = async (productId, amount) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/cart/update', 
        null, 
        { params: { product_id: productId, amount: amount } }
      );
      const updatedItem = response.data;
      
      if (updatedItem) {
        // If item is updated (quantity > 0)
        setCartItems(
          cartItems.map(item => 
            item.product_id === productId ? updatedItem : item
          )
        );
      } else {
        // If item is removed (quantity <= 0)
        setCartItems(cartItems.filter((item) => item.product_id !== productId));
      }
    } catch (error) {
      // Fallback: remove item from state if API fails
      setCartItems(cartItems.filter((item) => item.product_id !== productId));
    }
  };

  // Remove from Cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/cart/remove/${productId}`);
      setCartItems(cartItems.filter((item) => item.product_id !== productId));
      toast.error('Item removed from cart.');
    } catch (error) {
      toast.error('Failed to remove item.');
    }
  };

  // Clear Cart (used on checkout)
  const clearCart = async () => {
    setCartItems([]);
    setCoupon(null);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        setCartItems,
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        totalPrice,
        subtotal,
        discount,
        coupon,
        applyCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);