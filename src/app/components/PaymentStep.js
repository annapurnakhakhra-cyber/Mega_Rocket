// shiprocket/src/app/components/PaymentStep.js

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faTimesCircle, faCheckCircle, faQrcode, faTag } from '@fortawesome/free-solid-svg-icons';

// --- SIMULATED DISCOUNT LOGIC (Dynamic Promo Codes) ---
const verifyPromoCode = (code, subtotal) => {
    const defaultDiscount = 50; // Base discount for prepaid orders
    
    const upperCaseCode = code.toUpperCase(); 

    if (upperCaseCode === 'FLAT100') {
        return {
            valid: true,
            amount: 100, // Flat discount of 100
            message: "FLAT100 applied successfully! Saved ₹100.",
        };
    } 
    if (upperCaseCode === 'FESTIVE10') {
        const percentDiscount = Math.min(250, subtotal * 0.10); // 10% off, max ₹250
        return {
            valid: true,
            amount: parseFloat(percentDiscount.toFixed(2)), 
            message: "FESTIVE10 applied! 10% off (Max ₹250).",
        };
    } 
    
    if (code === '') {
        return { valid: true, amount: defaultDiscount, message: "Prepaid discount applied." };
    }

    return {
        valid: false,
        amount: 0,
        message: "Invalid or expired promo code.",
    };
};


// --- SIMULATED ORDER DATA (MODIFIED to accept Dynamic Discount) ---
const getSimulatedOrderData = (isCodSelected, initialOrderItems, appliedDiscountAmount) => {
    const BASE_TOTAL = initialOrderItems.reduce((acc, item) => acc + (item.base_price * item.quantity), 0); 
    
    const SHIPPING_CHARGE = 80;
    const COD_CHARGE = 40;
    const TAX_RATE = 0.05; 

    const subtotal = BASE_TOTAL;
    
    const discount = isCodSelected ? 0 : appliedDiscountAmount; 

    const taxableBase = subtotal - discount;
    const taxAmount = parseFloat((taxableBase * TAX_RATE).toFixed(2));
    
    let finalTotal = taxableBase + SHIPPING_CHARGE + taxAmount;
    
    const paymentFee = isCodSelected ? COD_CHARGE : 0;
    finalTotal += paymentFee;

    return {
        subtotal: subtotal, discount: discount, taxRate: TAX_RATE, taxAmount: taxAmount,
        shipping: { method: 'Standard Shipping (3-5 days)', charge: SHIPPING_CHARGE, isFree: false, },
        paymentFee: paymentFee, isCodSelected: isCodSelected,
        totalPayable: parseFloat(finalTotal.toFixed(2)),
    };
};
// ----------------------------------------------------------------------


// ⭐️ NEW UI/UX COMPONENT: QR Code Overlay ⭐️
const QrCodeOverlay = ({ totalPayable, onGoBack, onOrderPlace, isLoading }) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed

    useEffect(() => {
        if (timeLeft <= 0 || paymentStatus !== 'pending') return;

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, paymentStatus]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const mockUpiData = `upi://pay?pa=mockvpa@bank&pn=Merchant%20Name&mc=1234&tid=TID${Date.now()}&am=${totalPayable.toFixed(2)}&cu=INR`;
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(mockUpiData)}`;
    
    const handleManualConfirm = () => {
        setPaymentStatus('success');
        setTimeout(() => onOrderPlace(), 1000);
    }
    
    let statusIcon, statusText, statusColor;
    if (paymentStatus === 'pending') {
        statusIcon = faQrcode;
        statusText = `Scan the QR code to pay ₹${totalPayable.toFixed(2)}`;
        statusColor = 'text-blue-600';
    } else if (paymentStatus === 'success') {
        statusIcon = faCheckCircle;
        statusText = 'Payment Received! Finalizing order...';
        statusColor = 'text-green-600';
    } else {
        statusIcon = faTimesCircle;
        statusText = 'Payment Expired or Failed. Please retry.';
        statusColor = 'text-red-600';
    }

    return (
        <div className="space-y-6 text-center">
            <button 
                onClick={onGoBack}
                className="flex items-center text-gray-500 hover:text-gray-800 transition duration-150"
                disabled={paymentStatus !== 'pending'}
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Options
            </button>
            
            <h3 className={`text-3xl font-extrabold ${statusColor}`}>
                <FontAwesomeIcon icon={statusIcon} className="mr-3" />
                {statusText}
            </h3>
            
            <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-xl mx-auto max-w-xs">
                 <img src={qrCodeUrl} alt="UPI Payment QR Code" className="w-full h-auto border p-2" />
            </div>
            
            <div className="font-semibold text-gray-700">
                <p>Total Payable: <span className="text-2xl font-bold text-red-600">₹{totalPayable.toFixed(2)}</span></p>
            </div>
            
            <div className={`p-3 rounded-lg font-bold mx-auto w-3/4 ${paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
                {paymentStatus === 'pending' ? (
                    `Time Remaining: ${formattedTime}`
                ) : (
                    'Payment gateway finalized.'
                )}
            </div>
            
            {paymentStatus === 'pending' && (
                 <button
                    onClick={handleManualConfirm} 
                    disabled={isLoading || timeLeft <= 0}
                    className="w-full bg-green-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                            Checking Payment Status...
                        </>
                    ) : (
                        'I have Paid - Confirm Order'
                    )}
                </button>
            )}
        </div>
    );
};
// ----------------------------------------------------------------------


const PaymentStep = ({ onOrderPlace, onFinalizeAddress, isLoading, initialOrderItems }) => {
    const [selectedPayment, setSelectedPayment] = useState('prepaid');
    const [showQrCode, setShowQrCode] = useState(false); 
    
    // ⭐️ NEW DISCOUNT STATES ⭐️
    const [promoCode, setPromoCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState({ 
        amount: 50, // Default prepaid discount
        message: 'Prepaid discount applied.',
        valid: true 
    });

    // 🔴 FIX: Define the banner object here to fix "banner is not defined" error
    const banner = {
        bgColor: '#F74435', 
        textColor: '#FFFFFF',
        text: 'Prepaid 5% discount | COD Rs.40 Extra',
    };
    // -------------------------------------------------------------------

    const isCodSelected = selectedPayment === 'cod';
    const subtotal = initialOrderItems.reduce((acc, item) => acc + (item.base_price * item.quantity), 0); 
    
    const effectiveDiscountAmount = isCodSelected ? 0 : appliedDiscount.amount;
    
    const orderDetails = getSimulatedOrderData(isCodSelected, initialOrderItems, effectiveDiscountAmount);
    const { 
        taxAmount, shipping, paymentFee, totalPayable 
    } = orderDetails;

    // --- EFFECT: Update Parent State on Change ---
    useEffect(() => {
        onFinalizeAddress(prev => ({ ...prev, paymentDetails: orderDetails }));
    }, [isCodSelected, onFinalizeAddress, orderDetails]);
    
    // --- EFFECT: Recalculate default discount when changing payment method ---
    useEffect(() => {
        if (!isCodSelected) {
            if (promoCode === '') {
                 setAppliedDiscount(verifyPromoCode('', subtotal));
            } else {
                 handleApplyPromo();
            }
        } else {
            setAppliedDiscount({ amount: 0, message: "No discount applied for COD.", valid: true });
        }
    }, [isCodSelected]); 


    // ⭐️ NEW HANDLER: Apply Promo Code ⭐️
    const handleApplyPromo = () => {
        if (isCodSelected) {
            alert("Promo codes are only applicable for Prepaid orders.");
            return;
        }
        if (promoCode === '') {
             setAppliedDiscount(verifyPromoCode('', subtotal));
             return;
        }
        
        const result = verifyPromoCode(promoCode, subtotal);
        setAppliedDiscount(result);
    };


    const buttonBg = isCodSelected 
        ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400' 
        : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400';
    
    const buttonText = isCodSelected 
        ? `Confirm COD Order for ₹${totalPayable.toFixed(2)}` 
        : `Pay ₹${totalPayable.toFixed(2)} & Complete Order`;

    const paymentOptions = [
        { id: 'prepaid', label: 'UPI / Card / NetBanking (Recommended)' },
        { id: 'cod', label: 'Cash on Delivery (COD)' },
    ];
    
    const handlePaymentAction = () => {
        if (isCodSelected) {
            onOrderPlace();
        } else {
            setShowQrCode(true);
        }
    };
    
    if (showQrCode) {
        return (
            <QrCodeOverlay 
                totalPayable={totalPayable}
                onGoBack={() => setShowQrCode(false)}
                onOrderPlace={onOrderPlace}
                isLoading={isLoading}
            />
        );
    }

    // --- Default Payment Selection Screen Rendering ---
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-600">Payment Options</h3>

            {/* Dynamic Banner */}
            <div 
                style={{ backgroundColor: banner.bgColor, color: banner.textColor }}
                className="p-3 text-center text-sm font-semibold rounded-lg shadow-md"
            >
                {banner.text}
            </div>
            
            {/* ⭐️ NEW: Discount Input Field ⭐️ */}
            <div className="border p-4 rounded-lg shadow-sm space-y-2">
                <h4 className="font-bold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-500" />
                    Have a Promo Code? (FLAT100 / FESTIVE10)
                </h4>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Enter Code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                        disabled={isCodSelected}
                    />
                    <button
                        onClick={handleApplyPromo}
                        disabled={isLoading || isCodSelected}
                        className={`p-2 rounded-lg font-semibold text-white transition duration-150 ${
                            isCodSelected ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        Apply
                    </button>
                </div>
                {/* Discount Message */}
                <p className={`text-sm ${appliedDiscount.valid ? 'text-green-600' : 'text-red-600'}`}>
                    {appliedDiscount.message}
                </p>
            </div>
            {/* End Discount Input Field */}


            {/* Payment Options Selection */}
            <div className="space-y-3">
                {paymentOptions.map((option) => (
                    <label 
                        key={option.id} 
                        className={`flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPayment === option.id 
                            ? 'border-blue-600 bg-blue-50 shadow-sm' 
                            : 'border-gray-300'
                        }`}
                    >
                        <span className="ml-3 font-medium text-gray-700">{option.label}</span>
                         <input
                            type="radio"
                            name="payment"
                            value={option.id}
                            checked={selectedPayment === option.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                    </label>
                ))}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2 text-sm">
                <p className="flex justify-between font-medium"><span>Subtotal (Items):</span> <span>₹{subtotal.toFixed(2)}</span></p>
                
                <p className="flex justify-between font-medium" style={{ color: effectiveDiscountAmount > 0 ? '#10B981' : '#EF4444' }}>
                    <span>Discount Applied:</span> <span>- ₹{effectiveDiscountAmount.toFixed(2)}</span>
                </p>

                <p className="flex justify-between font-medium text-gray-700">
                    <span>Shipping ({shipping.method}):</span> <span>+ ₹{shipping.charge.toFixed(2)}</span>
                </p>
                <p className="flex justify-between font-medium text-gray-700">
                    <span>Taxes ({(orderDetails.taxRate * 100).toFixed(0)}%):</span> <span>+ ₹{taxAmount.toFixed(2)}</span>
                </p>
                {paymentFee > 0 && (
                    <p className="flex justify-between text-red-600 font-semibold">
                        <span>COD Convenience Fee:</span> <span>+ ₹{paymentFee.toFixed(2)}</span>
                    </p>
                )}
                <p className="flex justify-between text-xl font-extrabold border-t-2 pt-2">
                    <span>Total Payable:</span> <span className="text-red-600">₹{totalPayable.toFixed(2)}</span>
                </p>
            </div>

            <button
                onClick={handlePaymentAction}
                disabled={isLoading}
                className={`w-full text-white p-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center ${buttonBg}`}
            >
                {isLoading ? (
                    <>
                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                        Processing...
                    </>
                ) : (
                    buttonText
                )}
            </button>
        </div>
    );
};

export default PaymentStep;