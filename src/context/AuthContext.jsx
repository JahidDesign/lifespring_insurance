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

// Create Context
export const AuthContext = createContext();

// Define Agent roles
const AGENT_ROLES = ["agent", "a", "b", "c", "d", "e"]; // adjust roles as needed

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

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [user, token]);

  const syncWithBackend = useCallback(
    async (firebaseUser) => {
      if (!firebaseUser) return;
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

        // Assign roles
        if (updatedUser?.email === MAIN_ADMIN_EMAIL) updatedUser.role = "admin";
        else if (AGENT_ROLES.includes(updatedUser?.role)) updatedUser.role = "agent";
        else updatedUser.role = "customer";

        setUser(updatedUser);
        setToken(data.token);
      } catch (err) {
        console.error("❌ Backend sync error:", err);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) await syncWithBackend(firebaseUser);
        else setLoading(false);
      });
      return () => unsubscribe();
    });
  }, [syncWithBackend]);

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

  const login = (userData, jwtToken) => {
    if (userData?.email === MAIN_ADMIN_EMAIL) userData.role = "admin";
    else if (AGENT_ROLES.includes(userData?.role)) userData.role = "agent";
    else userData.role = "customer";

    setUser(userData);
    setToken(jwtToken);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("❌ Firebase sign out failed:", err);
    }
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
        isAgent: user?.role === "agent",
        role: user?.role || "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
