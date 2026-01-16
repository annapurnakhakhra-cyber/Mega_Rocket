"use client";
// src/app/(auth)/login/page.jsx
import React, { useState } from 'react';
import { Mail, ShieldCheck, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OTPLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = email, 2 = otp
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Mock correct OTP (for demo only)
  const MOCK_OTP = '123456';

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate email format
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    setMessage(`OTP sent to ${email}! (Demo: Use 123456)`);
    setStep(2);
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === MOCK_OTP) {
      // Fake login success
      sessionStorage.setItem('token', 'fake-jwt-token-for-demo');
      sessionStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));

      // Success message
      setMessage('Login Successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } else {
      setError('Invalid OTP. Try: 123456');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mt-6 text-gray-800">OTP Login</h1>
          <p className="text-gray-500 mt-2">
            {step === 1 
              ? 'Enter your email to get a magic code' 
              : 'Check your inbox (it’s 123456 😉)'}
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
              {isLoading ? 'Sending OTP...' : 'Send Magic Code'}
            </button>
          </form>
        ) : (
          /* Step 2: OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP (Hint: 123456)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full text-center text-3xl font-bold tracking-widest letter-spacing-4 px-6 py-6 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition"
                placeholder="------"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
                setError('');
                setMessage('');
              }}
              className="w-full text-center text-purple-600 font-medium hover:underline"
            >
              ← Back to Email
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-10 text-xs text-gray-400">
          <p>This is a demo login • Use any email • OTP is always <span className="font-bold text-purple-600">123456</span></p>
        </div>
      </div>
    </div>
  );
}