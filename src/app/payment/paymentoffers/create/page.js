'use client';
import React, { useState, useEffect } from 'react';

export default function CreatePaymentOfferPage() {
  // ── Basic Details ───────────────────────────────────────────────
  const [discountCode, setDiscountCode] = useState('FGHJ');
  const [offerName, setOfferName] = useState('Fghi');
  const [offerTitle, setOfferTitle] = useState('Get ₹1000 Off');
  const [offerSubtitle, setOfferSubtitle] = useState('On UPI payments');
  const [offerDescription, setOfferDescription] = useState('Exclusive discount for UPI users');
  const [termsConditions, setTermsConditions] = useState('Valid once per user');
  const [logoUrl, setLogoUrl] = useState('');
  const [viewInListing, setViewInListing] = useState('Yes');
  const [isPartnerOffer, setIsPartnerOffer] = useState(false);
  const [startDate, setStartDate] = useState('2026-01-15');
  const [endDate, setEndDate] = useState('2026-01-30');

  // ── Conditions ──────────────────────────────────────────────────
  const [discountType, setDiscountType] = useState('Fixed');
  const [discountAmount, setDiscountAmount] = useState('1000');
  const [maxTotalUsage, setMaxTotalUsage] = useState('10000');
  const [maxPerCustomer, setMaxPerCustomer] = useState('');
  const [minCartValue, setMinCartValue] = useState('10000');
  const [maxCartValue, setMaxCartValue] = useState('100000');
  const [skuRestriction, setSkuRestriction] = useState('Yes');

  // ── Applicable On ───────────────────────────────────────────────
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
  const [methodOfApplication, setMethodOfApplication] = useState('Coupon Based');

  // ── UI / Flow States ────────────────────────────────────────────
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
   const [user, setUser] = useState(null);

  // ── API Config (change in production!) ──────────────────────────
  const API_BASE_URL = 'http://10.27.4.11:3000';
 

  
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

  const getPayload = () => ({
    discountCode: discountCode.trim() || 'DEFAULT_CODE',
    offerName: offerName.trim() || 'New Offer',
    offerTitle: offerTitle.trim(),
    offerSubtitle: offerSubtitle.trim(),
    offerDescription: offerDescription.trim(),
    termsConditions: termsConditions.trim(),
    logoUrl: logoUrl.trim(),
    viewInListing,
    isPartnerOffer,
    startDate,
    endDate,
    discountType,
    discountAmount: discountAmount || '0',
    maxTotalUsage: maxTotalUsage || '0',
    maxPerCustomer: maxPerCustomer || null,
    minCartValue: minCartValue || '0',
    maxCartValue: maxCartValue || null,
    skuRestriction,
    selectedPaymentMethod,
    methodOfApplication,
  });

  const saveOffer = async (publish = false) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...getPayload(),
        status: publish ? 'published' : 'draft',
      };

      const response = await fetch(`${API_BASE_URL}/api/payment-offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shop-Id': SHOP_ID,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData.message || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (publish) {
        alert('Offer Published Successfully!');
        // Optional: window.location.href = '/payment-offers/list';
      } else {
        alert('Draft saved successfully!');
      }

      console.log('Success:', result);
      return result;
    } catch (err) {
      console.error('API Error:', err);
      const msg = err.message || 'Failed to save offer. Please try again.';
      setError(msg);
      alert(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
      return;
    }

    // Last step → Publish
    await saveOffer(true);
  };

  const handleSaveAsDraft = async () => {
    await saveOffer(false);
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Create Payment Offer</h1>

            <div className="flex items-center gap-4">
              {activeStep > 0 && (
                <button
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
              )}

              <button
                onClick={handleSaveAsDraft}
                disabled={isSubmitting}
                className={`px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium min-w-[140px]
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>

              <button
                onClick={handleSaveAndNext}
                disabled={isSubmitting}
                className={`px-6 py-2.5 min-w-[140px] rounded-lg font-medium text-white
                  ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
              >
                {isSubmitting
                  ? 'Processing...'
                  : activeStep === 2
                  ? 'Publish Offer'
                  : 'Save & Next'}
              </button>
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex justify-center">
            <div className="flex items-center gap-16 md:gap-24 relative">
              {['Basic Details', 'Conditions', 'Applicable On'].map((step, i) => (
                <div key={step} className="relative flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                      i < activeStep
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : i === activeStep
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-gray-300 text-gray-500 bg-gray-100'
                    }`}
                  >
                    {i < activeStep ? '✓' : i + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      i === activeStep ? 'text-blue-700' : 'text-gray-600'
                    }`}
                  >
                    {step}
                  </span>

                  {i === activeStep && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-600" />
                  )}

                  {i < 2 && (
                    <div className="absolute top-4 left-full w-20 h-0.5 bg-gray-300 -translate-y-1/2 ml-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* STEP 1 - Basic Details */}
              {activeStep === 0 && (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-xl font-semibold mb-6">Offer Information</h3>
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Code *
                        </label>
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. FGHI"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Offer Name *
                        </label>
                        <input
                          type="text"
                          value={offerName}
                          onChange={(e) => setOfferName(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. UPI Festive Discount"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Offer Title
                        </label>
                        <input
                          type="text"
                          value={offerTitle}
                          onChange={(e) => setOfferTitle(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Get ₹1000 Off"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Offer Subtitle
                        </label>
                        <textarea
                          value={offerSubtitle}
                          onChange={(e) => setOfferSubtitle(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                          placeholder="e.g. On UPI payments only"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={offerDescription}
                          onChange={(e) => setOfferDescription(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[110px]"
                          placeholder="Detailed description of the offer..."
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-6">Additional Settings</h3>
                    <div className="grid gap-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Terms & Conditions
                        </label>
                        <textarea
                          value={termsConditions}
                          onChange={(e) => setTermsConditions(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
                          placeholder="Terms and conditions..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo URL (optional)
                        </label>
                        <input
                          type="url"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Show in Listing?
                        </label>
                        <div className="flex gap-12">
                          {['Yes', 'No'].map((opt) => (
                            <label key={opt} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="viewInListing"
                                value={opt}
                                checked={viewInListing === opt}
                                onChange={(e) => setViewInListing(e.target.value)}
                                className="w-5 h-5 text-blue-600"
                              />
                              <span className="ml-3 text-gray-800">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={isPartnerOffer}
                            onChange={(e) => setIsPartnerOffer(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="text-gray-800 font-medium">
                            This is a Partner Offer
                          </span>
                        </label>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-4">Validity Period</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-4 py-3"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* STEP 2 - Conditions */}
              {activeStep === 1 && (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-xl font-semibold mb-6">Discount Type</h3>
                    <div className="flex gap-12">
                      {['Fixed', 'Percentage'].map((type) => (
                        <label key={type} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="discountType"
                            value={type}
                            checked={discountType === type}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="ml-3 font-medium">{type}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-6">Discount Value</h3>
                    <div className="max-w-sm relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                        {discountType === 'Percentage' ? '%' : '₹'}
                      </span>
                      <input
                        type="text"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 1000"
                      />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-6">Usage Limits</h3>
                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Usage Limit
                        </label>
                        <input
                          type="text"
                          value={maxTotalUsage}
                          onChange={(e) => setMaxTotalUsage(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 10000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Per Customer (optional)
                        </label>
                        <input
                          type="text"
                          value={maxPerCustomer}
                          onChange={(e) => setMaxPerCustomer(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Leave empty for unlimited"
                        />
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-6">Cart Value Restrictions</h3>
                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Cart Value
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                          <input
                            type="text"
                            value={minCartValue}
                            onChange={(e) => setMinCartValue(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Cart Value (optional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                          <input
                            type="text"
                            value={maxCartValue}
                            onChange={(e) => setMaxCartValue(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="No limit"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-6">SKU Restriction</h3>
                    <div className="flex gap-12">
                      {['Yes', 'No'].map((opt) => (
                        <label key={opt} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="skuRestriction"
                            value={opt}
                            checked={skuRestriction === opt}
                            onChange={(e) => setSkuRestriction(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="ml-3 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* STEP 3 - Applicable On */}
              {activeStep === 2 && (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-xl font-semibold mb-6">Applicable Payment Method</h3>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-full max-w-md px-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select payment method</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Wallet">Wallet</option>
                    </select>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-6">Application Method</h3>
                    <div className="flex gap-12">
                      {['Coupon Based', 'Auto Apply'].map((method) => (
                        <label key={method} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="methodOfApplication"
                            value={method}
                            checked={methodOfApplication === method}
                            onChange={(e) => setMethodOfApplication(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="ml-3 font-medium">{method}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-6">Offer Summary</h3>

              <div className="space-y-8 text-sm">
                <div>
                  <p className="text-gray-500 font-medium mb-3 uppercase tracking-wide text-xs">
                    Basic Details
                  </p>
                  <div className="space-y-1.5">
                    <p>Code: <span className="font-medium">{discountCode || '-'}</span></p>
                    <p>Name: <span className="font-medium">{offerName || '-'}</span></p>
                    <p>Title: <span className="font-medium">{offerTitle || '-'}</span></p>
                    <p>Period: <span className="font-medium">
                      {startDate ? new Date(startDate).toLocaleDateString('en-IN') : '-'} – 
                      {endDate ? new Date(endDate).toLocaleDateString('en-IN') : '-'}
                    </span></p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-3 uppercase tracking-wide text-xs">
                    Discount
                  </p>
                  <div className="space-y-1.5">
                    <p>Type: <span className="font-medium">{discountType}</span></p>
                    <p>Value: <span className="font-medium">
                      {discountType === 'Percentage' ? `${discountAmount}%` : `₹${discountAmount}`}
                    </span></p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-3 uppercase tracking-wide text-xs">
                    Limits
                  </p>
                  <div className="space-y-1.5">
                    <p>Total: <span className="font-medium">{maxTotalUsage || 'Unlimited'}</span></p>
                    <p>Min Cart: <span className="font-medium">₹{minCartValue || '0'}</span></p>
                    <p>Max Cart: <span className="font-medium">
                      {maxCartValue ? `₹${maxCartValue}` : 'No limit'}
                    </span></p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-3 uppercase tracking-wide text-xs">
                    Payment
                  </p>
                  <div className="space-y-1.5">
                    <p>Method: <span className="font-medium">{selectedPaymentMethod || '-'}</span></p>
                    <p>Apply: <span className="font-medium">{methodOfApplication}</span></p>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="text-gray-500 mb-4 font-medium">Preview</p>
                <div className="bg-gray-50 rounded-xl p-5 border border-dashed border-gray-300 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-lg">
                    {discountCode.slice(0,4)}
                  </div>
                  <div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full inline-block mb-2">
                      Payment Offer
                    </div>
                    <p className="text-gray-800 font-medium">
                      {discountType === 'Percentage'
                        ? `Get ${discountAmount}% Off`
                        : `Save ₹${discountAmount}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{offerSubtitle || 'Special offer'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}