"use client";

import { useState } from "react";

export default function ShippingAdmin() {
  const [activeTab, setActiveTab] = useState("method");
  const [priceBasis, setPriceBasis] = useState("Discounted Price");
  const [discountEnabled, setDiscountEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Shipping</h1>
          <p className="text-sm text-gray-600 mt-1">
            This section enables you to choose where you ship and how much you charge for shipping at checkout.
          </p>
          <a href="#" className="text-sm text-blue-600 hover:underline cursor-pointer mt-2 inline-block">
            Open Guide
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tabs - Responsive */}
        <div className="flex flex-wrap border-b border-gray-300 mb-8 gap-2">
          {[
            { id: "method", label: "Shipping Method" },
            { id: "weight", label: "Weight Based Shipping" },
            { id: "discount", label: "Discount Based Shipping" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">

          {/* ==================== SHIPPING METHOD TAB ==================== */}
          {activeTab === "method" && (
            <>
              {/* Price Basis */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <label className="text-sm font-medium text-gray-700">
                  Shipping method should be applicable on which price?
                </label>
                <div className="flex items-center gap-4">
                  <select
                    value={priceBasis}
                    onChange={(e) => setPriceBasis(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>Discounted Price</option>
                    <option>Original Price</option>
                  </select>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
                    Save
                  </button>
                </div>
              </div>

              {/* Add New Rule Form - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
                <div className="lg:col-span-1">
                  <label className="text-xs text-gray-500 mb-1 block">Shipping Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Express"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Shipping Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Min Order Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Max Order Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-600">₹</span>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <button className="text-blue-600 text-sm font-medium underline hover:text-blue-800 cursor-pointer">
                  Advanced Conditions
                </button>
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
                  Add Shipping
                </button>
              </div>

              {/* Table - Horizontally Scrollable on Mobile */}
              <div className="overflow-x-auto -mx-6 sm:mx-0">
                <table className="w-full text-sm min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Minimum Order Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Maximum Order Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Method</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">PIN Code</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customer Cohort</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 px-4 text-blue-600">#8952</td>
                      <td className="py-4 px-4">Prepaid Shipping | Delivers 3-6 Days</td>
                      <td className="py-4 px-4">₹0.00</td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4">₹499.00</td>
                      <td className="py-4 px-4">UPI</td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4 text-right cursor-pointer">⋯</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-blue-600">#7422</td>
                      <td className="py-4 px-4">COD Shipping | Deliver 5-10 Days</td>
                      <td className="py-4 px-4">₹0.00</td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4">₹499.00</td>
                      <td className="py-4 px-4">COD</td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4 text-right cursor-pointer">⋯</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 text-blue-600">#5840</td>
                      <td className="py-4 px-4">Free Shipping</td>
                      <td className="py-4 px-4">₹0.00</td>
                      <td className="py-4 px-4">₹499.01</td>
                      <td className="py-4 px-4">NA</td>
                      <td className="py-4 px-4">ALL</td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4"></td>
                      <td className="py-4 px-4 text-right cursor-pointer">⋯</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tip */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  i
                </div>
                <div className="text-sm text-blue-800">
                  <p>You can set product level shipping on Shopify. Just add ship@price tag on Shopify.</p>
                  <p className="mt-2">
                    Eg: To set free shipping for a product, add <code className="bg-blue-100 px-1 rounded">ship@0</code> tag.<br />
                    To set a shipping price, add <code className="bg-blue-100 px-1 rounded">ship@price</code> tag.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ==================== WEIGHT BASED SHIPPING ==================== */}
          {activeTab === "weight" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="lg:col-span-1">
                  <label className="text-xs text-gray-600 mb-1 block">Shipping Name</label>
                  <input
                    type="text"
                    placeholder="Enter"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Shipping ID</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                    <option></option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Min Weight</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 whitespace-nowrap">KG</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Max Weight</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600 whitespace-nowrap">KG</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Shipping Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-600 text-lg">₹</span>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <button className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
                  Add Shipping
                </button>
                <button className="border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
                  Save
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Min Weight</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Max Weight</th>
                      <th className="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-4 px-4 text-blue-600">#8952</td>
                      <td className="py-4 px-4">Shipping1</td>
                      <td className="py-4 px-4">₹50.00</td>
                      <td className="py-4 px-4">0.01 KG</td>
                      <td className="py-4 px-4">0.5 KG</td>
                      <td className="py-4 px-4 text-right cursor-pointer">⋮</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ==================== DISCOUNT BASED SHIPPING ==================== */}
          {activeTab === "discount" && (
            <>
              <div className="flex justify-between items-center mb-10">
                <label className="text-sm font-medium text-gray-700">
                  Enable Discount Based Shipping
                </label>
                <button
                  type="button"
                  onClick={() => setDiscountEnabled(!discountEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                    discountEnabled ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                      discountEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {discountEnabled ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="lg:col-span-1">
                      <label className="text-xs text-gray-600 mb-1 block">Discount Code</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <label className="text-xs text-gray-600 mb-1 block">Match Type</label>
                      <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <option></option>
                        <option>Exact Match</option>
                        <option>Contains</option>
                        <option>Starts With</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Shipping Charge</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-600 text-lg">₹</span>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <button className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer">
                      Add Shipping
                    </button>
                    <button className="border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer">
                      Save
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Discount Code</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Match Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Shipping Charge</th>
                          <th className="py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <div className="flex flex-col items-center text-gray-400">
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
                              <p className="text-lg">No Data</p>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="mx-auto max-w-md">
                    <p className="text-xl font-medium">Discount Based Shipping is currently disabled.</p>
                    <p className="text-sm mt-3">Turn on the toggle above to start configuring shipping rules based on discount codes.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}