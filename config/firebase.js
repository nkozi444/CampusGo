// config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBROiDalp_KLwaKvUCwpdgDfJUjDmYl908",
  authDomain: "campusgo-57be2.firebaseapp.com",
  projectId: "campusgo-57be2",
  storageBucket: "campusgo-57be2.firebasestorage.app",
  messagingSenderId: "1057287710605",
  appId: "1:1057287710605:web:01c5d55a4021d838167fc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
