module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/shiprocket/src/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// /lib/db.js
__turbopack_context__.s([
    "default",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    if (!process.env.MONGODB_URI) {
        throw new Error("❌ MONGODB_URI is missing in .env.local");
    }
    try {
        const db = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(process.env.MONGODB_URI, {
            dbName: "shopify-app"
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("✅ Database connected");
    } catch (err) {
        console.error("❌ Database connection error:", err);
        throw err;
    }
}
}),
"[project]/shiprocket/src/models/User.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    adminName: String,
    email: {
        type: String,
        unique: true
    },
    shopName: String,
    shopUrl: String,
    accessToken: String
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("User", UserSchema);
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/shiprocket/src/lib/jwt.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signToken",
    ()=>signToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
function signToken(payload, expiresIn = "1h") {
    return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
}
}),
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[externals]/node:https [external] (node:https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}),
"[externals]/node:zlib [external] (node:zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:zlib", () => require("node:zlib"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:stream/web [external] (node:stream/web, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream/web", () => require("node:stream/web"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/shiprocket/src/app/api/dashboard/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/models/User.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$lib$2f$jwt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/src/lib/jwt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$node$2d$fetch$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/node-fetch/src/index.js [app-route] (ecmascript) <locals>");
const dynamic = "force-dynamic";
;
;
;
;
async function GET(req) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return new Response(JSON.stringify({
        error: "Unauthorized"
    }), {
        status: 401
    });
    const token = authHeader.split(" ")[1];
    const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$lib$2f$jwt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
    if (!decoded) return new Response(JSON.stringify({
        error: "Invalid token"
    }), {
        status: 401
    });
    console.log(decoded);
    // Fetch admin from users collection
    const admin = await __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
        email: decoded.email.trim()
    });
    console.log("Decoded token:", admin);
    if (!admin) {
        console.log("Admin not found for email:", decoded.email);
        return new Response(JSON.stringify({
            error: "Admin not found"
        }), {
            status: 404
        });
    }
    if (!admin.accessToken || !admin.shopUrl) {
        console.log("Admin credentials missing:", admin);
        return new Response(JSON.stringify({
            error: "Shopify credentials missing"
        }), {
            status: 400
        });
    }
    const SHOPIFY_URL = `https://${admin.shopUrl}/admin/api/2025-10`;
    try {
        // Fetch recent customers
        const customerRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$node$2d$fetch$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(`${SHOPIFY_URL}/graphql.json`, {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": admin.accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `
          {
            customers(first: 10, sortKey: CREATED_AT, reverse: true) {
              edges { node { id email firstName lastName createdAt } }
            }
          }
        `
            })
        });
        const customerJson = await customerRes.json();
        const recentCustomers = customerJson.data?.customers?.edges?.map((e)=>e.node) || [];
        // Fetch orders
        const ordersRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$node$2d$fetch$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(`${SHOPIFY_URL}/orders.json`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": admin.accessToken,
                "Content-Type": "application/json"
            }
        });
        const ordersData = await ordersRes.json();
        const orders = Array.isArray(ordersData.orders) ? ordersData.orders : [];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentOrders = orders.filter((order)=>new Date(order.created_at) >= thirtyDaysAgo);
        const prepaidCount = orders.filter((o)=>o.financial_status === "paid").length;
        const pendingCount = orders.filter((o)=>o.financial_status === "pending").length;
        // Fetch refunds
        const refunds = [];
        for (const order of recentOrders.slice(0, 10)){
            if (order.refunds?.length) {
                order.refunds.forEach((refund)=>{
                    refunds.push({
                        id: refund.id,
                        orderId: order.id,
                        orderName: order.name,
                        amount: refund.total_refunded_amount || refund.amount,
                        createdAt: refund.created_at
                    });
                });
            }
        }
        refunds.sort((a, b)=>new Date(b.createdAt) - new Date(a.createdAt));
        const dashboard = {
            customers: {
                total: recentCustomers.length > 0 ? "100+" : recentCustomers.length,
                recent: recentCustomers
            },
            orders: {
                total: orders.length,
                prepaidCount,
                pendingCount,
                recent: recentOrders.map((o)=>({
                        id: o.id,
                        name: o.name,
                        total: parseFloat(o.total_price),
                        status: o.financial_status,
                        createdAt: o.created_at
                    }))
            },
            refunds: {
                total: refunds.length,
                recent: refunds.slice(0, 10)
            }
        };
        return new Response(JSON.stringify({
            dashboard
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.error("Dashboard fetch error:", err);
        return new Response(JSON.stringify({
            error: "Failed to fetch dashboard data",
            details: err.message
        }), {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__36a767cc._.js.map