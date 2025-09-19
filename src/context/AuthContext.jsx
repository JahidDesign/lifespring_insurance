// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  getIdToken,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_BACKEND_URL || "https://insurances-lmy8.onrender.com";
  const MAIN_ADMIN_EMAIL = "jhadam904@gmail.com";

  // Persist user & token
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [user, token]);

  // Sync Firebase user with backend
  const syncWithBackend = useCallback(
    async (firebaseUser) => {
      if (!firebaseUser) return; // Do nothing if no user

      try {
        const idToken = await getIdToken(firebaseUser, true);
        const res = await fetch(`${API_URL}/customer/firebase-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        if (!res.ok) throw new Error("Backend login failed");
        const data = await res.json();

        let updatedUser = data.user;
        if (updatedUser?.email === MAIN_ADMIN_EMAIL) updatedUser.role = "admin";

        setUser(updatedUser);
        setToken(data.token);
      } catch (err) {
        console.error("❌ Backend sync error:", err);
        // ❌ DO NOT logout on error
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Firebase auth listener
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) await syncWithBackend(firebaseUser);
        else setLoading(false); // Do NOT logout
      });
      return () => unsubscribe();
    });
  }, [syncWithBackend]);

  // Google login
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) await syncWithBackend(result.user);
      toast.success("Login successful");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      toast.error("Login failed");
    }
  };

  // Manual login
  const login = (userData, jwtToken) => {
    if (userData?.email === MAIN_ADMIN_EMAIL) userData.role = "admin";
    setUser(userData);
    setToken(jwtToken);
  };

  // Manual logout only
  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loginWithGoogle,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === "admin",
        role: user?.role || "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
