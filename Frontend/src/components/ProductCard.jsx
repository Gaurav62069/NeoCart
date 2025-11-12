import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

// --- CardActionButton Component (No Change) ---
const CardActionButton = ({ onClick, children, title, isAdded, addedText, iconFillColor, isPrimary }) => {
    const [isHovered, setIsHovered] = useState(false);
    const shouldBeFilled = isAdded || isHovered; 
    const iconFill = shouldBeFilled ? iconFillColor : "none";
    const iconStroke = shouldBeFilled ? 'none' : 'currentColor';
    const iconStrokeWidth = shouldBeFilled ? '0' : '2';

    let buttonClasses = `
        w-full px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 shadow-md active:shadow-inner 
        flex items-center justify-center gap-2 h-11
    `;

    if (isAdded) {
        buttonClasses += ` shadow-neumo-inset bg-[var(--bg-base)] text-[var(--text-secondary)] cursor-not-allowed`;
    } 
    else if (isPrimary) {
        buttonClasses += ` btn-neumo !text-cyan-500`;
    } 
    else {
        buttonClasses += ` btn-neumo`;
    }

    return (
        <button 
            onClick={onClick}
            className={buttonClasses} 
            disabled={isAdded}
            title={title}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {React.cloneElement(children, {
                fill: iconFill,
                stroke: iconStroke,
                strokeWidth: iconStrokeWidth,
                className: `h-5 w-5 ${shouldBeFilled ? (isPrimary ? 'text-white' : 'text-current') : 'text-[var(--text-primary)]'} transition-colors duration-200`,
            })}
            <span>{isAdded ? addedText : title}</span>
        </button>
    );
};
// --- CardActionButton Component End ---


function ProductCard({ product }) {
  const { id, name, image_url, original_price, discount_price, discount_percent } = product;
  
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isInCart = cartItems.find(item => item.product_id === product.id);
  const isInWishlist = wishlistItems.find(item => item.product_id === product.id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to your cart.");
      navigate('/login');
      return; 
    }
    if (!isInCart) { 
      // Product object ko cart schema ke hisaab se pass karo
      const productForCart = {
        id: product.id,
        name: product.name,
        discount_price: product.discount_price,
        image_url: product.image_url
      };
      addToCart(productForCart);
    }
  };

  const handleAddToWishlist = () => {
    if (!user) {
      toast.error("Please login to add items to your wishlist.");
      navigate('/login');
      return; 
    }
    if (!isInWishlist) {
        // Product object ko wishlist schema ke hisaab se pass karo
        const productForWishlist = {
            id: product.id,
            name: product.name,
            discount_price: product.discount_price,
            image_url: product.image_url
          };
      addToWishlist(productForWishlist);
    }
  };


  return (
    // --- 1. 'flex flex-col h-full' ADDED ---
    // 'h-full' is needed so the card takes the full height of the grid cell
    <div className="card-neumo group overflow-hidden !p-3
                    hover:shadow-none cursor-pointer flex flex-col h-full"> 
      
      {/* Image (No Change) */}
      <Link to={`/product/${id}`}>
        <div className="w-full h-56 rounded-lg overflow-hidden bg-transparent shadow-neumo-inset mb-3"> 
            <img 
              className="w-full h-full object-cover
                         transition-transform duration-300 group-hover:scale-105"
              src={image_url} 
              alt={name} 
            />
        </div>
      </Link>
      
      {/* --- 2. 'flex flex-col flex-1' ADDED --- */}
      {/* 'flex-1' pushes the content area to take all available space */}
      <div className="px-1 py-1 flex flex-col flex-1">
        <Link to={`/product/${id}`}>
          <div 
            className="font-bold text-lg mb-1 truncate text-[var(--text-primary)] hover:text-cyan-500 transition-colors" 
            title={name}
          >
            {name}
          </div>
        </Link>
        
        {/* Price Section (No Change) */}
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            ₹{discount_price}
          </p>
          <p className="text-sm text-[var(--text-secondary)] line-through">
            ₹{original_price}
          </p>
        </div>
        
        <p className="text-sm font-semibold text-green-600 dark:text-green-500 mb-4">
          {discount_percent}% off
        </p>
        
        {/* --- 3. 'mt-auto' ADDED --- */}
        {/* 'mt-auto' pushes the buttons to the bottom of the card */}
        <div className="flex flex-col gap-3 mt-auto">
            
            {/* 1. Add to Wishlist Button */}
            <CardActionButton
                onClick={handleAddToWishlist}
                title="Add to Wishlist"
                addedText="✓ Wishlisted"
                isAdded={isInWishlist}
                iconFillColor="#F87171"
                isPrimary={false}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
            </CardActionButton>

            {/* 2. Add to Cart Button */}
            <CardActionButton
                onClick={handleAddToCart}
                title="Add to Cart"
                addedText="✓ Added to Cart"
                isAdded={isInCart}
                iconFillColor="#4ADE80"
                isPrimary={true}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </CardActionButton>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;