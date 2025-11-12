import React from 'react';
import { Link } from 'react-router-dom';

function ReturnsPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Return Policy</h1>

      {/* --- Neumorphic Card --- */}
      <div className="card-neumo !p-8 space-y-6">
        
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">Our 10-Day Return Guarantee</h2>
          <p className="text-[var(--text-secondary)]">
            We want you to be completely satisfied with your purchase. If you are unhappy for any reason, you can return any item within 10 days of the delivery date, provided it is in its original condition, unused, and with all original tags and packaging intact.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">How to Initiate a Return</h2>
          <p className="text-[var(--text-secondary)]">
            1. Go to your <Link to="/orders" className="text-blue-400 hover:underline">Order History</Link> page.
            <br />
            2. Find the order containing the item you wish to return.
            <br />
            3. Click the "Request Return" button next to the item (Feature coming soon).
            <br />
            4. Follow the on-screen instructions to complete your return request.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">Items Not Eligible for Return</h2>
          <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1">
            <li>Items marked as "Final Sale".</li>
            <li>Digital products or gift cards.</li>
            <li>Products that have been used, washed, or altered.</li>
            <li>Items returned without original packaging or tags.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">Refunds</h2>
          <p className="text-[var(--text-secondary)]">
            Once we receive and inspect your returned item, we will process your refund. The refund will be credited back to your original payment method within 5-7 business days.
          </p>
        </div>

        <div>
          <p className="text-[var(--text-secondary)]">
            For more details, please <Link to="/support" className="text-blue-400 hover:underline">contact customer support</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}

export default ReturnsPage;
