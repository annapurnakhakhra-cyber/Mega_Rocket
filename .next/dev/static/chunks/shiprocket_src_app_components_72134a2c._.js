(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/shiprocket/src/app/components/LoginStep.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// shiprocket/src/app/components/LoginStep.js - (Same as before, using the /api/user-data endpoint)
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/react-fontawesome/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const LoginStep = ({ onLoginSuccess })=>{
    _s();
    // Setting a default number for easy testing, but this should be dynamic
    const [mobile, setMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('9876543210');
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isOtpSent, setIsOtpSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-2xl font-bold text-blue-600",
                children: isOtpSent ? 'Verify OTP' : 'Quick Login'
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                lineNumber: 58,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            !isOtpSent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "tel",
                        className: "w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500",
                        placeholder: "10 digit Mobile Number",
                        value: mobile,
                        onChange: (e)=>setMobile(e.target.value),
                        maxLength: 10,
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 63,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSendOtp,
                        disabled: isLoading || mobile.length !== 10,
                        className: "w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center shadow-md",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faSpinner"],
                            spin: true,
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                            lineNumber: 65,
                            columnNumber: 38
                        }, ("TURBOPACK compile-time value", void 0)) : 'Get OTP & Auto-fill'
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 64,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                lineNumber: 62,
                columnNumber: 27
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: "w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-center tracking-widest focus:ring-green-500 focus:border-green-500",
                        placeholder: "XXXX",
                        value: otp,
                        onChange: (e_0)=>setOtp(e_0.target.value),
                        maxLength: 4,
                        disabled: isLoading
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 68,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleVerifyOtp,
                        disabled: isLoading || otp.length !== 4,
                        className: "w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center shadow-md",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faSpinner"],
                            spin: true,
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                            lineNumber: 70,
                            columnNumber: 38
                        }, ("TURBOPACK compile-time value", void 0)) : 'Verify OTP'
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 69,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsOtpSent(false),
                        className: "w-full text-blue-600 text-sm mt-2 hover:underline",
                        children: "Change Number"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                        lineNumber: 72,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
                lineNumber: 67,
                columnNumber: 26
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/LoginStep.js",
        lineNumber: 57,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(LoginStep, "qKeNEpvuWByPNKM31LTHmC4cGR4=");
_c = LoginStep;
const __TURBOPACK__default__export__ = LoginStep;
var _c;
__turbopack_context__.k.register(_c, "LoginStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shiprocket/src/app/components/AddressStep.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
// shiprocket/src/app/components/AddressStep.js
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
// --- External Data: Comprehensive Country List ---
const COUNTRIES = [
    {
        code: '',
        name: 'Select Country/Region *'
    },
    // Placeholder
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
const AddressStep = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(50);
    if ($[0] !== "d3db2deea93aa700d831a5fcbc51639db726750c9dcdbf97d66b500437c24c8e") {
        for(let $i = 0; $i < 50; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d3db2deea93aa700d831a5fcbc51639db726750c9dcdbf97d66b500437c24c8e";
    }
    const { initialAddress, onAddressConfirm, userName } = t0;
    let t1;
    if ($[1] !== initialAddress) {
        t1 = initialAddress || {
            country: "",
            first_name: "",
            last_name: "",
            line1: "",
            address2: "",
            city: "",
            state: "",
            pincode: "",
            saveInfo: true
        };
        $[1] = initialAddress;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = (e)=>{
            const { name, value, type, checked } = e.target;
            setAddress((prev)=>({
                    ...prev,
                    [name]: type === "checkbox" ? checked : value
                }));
        };
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const handleChange = t2;
    let t3;
    if ($[4] !== address || $[5] !== onAddressConfirm) {
        t3 = (e_0)=>{
            e_0.preventDefault();
            if (!address.country || address.country === "" || !address.first_name || !address.last_name || !address.line1 || !address.city || !address.state || !address.pincode) {
                alert("Please fill in all required address fields (marked with *), including Country/Region.");
                return;
            }
            onAddressConfirm(address);
        };
        $[4] = address;
        $[5] = onAddressConfirm;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    const handleSubmit = t3;
    const isAddressAutoFilled = initialAddress && initialAddress.line1 !== "";
    let t4;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: "text-2xl font-bold text-blue-600",
            children: "Delivery Address"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 115,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    if ($[8] !== isAddressAutoFilled || $[9] !== userName) {
        t5 = isAddressAutoFilled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-sm font-semibold",
            children: [
                "👋 Welcome back, ",
                userName,
                "! Your address is auto-filled."
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 122,
            columnNumber: 33
        }, ("TURBOPACK compile-time value", void 0));
        $[8] = isAddressAutoFilled;
        $[9] = userName;
        $[10] = t5;
    } else {
        t5 = $[10];
    }
    const t6 = address.country;
    let t7;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = COUNTRIES.map(_temp);
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== address.country) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
            name: "country",
            value: t6,
            onChange: handleChange,
            className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
            required: true,
            children: t7
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 139,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = address.country;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    let t9;
    if ($[14] !== address.first_name) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            name: "first_name",
            placeholder: "First Name *",
            value: address.first_name,
            onChange: handleChange,
            className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
            required: true
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 147,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[14] = address.first_name;
        $[15] = t9;
    } else {
        t9 = $[15];
    }
    let t10;
    if ($[16] !== address.last_name) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            name: "last_name",
            placeholder: "Last Name *",
            value: address.last_name,
            onChange: handleChange,
            className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
            required: true
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 155,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[16] = address.last_name;
        $[17] = t10;
    } else {
        t10 = $[17];
    }
    let t11;
    if ($[18] !== t10 || $[19] !== t9) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-4",
            children: [
                t9,
                t10
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 163,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[18] = t10;
        $[19] = t9;
        $[20] = t11;
    } else {
        t11 = $[20];
    }
    let t12;
    if ($[21] !== address.line1) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            name: "line1",
            placeholder: "Address (Street, House No., Locality) *",
            value: address.line1,
            onChange: handleChange,
            className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
            required: true
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 172,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[21] = address.line1;
        $[22] = t12;
    } else {
        t12 = $[22];
    }
    let t13;
    if ($[23] !== address.address2) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            name: "address2",
            placeholder: "Apartment, suite, building, etc. (Optional)",
            value: address.address2,
            onChange: handleChange,
            className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 180,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[23] = address.address2;
        $[24] = t13;
    } else {
        t13 = $[24];
    }
    let t14;
    if ($[25] !== address.city) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            name: "city",
            placeholder: "City *",
            value: address.city,
            onChange: handleChange,
            className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
            required: true
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 188,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[25] = address.city;
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] !== address.state) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            name: "state",
            placeholder: "State *",
            value: address.state,
            onChange: handleChange,
            className: "p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
            required: true
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 196,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[27] = address.state;
        $[28] = t15;
    } else {
        t15 = $[28];
    }
    let t16;
    if ($[29] !== t14 || $[30] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-4",
            children: [
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 204,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[29] = t14;
        $[30] = t15;
        $[31] = t16;
    } else {
        t16 = $[31];
    }
    let t17;
    if ($[32] !== address.pincode) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "text",
            name: "pincode",
            placeholder: "Pincode *",
            value: address.pincode,
            onChange: handleChange,
            className: "w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500",
            required: true
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 213,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[32] = address.pincode;
        $[33] = t17;
    } else {
        t17 = $[33];
    }
    let t18;
    if ($[34] !== address.saveInfo) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            type: "checkbox",
            id: "saveInfo",
            name: "saveInfo",
            checked: address.saveInfo,
            onChange: handleChange,
            className: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 221,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[34] = address.saveInfo;
        $[35] = t18;
    } else {
        t18 = $[35];
    }
    let t19;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            htmlFor: "saveInfo",
            className: "ml-2 block text-base text-gray-900 font-medium",
            children: "Save this information for next time"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 229,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[36] = t19;
    } else {
        t19 = $[36];
    }
    let t20;
    if ($[37] !== t18) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center pt-2",
            children: [
                t18,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 236,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[37] = t18;
        $[38] = t20;
    } else {
        t20 = $[38];
    }
    let t21;
    if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            className: "w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 mt-6",
            children: "Proceed to Payment"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 244,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[39] = t21;
    } else {
        t21 = $[39];
    }
    let t22;
    if ($[40] !== handleSubmit || $[41] !== t11 || $[42] !== t12 || $[43] !== t13 || $[44] !== t16 || $[45] !== t17 || $[46] !== t20 || $[47] !== t5 || $[48] !== t8) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "space-y-6",
            children: [
                t4,
                t5,
                t8,
                t11,
                t12,
                t13,
                t16,
                t17,
                t20,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
            lineNumber: 251,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[40] = handleSubmit;
        $[41] = t11;
        $[42] = t12;
        $[43] = t13;
        $[44] = t16;
        $[45] = t17;
        $[46] = t20;
        $[47] = t5;
        $[48] = t8;
        $[49] = t22;
    } else {
        t22 = $[49];
    }
    return t22;
};
_s(AddressStep, "VXHzydH9s+/eejyJI6myjC/kLeA=");
_c = AddressStep;
const __TURBOPACK__default__export__ = AddressStep;
function _temp(country) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
        value: country.code,
        disabled: country.code === "",
        children: country.name
    }, country.code, false, {
        fileName: "[project]/shiprocket/src/app/components/AddressStep.js",
        lineNumber: 269,
        columnNumber: 10
    }, this);
}
var _c;
__turbopack_context__.k.register(_c, "AddressStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shiprocket/src/app/components/PaymentStep.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
// shiprocket/src/app/components/PaymentStep.js
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/react-fontawesome/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/@fortawesome/free-solid-svg-icons/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
            // Flat discount of 100
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
const QrCodeOverlay = (t0)=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(47);
    if ($[0] !== "e794ea39aef9eb716a36484fda31dd748d862f496e61bf304446fe366133599d") {
        for(let $i = 0; $i < 47; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e794ea39aef9eb716a36484fda31dd748d862f496e61bf304446fe366133599d";
    }
    const { totalPayable, onGoBack, onOrderPlace, isLoading } = t0;
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(300);
    const [paymentStatus, setPaymentStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pending");
    let t1;
    let t2;
    if ($[1] !== paymentStatus || $[2] !== timeLeft) {
        t1 = ()=>{
            if (timeLeft <= 0 || paymentStatus !== "pending") {
                return;
            }
            const timerId = setInterval(()=>{
                setTimeLeft(_temp);
            }, 1000);
            return ()=>clearInterval(timerId);
        };
        t2 = [
            timeLeft,
            paymentStatus
        ];
        $[1] = paymentStatus;
        $[2] = timeLeft;
        $[3] = t1;
        $[4] = t2;
    } else {
        t1 = $[3];
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    let t3;
    if ($[5] !== minutes) {
        t3 = minutes.toString().padStart(2, "0");
        $[5] = minutes;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== seconds) {
        t4 = seconds.toString().padStart(2, "0");
        $[7] = seconds;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    const formattedTime = `${t3}:${t4}`;
    let t5;
    if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = Date.now();
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    let t6;
    if ($[10] !== totalPayable) {
        t6 = totalPayable.toFixed(2);
        $[10] = totalPayable;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    const mockUpiData = `upi://pay?pa=mockvpa@bank&pn=Merchant%20Name&mc=1234&tid=TID${t5}&am=${t6}&cu=INR`;
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${encodeURIComponent(mockUpiData)}`;
    let t7;
    if ($[12] !== onOrderPlace) {
        t7 = ()=>{
            setPaymentStatus("success");
            setTimeout(()=>onOrderPlace(), 1000);
        };
        $[12] = onOrderPlace;
        $[13] = t7;
    } else {
        t7 = $[13];
    }
    const handleManualConfirm = t7;
    let statusIcon;
    let statusText;
    let statusColor;
    if (paymentStatus === "pending") {
        statusIcon = __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faQrcode"];
        let t8;
        if ($[14] !== totalPayable) {
            t8 = totalPayable.toFixed(2);
            $[14] = totalPayable;
            $[15] = t8;
        } else {
            t8 = $[15];
        }
        statusText = `Scan the QR code to pay ₹${t8}`;
        statusColor = "text-blue-600";
    } else {
        if (paymentStatus === "success") {
            statusIcon = __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faCheckCircle"];
            statusText = "Payment Received! Finalizing order...";
            statusColor = "text-green-600";
        } else {
            statusIcon = __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faTimesCircle"];
            statusText = "Payment Expired or Failed. Please retry.";
            statusColor = "text-red-600";
        }
    }
    const t8 = paymentStatus !== "pending";
    let t9;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faArrowLeft"],
            className: "mr-2"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 189,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[16] = t9;
    } else {
        t9 = $[16];
    }
    let t10;
    if ($[17] !== onGoBack || $[18] !== t8) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: onGoBack,
            className: "flex items-center text-gray-500 hover:text-gray-800 transition duration-150",
            disabled: t8,
            children: [
                t9,
                "Back to Options"
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 196,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[17] = onGoBack;
        $[18] = t8;
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    const t11 = `text-3xl font-extrabold ${statusColor}`;
    let t12;
    if ($[20] !== statusIcon) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
            icon: statusIcon,
            className: "mr-3"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 206,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[20] = statusIcon;
        $[21] = t12;
    } else {
        t12 = $[21];
    }
    let t13;
    if ($[22] !== statusText || $[23] !== t11 || $[24] !== t12) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            className: t11,
            children: [
                t12,
                statusText
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 214,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[22] = statusText;
        $[23] = t11;
        $[24] = t12;
        $[25] = t13;
    } else {
        t13 = $[25];
    }
    let t14;
    if ($[26] !== qrCodeUrl) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 bg-white border border-gray-100 rounded-lg shadow-xl mx-auto max-w-xs",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: qrCodeUrl,
                alt: "UPI Payment QR Code",
                className: "w-full h-auto border p-2"
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 224,
                columnNumber: 102
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 224,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[26] = qrCodeUrl;
        $[27] = t14;
    } else {
        t14 = $[27];
    }
    let t15;
    if ($[28] !== totalPayable) {
        t15 = totalPayable.toFixed(2);
        $[28] = totalPayable;
        $[29] = t15;
    } else {
        t15 = $[29];
    }
    let t16;
    if ($[30] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "font-semibold text-gray-700",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Total Payable: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-2xl font-bold text-red-600",
                        children: [
                            "₹",
                            t15
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 240,
                        columnNumber: 74
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 240,
                columnNumber: 56
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 240,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[30] = t15;
        $[31] = t16;
    } else {
        t16 = $[31];
    }
    const t17 = `p-3 rounded-lg font-bold mx-auto w-3/4 ${paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-500"}`;
    const t18 = paymentStatus === "pending" ? `Time Remaining: ${formattedTime}` : "Payment gateway finalized.";
    let t19;
    if ($[32] !== t17 || $[33] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t17,
            children: t18
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 250,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[32] = t17;
        $[33] = t18;
        $[34] = t19;
    } else {
        t19 = $[34];
    }
    let t20;
    if ($[35] !== handleManualConfirm || $[36] !== isLoading || $[37] !== paymentStatus || $[38] !== timeLeft) {
        t20 = paymentStatus === "pending" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleManualConfirm,
            disabled: isLoading || timeLeft <= 0,
            className: "w-full bg-green-600 text-white p-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center shadow-lg",
            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faSpinner"],
                        spin: true,
                        className: "mr-2"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 259,
                        columnNumber: 292
                    }, ("TURBOPACK compile-time value", void 0)),
                    "Checking Payment Status..."
                ]
            }, void 0, true) : "I have Paid - Confirm Order"
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 259,
            columnNumber: 42
        }, ("TURBOPACK compile-time value", void 0));
        $[35] = handleManualConfirm;
        $[36] = isLoading;
        $[37] = paymentStatus;
        $[38] = timeLeft;
        $[39] = t20;
    } else {
        t20 = $[39];
    }
    let t21;
    if ($[40] !== t10 || $[41] !== t13 || $[42] !== t14 || $[43] !== t16 || $[44] !== t19 || $[45] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6 text-center",
            children: [
                t10,
                t13,
                t14,
                t16,
                t19,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 270,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[40] = t10;
        $[41] = t13;
        $[42] = t14;
        $[43] = t16;
        $[44] = t19;
        $[45] = t20;
        $[46] = t21;
    } else {
        t21 = $[46];
    }
    return t21;
};
_s(QrCodeOverlay, "o3TjYipTz3Rkg1Yuxb4mN1HIgTw=");
_c = QrCodeOverlay;
// ----------------------------------------------------------------------
const PaymentStep = ({ onOrderPlace, onFinalizeAddress, isLoading, initialOrderItems })=>{
    _s1();
    const [selectedPayment, setSelectedPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('prepaid');
    const [showQrCode, setShowQrCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ⭐️ NEW DISCOUNT STATES ⭐️
    const [promoCode, setPromoCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [appliedDiscount, setAppliedDiscount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        amount: 50,
        // Default prepaid discount
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PaymentStep.useEffect": ()=>{
            onFinalizeAddress({
                "PaymentStep.useEffect": (prev)=>({
                        ...prev,
                        paymentDetails: orderDetails
                    })
            }["PaymentStep.useEffect"]);
        }
    }["PaymentStep.useEffect"], [
        isCodSelected,
        onFinalizeAddress,
        orderDetails
    ]);
    // --- EFFECT: Recalculate default discount when changing payment method ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PaymentStep.useEffect": ()=>{
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
        }
    }["PaymentStep.useEffect"], [
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QrCodeOverlay, {
            totalPayable: totalPayable,
            onGoBack: ()=>setShowQrCode(false),
            onOrderPlace: onOrderPlace,
            isLoading: isLoading
        }, void 0, false, {
            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
            lineNumber: 377,
            columnNumber: 12
        }, ("TURBOPACK compile-time value", void 0));
    }
    // --- Default Payment Selection Screen Rendering ---
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-2xl font-bold text-blue-600",
                children: "Payment Options"
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 382,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: banner.bgColor,
                    color: banner.textColor
                },
                className: "p-3 text-center text-sm font-semibold rounded-lg shadow-md",
                children: banner.text
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 385,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border p-4 rounded-lg shadow-sm space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-bold text-gray-800 flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faTag"],
                                className: "mr-2 text-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 395,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Have a Promo Code? (FLAT100 / FESTIVE10)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 394,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Enter Code",
                                value: promoCode,
                                onChange: (e)=>setPromoCode(e.target.value),
                                className: "flex-grow p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500",
                                disabled: isCodSelected
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 399,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleApplyPromo,
                                disabled: isLoading || isCodSelected,
                                className: `p-2 rounded-lg font-semibold text-white transition duration-150 ${isCodSelected ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`,
                                children: "Apply"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 400,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 398,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-sm ${appliedDiscount.valid ? 'text-green-600' : 'text-red-600'}`,
                        children: appliedDiscount.message
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 405,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 393,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: paymentOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: `flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPayment === option.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-300'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-3 font-medium text-gray-700",
                                children: option.label
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 415,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: "payment",
                                value: option.id,
                                checked: selectedPayment === option.id,
                                onChange: (e_0)=>setSelectedPayment(e_0.target.value),
                                className: "h-5 w-5 text-blue-600 focus:ring-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 416,
                                columnNumber: 26
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, option.id, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 414,
                        columnNumber: 47
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 413,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t pt-4 space-y-2 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Subtotal (Items):"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 422,
                                columnNumber: 65
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "₹",
                                    subtotal.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 422,
                                columnNumber: 96
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 422,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium",
                        style: {
                            color: effectiveDiscountAmount > 0 ? '#10B981' : '#EF4444'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Discount Applied:"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 427,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "- ₹",
                                    effectiveDiscountAmount.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 427,
                                columnNumber: 52
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 424,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium text-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Shipping (",
                                    shipping.method,
                                    "):"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 431,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "+ ₹",
                                    shipping.charge.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 431,
                                columnNumber: 64
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 430,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between font-medium text-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Taxes (",
                                    (orderDetails.taxRate * 100).toFixed(0),
                                    "%):"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 434,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "+ ₹",
                                    taxAmount.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 434,
                                columnNumber: 86
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 433,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    paymentFee > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between text-red-600 font-semibold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "COD Convenience Fee:"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 437,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "+ ₹",
                                    paymentFee.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 437,
                                columnNumber: 59
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 436,
                        columnNumber: 36
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "flex justify-between text-xl font-extrabold border-t-2 pt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Total Payable:"
                            }, void 0, false, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 440,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-red-600",
                                children: [
                                    "₹",
                                    totalPayable.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                                lineNumber: 440,
                                columnNumber: 49
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                        lineNumber: 439,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 421,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handlePaymentAction,
                disabled: isLoading,
                className: `w-full text-white p-3 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center ${buttonBg}`,
                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$react$2d$fontawesome$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FontAwesomeIcon"], {
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f40$fortawesome$2f$free$2d$solid$2d$svg$2d$icons$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["faSpinner"],
                            spin: true,
                            className: "mr-2"
                        }, void 0, false, {
                            fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                            lineNumber: 446,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        "Processing..."
                    ]
                }, void 0, true) : buttonText
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
                lineNumber: 444,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/PaymentStep.js",
        lineNumber: 381,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(PaymentStep, "vyRluS7h960MtBE70kVG9eudPP8=");
_c1 = PaymentStep;
const __TURBOPACK__default__export__ = PaymentStep;
function _temp(prevTime) {
    return prevTime - 1;
}
var _c, _c1;
__turbopack_context__.k.register(_c, "QrCodeOverlay");
__turbopack_context__.k.register(_c1, "PaymentStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/shiprocket/src/app/components/CheckoutLayout.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// shiprocket/src/app/components/CheckoutLayout.js
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$LoginStep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/app/components/LoginStep.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$AddressStep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/app/components/AddressStep.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$PaymentStep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/app/components/PaymentStep.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(STEPS.LOGIN);
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [addressData, setAddressData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 🔴 1. CRITICAL: Item details for Shopify. REPLACE VARIANT_ID and NAME.
    const [initialOrderItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            // Example product with base price (1250)
            variant_id: 45678901234567,
            // <--- REPLACE THIS WITH A VALID VARIANT ID
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
    const handleAddressConfirm = (data_0)=>{
        setAddressData(data_0);
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
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$LoginStep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onLoginSuccess: handleLoginSuccess
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 88,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case STEPS.ADDRESS:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$AddressStep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    initialAddress: addressData,
                    onAddressConfirm: handleAddressConfirm,
                    userName: userData?.name || "Customer"
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 90,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case STEPS.PAYMENT:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$PaymentStep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onOrderPlace: handleOrderPlace,
                    initialOrderItems: initialOrderItems,
                    onFinalizeAddress: setAddressData,
                    isLoading: isLoading
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 92,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$app$2f$components$2f$LoginStep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    onLoginSuccess: handleLoginSuccess
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 94,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-xl mx-auto p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold text-center mb-6 text-gray-800",
                children: [
                    "🚀 Custom Fast Checkout (",
                    currentStep,
                    "/3)"
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 98,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-2xl rounded-xl p-6",
                children: renderStep()
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 102,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 p-3 bg-white border border-green-200 rounded-lg text-center text-sm shadow-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-bold text-green-700",
                        children: "🔒 100% Secure Checkout"
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                        lineNumber: 108,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 mt-1",
                        children: "All payments are encrypted. 7-Day Easy Return Guarantee applies."
                    }, void 0, false, {
                        fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                        lineNumber: 109,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 107,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-center text-xs text-gray-500",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Note: Check your server terminal for Shopify API errors (SHOPIFY ERROR DETAILS)."
                }, void 0, false, {
                    fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                    lineNumber: 115,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
                lineNumber: 114,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/shiprocket/src/app/components/CheckoutLayout.js",
        lineNumber: 97,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CheckoutLayout, "pAM1+UYWGvRT5VPSdDuU6R1lc/o=");
_c = CheckoutLayout;
const __TURBOPACK__default__export__ = CheckoutLayout;
var _c;
__turbopack_context__.k.register(_c, "CheckoutLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=shiprocket_src_app_components_72134a2c._.js.map