import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import EmptyState from '../components/EmptyState.jsx'; // EmptyState import kiya

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/orders/me');
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <p className="text-center text-xl text-[var(--text-secondary)] p-10">Loading order history...</p>;
  }

  if (!user) {
     return (
      <EmptyState
        title="Please Login"
        message="You need to be logged in to view your order history."
        buttonText="Go to Login"
        buttonTo="/login"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />
    );
  }

  // Naya Empty State
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No Orders Yet"
        message="You haven't placed any orders with us yet. Let's change that!"
        buttonText="Start Shopping"
        buttonTo="/"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
    );
  }

  // Agar orders hain, toh yeh dikhega
  return (
    <div className="container mx-auto p-4 max-w-4xl animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Your Order History</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card-neumo !p-0 overflow-hidden">
            
            <div className="flex justify-between items-center p-4 shadow-neumo-inset">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Order Placed</p>
                <p className="font-semibold text-[var(--text-primary)]">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total</p>
                <p className="font-semibold text-[var(--text-primary)]">₹{order.total_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Order ID</p>
                <p className="font-semibold text-[var(--text-primary)]">#{order.id}</p>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img 
                    src={item.image_url} 
                    alt={item.product_name} 
                    className="w-16 h-16 rounded-lg object-cover p-1 shadow-neumo-inset" 
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-[var(--text-primary)]">{item.product_name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">Qty: {item.quantity}</p>
                  </div>
                  {/* --- YAHAN THA ERROR --- */}
                  <p className="font-semibold text-[var(--text-primary)]">₹{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="p-4 shadow-neumo-inset">
                <h4 className="text-md font-semibold text-[var(--text-primary)] mb-1">Shipping Address</h4>
                <p className="text-sm text-[var(--text-secondary)]">{order.shipping_address.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{order.shipping_address.address}, {order.shipping_address.city} - {order.shipping_address.pincode}</p>
                <p className="text-sm text-[var(--text-secondary)]">{order.shipping_address.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistoryPage;