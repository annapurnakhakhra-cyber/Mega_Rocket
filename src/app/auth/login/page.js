"use client";
import React, { useState, useEffect } from "react";
import { Mail, ShieldCheck, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OTPLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Check localStorage on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // Immediate redirect if token exists (client-side)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Send OTP (unchanged)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(`OTP sent to ${email}. Check your inbox.`);
        setStep(2);
      } else {
        setError(data.msg || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP → Store in localStorage
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // CHANGED: Use localStorage instead of sessionStorage
        localStorage.setItem("token", data.token || "fake-jwt-token");
        localStorage.setItem("user", JSON.stringify(data.user || { email }));

        setMessage("Login Successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        setError(data.msg || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of your UI (unchanged)
  return (
    <div className="flex items-center h-full justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mt-6 text-gray-800">OTP Login</h1>
          <p className="text-gray-500 mt-2">
            {step === 1
              ? "Enter your email to get a magic code"
              : "Check your inbox for the OTP"}
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition text-lg"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-70"
            >
              {isLoading ? "Sending OTP..." : "Send Magic Code"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-purple-600 font-medium hover:underline">
                Register here
              </Link>
            </p>
          </form>
        ) : (
          /* Step 2: OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength={6}
                className="w-full text-center text-3xl font-bold tracking-widest px-6 py-6 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition"
                placeholder="------"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="w-full text-center text-purple-600 font-medium hover:underline"
            >
              ← Back to Email
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-10 text-xs text-gray-400">
          <p>
            OTP login • Use your registered email • Check inbox for OTP
          </p>
        </div>
      </div>
    </div>
  );
}
