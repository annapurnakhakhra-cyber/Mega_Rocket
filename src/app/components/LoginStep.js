// shiprocket/src/app/components/LoginStep.js - (Same as before, using the /api/user-data endpoint)

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoginStep = ({ onLoginSuccess }) => {
    const [mobile, setMobile] = useState('9876543210'); 
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async () => {
        if (mobile.length !== 10) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        
        setIsOtpSent(true); 
        alert(`DEMO: OTP sent to +91 ${mobile}. Use 1234 to verify. Check server console for dynamic DB attempt.`); 
        setIsLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (otp !== '1234') { 
            alert('Invalid OTP. Please use 1234.');
            return;
        }
        setIsLoading(true);
        
        // ⭐️ DYNAMIC DATA FETCHING LOGIC (API Call) ⭐️
        try {
            const response = await fetch('/api/user-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: mobile }) // Send the mobile number to API
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user data from API.');
            }

            const userData = await response.json(); 
            
            console.log("✅ Dynamic User Data Received:", userData);
            
            onLoginSuccess(userData);

        } catch (error) {
            console.error("Login verification failed:", error);
            alert(`Login Failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-600">
                {isOtpSent ? 'Verify OTP' : 'Quick Login'}
            </h3>
            
            {!isOtpSent ? (
                <div className="space-y-4">
                    <input
                        type="tel"
                        className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="10 digit Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        maxLength={10}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendOtp}
                        disabled={isLoading || mobile.length !== 10}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center shadow-md"
                    >
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : 'Get OTP & Auto-fill'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-center tracking-widest focus:ring-green-500 focus:border-green-500"
                        placeholder="XXXX"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={4}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otp.length !== 4}
                        className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center shadow-md"
                    >
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : 'Verify OTP'}
                    </button>
                    <button 
                        onClick={() => setIsOtpSent(false)} 
                        className="w-full text-blue-600 text-sm mt-2 hover:underline"
                    >
                        Change Number
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginStep;