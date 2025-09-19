import React, { useState, useEffect, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock, Shield, Chrome, ArrowRight, Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://insurances-lmy8.onrender.com";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Initial page loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }
    return res.json();
  };

  const handleLogin = async e => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password)
      return Swal.fire("Missing fields", "Email and password required.", "warning");

    setLoading(true);
    try {
      const loginData = await loginUser(email, password);
      login(loginData.user, loginData.token);
      Swal.fire("Welcome!", "Logged in successfully.", "success").then(() => navigate("/"));
    } catch (err) {
      console.error(err);
      Swal.fire("Login Failed", err.message || "Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user.email)
        return Swal.fire("Google account has no email", "Please use another account.", "error");

      const res = await fetch(`${API_URL}/customer/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Google login failed");
      }

      const loginData = await res.json();
      login(loginData.user, loginData.token);
      Swal.fire("Welcome!", "Signed in with Google!", "success").then(() => navigate("/"));
    } catch (err) {
      console.error(err);
      Swal.fire("Google Sign-in Failed", err.message || "Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 animate-ping"></div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to LifeSecure</h2>
          <p className="text-gray-600">Securing your future, one step at a time</p>
        </div>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/background-login.jpg')" }}
    >
      <Helmet>
        <title>Login | Smart Insurance</title>
        <meta
          name="description"
          content="Login to your Smart Insurance account to manage policies, claims, and payments securely."
        />
        <meta
          name="keywords"
          content="login, smart insurance, customer portal, policies, claims"
        />
        <link rel="icon" href="insurance.png" sizes="any" />
        <link rel="icon" type="image/png" href="insurance.png" />
        <link rel="apple-touch-icon" href="insurance.png" />
      </Helmet>

      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Mail className="w-4 h-4" /> <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pl-10 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Lock className="w-4 h-4" /> <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pl-10 pr-10 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">— or —</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:transform-none shadow-sm"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            <span>Sign in with Google</span>
          </button>

          <p className="text-center text-gray-600 pt-4">
            No account?{" "}
            <NavLink
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors underline"
            >
              Register
            </NavLink>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
