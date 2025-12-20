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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/shiprocket/src/app/api/customer/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/shiprocket/node_modules/next/server.js [app-route] (ecmascript)");
const dynamic = "force-dynamic";
;
;
;
;
const CUSTOMER_BATCH_SIZE = 50; // customers per request
const ORDER_BATCH_SIZE = 50; // orders per request
async function GET(req) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    // 1️⃣ Auth
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
    const token = authHeader.split(" ")[1];
    const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$lib$2f$jwt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
    if (!decoded) return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Invalid token"
    }, {
        status: 401
    });
    // 2️⃣ Get admin
    const admin = await __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$src$2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
        email: decoded.email
    }).select("+accessToken +shopUrl");
    if (!admin) return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Admin not found"
    }, {
        status: 404
    });
    if (!admin.accessToken || !admin.shopUrl) return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Shopify credentials missing"
    }, {
        status: 400
    });
    const allCustomers = [];
    let customerCursor = null;
    try {
        // 3️⃣ Paginate through all customers
        while(true){
            const customersQuery = {
                query: `
          {
            customers(first: ${CUSTOMER_BATCH_SIZE}${customerCursor ? `, after: "${customerCursor}"` : ""}) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  id
                  email
                  firstName
                  lastName
                  orders(first: ${ORDER_BATCH_SIZE}) {
                    edges {
                      node {
                        currentTotalPriceSet {
                          presentmentMoney {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                  }
                }
              }
            }
          }
        `
            };
            const resp = await fetch(`https://${admin.shopUrl}/admin/api/2025-10/graphql.json`, {
                method: "POST",
                headers: {
                    "X-Shopify-Access-Token": admin.accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(customersQuery)
            });
            const data = await resp.json();
            if (data.errors) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Shopify GraphQL returned errors",
                    details: data.errors
                }, {
                    status: 500
                });
            }
            const customersBatch = data.data.customers.edges.map((edge)=>edge.node);
            // 4️⃣ Process each customer
            const processedCustomers = await Promise.all(customersBatch.map(async (c)=>{
                let ordersCount = c.orders.edges.length;
                let totalSpent = c.orders.edges.reduce((sum, o)=>sum + parseFloat(o.node.currentTotalPriceSet.presentmentMoney.amount), 0);
                let currency = c.orders.edges[0]?.node.currentTotalPriceSet.presentmentMoney.currencyCode || "";
                // Handle pagination for orders if more than ORDER_BATCH_SIZE
                let orderCursor = c.orders.pageInfo.endCursor;
                while(c.orders.pageInfo.hasNextPage && orderCursor){
                    const ordersQuery = {
                        query: `
                {
                  customer(id: "${c.id}") {
                    orders(first: ${ORDER_BATCH_SIZE}, after: "${orderCursor}") {
                      edges {
                        node {
                          currentTotalPriceSet {
                            presentmentMoney {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                    }
                  }
                }
              `
                    };
                    const ordersResp = await fetch(`https://${admin.shopUrl}/admin/api/2025-10/graphql.json`, {
                        method: "POST",
                        headers: {
                            "X-Shopify-Access-Token": admin.accessToken,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(ordersQuery)
                    });
                    const ordersData = await ordersResp.json();
                    const orderEdges = ordersData.data.customer.orders.edges;
                    ordersCount += orderEdges.length;
                    totalSpent += orderEdges.reduce((sum, o)=>sum + parseFloat(o.node.currentTotalPriceSet.presentmentMoney.amount), 0);
                    orderCursor = ordersData.data.customer.orders.pageInfo.endCursor;
                    if (!ordersData.data.customer.orders.pageInfo.hasNextPage) break;
                }
                return {
                    id: c.id,
                    email: c.email,
                    firstName: c.firstName || "",
                    lastName: c.lastName || "",
                    ordersCount,
                    totalSpent,
                    currency
                };
            }));
            allCustomers.push(...processedCustomers);
            if (!data.data.customers.pageInfo.hasNextPage) break;
            customerCursor = data.data.customers.pageInfo.endCursor;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            customers: allCustomers
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$shiprocket$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch Shopify customers",
            details: err.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2335abd7._.js.map