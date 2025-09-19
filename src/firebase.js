// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWvnNTFhX4RXIepTOARmh3CmGQFcf3r_Q",
  authDomain: "portfolio-f4a66.firebaseapp.com",
  projectId: "portfolio-f4a66",
  storageBucket: "portfolio-f4a66.appspot.com",
  messagingSenderId: "1045990629631",
  appId: "1:1045990629631:web:866d1b1327e9b10359ecca",
  measurementId: "G-YJK61T441C",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// ✅ Initialize analytics only in browser environment
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// ✅ Export all initialized Firebase services
export { auth, db, storage, provider, analytics };
