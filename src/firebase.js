// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBREyWeyCyuO8dfcCXudFBWElGMKKpN1yo",
  authDomain: "radar-app-f0692.firebaseapp.com",
  projectId: "radar-app-f0692",
  storageBucket: "radar-app-f0692.firebasestorage.app",
  messagingSenderId: "76908341956",
  appId: "1:76908341956:web:356301bd13a0a9e285b791",
  measurementId: "G-4EMK76YC3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
