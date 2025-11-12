import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx'; // Context import
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import toast from 'react-hot-toast';

// --- Star rating component ---
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
};

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // --- 1. ADMINVIEW KO AUTHCONTEXT SE IMPORT KIYA GAYA ---
  const { user, adminView } = useAuth();
  
  const { addToCart, cartItems } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Status check
  const isInCart = product && cartItems.find(item => item.product_id === product.id);
  const isInWishlist = product && wishlistItems.find(item => item.product_id === product.id);

  // --- 2. DISPLAYROLE LOGIC KO ADMIN KE LIYE UPDATE KIYA GAYA ---
  const isAdmin = user && user.email === '62069gaurav@gmail.com';
  const isVerifiedWholesaler = user && user.role === 'wholesaler' && user.is_verified;

  const displayRole = isAdmin
    ? adminView  // Agar admin hai, toh context ka view use karo
    : (isVerifiedWholesaler ? 'wholesaler' : 'retailer'); // Warna normal logic

  // --- Click Handlers (Cart/Wishlist) ---
  // (Inme koi change nahi, kyunki yeh 'product.discount_price' use karte hain, jo state se aata hai)
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to your cart.");
      navigate('/login');
      return;
    }
    if (product && !isInCart) {
      const productForCart = {
        id: product.id,
        name: product.name,
        discount_price: product.discount_price, // Yeh state se sahi price uthayega
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
    if (product && !isInWishlist) {
      const productForWishlist = {
        id: product.id,
        name: product.name,
        discount_price: product.discount_price, // Yeh state se sahi price uthayega
        image_url: product.image_url
      };
      addToWishlist(productForWishlist);
    }
  };

  // --- Data fetching (Product aur Reviews) ---
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      setLoading(true);
      try {
        // --- 3. API CALL AB SAHI 'displayRole' BHEJEGA ---
        const productRes = await axios.get(`http://localhost:8000/api/products/${id}`, {
          params: { user_role: displayRole } // 'displayRole' ab admin view ko support karta hai
        });
        setProduct(productRes.data);
        
        // Fetch reviews (public)
        const reviewsRes = await axios.get(`http://localhost:8000/api/reviews/${id}`);
        setReviews(reviewsRes.data);
        
      } catch (error) {
        console.error("Error fetching product or reviews:", error);
        setProduct(null);
      }
      setLoading(false);
    };
    fetchProductAndReviews();
  }, [id, displayRole]); // 'displayRole' dependency mein hai (bilkul sahi)

  // --- Review Submit ---
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review.");
      navigate('/login');
      return;
    }
    
    setSubmittingReview(true);
    try {
      const reviewData = {
        product_id: product.id,
        rating: newRating,
        comment: newComment
      };
      
      const response = await axios.post('http://localhost:8000/api/reviews', reviewData);
      
      setReviews([response.data, ...reviews]); // Add new review to the top
      setNewComment('');
      setNewRating(5);
      toast.success('Review submitted successfully!');
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.detail || "Failed to submit review.");
    }
    setSubmittingReview(false);
  };

  // --- Loading States ---
  if (loading) {
    return <p className="text-center text-xl text-[var(--text-secondary)] p-10">Loading product details...</p>;
  }
  if (!product) {
    return <p className="text-center text-xl text-red-500 p-10">Product not found.</p>;
  }

  // --- BAAKI POORA JSX/UI CODE BILKUL SAME RAHEGA ---
  return (
    <div className="container mx-auto p-4 animate-[fadeInUp_0.5s_ease-out_forwards]">
      {/* --- 3-COLUMN LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* --- COLUMN 1: Image (Neumorphic) --- */}
        <div className="lg:col-span-2 flex items-center justify-center card-neumo">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-neumo-inset"
          />
        </div>
        
        {/* --- COLUMN 2: Details --- */}
        <div className="lg:col-span-2 flex flex-col">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">{product.name}</h1>
          <p className="text-[var(--text-secondary)] mb-4">
            In Stock: <span className="font-bold text-[var(--text-primary)]">{product.stock}</span> units
          </p>
          {product.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Product Description</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>

        {/* --- COLUMN 3: Buy Box (Neumorphic) --- */}
        <div className="lg:col-span-1">
          <div className="card-neumo">
            <div className="mb-4">
              {/* Yeh price state se aa raha hai, jo pehle hi sahi role se fetch hua hai */}
              <p className="text-4xl font-bold text-[var(--text-primary)]">₹{product.discount_price}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg text-[var(--text-secondary)] line-through">₹{product.original_price}</p>
                <p className="text-md font-semibold text-green-500">{product.discount_percent}% off</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* --- Add to Cart Button --- */}
              <button 
                onClick={handleAddToCart}
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 active:scale-95 ${
                  isInCart 
                    ? 'shadow-neumo-inset bg-[var(--bg-base)] text-[var(--text-secondary)] cursor-not-allowed'
                    : 'btn-neumo !text-cyan-500'
                }`}
                disabled={isInCart}
              >
                {isInCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>

              {/* --- Add to Wishlist Button --- */}
              <button 
                onClick={handleAddToWishlist}
                className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 active:scale-95 ${
                  isInWishlist 
                    ? 'shadow-neumo-inset bg-[var(--bg-base)] text-[var(--text-secondary)] cursor-not-allowed'
                    : 'btn-neumo'
                }`}
                disabled={isInWishlist}
              >
                {isInWishlist ? '✓ In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
        
      </div>

      {/* --- REVIEWS SECTION --- */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Customer Reviews</h2>
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Side: Naya Review Submit Form */}
          <div className="md:w-1/3">
            <div className="card-neumo">
              <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Write a Review</h3>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your Rating</label>
                    <div className="flex p-2 rounded-lg shadow-neumo-inset">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          onClick={() => setNewRating(i + 1)}
                          className={`w-8 h-8 cursor-pointer transition-colors ${i < newRating ? 'text-yellow-400' : 'text-[var(--neumo-dark-shadow)] hover:text-[var(--neumo-light-shadow)]'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your Review</label>
                    <textarea 
                      id="comment" 
                      rows="4"
                      className="input-neumo"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full mt-2 btn-neumo !text-cyan-500"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <p className="text-[var(--text-secondary)]">
                  Please <Link to="/login" className="text-blue-400 hover:underline">login</Link> to write a review.
                </p>
              )}
            </div>
          </div>
          
          {/* Right Side: Puraane Reviews ki List */}
          <div className="md:w-2/3">
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="card-neumo">
                    <div className="flex items-center gap-3 mb-2">
                      <img 
                        src={review.owner.dp_url || `https://ui-avatars.com/api/?name=${review.owner.name || 'U'}&background=805ad5&color=fff&size=40`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover shadow-neumo-inset p-1"
                      />
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{review.owner.name || 'Anonymous'}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-[var(--text-secondary)]">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-[var(--text-secondary)]">No reviews for this product yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;