module.exports = [
"[project]/shiprocket/src/app/components/LoginStep.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// shiprocket/src/app/components/LoginStep.js - (Same as before, using the /api/user-data endpoint)
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/react-fontawesome/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
const LoginStep = ({ onLoginSuccess })=>{
    // Setting a default number for easy testing, but this should be dynamic
    const [mobile, setMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('9876543210');
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isOtpSent, setIsOtpSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSendOtp = async ()=>{
        if (mobile.length !== 10) return;
        setIsLoading(true);
        // Simulate OTP sending delay
        await new Promise((resolve)=>setTimeout(resolve, 1500));
        setIsOtpSent(true);
        alert(`DEMO: OTP sent to +91 ${mobile}. Use 1234 to verify. Check server console for dynamic DB attempt.`);
        setIsLoading(false);
    };
    const handleVerifyOtp = async ()=>{
        if (otp !== '1234') {
            alert('Invalid OTP. Please use 1234.');
            return;
        }
        setIsLoading(true);
        // ⭐️ DYNAMIC DATA FETCHING LOGIC (API Call) ⭐️
        try {
            const response = await fetch('/api/user-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mobile: mobile
                }) // Send the mobile number to API
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user data from API.');
            }
            // 🟢 SUCCESS: Receive dynamic data from the API
            const userData = await response.json();
            console.log("✅ Dynamic User Data Received:", userData);
            onLoginSuccess(userData);
        } catch (error) {
            console.error("Login verification failed:", error);
            alert(`Login Failed: ${error.message}`);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-2xl font-bold text-blue-600",
                children: isOtpSent ? 'Verify OTP' : 'Quick Login'
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                lineNumber: 62,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            !isOtpSent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "tel",
                        className: "w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500",
                        placeholder: "10 digit Mobile Number",
                        value: mobile,
                        onChange: (e)=>setMobile(e.target.value),
                        maxLength: 10,
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 68,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSendOtp,
                        disabled: isLoading || mobile.length !== 10,
                        className: "w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center shadow-md",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faSpinner"],
                            spin: true,
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                            lineNumber: 82,
                            columnNumber: 38
                        }, ("TURBOPACK compile-time value", void 0)) : 'Get OTP & Auto-fill'
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 77,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                lineNumber: 67,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: "w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-center tracking-widest focus:ring-green-500 focus:border-green-500",
                        placeholder: "XXXX",
                        value: otp,
                        onChange: (e)=>setOtp(e.target.value),
                        maxLength: 4,
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 87,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleVerifyOtp,
                        disabled: isLoading || otp.length !== 4,
                        className: "w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center shadow-md",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faSpinner"],
                            spin: true,
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                            lineNumber: 101,
                            columnNumber: 38
                        }, ("TURBOPACK compile-time value", void 0)) : 'Verify OTP'
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 96,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsOtpSent(false),
                        className: "w-full text-blue-600 text-sm mt-2 hover:underline",
                        children: "Change Number"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 103,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                lineNumber: 86,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
        lineNumber: 61,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = LoginStep;
}),
"[project]/shiprocket/src/app/components/AddressStep.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// shiprocket/src/app/components/AddressStep.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
// --- External Data: Comprehensive Country List ---
const COUNTRIES = [
    {
        code: '',
        name: 'Select Country/Region *'
    },
    {
        code: 'IN',
        name: 'India'
    },
    {
        code: 'US',
        name: 'United States'
    },
    {
        code: 'GB',
        name: 'United Kingdom'
    },
    {
        code: 'CA',
        name: 'Canada'
    },
    {
        code: 'AU',
        name: 'Australia'
    },
    {
        code: 'DE',
        name: 'Germany'
    },
    {
        code: 'FR',
        name: 'France'
    },
    {
        code: 'AE',
        name: 'United Arab Emirates'
    },
    {
        code: 'SG',
        name: 'Singapore'
    }
];
// ------------------------------------------------
const AddressStep = ({ initialAddress, onAddressConfirm, userName })=>{
    // Expanded state structure to handle all address fields
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialAddress || {
        country: '',
        first_name: '',
        last_name: '',
        line1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        saveInfo: true
    });
    const handleChange = (e)=>{
        const { name, value, type, checked } = e.target;
        setAddress((prev)=>({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        // Input validation check for required fields
        if (!address.country || address.country === '' || !address.first_name || !address.last_name || !address.line1 || !address.city || !address.state || !address.pincode) {
            alert('Please fill in all required address fields (marked with *), including Country/Region.');
            return;
        }
        onAddressConfirm(address);
    };
    // Check if initialAddress exists and has the primary address line to confirm auto-fill
    const isAddressAutoFilled = initialAddress && initialAddress.line1 !== '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-2xl font-bold text-blue-600",
                children: "Delivery Address"
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 61,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            isAddressAutoFilled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-sm font-semibold",
                children: [
                    "👋 Welcome back, ",
                    userName,
                    "! Your address is auto-filled."
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 65,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                name: "country",
                value: address.country,
                onChange: handleChange,
                className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                required: true,
                children: COUNTRIES.map((country)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: country.code,
                        disabled: country.code === '',
                        children: country.name
                    }, country.code, false, {
                        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                        lineNumber: 79,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 71,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        name: "first_name",
                        placeholder: "First Name *",
                        value: address.first_name,
                        onChange: handleChange,
                        className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                        lineNumber: 91,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        name: "last_name",
                        placeholder: "Last Name *",
                        value: address.last_name,
                        onChange: handleChange,
                        className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                        lineNumber: 97,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 90,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                name: "line1",
                placeholder: "Address (Street, House No., Locality) *",
                value: address.line1,
                onChange: handleChange,
                className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                required: true
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 106,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                name: "address2",
                placeholder: "Apartment, suite, building, etc. (Optional)",
                value: address.address2,
                onChange: handleChange,
                className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 117,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        name: "city",
                        placeholder: "City *",
                        value: address.city,
                        onChange: handleChange,
                        className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                        lineNumber: 128,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        name: "state",
                        placeholder: "State *",
                        value: address.state,
                        onChange: handleChange,
                        className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                        lineNumber: 134,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 127,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "text",
                name: "pincode",
                placeholder: "Pincode *",
                value: address.pincode,
                onChange: handleChange,
                className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                required: true
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 141,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center pt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        id: "saveInfo",
                        name: "saveInfo",
                        checked: address.saveInfo,
                        onChange: handleChange,
                        className: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                        lineNumber: 150,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "saveInfo",
                        className: "ml-2 block text-base text-gray-900 font-medium",
                        children: "Save this information for next time"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                        lineNumber: 158,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 149,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "submit",
                className: "w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 mt-6",
                children: "Proceed to Payment"
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
                lineNumber: 163,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
        lineNumber: 60,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = AddressStep;
}),
"[project]/shiprocket/src/app/components/PaymentStep.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// shiprocket/src/app/components/PaymentStep.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/react-fontawesome/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
// --- SIMULATED DISCOUNT LOGIC (Dynamic Promo Codes) ---
const verifyPromoCode = (code, subtotal)=>{
    const defaultDiscount = 50; // Base discount for prepaid orders
    const upperCaseCode = code.toUpperCase();
    if (upperCaseCode === 'FLAT100') {
        return {
            valid: true,
            amount: 100,
            message: "FLAT100 applied successfully! Saved ₹100."
        };
    }
    if (upperCaseCode === 'FESTIVE10') {
        const percentDiscount = Math.min(250, subtotal * 0.10); // 10% off, max ₹250
        return {
            valid: true,
            amount: parseFloat(percentDiscount.toFixed(2)),
            message: "FESTIVE10 applied! 10% off (Max ₹250)."
        };
    }
    if (code === '') {
        return {
            valid: true,
            amount: defaultDiscount,
            message: "Prepaid discount applied."
        };
    }
    return {
        valid: false,
        amount: 0,
        message: "Invalid or expired promo code."
    };
};
// --- SIMULATED ORDER DATA (MODIFIED to accept Dynamic Discount) ---
const getSimulatedOrderData = (isCodSelected, initialOrderItems, appliedDiscountAmount)=>{
    const BASE_TOTAL = initialOrderItems.reduce((acc, item)=>acc + item.base_price * item.quantity, 0);
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
        subtotal: subtotal,
        discount: discount,
        taxRate: TAX_RATE,
        taxAmount: taxAmount,
        shipping: {
            method: 'Standard Shipping (3-5 days)',
            charge: SHIPPING_CHARGE,
            isFree: false
        },
        paymentFee: paymentFee,
        isCodSelected: isCodSelected,
        totalPayable: parseFloat(finalTotal.toFixed(2))
    };
};
// ----------------------------------------------------------------------
// ⭐️ NEW UI/UX COMPONENT: QR Code Overlay ⭐️
const QrCodeOverlay = ({ totalPayable, onGoBack, onOrderPlace, isLoading })=>{
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(300); // 5 minutes in seconds
    const [paymentStatus, setPaymentStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('pending'); // pending, success, failed
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (timeLeft <= 0 || paymentStatus !== 'pending') return;
        const timerId = setInterval(()=>{
            setTimeLeft((prevTime)=>prevTime - 1);
        }, 1000);
        return ()=>clearInterval(timerId);
    }, [
        timeLeft,
        paymentStatus
    ]);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const mockUpiData = `upi://pay?pa=mockvpa@bank&pn=Merchant%20Name&mc=1234&tid=TID${Date.now()}&am=${totalPayable.toFixed(2)}&cu=INR`;
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(mockUpiData)}`;
    const handleManualConfirm = ()=>{
        setPaymentStatus('success');
        setTimeout(()=>onOrderPlace(), 1000);
    };
    let statusIcon, statusText, statusColor;
    if (paymentStatus === 'pending') {
        statusIcon = __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faQrcode"];
        statusText = `Scan the QR code to pay ₹${totalPayable.toFixed(2)}`;
        statusColor = 'text-blue-600';
    } else if (paymentStatus === 'success') {
        statusIcon = __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faCheckCircle"];
        statusText = 'Payment Received! Finalizing order...';
        statusColor = 'text-green-600';
    } else {
        statusIcon = __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faTimesCircle"];
        statusText = 'Payment Expired or Failed. Please retry.';
        statusColor = 'text-red-600';
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onGoBack,
                className: "flex items-center text-gray-500 hover:text-gray-800 transition duration-150",
                disabled: paymentStatus !== 'pending',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faArrowLeft"],
                        className: "mr-2"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 120,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Back to Options"
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 115,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: `text-3xl font-extrabold ${statusColor}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                        icon: statusIcon,
                        className: "mr-3"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 125,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    statusText
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 124,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-white border border-gray-100 rounded-lg shadow-xl mx-auto max-w-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: qrCodeUrl,
                    alt: "UPI Payment QR Code",
                    className: "w-full h-auto border p-2"
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                    lineNumber: 130,
                    columnNumber: 18
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 129,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "font-semibold text-gray-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: [
                        "Total Payable: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-2xl font-bold text-red-600",
                            children: [
                                "₹",
                                totalPayable.toFixed(2)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                            lineNumber: 134,
                            columnNumber: 35
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                    lineNumber: 134,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 133,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `p-3 rounded-lg font-bold mx-auto w-3/4 ${paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`,
                children: paymentStatus === 'pending' ? `Time Remaining: ${formattedTime}` : 'Payment gateway finalized.'
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 137,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            paymentStatus === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleManualConfirm,
                disabled: isLoading || timeLeft <= 0,
                className: "w-full bg-green-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center shadow-lg",
                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faSpinner"],
                            spin: true,
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                            lineNumber: 153,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0)),
                        "Checking Payment Status..."
                    ]
                }, void 0, true) : 'I have Paid - Confirm Order'
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 146,
                columnNumber: 18
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
        lineNumber: 114,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
// ----------------------------------------------------------------------
const PaymentStep = ({ onOrderPlace, onFinalizeAddress, isLoading, initialOrderItems })=>{
    const [selectedPayment, setSelectedPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('prepaid');
    const [showQrCode, setShowQrCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // ⭐️ NEW DISCOUNT STATES ⭐️
    const [promoCode, setPromoCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [appliedDiscount, setAppliedDiscount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        amount: 50,
        message: 'Prepaid discount applied.',
        valid: true
    });
    // 🔴 FIX: Define the banner object here to fix "banner is not defined" error
    const banner = {
        bgColor: '#F74435',
        textColor: '#FFFFFF',
        text: 'Prepaid 5% discount | COD Rs.40 Extra'
    };
    // -------------------------------------------------------------------
    const isCodSelected = selectedPayment === 'cod';
    const subtotal = initialOrderItems.reduce((acc, item)=>acc + item.base_price * item.quantity, 0);
    const effectiveDiscountAmount = isCodSelected ? 0 : appliedDiscount.amount;
    const orderDetails = getSimulatedOrderData(isCodSelected, initialOrderItems, effectiveDiscountAmount);
    const { taxAmount, shipping, paymentFee, totalPayable } = orderDetails;
    // --- EFFECT: Update Parent State on Change ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        onFinalizeAddress((prev)=>({
                ...prev,
                paymentDetails: orderDetails
            }));
    }, [
        isCodSelected,
        onFinalizeAddress,
        orderDetails
    ]);
    // --- EFFECT: Recalculate default discount when changing payment method ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isCodSelected) {
            if (promoCode === '') {
                setAppliedDiscount(verifyPromoCode('', subtotal));
            } else {
                handleApplyPromo();
            }
        } else {
            setAppliedDiscount({
                amount: 0,
                message: "No discount applied for COD.",
                valid: true
            });
        }
    }, [
        isCodSelected
    ]);
    // ⭐️ NEW HANDLER: Apply Promo Code ⭐️
    const handleApplyPromo = ()=>{
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
    const buttonBg = isCodSelected ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400' : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400';
    const buttonText = isCodSelected ? `Confirm COD Order for ₹${totalPayable.toFixed(2)}` : `Pay ₹${totalPayable.toFixed(2)} & Complete Order`;
    const paymentOptions = [
        {
            id: 'prepaid',
            label: 'UPI / Card / NetBanking (Recommended)'
        },
        {
            id: 'cod',
            label: 'Cash on Delivery (COD)'
        }
    ];
    const handlePaymentAction = ()=>{
        if (isCodSelected) {
            onOrderPlace();
        } else {
            setShowQrCode(true);
        }
    };
    if (showQrCode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(QrCodeOverlay, {
            totalPayable: totalPayable,
            onGoBack: ()=>setShowQrCode(false),
            onOrderPlace: onOrderPlace,
            isLoading: isLoading
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 255,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    // --- Default Payment Selection Screen Rendering ---
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-2xl font-bold text-blue-600",
                children: "Payment Options"
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 267,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: banner.bgColor,
                    color: banner.textColor
                },
                className: "p-3 text-center text-sm font-semibold rounded-lg shadow-md",
                children: banner.text
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 270,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border p-4 rounded-lg shadow-sm space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-bold text-gray-800 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faTag"],
                                className: "mr-2 text-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 280,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Have a Promo Code? (FLAT100 / FESTIVE10)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 279,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Enter Code",
                                value: promoCode,
                                onChange: (e)=>setPromoCode(e.target.value),
                                className: "flex-grow p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                                disabled: isCodSelected
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 284,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleApplyPromo,
                                disabled: isLoading || isCodSelected,
                                className: `p-2 rounded-lg font-semibold text-white transition duration-150 ${isCodSelected ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`,
                                children: "Apply"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 292,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 283,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-sm ${appliedDiscount.valid ? 'text-green-600' : 'text-red-600'}`,
                        children: appliedDiscount.message
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 303,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 278,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: paymentOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: `flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPayment === option.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-300'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-3 font-medium text-gray-700",
                                children: option.label
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 321,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: "payment",
                                value: option.id,
                                checked: selectedPayment === option.id,
                                onChange: (e)=>setSelectedPayment(e.target.value),
                                className: "h-5 w-5 text-blue-600 focus:ring-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 322,
                                columnNumber: 26
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, option.id, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 313,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 311,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t pt-4 space-y-2 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Subtotal (Items):"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 336,
                                columnNumber: 65
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "₹",
                                    subtotal.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 336,
                                columnNumber: 96
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 336,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium",
                        style: {
                            color: effectiveDiscountAmount > 0 ? '#10B981' : '#EF4444'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Discount Applied:"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 339,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "- ₹",
                                    effectiveDiscountAmount.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 339,
                                columnNumber: 52
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 338,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium text-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Shipping (",
                                    shipping.method,
                                    "):"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 343,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "+ ₹",
                                    shipping.charge.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 343,
                                columnNumber: 64
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 342,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium text-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Taxes (",
                                    (orderDetails.taxRate * 100).toFixed(0),
                                    "%):"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 346,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "+ ₹",
                                    taxAmount.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 346,
                                columnNumber: 86
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 345,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    paymentFee > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between text-red-600 font-semibold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "COD Convenience Fee:"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 350,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "+ ₹",
                                    paymentFee.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 350,
                                columnNumber: 59
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 349,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between text-xl font-extrabold border-t-2 pt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Total Payable:"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 354,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-red-600",
                                children: [
                                    "₹",
                                    totalPayable.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 354,
                                columnNumber: 49
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 353,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 335,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handlePaymentAction,
                disabled: isLoading,
                className: `w-full text-white p-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center ${buttonBg}`,
                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["faSpinner"],
                            spin: true,
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                            lineNumber: 365,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        "Processing..."
                    ]
                }, void 0, true) : buttonText
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 358,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
        lineNumber: 266,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = PaymentStep;
}),
"[project]/shiprocket/src/app/components/CheckoutLayout.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// shiprocket/src/app/components/CheckoutLayout.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$LoginStep$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/app/components/LoginStep.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$AddressStep$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/app/components/AddressStep.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$PaymentStep$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/app/components/PaymentStep.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const STEPS = {
    LOGIN: 1,
    ADDRESS: 2,
    PAYMENT: 3
};
const CheckoutLayout = ()=>{
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(STEPS.LOGIN);
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [addressData, setAddressData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔴 1. CRITICAL: Item details for Shopify. REPLACE VARIANT_ID and NAME.
    const [initialOrderItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            // Example product with base price (1250)
            variant_id: 45678901234567,
            name: "Shiprocket Integration Service",
            quantity: 1,
            base_price: 1250
        }
    ]);
    const handleLoginSuccess = (data)=>{
        setUserData(data);
        if (data.address_found) {
            setAddressData(data.address);
        }
        setCurrentStep(STEPS.ADDRESS);
    };
    const handleAddressConfirm = (data)=>{
        setAddressData(data);
        setCurrentStep(STEPS.PAYMENT);
    };
    // --- API Call to Simulated MongoDB & Shopify Backend ---
    const handleOrderPlace = async ()=>{
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
                    'Content-Type': 'application/json'
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
        } finally{
            setIsLoading(false);
        }
    };
    // -------------------------------------------------------------
    const renderStep = ()=>{
        switch(currentStep){
            case STEPS.LOGIN:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$LoginStep$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onLoginSuccess: handleLoginSuccess
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 100,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0));
            case STEPS.ADDRESS:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$AddressStep$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    initialAddress: addressData,
                    onAddressConfirm: handleAddressConfirm,
                    userName: userData?.name || "Customer"
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 103,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0));
            case STEPS.PAYMENT:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$PaymentStep$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onOrderPlace: handleOrderPlace,
                    initialOrderItems: initialOrderItems,
                    onFinalizeAddress: setAddressData,
                    isLoading: isLoading
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 111,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$LoginStep$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    onLoginSuccess: handleLoginSuccess
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 119,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-xl mx-auto p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold text-center mb-6 text-gray-800",
                children: [
                    "🚀 Custom Fast Checkout (",
                    currentStep,
                    "/3)"
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 125,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-2xl rounded-xl p-6",
                children: renderStep()
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 129,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 p-3 bg-white border border-green-200 rounded-lg text-center text-sm shadow-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-bold text-green-700",
                        children: "🔒 100% Secure Checkout"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                        lineNumber: 135,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 mt-1",
                        children: "All payments are encrypted. 7-Day Easy Return Guarantee applies."
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                        lineNumber: 136,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 134,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center text-xs text-gray-500",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Note: Check your server terminal for Shopify API errors (SHOPIFY ERROR DETAILS)."
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 142,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 141,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
        lineNumber: 124,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CheckoutLayout;
}),
];

//# sourceMappingURL=shiprocket_src_app_components_99101386._.js.map