

// app/auth/register/page.tsx
"use client";

import React, { useState } from "react";
import { User, Mail, Store, Link2, Key, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; // Optional: better than alert()

export default function ShopAdminRegister() {
  const [showToken, setShowToken] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    shopName: "",
    shopUrl: "",
    accessToken: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminName: formData.adminName.trim(),
          email: formData.email.trim().toLowerCase(),
          shopName: formData.shopName.trim(),
          shopUrl: formData.shopUrl.trim().toLowerCase().replace("https://", "").replace("http://", ""),
          accessToken: formData.accessToken.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.message || "Registration failed. Please try again.";
        setError(errMsg);
        toast.error(errMsg);
        return;
      }

      // Success
      setMessage("Store connected successfully! 🎉");
      toast.success("Registration successful! Redirecting...");
      
      setTimeout(() => {
        router.push("/auth/login"); // or dashboard if auto-login
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);
      const errMsg = "Network error. Please check your connection and try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/30">

            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Shop Admin Registration</h1>
              <p className="text-gray-600 mt-3 text-lg">Connect your Shopify store securely</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-center font-medium flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Admin Name */}
              <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Admin Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@yourstore.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base"
                />
              </div>

              {/* Shop Name */}
              <div className="relative">
                <Store className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Your Store Name (e.g. My Fashion Hub)"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base"
                />
              </div>

              {/* Shop URL */}
              <div className="relative">
                <Link2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="shopUrl"
                  value={formData.shopUrl}
                  onChange={handleChange}
                  placeholder="your-store.myshopify.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium text-base lowercase"
                />
                <small className="block mt-2 text-gray-500 ml-12">
                  Enter your Shopify store URL (without https://)
                </small>
              </div>

              {/* Access Token */}
              <div className="relative">
                <Key className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type={showToken ? "text" : "password"}
                  name="accessToken"
                  value={formData.accessToken}
                  onChange={handleChange}
                  placeholder="Admin API Access Token (x-shopify-access-token)"
                  required
                  className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all text-gray-800 font-mono text-sm tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition"
                >
                  {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Security Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <strong>Secure Connection:</strong> Your Access Token is encrypted and never stored in plain text. 
                  Required for reading orders, customers, and products.
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transform hover:scale-[1.02] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Connecting to Shopify...</>
                ) : (
                  <>
                    Register & Connect Store
                    <CheckCircle className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already registered?{" "}
                <Link href="/auth/login" className="text-indigo-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

            {/* Help */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Need help finding your <strong>Admin API Access Token</strong>?{" "}
                <a href="https://www.youtube.com/results?search_query=shopify+admin+api+access+token" target="_blank" className="text-indigo-600 hover:underline font-medium">
                  Watch 30-second guide
                </a>
              </p>
            </div>
          </div>

          <p className="text-center mt-8 text-gray-500 text-sm">
            © 2025 Fastrr Checkout • End-to-end encrypted • GDPR Compliant
          </p>
        </div>
      </div>
    </>
  );
}