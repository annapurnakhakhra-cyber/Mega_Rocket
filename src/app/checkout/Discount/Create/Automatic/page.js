// File: src/app/checkout/Discount/Create/Automatic/page.tsx
// Recommended: Rename your file to page.tsx if using TypeScript
// If keeping page.js, remove all type annotations (e.g., : any) if errors occur

'use client';

import React, { useState, useEffect } from 'react';

// const STORE_ID = 'swing-9926.myshopify.com';
// Use this proxy path if you added the rewrite in next.config.js
// Otherwise, keep your original https://adminrocket.megascale.co.in/api/discount/automatic
const API_URL = '/api/discount/automatic';  // ← Proxy recommended to fix CORS

export default function ConfigureAutomaticDiscount() {
  const [form, setForm] = useState({
    discountCode: '',
    matchType: 'Exact Match',
    combinesWith: 'No',
    replacedBy: 'No',
    disableCOD: false,
    disablePrepaid: false,
    salesChannels: {
      website: true,
      mobileApp: true,
    },
    status: 'draft',
  });

  const [summary, setSummary] = useState({
    combines: 'Combines with no manual discounts',
    replaces: 'Replaces no manual discounts',
    payment: 'COD enabled, Prepaid discounts enabled',
    channels: 'Website, Mobile Application',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
    const [user, setUser] = useState(null);

  // Real-time summary update
  useEffect(() => {
    const combinesText =
      form.combinesWith === 'No'
        ? 'Combines with no manual discounts'
        : form.combinesWith === 'Yes'
        ? 'Combines with all manual discounts'
        : 'Combines with specific manual discounts only';

    const replacesText =
      form.replacedBy === 'No'
        ? 'Replaces no manual discounts'
        : form.replacedBy === 'Yes'
        ? 'Replaces all manual discounts'
        : 'Replaces specific manual discounts only';

    const paymentParts = [];
    paymentParts.push(form.disableCOD ? 'COD disabled' : 'COD enabled');
    paymentParts.push(form.disablePrepaid ? 'Prepaid discounts disabled' : 'Prepaid discounts enabled');

    const channels = [];
    if (form.salesChannels.website) channels.push('Website');
    if (form.salesChannels.mobileApp) channels.push('Mobile Application');

    setSummary({
      combines: combinesText,
      replaces: replacesText,
      payment: paymentParts.join(', '),
      channels: channels.length ? channels.join(', ') : 'No channels selected',
    });
  }, [form]);

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

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleChannelChange = (channel) => {
    setForm((prev) => ({
      ...prev,
      salesChannels: {
        ...prev.salesChannels,
        [channel]: !prev.salesChannels[channel],
      },
    }));
  };

  const saveDiscount = async () => {
    // Validation
    if (!form.discountCode.trim()) {
      setError('Please enter a discount code');
      return;
    }
    if (!form.salesChannels.website && !form.salesChannels.mobileApp) {
      setError('Please select at least one sales channel');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      title: form.discountCode.trim() || `Auto Discount - ${new Date().toISOString().slice(0, 10)}`,
      combinesWith: form.combinesWith !== 'No',
      status: 'active',
      visibility: form.salesChannels.mobileApp,
      metadata: {
        value: 15,
        valueType: 'percentage',
        minimumPurchase: 1000,
        appliesTo: 'specific_collections',
        matchType: form.matchType.toLowerCase().replace(' ', '_'),
        disableCOD: form.disableCOD,
        disablePrepaid: form.disablePrepaid,
        salesChannels: Object.keys(form.salesChannels).filter(
          (ch) => form.salesChannels[ch]
        ),
      },
    };

    console.log('Sending payload:', payload); // Debug: Check what is sent

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
          // Origin header optional with proxy
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status); // Debug

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server responded with ${response.status}`);
      }

      const result = await response.json(); // If backend returns JSON
      console.log('Success response:', result); // Debug

      setSuccess(true);
      setForm((prev) => ({ ...prev, status: 'active' }));
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save discount configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Automatic Discount Configuration</h1>
            <span className="text-sm text-gray-500">Draft</span>
          </div>
          <button
            type="button"  // Important: prevents form submit behavior
            onClick={saveDiscount}
            disabled={isSaving}
            className={`
              px-8 py-2.5 rounded-lg font-medium transition-all
              ${isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
              }
            `}
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg">
            Error: {error}
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-lg">
            ✓ Configuration saved successfully! Status updated to Active.
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Discount Code Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-7">
              <h2 className="text-xl font-semibold text-gray-800 mb-5">Automatic Discount Code</h2>
              <input
                name="discountCode"
                type="text"
                value={form.discountCode}
                onChange={handleTextChange}
                placeholder="Enter discount code (e.g., WINTER15OFF)"
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-lg"
              />
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 5a1 1 0 112 0 1 1 0 01-2 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p>Please ensure this discount code is pre-created and tested in your system.</p>
              </div>
            </section>

            {/* Match Type */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-7">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Match Type</h2>
              <p className="text-gray-600 mb-6 text-sm">Defines how the discount code should match user input</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {['Exact Match', 'Starts With', 'Ends With', 'Contains'].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="matchType"
                      value={type}
                      checked={form.matchType === type}
                      onChange={handleRadioChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Combinations */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-7">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Combinations</h2>
              <div className="space-y-8">
                <div>
                  <p className="text-gray-700 font-medium mb-4">Club with manual discount codes?</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {['No', 'Yes', 'Only Specific Discount Codes'].map((opt) => (
                      <label key={opt} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="combinesWith"
                          value={opt}
                          checked={form.combinesWith === opt}
                          onChange={handleRadioChange}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 font-medium mb-4">Replace manual discount codes?</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {['No', 'Yes', 'Only Specific Discount Codes'].map((opt) => (
                      <label key={opt} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="replacedBy"
                          value={opt}
                          checked={form.replacedBy === opt}
                          onChange={handleRadioChange}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Payment & Sales Channels */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-7">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Restrictions & Controls</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Payment Methods</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="disableCOD"
                        checked={form.disableCOD}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">Disable Cash on Delivery</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="disablePrepaid"
                        checked={form.disablePrepaid}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">Disable Prepaid Discounts</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Sales Channels</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.salesChannels.website}
                        onChange={() => handleChannelChange('website')}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">Website</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={form.salesChannels.mobileApp}
                        onChange={() => handleChannelChange('mobileApp')}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="ml-3 text-gray-700">Mobile Application</span>
                    </label>
                  </div>
                  <div className="mt-5 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-3">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 5a1 1 0 112 0 1 1 0 01-2 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>
                      GoKwik checkout must be active for mobile app-specific discount control.{' '}
                      <a href="#" className="underline font-medium hover:text-blue-900">Learn more</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Summary Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-7 sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    form.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {form.status === 'active' ? 'Active' : 'Draft'}
                </span>
              </div>

              <div className="space-y-7 text-sm">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Combinations</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>{summary.combines}</li>
                    <li>{summary.replaces}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Payment Controls</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>{summary.payment.split(', ')[0]}</li>
                    <li>{summary.payment.split(', ')[1]}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Sales Channels</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>{summary.channels}</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}