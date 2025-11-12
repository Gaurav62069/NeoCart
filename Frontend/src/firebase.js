import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 1. Storage ko import karein

// Aapka Firebase config code
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ecommerce-3f906.firebaseapp.com",
  projectId: "ecommerce-3f906",
  storageBucket: "ecommerce-3f906.firebasestorage.app", // 2. Yeh line zaroori hai
  messagingSenderId: "529613184777",
  appId: "1:529613184777:web:af19fb8da03769b952bdd8",
  measurementId: "G-Z2SWXHZLQP"
};

// Firebase ko initialize karein
const app = initializeApp(firebaseConfig);

// Authentication service ko export karein
export const auth = getAuth(app);

// 3. Storage service ko export karein
export const storage = getStorage(app);