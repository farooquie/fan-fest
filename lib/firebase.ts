import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVJkXwlrEtQHuB1WSNjgTZ-1A5cZE_sqU",
  authDomain: "fan-fest-6b640.firebaseapp.com",
  projectId: "fan-fest-6b640",
  storageBucket: "fan-fest-6b640.firebasestorage.app",
  messagingSenderId: "989473193408",
  appId: "1:989473193408:web:dff675ff2405e269c59c25",
  measurementId: "G-T03JV3DP7Q"
};

// Initialize Firebase (safely check for server-side hot reloading)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
