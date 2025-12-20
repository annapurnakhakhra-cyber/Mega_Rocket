// shiprocket/src/app/components/CheckoutLayout.js

"use client"; 

import React, { useState } from 'react';
import LoginStep from './LoginStep';
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';

const STEPS = {
    LOGIN: 1,
    ADDRESS: 2,
    PAYMENT: 3,
};

const CheckoutLayout = () => {
    const [currentStep, setCurrentStep] = useState(STEPS.LOGIN);
    const [userData, setUserData] = useState(null); 
    const [addressData, setAddressData] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    // 🔴 1. CRITICAL: Item details for Shopify. REPLACE VARIANT_ID and NAME.
    const [initialOrderItems] = useState([{
        // Example product with base price (1250)
        variant_id: 45678901234567, // <--- REPLACE THIS WITH A VALID VARIANT ID
        name: "Shiprocket Integration Service", 
        quantity: 1,
        base_price: 1250 
    }]);

    const handleLoginSuccess = (data) => {
        setUserData(data);
        if (data.address_found) {
            setAddressData(data.address);
        }
        setCurrentStep(STEPS.ADDRESS);
    };

    const handleAddressConfirm = (data) => {
        setAddressData(data);
        setCurrentStep(STEPS.PAYMENT);
    };

    // --- API Call to Simulated MongoDB & Shopify Backend ---
    const handleOrderPlace = async () => {
        
        if (!userData || !addressData || !addressData.paymentDetails) {
            alert("Error: Missing user or payment data.");
            return;
        }

        setIsLoading(true); 

        const orderDataToSend = {
            userId: userData.mobile,
            userName: userData.name,
            shippingAddress: addressData,
            paymentSummary: addressData.paymentDetails,
            orderItems: initialOrderItems, 
            status: "Processing"
        };
        
        const finalTotal = addressData.paymentDetails.totalPayable.toFixed(2);
        
        try {
            const response = await fetch('/api/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDataToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detailedError || errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            
            alert(`✅ Order Placed Successfully! Shopify ID: ${result.shopifyId}. Final Total: ₹${finalTotal}.`);
            
            // Reset state after successful order placement
            setUserData(null);
            setAddressData(null);
            setCurrentStep(STEPS.LOGIN);

        } catch (error) {
            console.error("Error placing order:", error);
            alert(`❌ Order failed due to a server/API error. Details: ${error.message}`);
        } finally {
            setIsLoading(false); 
        }
    };
    // -------------------------------------------------------------

    const renderStep = () => {
        switch (currentStep) {
            case STEPS.LOGIN:
                return <LoginStep onLoginSuccess={handleLoginSuccess} />;
            case STEPS.ADDRESS:
                return (
                    <AddressStep 
                        initialAddress={addressData} 
                        onAddressConfirm={handleAddressConfirm} 
                        userName={userData?.name || "Customer"}
                    />
                );
            case STEPS.PAYMENT:
                return (
                    <PaymentStep 
                        onOrderPlace={handleOrderPlace} 
                        initialOrderItems={initialOrderItems}
                        onFinalizeAddress={setAddressData}
                        isLoading={isLoading} 
                    />
                );
            default:
                return <LoginStep onLoginSuccess={handleLoginSuccess} />;
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                🚀 Custom Fast Checkout ({currentStep}/3)
            </h1>
            
            <div className="bg-white shadow-2xl rounded-xl p-6">
                {renderStep()}
            </div>
            
            {/* 🔴 NEW: Security and Trust Indicators */}
            <div className="mt-6 p-3 bg-white border border-green-200 rounded-lg text-center text-sm shadow-md">
                <p className="font-bold text-green-700">🔒 100% Secure Checkout</p>
                <p className="text-gray-500 mt-1">
                    All payments are encrypted. 7-Day Easy Return Guarantee applies.
                </p>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
                <p>Note: Check your server terminal for Shopify API errors (SHOPIFY ERROR DETAILS).</p>
            </div>
        </div>
    );
};

export default CheckoutLayout;