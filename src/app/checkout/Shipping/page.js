// "use client";

// import { useState, useEffect } from "react";

// const STORE_ID = "annapurnakhakhra";
// const API_BASE = "/api/shipping";

// export default function ShippingAdmin() {
//   const [activeTab, setActiveTab] = useState("method");
//   const [priceBasis, setPriceBasis] = useState("Discounted Price");
//   const [discountEnabled, setDiscountEnabled] = useState(false);
//   const [originalEnabled, setOriginalEnabled] = useState(false); // Track for change detection + revert

//   // Always arrays – safe from .map errors
//   const [valueBasedRules, setValueBasedRules] = useState([]);
//   const [weightBasedRules, setWeightBasedRules] = useState([]);
//   const [discountBasedRules, setDiscountBasedRules] = useState([]);

//   // Form states
//   const [valueForm, setValueForm] = useState({
//     name: "",
//     price: "",
//     minOrderValue: "",
//     maxOrderValue: "",
//   });

//   const [weightForm, setWeightForm] = useState({
//     name: "",
//     minWeight: "",
//     maxWeight: "",
//     price: "",
//   });

//   const [discountForm, setDiscountForm] = useState({
//     discountCode: "",
//     matchType: "Exact Match",
//     price: "",
//   });

//   const [loading, setLoading] = useState(true); // Start true for better UX
//   const [saving, setSaving] = useState(false);
//   const [discountSaving, setDiscountSaving] = useState(false);

//   // Fetch on mount + whenever tab changes
//   useEffect(() => {
//     fetchSettings();

//     if (activeTab === "method") fetchValueBasedRules();
//     if (activeTab === "weight") fetchWeightBasedRules();
//     if (activeTab === "discount") fetchDiscountBasedConfig(); // Loads enabled + rules together
//   }, [activeTab]);

//   // Load default tab data on first render
//   useEffect(() => {
//     fetchValueBasedRules();
//   }, []);

//   // ==================== SETTINGS ====================
//   const fetchSettings = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/settings`, {
//         headers: { "x-store-id": STORE_ID },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         setPriceBasis(data.priceBasis || "Discounted Price");
//       }
//     } catch (err) {
//       console.error("Failed to fetch settings:", err);
//     }
//   };

//   const savePriceBasis = async () => {
//     setSaving(true);
//     try {
//       const res = await fetch(`${API_BASE}/settings`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-store-id": STORE_ID,
//         },
//         body: JSON.stringify({ priceBasis }),
//       });
//       if (res.ok) {
//         alert("Price basis saved successfully!");
//       } else {
//         alert("Failed to save price basis");
//       }
//     } catch (err) {
//       alert("Error saving settings");
//     }
//     setSaving(false);
//   };

//   // ==================== DISCOUNT BASED CONFIG (enabled + rules) ====================
//   const fetchDiscountBasedConfig = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/discount-based`, {
//         headers: { "x-store-id": STORE_ID },
//       });
//       if (res.ok) {
//         const { success, config } = await res.json();
//         if (success && config) {
//           setDiscountEnabled(Boolean(config.enabled));
//           setOriginalEnabled(Boolean(config.enabled));
//           setDiscountBasedRules(config.rules || []);
//         } else {
//           setDiscountEnabled(false);
//           setOriginalEnabled(false);
//           setDiscountBasedRules([]);
//         }
//       } else {
//         setDiscountEnabled(false);
//         setOriginalEnabled(false);
//         setDiscountBasedRules([]);
//       }
//     } catch (err) {
//       console.error("Error fetching discount-based config:", err);
//       setDiscountEnabled(false);
//       setOriginalEnabled(false);
//       setDiscountBasedRules([]);
//     }
//     setLoading(false);
//   };

//   const saveDiscountConfig = async () => {
//     if (discountEnabled === originalEnabled && discountBasedRules.length === discountBasedRules.length) {
//       alert("No changes detected.");
//       return;
//     }

//     setDiscountSaving(true);
//     try {
//       const res = await fetch(`${API_BASE}/discount-based`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-store-id": STORE_ID,
//         },
//         body: JSON.stringify({
//           enabled: discountEnabled, // Real boolean – matches your backend validation
//           rules: discountBasedRules.map(rule => ({
//             discountCode: rule.discountCode,
//             matchType: rule.matchType,
//             shippingCharge: Number(rule.shippingCharge || rule.price || 0),
//           })),
//         }),
//       });

//       const result = await res.json();

//       if (res.ok && result.success) {
//         alert("Discount Based Shipping updated successfully!");
//         setOriginalEnabled(discountEnabled);
//       } else {
//         alert("Error: " + (result.error || "Failed to save"));
//         setDiscountEnabled(originalEnabled); // Revert toggle on error
//       }
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert("Network error – changes reverted.");
//       setDiscountEnabled(originalEnabled);
//     }
//     setDiscountSaving(false);
//   };

//   // ==================== VALUE BASED RULES ====================
//   const fetchValueBasedRules = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/value-based`, {
//         headers: { "x-store-id": STORE_ID },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         const rules =
//           Array.isArray(data)
//             ? data
//             : data.rules
//               ? data.rules
//               : data.data
//                 ? data.data
//                 : [];
//         setValueBasedRules(rules);
//       } else {
//         setValueBasedRules([]);
//       }
//     } catch (err) {
//       console.error("Error fetching value-based rules:", err);
//       setValueBasedRules([]);
//     }
//     setLoading(false);
//   };

//   const addValueBasedRule = async () => {
//     if (!valueForm.name.trim() || !valueForm.price) {
//       alert("Shipping Name and Price are required");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/value-based`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-store-id": STORE_ID,
//         },
//         body: JSON.stringify({
//           name: valueForm.name.trim(),
//           price: Number(valueForm.price) || 0,
//           minOrderValue: valueForm.minOrderValue ? Number(valueForm.minOrderValue) : null,
//           maxOrderValue: valueForm.maxOrderValue ? Number(valueForm.maxOrderValue) : null,
//           paymentMethods: ["ALL"],
//         }),
//       });

//       if (res.ok) {
//         fetchValueBasedRules();
//         setValueForm({ name: "", price: "", minOrderValue: "", maxOrderValue: "" });
//       } else {
//         alert("Failed to add rule");
//       }
//     } catch (err) {
//       alert("Network error while adding rule");
//     }
//   };

//   const deleteValueBasedRule = async (id) => {
//     if (!confirm("Are you sure you want to delete this rule?")) return;
//     try {
//       const res = await fetch(`${API_BASE}/value-based?id=${id}`, {
//         method: "DELETE",
//         headers: { "x-store-id": STORE_ID },
//       });
//       if (res.ok) {
//         fetchValueBasedRules();
//       } else {
//         alert("Failed to delete rule");
//       }
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // ==================== WEIGHT BASED RULES ====================
//   const fetchWeightBasedRules = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/weight-based`, {
//         headers: { "x-store-id": STORE_ID },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         const rules =
//           Array.isArray(data)
//             ? data
//             : data.rules
//               ? data.rules
//               : data.data
//                 ? data.data
//                 : [];
//         setWeightBasedRules(rules);
//       } else {
//         setWeightBasedRules([]);
//       }
//     } catch (err) {
//       console.error("Error fetching weight rules:", err);
//       setWeightBasedRules([]);
//     }
//     setLoading(false);
//   };

//   const addWeightBasedRule = async () => {
//     if (!weightForm.name.trim() || !weightForm.price) {
//       alert("Name and Price are required");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/weight-based`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-store-id": STORE_ID,
//         },
//         body: JSON.stringify({
//           name: weightForm.name.trim(),
//           minWeight: Number(weightForm.minWeight) || 0,
//           maxWeight: weightForm.maxWeight ? Number(weightForm.maxWeight) : null,
//           price: Number(weightForm.price) || 0,
//         }),
//       });

//       if (res.ok) {
//         fetchWeightBasedRules();
//         setWeightForm({ name: "", minWeight: "", maxWeight: "", price: "" });
//       } else {
//         alert("Failed to add weight rule");
//       }
//     } catch (err) {
//       alert("Error adding weight rule");
//     }
//   };

//   const deleteWeightBasedRule = async (id) => {
//     if (!confirm("Delete this weight rule?")) return;
//     try {
//       await fetch(`${API_BASE}/weight-based?id=${id}`, {
//         method: "DELETE",
//         headers: { "x-store-id": STORE_ID },
//       });
//       fetchWeightBasedRules();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // ==================== DISCOUNT BASED RULES ====================
//   const addDiscountBasedRule = async () => {
//     if (!discountForm.discountCode.trim() || !discountForm.price) {
//       alert("Discount Code and Shipping Charge are required");
//       return;
//     }

//     const newRule = {
//       discountCode: discountForm.discountCode.trim(),
//       matchType: discountForm.matchType,
//       shippingCharge: Number(discountForm.price) || 0,
//     };

//     setDiscountSaving(true);
//     try {
//       const res = await fetch(`${API_BASE}/discount-based`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-store-id": STORE_ID,
//         },
//         body: JSON.stringify({
//           enabled: discountEnabled,
//           rules: [...discountBasedRules, newRule],
//         }),
//       });

//       if (res.ok) {
//         fetchDiscountBasedConfig(); // Refresh full config
//         setDiscountForm({ discountCode: "", matchType: "Exact Match", price: "" });
//       } else {
//         const result = await res.json();
//         alert("Failed: " + (result.error || "Unknown error"));
//       }
//     } catch (err) {
//       alert("Network error adding rule");
//     }
//     setDiscountSaving(false);
//   };

//   const deleteDiscountBasedRule = async (id) => {
//     if (!confirm("Delete this discount rule?")) return;

//     const updatedRules = discountBasedRules.filter((r) => r._id !== id);

//     setDiscountSaving(true);
//     try {
//       const res = await fetch(`${API_BASE}/discount-based`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-store-id": STORE_ID,
//         },
//         body: JSON.stringify({
//           enabled: discountEnabled,
//           rules: updatedRules,
//         }),
//       });

//       if (res.ok) {
//         fetchDiscountBasedConfig();
//       } else {
//         alert("Failed to delete rule");
//       }
//     } catch (err) {
//       alert("Network error");
//     }
//     setDiscountSaving(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
//           <p className="text-sm text-gray-600 mt-1">
//             This section enables you to choose where you ship and how much you charge for shipping at checkout.
//           </p>
//           <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
//             Open Guide
//           </a>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         {/* Tabs */}
//         <div className="flex flex-wrap border-b border-gray-300 mb-8 gap-2">
//           {[
//             { id: "method", label: "Shipping Method" },
//             { id: "weight", label: "Weight Based Shipping" },
//             { id: "discount", label: "Discount Based Shipping" },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
//                 ? "border-blue-600 text-blue-600"
//                 : "border-transparent text-gray-600 hover:text-gray-900"
//                 }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
//           {/* ==================== SHIPPING METHOD TAB ==================== */}
//           {activeTab === "method" && (
//             <>
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
//                 <label className="text-sm font-medium text-gray-700">
//                   Shipping method should be applicable on which price?
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <select
//                     value={priceBasis}
//                     onChange={(e) => setPriceBasis(e.target.value)}
//                     className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option>Discounted Price</option>
//                     <option>Original Price</option>
//                   </select>
//                   <button
//                     onClick={savePriceBasis}
//                     disabled={saving}
//                     className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {saving ? "Saving..." : "Save"}
//                   </button>
//                 </div>
//               </div>

//               {/* Add Rule Form */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
//                 <div>
//                   <label className="text-xs text-gray-500 mb-1 block">Shipping Name</label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Express"
//                     value={valueForm.name}
//                     onChange={(e) => setValueForm({ ...valueForm, name: e.target.value })}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-500 mb-1 block">Shipping Price</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
//                     <input
//                       type="number"
//                       value={valueForm.price}
//                       onChange={(e) => setValueForm({ ...valueForm, price: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-500 mb-1 block">Min Order Value</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
//                     <input
//                       type="number"
//                       value={valueForm.minOrderValue}
//                       onChange={(e) => setValueForm({ ...valueForm, minOrderValue: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-500 mb-1 block">Max Order Value</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
//                     <input
//                       type="number"
//                       value={valueForm.maxOrderValue}
//                       onChange={(e) => setValueForm({ ...valueForm, maxOrderValue: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 mb-10">
//                 <button
//                   onClick={addValueBasedRule}
//                   className="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-blue-700"
//                 >
//                   Add Shipping Rule
//                 </button>
//               </div>

//               {/* Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm min-w-[800px]">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping ID</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Name</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Price</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Min Order</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Max Order</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
//                       <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {loading ? (
//                       <tr>
//                         <td colSpan={7} className="text-center py-12 text-gray-500">
//                           Loading rules...
//                         </td>
//                       </tr>
//                     ) : valueBasedRules.length === 0 ? (
//                       <tr>
//                         <td colSpan={7} className="text-center py-12 text-gray-500">
//                           No shipping rules added yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       valueBasedRules.map((rule) => (
//                         <tr key={rule._id}>
//                           <td className="py-4 px-4 text-blue-600">#{rule._id?.slice(-6)}</td>
//                           <td className="py-4 px-4 font-medium">{rule.name || "-"}</td>
//                           <td className="py-4 px-4">₹{Number(rule.price || 0).toFixed(2)}</td>
//                           <td className="py-4 px-4">{rule.minOrderValue ? `₹${rule.minOrderValue}` : "-"}</td>
//                           <td className="py-4 px-4">{rule.maxOrderValue ? `₹${rule.maxOrderValue}` : "No limit"}</td>
//                           <td className="py-4 px-4 text-xs">{rule.paymentMethods?.join(", ") || "ALL"}</td>
//                           <td className="py-4 px-4 text-right">
//                             <button
//                               onClick={() => deleteValueBasedRule(rule._id)}
//                               className="text-red-600 hover:underline text-sm"
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Tip */}
//               <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4">
//                 <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-lg font-bold">i</div>
//                 <div className="text-sm text-blue-800">
//                   <p>You can set product level shipping on Shopify. Just add ship@price tag on Shopify.</p>
//                   <p className="mt-2">
//                     Eg: To set free shipping for a product, add <code className="bg-blue-100 px-2 py-1 rounded">ship@0</code> tag.<br />
//                     To set a custom price, add <code className="bg-blue-100 px-2 py-1 rounded">ship@99</code> tag.
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* ==================== WEIGHT BASED TAB ==================== */}
//           {activeTab === "weight" && (
//             <>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
//                 <div>
//                   <label className="text-xs text-gray-600 mb-1 block">Shipping Name</label>
//                   <input
//                     type="text"
//                     value={weightForm.name}
//                     onChange={(e) => setWeightForm({ ...weightForm, name: e.target.value })}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-600 mb-1 block">Min Weight (KG)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={weightForm.minWeight}
//                     onChange={(e) => setWeightForm({ ...weightForm, minWeight: e.target.value })}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-600 mb-1 block">Max Weight (KG)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={weightForm.maxWeight}
//                     onChange={(e) => setWeightForm({ ...weightForm, maxWeight: e.target.value })}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-xs text-gray-600 mb-1 block">Shipping Price</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
//                     <input
//                       type="number"
//                       value={weightForm.price}
//                       onChange={(e) => setWeightForm({ ...weightForm, price: e.target.value })}
//                       className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 mb-10">
//                 <button
//                   onClick={addWeightBasedRule}
//                   className="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-blue-700"
//                 >
//                   Add Weight Rule
//                 </button>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Min Weight</th>
//                       <th className="text-left py-3 px-4 font-medium text-gray-700">Max Weight</th>
//                       <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {loading ? (
//                       <tr>
//                         <td colSpan={5} className="text-center py-12 text-gray-500">
//                           Loading...
//                         </td>
//                       </tr>
//                     ) : weightBasedRules.length === 0 ? (
//                       <tr>
//                         <td colSpan={5} className="text-center py-12 text-gray-500">
//                           No weight-based rules yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       weightBasedRules.map((rule) => (
//                         <tr key={rule._id}>
//                           <td className="py-4 px-4">{rule.name || "-"}</td>
//                           <td className="py-4 px-4">₹{Number(rule.price || 0).toFixed(2)}</td>
//                           <td className="py-4 px-4">{rule.minWeight ?? "0"} KG</td>
//                           <td className="py-4 px-4">{rule.maxWeight ?? "∞"} KG</td>
//                           <td className="py-4 px-4 text-right">
//                             <button
//                               onClick={() => deleteWeightBasedRule(rule._id)}
//                               className="text-red-600 hover:underline text-sm"
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}

//           {/* ==================== DISCOUNT BASED TAB ==================== */}
//           {activeTab === "discount" && (
//             <>
//               <div className="flex justify-between items-center mb-10">
//                 <label className="text-lg font-medium text-gray-800">
//                   Enable Discount Based Shipping
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <button
//                     type="button"
//                     onClick={() => setDiscountEnabled(!discountEnabled)}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${discountEnabled ? "bg-blue-600" : "bg-gray-300"
//                       }`}
//                     aria-pressed={discountEnabled}
//                     aria-label="Toggle discount based shipping"
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-translate duration-200 ease-in-out ${discountEnabled ? "translate-x-6" : "translate-x-1"
//                         }`}
//                     />
//                   </button>
//                   <button
//                     onClick={saveDiscountConfig}
//                     disabled={discountSaving || (discountEnabled === originalEnabled)}
//                     className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
//                   >
//                     {discountSaving ? "Saving..." : "Save Changes"}
//                   </button>
//                 </div>
//               </div>

//               {discountEnabled ? (
//                 <>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200">
//                     <div>
//                       <label className="text-xs text-gray-600 mb-1 block">Discount Code</label>
//                       <input
//                         type="text"
//                         value={discountForm.discountCode}
//                         onChange={(e) =>
//                           setDiscountForm({ ...discountForm, discountCode: e.target.value.trim() })
//                         }
//                         placeholder="e.g. SUMMER2026"
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-xs text-gray-600 mb-1 block">Match Type</label>
//                       <select
//                         value={discountForm.matchType}
//                         onChange={(e) =>
//                           setDiscountForm({ ...discountForm, matchType: e.target.value })
//                         }
//                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="Exact Match">Exact Match</option>
//                         <option value="Contains">Contains</option>
//                         <option value="Starts With">Starts With</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="text-xs text-gray-600 mb-1 block">Shipping Charge</label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-2.5 text-gray-600 text-lg">₹</span>
//                         <input
//                           type="number"
//                           min="0"
//                           step="0.01"
//                           value={discountForm.price}
//                           onChange={(e) =>
//                             setDiscountForm({ ...discountForm, price: e.target.value })
//                           }
//                           className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex gap-4 mb-10">
//                     <button
//                       onClick={addDiscountBasedRule}
//                       disabled={!discountForm.discountCode || discountForm.price === ""}
//                       className="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
//                     >
//                       Add Discount Rule
//                     </button>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gray-50 border-b border-gray-200">
//                         <tr>
//                           <th className="text-left py-3 px-4 font-medium text-gray-700">Discount Code</th>
//                           <th className="text-left py-3 px-4 font-medium text-gray-700">Match Type</th>
//                           <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Charge</th>
//                           <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {loading ? (
//                           <tr>
//                             <td colSpan={4} className="text-center py-12 text-gray-500">
//                               Loading rules...
//                             </td>
//                           </tr>
//                         ) : discountBasedRules.length === 0 ? (
//                           <tr>
//                             <td colSpan={4} className="py-20 text-center text-gray-400">
//                               <div className="flex flex-col items-center">
//                                 <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
//                                 <p className="text-lg font-medium">No discount rules yet</p>
//                                 <p className="text-sm mt-2">Add your first rule above</p>
//                               </div>
//                             </td>
//                           </tr>
//                         ) : (
//                           discountBasedRules.map((rule) => (
//                             <tr key={rule._id}>
//                               <td className="py-4 px-4 font-medium">{rule.discountCode}</td>
//                               <td className="py-4 px-4">{rule.matchType}</td>
//                               <td className="py-4 px-4">₹{Number(rule.shippingCharge || rule.price || 0).toFixed(2)}</td>
//                               <td className="py-4 px-4 text-right">
//                                 <button
//                                   onClick={() => deleteDiscountBasedRule(rule._id)}
//                                   className="text-red-600 hover:text-red-800 hover:underline text-sm font-medium transition"
//                                 >
//                                   Delete
//                                 </button>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">
//                   <p className="text-2xl font-medium text-gray-700">Discount Based Shipping is disabled</p>
//                   <p className="text-sm mt-4 max-w-md mx-auto">
//                     Enable the toggle above and click "Save Changes" to configure shipping rules based on discount codes.
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

















"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


export default function ShippingAdmin() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        console.log("user data is", parsed);
      } catch (err) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const STORE_ID = user?.shopUrl;
  // shopurl
  const API_BASE = "/api/shipping";

  const [activeTab, setActiveTab] = useState("method");

  // Settings
  const [priceBasis, setPriceBasis] = useState("Discounted Price");
  const [saving, setSaving] = useState(false);

  // Discount Based
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [originalEnabled, setOriginalEnabled] = useState(false);
  const [discountSaving, setDiscountSaving] = useState(false);

  // Rules
  const [valueBasedRules, setValueBasedRules] = useState([]);
  const [weightBasedRules, setWeightBasedRules] = useState([]);
  const [discountBasedRules, setDiscountBasedRules] = useState([]);

  // Forms for adding
  const [valueForm, setValueForm] = useState({
    name: "",
    price: "",
    minOrderValue: "",
    maxOrderValue: "",
  });

  const [weightForm, setWeightForm] = useState({
    name: "",
    minWeight: "",
    maxWeight: "",
    price: "",
  });

  const [discountForm, setDiscountForm] = useState({
    discountCode: "",
    matchType: "Exact Match",
    price: "",
  });

  // Editing states
  const [editingValueRule, setEditingValueRule] = useState(null);
  const [editValueForm, setEditValueForm] = useState({
    name: "",
    price: "",
    minOrderValue: "",
    maxOrderValue: "",
  });

  const [editingWeightRule, setEditingWeightRule] = useState(null);
  const [editWeightForm, setEditWeightForm] = useState({
    name: "",
    minWeight: "",
    maxWeight: "",
    price: "",
  });

  const [editingDiscountRule, setEditingDiscountRule] = useState(null);
  const [editingDiscountIndex, setEditingDiscountIndex] = useState(-1);
  const [editDiscountForm, setEditDiscountForm] = useState({
    discountCode: "",
    matchType: "Exact Match",
    price: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch data based on active tab
  useEffect(() => {
if (STORE_ID) {                    
    if (activeTab === "method") fetchValueBasedRules();
    if (activeTab === "weight") fetchWeightBasedRules();
    if (activeTab === "discount") fetchDiscountBasedConfig();
  }
  }, [activeTab, STORE_ID]);

  // Initial load
 useEffect(() => {
  if (STORE_ID) {                   
    fetchSettings();
    fetchValueBasedRules();
  }
}, [STORE_ID]);

  // ==================== SETTINGS ====================
  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        headers: { "x-store-id": STORE_ID },
      });
      if (res.ok) {
        const data = await res.json();
        setPriceBasis(data.priceBasis || "Discounted Price");
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const savePriceBasis = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": STORE_ID,
        },
        body: JSON.stringify({ priceBasis }),
      });
      if (res.ok) {
        alert("Price basis saved successfully!");
      } else {
        alert("Failed to save price basis");
      }
    } catch (err) {
      alert("Error saving settings");
    }
    setSaving(false);
  };

  // ==================== VALUE BASED RULES ====================
  const fetchValueBasedRules = async () => {

    if (!STORE_ID) {
    console.log("STORE_ID not ready yet, skipping fetch");
    setValueBasedRules([]);
    setLoading(false);
    return;
  }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/value-based`, {
        headers: { "x-store-id": STORE_ID },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const rules = Array.isArray(data) ? data : data.rules || data.data || [];
        setValueBasedRules(rules);
      } else {
        setValueBasedRules([]);
      }
    } catch (err) {
      console.error(err);
      setValueBasedRules([]);
    }
    setLoading(false);
  };

  const addValueBasedRule = async () => {
    if (!valueForm.name.trim() || !valueForm.price) {
      alert("Shipping Name and Price are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/value-based`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": STORE_ID,
        },
        body: JSON.stringify({
          name: valueForm.name.trim(),
          price: Number(valueForm.price) || 0,
          minOrderValue: valueForm.minOrderValue ? Number(valueForm.minOrderValue) : null,
          maxOrderValue: valueForm.maxOrderValue ? Number(valueForm.maxOrderValue) : null,
          paymentMethods: ["ALL"],
        }),
      });

      if (res.ok) {
        fetchValueBasedRules();
        setValueForm({ name: "", price: "", minOrderValue: "", maxOrderValue: "" });
      } else {
        alert("Failed to add rule");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const updateValueBasedRule = async () => {
    if (!editValueForm.name.trim() || !editValueForm.price) {
      alert("Shipping Name and Price are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/value-based`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": STORE_ID,
        },
        body: JSON.stringify({
          _id: editingValueRule._id, // ✅ REQUIRED
          name: editValueForm.name.trim(),
          price: Number(editValueForm.price) || 0,
          minOrderValue: editValueForm.minOrderValue
            ? Number(editValueForm.minOrderValue)
            : null,
          maxOrderValue: editValueForm.maxOrderValue
            ? Number(editValueForm.maxOrderValue)
            : null,
          paymentMethods: editingValueRule.paymentMethods || ["ALL"],
        }),
      });

      if (res.ok) {
        fetchValueBasedRules();
        setEditingValueRule(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update rule");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const deleteValueBasedRule = async (id) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    try {
      const res = await fetch(`${API_BASE}/value-based?id=${id}`, {
        method: "DELETE",
        headers: { "x-store-id": STORE_ID },
      });
      if (res.ok) fetchValueBasedRules();
      else alert("Failed to delete");
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ==================== WEIGHT BASED RULES ====================
  const fetchWeightBasedRules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/weight-based`, {
        headers: { "x-store-id": STORE_ID },
      });
      if (res.ok) {
        const data = await res.json();
        const rules = Array.isArray(data) ? data : data.rules || data.data || [];
        setWeightBasedRules(rules);
      } else {
        setWeightBasedRules([]);
      }
    } catch (err) {
      console.error(err);
      setWeightBasedRules([]);
    }
    setLoading(false);
  };

  const addWeightBasedRule = async () => {
    if (!weightForm.name.trim() || !weightForm.price) {
      alert("Name and Price are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/weight-based`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": STORE_ID,
        },
        body: JSON.stringify({
          name: weightForm.name.trim(),
          minWeight: Number(weightForm.minWeight) || 0,
          maxWeight: weightForm.maxWeight ? Number(weightForm.maxWeight) : null,
          price: Number(weightForm.price) || 0,
        }),
      });

      if (res.ok) {
        fetchWeightBasedRules();
        setWeightForm({ name: "", minWeight: "", maxWeight: "", price: "" });
      } else {
        alert("Failed to add rule");
      }
    } catch (err) {
      alert("Error");
    }
  };

  const updateWeightBasedRule = async () => {
    if (!editWeightForm.name.trim() || !editWeightForm.price) {
      alert("Name and Price are required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/weight-based`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": STORE_ID,
        },
        body: JSON.stringify({
          _id: editingWeightRule._id, // ✅ REQUIRED
          name: editWeightForm.name.trim(),
          minWeight: Number(editWeightForm.minWeight) || 0,
          maxWeight: editWeightForm.maxWeight
            ? Number(editWeightForm.maxWeight)
            : null,
          price: Number(editWeightForm.price) || 0,
        }),
      });

      if (res.ok) {
        fetchWeightBasedRules();
        setEditingWeightRule(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update rule");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const deleteWeightBasedRule = async (id) => {
    if (!confirm("Delete this rule?")) return;
    try {
      await fetch(`${API_BASE}/weight-based?id=${id}`, {
        method: "DELETE",
        headers: { "x-store-id": STORE_ID },
      });
      fetchWeightBasedRules();
    } catch (err) {
      alert("Failed");
    }
  };

  // ==================== DISCOUNT BASED CONFIG ====================
  const fetchDiscountBasedConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/discount-based`, {
        headers: { "x-store-id": STORE_ID },
      });
      if (res.ok) {
        const { success, config } = await res.json();
        if (success && config) {
          setDiscountEnabled(Boolean(config.enabled));
          setOriginalEnabled(Boolean(config.enabled));
          setDiscountBasedRules(config.rules || []);
        } else {
          setDiscountEnabled(false);
          setOriginalEnabled(false);
          setDiscountBasedRules([]);
        }
      }
    } catch (err) {
      console.error(err);
      setDiscountEnabled(false);
      setOriginalEnabled(false);
      setDiscountBasedRules([]);
    }
    setLoading(false);
  };

  const saveDiscountConfig = async () => {
    setDiscountSaving(true);
    try {
      const res = await fetch(`${API_BASE}/discount-based`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": STORE_ID,
        },
        body: JSON.stringify({
          enabled: discountEnabled,
          rules: discountBasedRules.map((rule) => ({
            discountCode: rule.discountCode,
            matchType: rule.matchType,
            shippingCharge: Number(rule.shippingCharge || rule.price || 0),
          })),
        }),
      });

      if (res.ok) {
        alert("Discount Based Shipping saved successfully!");
        setOriginalEnabled(discountEnabled);
      } else {
        alert("Failed to save");
        setDiscountEnabled(originalEnabled);
      }
    } catch (err) {
      alert("Network error – changes reverted");
      setDiscountEnabled(originalEnabled);
    }
    setDiscountSaving(false);
  };

  const addDiscountBasedRule = () => {
    if (!discountForm.discountCode.trim() || !discountForm.price) {
      alert("Discount Code and Shipping Charge required");
      return;
    }
    const newRule = {
      discountCode: discountForm.discountCode.trim().toUpperCase(),
      matchType: discountForm.matchType,
      shippingCharge: Number(discountForm.price),
    };
    setDiscountBasedRules([...discountBasedRules, newRule]);
    setDiscountForm({ discountCode: "", matchType: "Exact Match", price: "" });
  };

  const updateDiscountBasedRule = async () => {
    if (!editingDiscountRule?._id) {
      alert("Invalid rule selected");
      return;
    }

    if (!editDiscountForm.discountCode.trim() || editDiscountForm.price === "") {
      alert("Discount Code and Shipping Charge required");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/discount-based`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-store-id": STORE_ID,
        },
        body: JSON.stringify({
          _id: editingDiscountRule._id,
          discountCode: editDiscountForm.discountCode
            .trim()
            .toUpperCase(),
          matchType: editDiscountForm.matchType,
          shippingCharge: Number(editDiscountForm.price),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update rule");
        return;
      }

      // ✅ CORRECT function
      await fetchDiscountBasedConfig();

      setEditingDiscountRule(null);
      setEditingDiscountIndex(-1);
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const deleteDiscountBasedRule = (index) => {
    if (!confirm("Delete this rule?")) return;
    setDiscountBasedRules(discountBasedRules.filter((_, i) => i !== index));
  };

  // Reusable SVG Icons
  const EditIcon = () => (
    <svg
      className="w-5 h-5 text-blue-600 hover:text-blue-800"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      className="w-5 h-5 text-red-600 hover:text-red-800"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
          <p className="text-sm text-gray-600 mt-1">
            This section enables you to choose where you ship and how much you charge for shipping at checkout.
          </p>
          {/* <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            Open Guide
          </a> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-300 mb-8 gap-8">
          {[
            { id: "method", label: "Shipping Method" },
            { id: "weight", label: "Weight Based Shipping" },
            { id: "discount", label: "Discount Based Shipping" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Shipping Method Tab */}
          {activeTab === "method" && (
            <>
              {/* Price Basis */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <label className="text-sm font-medium text-gray-700">
                  Shipping method should be applicable on which price?
                </label>
                <div className="flex items-center gap-4">
                  <select
                    value={priceBasis}
                    onChange={(e) => setPriceBasis(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Discounted Price</option>
                    <option>Original Price</option>
                  </select>
                  <button
                    onClick={savePriceBasis}
                    disabled={saving}
                    className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              {/* Add Rule Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200 items-end">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Express"
                    value={valueForm.name}
                    onChange={(e) => setValueForm({ ...valueForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600">₹</span>
                    <input
                      type="number"
                      value={valueForm.price}
                      onChange={(e) => setValueForm({ ...valueForm, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Min Order Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600">₹</span>
                    <input
                      type="number"
                      value={valueForm.minOrderValue}
                      onChange={(e) => setValueForm({ ...valueForm, minOrderValue: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Max Order Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600">₹</span>
                    <input
                      type="number"
                      value={valueForm.maxOrderValue}
                      onChange={(e) => setValueForm({ ...valueForm, maxOrderValue: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <button className="text-blue-600 text-sm font-medium underline hover:text-blue-800 cursor-pointer">
                  Advanced Conditions
                </button>
                <button
                  onClick={addValueBasedRule}
                  className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 cursor-pointer"
                >
                  Add Shipping
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Minimum Order Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Maximum Order Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Map Payment Method</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Serviceable PIN Code</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customer Cohort</th>
                      <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="text-center py-12 text-gray-500">Loading rules...</td>
                      </tr>
                    ) : valueBasedRules.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-12 text-gray-500">No shipping rules added yet.</td>
                      </tr>
                    ) : (
                      valueBasedRules.map((rule) => (
                        <tr key={rule._id}>
                          <td className="py-4 px-4 text-blue-600">#{rule._id?.slice(-4)}</td>
                          <td className="py-4 px-4">{rule.name || "-"}</td>
                          <td className="py-4 px-4">₹{Number(rule.price || 0).toFixed(2)}</td>
                          <td className="py-4 px-4">{rule.minOrderValue ? `₹${rule.minOrderValue}` : "-"}</td>
                          <td className="py-4 px-4">{rule.maxOrderValue ? `₹${rule.maxOrderValue}` : "NA"}</td>
                          <td className="py-4 px-4">{rule.paymentMethods?.join(", ") || "ALL"}</td>
                          <td className="py-4 px-4">-</td>
                          <td className="py-4 px-4">-</td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-4">
                              <button
                                onClick={() => {
                                  setEditingValueRule(rule);
                                  setEditValueForm({
                                    name: rule.name || "",
                                    price: rule.price?.toString() || "",
                                    minOrderValue: rule.minOrderValue?.toString() || "",
                                    maxOrderValue: rule.maxOrderValue?.toString() || "",
                                  });
                                }}
                                title="Edit"
                                className="inline-block cursor-pointer"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => deleteValueBasedRule(rule._id)}
                                title="Delete"
                                className="inline-block cursor-pointer"
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Edit Modal for Value Based */}
              {editingValueRule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-6">Edit Shipping Rule</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-end">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Name</label>
                        <input
                          type="text"
                          value={editValueForm.name}
                          onChange={(e) => setEditValueForm({ ...editValueForm, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-600">₹</span>
                          <input
                            type="number"
                            value={editValueForm.price}
                            onChange={(e) => setEditValueForm({ ...editValueForm, price: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Min Order Value</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-600">₹</span>
                          <input
                            type="number"
                            value={editValueForm.minOrderValue}
                            onChange={(e) => setEditValueForm({ ...editValueForm, minOrderValue: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Max Order Value</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-600">₹</span>
                          <input
                            type="number"
                            value={editValueForm.maxOrderValue}
                            onChange={(e) => setEditValueForm({ ...editValueForm, maxOrderValue: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        onClick={() => setEditingValueRule(null)}
                        className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateValueBasedRule}
                        className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tip Box */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-lg font-bold">i</div>
                <div className="text-sm text-blue-800">
                  <p>You can set product level shipping on Shopify. Just add ship@price tag on Shopify.</p>
                  <p className="mt-2">
                    Eg: To set free shipping for a product, add <code className="bg-blue-100 px-1 rounded">ship@0</code> tag.<br />
                    To set a shipping price for a specific product, add <code className="bg-blue-100 px-1 rounded">ship@price</code> tag.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Weight Based Tab */}
          {activeTab === "weight" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200 items-end">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Name</label>
                  <input
                    type="text"
                    value={weightForm.name}
                    onChange={(e) => setWeightForm({ ...weightForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Min Weight</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={weightForm.minWeight}
                      onChange={(e) => setWeightForm({ ...weightForm, minWeight: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 whitespace-nowrap">KG</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Max Weight</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={weightForm.maxWeight}
                      onChange={(e) => setWeightForm({ ...weightForm, maxWeight: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 whitespace-nowrap">KG</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-600">₹</span>
                    <input
                      type="number"
                      value={weightForm.price}
                      onChange={(e) => setWeightForm({ ...weightForm, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mb-8">
                <button
                  onClick={addWeightBasedRule}
                  className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 cursor-pointer"
                >
                  Add Shipping
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Weight Based Shipping Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Min Weight (KG)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Max Weight (KG)</th>
                      <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
                      <th className="py-3 px-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-500">Loading...</td></tr>
                    ) : weightBasedRules.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-gray-500">No weight rules yet</td></tr>
                    ) : (
                      weightBasedRules.map((rule) => (
                        <tr key={rule._id}>
                          <td className="py-4 px-4 text-blue-600">#{rule._id?.slice(-4)}</td>
                          <td className="py-4 px-4">{rule.name || "-"}</td>
                          <td className="py-4 px-4">₹{Number(rule.price || 0).toFixed(2)}</td>
                          <td className="py-4 px-4">{rule.minWeight ?? "0"} KG</td>
                          <td className="py-4 px-4">{rule.maxWeight ?? "∞"} KG</td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-4">
                              <button
                                onClick={() => {
                                  setEditingWeightRule(rule);
                                  setEditWeightForm({
                                    name: rule.name || "",
                                    minWeight: rule.minWeight?.toString() || "",
                                    maxWeight: rule.maxWeight?.toString() || "",
                                    price: rule.price?.toString() || "",
                                  });
                                }}
                                title="Edit"
                                className="inline-block cursor-pointer"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => deleteWeightBasedRule(rule._id)}
                                title="Delete"
                                className="inline-block cursor-pointer"
                              >
                                <DeleteIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Edit Modal for Weight Based */}
              {editingWeightRule && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-xl max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-6">Edit Weight Based Rule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-end">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Name</label>
                        <input
                          type="text"
                          value={editWeightForm.name}
                          onChange={(e) => setEditWeightForm({ ...editWeightForm, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Min Weight</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={editWeightForm.minWeight}
                            onChange={(e) => setEditWeightForm({ ...editWeightForm, minWeight: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-600 whitespace-nowrap">KG</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Max Weight</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={editWeightForm.maxWeight}
                            onChange={(e) => setEditWeightForm({ ...editWeightForm, maxWeight: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-600 whitespace-nowrap">KG</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-600">₹</span>
                          <input
                            type="number"
                            value={editWeightForm.price}
                            onChange={(e) => setEditWeightForm({ ...editWeightForm, price: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        onClick={() => setEditingWeightRule(null)}
                        className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updateWeightBasedRule}
                        className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Discount Based Tab */}
          {activeTab === "discount" && (
            <>
              <div className="flex justify-between items-center mb-10">
                <label className="text-lg font-medium text-gray-800">Enable Discount Based Shipping</label>
                <div className="flex items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setDiscountEnabled(!discountEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${discountEnabled ? "bg-blue-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${discountEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                  <button
                    onClick={saveDiscountConfig}
                    disabled={discountSaving}
                    className="border border-green-600 text-green-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-50 disabled:opacity-50 cursor-pointer"
                  >
                    {discountSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              {discountEnabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200 items-end">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Discount Code</label>
                      <input
                        type="text"
                        value={discountForm.discountCode}
                        onChange={(e) => setDiscountForm({ ...discountForm, discountCode: e.target.value })}
                        placeholder="e.g. SUMMER2026"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Match Type</label>
                      <div className="relative">
                        <select
                          value={discountForm.matchType}
                          onChange={(e) => setDiscountForm({ ...discountForm, matchType: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
                        >
                          <option>Exact Match</option>
                          <option>Contains</option>
                          <option>Starts With</option>
                        </select>
                        {/* Custom Dropdown Arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Charge</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-600">₹</span>
                        <input
                          type="number"
                          value={discountForm.price}
                          onChange={(e) => setDiscountForm({ ...discountForm, price: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mb-8">
                    <button
                      onClick={addDiscountBasedRule}
                      disabled={!discountForm.discountCode.trim() || !discountForm.price}
                      className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 disabled:opacity-50 cursor-pointer"
                    >
                      Add Shipping
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Discount Code</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Match Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Charge</th>
                          <th className="py-3 px-4 text-right font-medium text-gray-700">Actions</th>
                          <th className="py-3 px-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {loading ? (
                          <tr><td colSpan={4} className="text-center py-12 text-gray-500">Loading...</td></tr>
                        ) : discountBasedRules.length === 0 ? (
                          <tr><td colSpan={4} className="text-center py-12 text-gray-500">No discount rules yet</td></tr>
                        ) : (
                          discountBasedRules.map((rule, index) => (
                            <tr key={index}>
                              <td className="py-4 px-4 font-medium">{rule.discountCode}</td>
                              <td className="py-4 px-4">{rule.matchType.toUpperCase()}</td>
                              <td className="py-4 px-4">₹{Number(rule.shippingCharge || 0).toFixed(2)}</td>
                              <td className="py-4 px-4">
                                <div className="flex justify-end gap-4">
                                  <button
                                    onClick={() => {
                                      setEditingDiscountRule(rule);
                                      setEditingDiscountIndex(index);
                                      setEditDiscountForm({
                                        discountCode: rule.discountCode || "",
                                        matchType: rule.matchType || "Exact Match",
                                        price: rule.shippingCharge?.toString() || "",
                                      });
                                    }}
                                    title="Edit"
                                    className="inline-block cursor-pointer"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    onClick={() => deleteDiscountBasedRule(index)}
                                    title="Delete"
                                    className="inline-block cursor-pointer"
                                  >
                                    <DeleteIcon />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Edit Modal for Discount Based */}
                  {editingDiscountRule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-8 rounded-xl max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-6">Edit Discount Based Rule</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Discount Code</label>
                            <input
                              type="text"
                              value={editDiscountForm.discountCode}
                              onChange={(e) => setEditDiscountForm({ ...editDiscountForm, discountCode: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Match Type</label>
                            <select
                              value={editDiscountForm.matchType}
                              onChange={(e) => setEditDiscountForm({ ...editDiscountForm, matchType: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option>Exact Match</option>
                              <option>Contains</option>
                              <option>Starts With</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Shipping Charge</label>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-600">₹</span>
                              <input
                                type="number"
                                value={editDiscountForm.price}
                                onChange={(e) => setEditDiscountForm({ ...editDiscountForm, price: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                          <button
                            onClick={() => {
                              setEditingDiscountRule(null);
                              setEditingDiscountIndex(-1);
                            }}
                            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={updateDiscountBasedRule}
                            className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!discountEnabled && (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl font-medium">Discount Based Shipping is currently disabled</p>
                  <p className="mt-4">Turn on the toggle above and save to start adding rules.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}