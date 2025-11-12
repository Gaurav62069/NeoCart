import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../firebase.js';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import FormInputWithIcon from '../components/FormInputWithIcon.jsx';
import FullPageLoader from '../components/FullPageLoader.jsx';
// Import icons from the centralized file
import { EmailIcon, LockIcon, BusinessIcon } from '../components/Icons.jsx';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('retailer');
  const [businessId, setBusinessId] = useState('');

  const navigate = useNavigate();
  const { loginAction } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Signup Handlers ---
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (role === 'wholesaler' && !businessId) {
      toast.error('Business ID is required for wholesaler account.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      const firebaseToken = await userCredential.user.getIdToken();
      await axios.post(
        'http://localhost:8000/api/auth/firebase-login', 
        {
          token: firebaseToken,
          role: role,
          business_id: businessId
        }
      );
      toast.success('Account created! Please check your email to verify.');
      await auth.signOut();
      navigate('/login');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Email signup error:", error);
      toast.error(error.message || 'Signup failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();
      const dpUrl = result.user.photoURL; 
      const response = await axios.post(
        'http://localhost:8000/api/auth/firebase-login', 
        { 
          token: firebaseToken, 
          role: 'retailer', 
          business_id: null,
          dp_url: dpUrl
        }
      );
      loginAction(response.data.access_token);
      toast.success('Signed up with Google!');
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      console.error("Google login error:", error);
      toast.error('Google signup failed. Please try again.');
    }
  };
  // --- End Handlers ---

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="container mx-auto p-4 flex justify-center animate-[fadeInUp_0.5s_ease-out_forwards]">
      <div className="w-full max-w-md card-neumo !p-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Email
            </label>
            <FormInputWithIcon
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<EmailIcon />}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Password (min. 6 characters)
            </label>
            <FormInputWithIcon
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockIcon />}
              togglePassword={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Account Type
            </label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-neumo appearance-none"
            >
              <option value="retailer">Retailer (Regular Customer)</option>
              <option value="wholesaler">Wholesaler (Business Account)</option>
            </select>
          </div>

          {role === 'wholesaler' && (
            <div>
              <label htmlFor="businessId" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Business ID (e.g., GST Number)
              </label>
              <FormInputWithIcon
                id="businessId"
                type="text"
                placeholder="Your Business ID"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                icon={<BusinessIcon />}
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">Verification is required for wholesale pricing.</p>
            </div>
          )}

          <button 
            type="submit"
            className="w-full mt-4 btn-neumo !text-cyan-500 font-bold text-lg"
          >
            Create Account & Verify Email
          </button>
        </form>

        <div className="flex items-center justify-center my-6">
          <hr className="w-full border-[var(--neumo-dark-shadow)]" />
          <span className="px-4 text-[var(--text-secondary)]">OR</span>
          <hr className="w-full border-[var(--neumo-dark-shadow)]" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full btn-neumo flex items-center justify-center gap-2"
        >
          <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" />
          Sign up with Google
        </button>

        <p className="text-center text-[var(--text-secondary)] mt-6">
          Already have an account? 
          <Link to="/login" className="text-blue-400 hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;