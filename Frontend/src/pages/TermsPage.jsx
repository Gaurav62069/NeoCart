import React from 'react';
import { Link } from 'react-router-dom';

function TermsPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Terms & Conditions</h1>

      {/* --- Neumorphic Card --- */}
      <div className="card-neumo !p-8 space-y-6 text-[var(--text-secondary)]">
        
        <p>
          Welcome to My E-Commerce Store. By accessing or using our website, you agree to be bound by these terms and conditions ("Terms"). Please read them carefully.
        </p>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">1. Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
          </p>
          <p className="mt-2">
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">2. Wholesaler Accounts</h2>
          <p>
            Wholesaler accounts are subject to manual verification. You must provide a valid Business ID (e.g., GST Number) upon registration. Access to wholesale pricing is granted only after your account has been verified by our admin team. We reserve the right to revoke wholesaler status at any time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">3. Orders & Payments</h2>
          <p>
            By placing an order, you warrant that you are legally capable of entering into binding contracts and that the information you provide is true and accurate. All prices are listed in INR. We reserve the right to refuse or cancel any order at any time for reasons including, but not limited to, product availability, errors in the description or price of the product, or error in your order.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">4. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of My E-Commerce Store and its licensors.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">5. Limitation of Liability</h2>
          <p>
            In no event shall My E-Commerce Store, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">6. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.
          </p>
        </div>

        <div>
          <p>
            If you have any questions about these Terms, please <Link to="/support" className="text-blue-400 hover:underline">contact us</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}

export default TermsPage;
