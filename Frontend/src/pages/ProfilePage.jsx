import React, { useState, useEffect } from 'react';
// Yeh import path aapke file structure ke hisab se 'context' (singular) hai
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import FormInputWithIcon from '../components/FormInputWithIcon.jsx'; // Aapka component

// --- Aapke Icons ---
const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);
const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.63-1.39-4.823-3.583-6.213-6.213l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);
const LocationIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const EmailIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);
// --- Icons End ---

// Cloudinary details
const CLOUDINARY_CLOUD_NAME = "ddnpzsybs";
const CLOUDINARY_UPLOAD_PRESET = "my_ecom_preset";
// const API_BASE_URL = window.location.origin + "/api";

function ProfilePage() {
  // --- FIX 1: 'setUser' ki jagah 'loginAction' ko import karo ---
  const { user, loginAction } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [dpUrl, setDpUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setDpUrl(user.dp_url || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    toast.loading('Uploading image...');
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: uploadData }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || 'Cloudinary upload failed');
      setDpUrl(data.secure_url);
      toast.dismiss();
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.dismiss();
      toast.error(error.message || 'Image upload failed.');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = { ...formData, dp_url: dpUrl };
    try {
      // Axios ko custom config (axiosConfig.js) ki zaroorat nahi hai
      // agar aapne base URL set nahi kiya hai.
      const response = await axios.put(`http://localhost:8000/api/users/me`, profileData);
      
      // --- FIX 2: Naya token milne par 'loginAction' ko call karo ---
      // Yeh AuthContext ko trigger karega naye token se user ko refresh karne ke liye.
      loginAction(response.data.access_token);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.detail || "Failed to update profile.");
    }
  };

  if (!user) {
    return <p className="text-center text-xl text-[var(--text-secondary)] p-10">Loading profile...</p>;
  }

  // --- Baaki aapka UI (JSX) code bilkul sahi hai ---
  return (
    <div className="container mx-auto p-4 max-w-2xl animate-[fadeInUp_0.5s_ease-out_forwards]">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Your Profile</h1>
      
      <div className="card-neumo !p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex items-center gap-4">
            <img
              src={dpUrl || `https://ui-avatars.com/api/?name=${user.email.charAt(0)}&background=805ad5&color=fff&size=80`}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover p-1 shadow-neumo-inset"
            />
            <div>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{formData.name || user.email.split('@')[0]}</h2>
              <p className="text-[var(--text-secondary)]">{user.email}</p>
              <label className="text-sm text-blue-400 hover:underline cursor-pointer">
                Change Picture
                <input 
                  type="file" 
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
          
          <hr className="border-[var(--neumo-dark-shadow)]" />

          {/* Email (Disabled) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Email (Cannot be changed)
            </label>
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] opacity-50">
                <EmailIcon className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                id="email" 
                className="input-neumo !pl-10 !bg-[var(--bg-base)] text-[var(--text-secondary)] cursor-not-allowed opacity-70" 
                value={user.email}
                disabled
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Full Name
            </label>
            <FormInputWithIcon
              id="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleInputChange}
              icon={<UserIcon />}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Phone Number
            </label>
            <FormInputWithIcon
              id="phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              icon={<PhoneIcon />}
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              Shipping Address
            </label>
            <FormInputWithIcon
              id="address"
              type="text"
              placeholder="Your shipping address"
              value={formData.address}
              onChange={handleInputChange}
              icon={<LocationIcon />}
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-4 btn-neumo !text-cyan-500 font-bold text-lg"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;