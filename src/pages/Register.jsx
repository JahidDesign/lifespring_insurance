import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://insurances-lmy8.onrender.com";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ---------------- Validation ----------------
  const validateField = (name, value) => {
    let error = "";
    if (name === "name" && (!value.trim() || value.trim().length < 2)) {
      error = "Name must be at least 2 characters.";
    }
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      error = "Invalid email address.";
    }
    if (
      name === "password" &&
      !/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(value)
    ) {
      error =
        "Password must be at least 6 characters with upper and lower case letters.";
    }
    if (name === "photo" && value.trim()) {
      try {
        new URL(value);
      } catch {
        error = "Invalid photo URL.";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // ---------------- Backend Calls ----------------
  const saveUserToBackend = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save user");
      return data;
    } catch (err) {
      console.error("Backend Save Error:", err.message);
      throw err;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data;
    } catch (err) {
      console.error("Backend Login Error:", err.message);
      throw err;
    }
  };

  const googleLogin = async (uid, email, name, photo) => {
    try {
      const res = await fetch(`${API_URL}/customer/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email, name, photo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google login failed");
      return data;
    } catch (err) {
      console.error("Google Login Backend Error:", err.message);
      throw err;
    }
  };

  // ---------------- Submit Registration ----------------
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields
    const currentErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) currentErrors[key] = err;
    });
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) return;

    setLoading(true);
    try {
      // 1️⃣ Firebase Auth create
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name,
        ...(formData.photo ? { photoURL: formData.photo } : {}),
      });

      // 2️⃣ Save in backend
      await saveUserToBackend({
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photo: formData.photo,
        phone: formData.phone,
        role: "customer",
        status: "active",
      });

      // 3️⃣ Login backend
      const loginData = await loginUser(formData.email, formData.password);
      login(loginData.user, loginData.token);

      Swal.fire("Success!", "Account created successfully.", "success").then(() =>
        navigate("/")
      );
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        Swal.fire("Email already in use", "Try logging in.", "warning");
      } else {
        Swal.fire("Error", err.message || "Something went wrong.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Google Sign Up ----------------
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        Swal.fire(
          "Google account has no email",
          "Please use another account.",
          "error"
        );
        return;
      }

      const loginData = await googleLogin(
        user.uid,
        user.email,
        user.displayName || "Google User",
        user.photoURL
      );
      login(loginData.user, loginData.token);

      Swal.fire("Welcome!", "Signed in with Google!", "success").then(() =>
        navigate("/")
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Google Sign-in Failed", err.message || "Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-400 via-blue-300 to-pink-300 justify-center items-center px-4">
      <Helmet>
        <title>Register | Smart Insurance</title>
        <meta
          name="description"
          content="Create an account with Smart Insurance to manage policies, claims, and get secure support."
        />
        <meta
          name="keywords"
          content="register, sign up, smart insurance, create account, policies"
        />
        <link rel="icon" href="insurance.png" sizes="any" />
      </Helmet>

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join our platform to get started</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {["name", "email", "photo", "phone"].map((field) => (
            <div key={field}>
              <input
                name={field}
                type={
                  field === "email" ? "email" : field === "photo" ? "url" : "text"
                }
                placeholder={
                  field === "name"
                    ? "Full Name"
                    : field === "email"
                    ? "Email Address"
                    : field === "photo"
                    ? "Photo URL (Optional)"
                    : "Phone Number (Optional)"
                }
                value={formData[field]}
                onChange={handleChange}
                disabled={loading}
                className={`w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full border px-4 py-3 rounded-xl pr-10 focus:outline-none focus:ring-2 transition-all ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium flex justify-center items-center gap-2 hover:opacity-90 transition-all"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            )}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">— or —</div>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <FcGoogle size={22} /> Sign Up with Google
        </button>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <NavLink to="/login" className="text-purple-600 underline">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
