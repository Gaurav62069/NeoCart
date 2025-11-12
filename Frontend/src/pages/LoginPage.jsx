import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../firebase.js';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber 
} from 'firebase/auth';
import FormInputWithIcon from '../components/FormInputWithIcon.jsx';
import FullPageLoader from '../components/FullPageLoader.jsx';
import { EmailIcon, LockIcon, PhoneIcon } from '../components/Icons.jsx'; // Import icons

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { loginAction } = useAuth(); 

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- Login Handlers ---
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        toast.error('Email not verified. Please check your inbox.');
        await auth.signOut();
        setIsLoading(false); 
        return;
      }
      const firebaseToken = await userCredential.user.getIdToken();
      const response = await axios.post(
        'http://localhost:8000/api/auth/firebase-login', 
        { token: firebaseToken } 
      );
      loginAction(response.data.access_token);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      setIsLoading(false); 
      if (error.code === 'auth/invalid-credential') {
        toast.error('Wrong email or password. Please try again.');
      } else {
        console.error("Email login error:", error);
        toast.error(error.message || 'Login failed. Check credentials.');
      }
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
        { token: firebaseToken, dp_url: dpUrl }
      );
      loginAction(response.data.access_token);
      toast.success('Logged in with Google!');
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      console.error("Google login error:", error);
      toast.error('Google login failed. Please try again.');
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {}
      });
    }
    return window.recaptchaVerifier;
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error('Please enter a phone number.');
    setIsLoading(true);
    try {
      const recaptchaVerifier = setupRecaptcha();
      const formattedPhone = `+91${phone}`; 
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      toast.success('OTP sent successfully!');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Phone login error:", error);
      toast.error(error.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP.');
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();
      const response = await axios.post(
        'http://localhost:8000/api/auth/firebase-login', 
        { token: firebaseToken, dp_url: null }
      );
      loginAction(response.data.access_token);
      toast.success('Logged in with Phone!');
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      console.error("OTP verify error:", error);
      toast.error('Invalid OTP. Please try again.');
    }
  };
  // --- End Handlers ---

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="container mx-auto p-4 flex justify-center animate-[fadeInUp_0.5s_ease-out_forwards]">
      <div className="w-full max-w-md card-neumo !p-8">
        
        <div id="recaptcha-container"></div>

        {!showOtpInput ? (
          // --- LOGIN FORM ---
          <>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">Login</h1>
            
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  Password
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
              <button 
                type="submit"
                className="w-full mt-4 btn-neumo !text-cyan-500 font-bold text-lg"
              >
                Login
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
              Login with Google
            </button>

            <form onSubmit={handlePhoneLogin} className="space-y-4 mt-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Login with Phone (OTP)
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-3 rounded-lg bg-[var(--bg-base)] shadow-neumo text-[var(--text-primary)]">
                    +91
                  </span>
                  <FormInputWithIcon
                    id="phone"
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<PhoneIcon />}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full btn-neumo !bg-green-600 hover:!bg-green-700 !text-white font-bold text-lg"
              >
                Send OTP
              </button>
            </form>

            <p className="text-center text-[var(--text-secondary)] mt-6">
              Don't have an account? 
              <Link to="/signup" className="text-blue-400 hover:underline ml-1">
                Sign Up
              </Link>
            </p>
          </>
        ) : (
          // --- OTP FORM ---
          <>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">Verify OTP</h1>
            <p className="text-center text-[var(--text-secondary)] mb-4">
              Enter the OTP sent to +91 {phone}
            </p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  Enter OTP
                </label>
                <FormInputWithIcon
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  icon={<LockIcon />}
                />
              </div>
              <button 
                type="submit"
                className="w-full mt-4 btn-neumo !text-cyan-500 font-bold text-lg"
              >
                Verify & Login
              </button>
            </form>
            <button 
              onClick={() => setShowOtpInput(false)}
              className="text-center text-[var(--text-secondary)] mt-4 hover:underline w-full"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;