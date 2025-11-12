import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCart } from './CartContext.jsx'; // To move items to cart

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // State will always be an empty array by default
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();

  // 'addToWishlist' function now calls the backend
  const addToWishlist = async (product) => {
    try {
      // Send product data matching ItemBase schema
      const itemData = {
        product_id: product.id,
        product_name: product.name,
        price: product.discount_price,
        image_url: product.image_url
      };
      
      const response = await axios.post('http://localhost:8000/api/wishlist/add', itemData);
      
      // Get the new item from the backend
      const newItem = response.data;

      // Update React state
      const existingItem = wishlistItems.find((item) => item.product_id === newItem.product_id);
      
      if (!existingItem) {
        setWishlistItems([...wishlistItems, newItem]);
        toast.success(`${product.name} added to wishlist!`);
      } else {
        toast.error(`${product.name} is already in wishlist!`);
      }

    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error('Failed to add item. Please login again.');
    }
  };

  // 'removeFromWishlist' now calls the backend
  const removeFromWishlist = async (productId) => {
    try {
      // Delete from backend
      await axios.delete(`http://localhost:8000/api/wishlist/remove/${productId}`);
      
      // Delete from React state
      setWishlistItems(wishlistItems.filter((item) => item.product_id !== productId));
      toast.error('Item removed from wishlist.');

    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error('Failed to remove item.');
    }
  };

  // 'moveToCart' now calls the backend
  const moveToCart = async (product) => {
    // Format the product object for the cart schema
    const cartProduct = {
        id: product.product_id, // Get product_id from the wishlist item
        name: product.product_name,
        discount_price: product.price,
        image_url: product.image_url
    };

    await addToCart(cartProduct); // First, add to cart
    await removeFromWishlist(product.product_id); // Then, remove from wishlist
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        setWishlistItems, // Export this for AuthContext to use
        addToWishlist, 
        removeFromWishlist,
        moveToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);