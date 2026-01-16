"use client";
import React, { useState, useEffect } from 'react';

const CreateManualDiscount = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [discountType, setDiscountType] = useState('Give Discount on Cart Items');
  const [minRequirement, setMinRequirement] = useState('No Minimum Requirements');
  const [applicableOn, setApplicableOn] = useState('All Products');
  const [valueType, setValueType] = useState('Percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [hasCapping, setHasCapping] = useState(false);
  const [topupGift, setTopupGift] = useState('No');
  const [cashback, setCashback] = useState('No');

  // Step 2: Conditions
  const [limitUsage, setLimitUsage] = useState(''); 
  const [totalUsageLimit, setTotalUsageLimit] = useState(''); 
  const [setEndDate, setSetEndDate] = useState(false);
  const [startDateTime, setStartDateTime] = useState('2026-01-06T10:14');
  const [endDateTime, setEndDateTime] = useState('');
  const [disableCod, setDisableCod] = useState(false);
  const [disablePrepaid, setDisablePrepaid] = useState(false);

  // Step 3: Combination (NEW)
  const [allowCombineManual, setAllowCombineManual] = useState('No'); // 'No' or 'Yes'
  const [allowOverwriteAuto, setAllowOverwriteAuto] = useState('No'); // 'No' or 'Only Specific Discount Codes'

  // Step 4: Customer Eligibility (NEW)
  const [customerEligibility, setCustomerEligibility] = useState('All Customers');
  const [channelWebsite, setChannelWebsite] = useState(true);
  const [channelMobile, setChannelMobile] = useState(true);
  const [utmEnabled, setUtmEnabled] = useState(false);

  // UTM Advanced Settings (only visible when utmEnabled = true)
  const [autoApplyCheckout, setAutoApplyCheckout] = useState(true);
  const [allowAllUtms, setAllowAllUtms] = useState(false);
  const [hideOtherCoupons, setHideOtherCoupons] = useState(false);
  const [makeUtmDefault, setMakeUtmDefault] = useState(false);
  const [matchType, setMatchType] = useState('Exact Match');
   const [user, setUser] = useState(null);


  // UTM Table Data
  const [utmRows, setUtmRows] = useState([]);
  const [newUtm, setNewUtm] = useState({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });

  // Step 5: Visibility - NEW
  const [showDiscountCode, setShowDiscountCode] = useState('No');

  // ── API states (only new addition) ──
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(false);

  
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

  const addUtmRow = () => {
    if (newUtm.source || newUtm.medium || newUtm.campaign || newUtm.term || newUtm.content) {
      setUtmRows([...utmRows, { ...newUtm, matchType }]);
      setNewUtm({ source: '', medium: '', campaign: '', term: '', content: '' });
    }
  };

  const deleteUtmRow = (index) => {
    setUtmRows(utmRows.filter((_, i) => i !== index));
  };

  const showSetupFields = discountCode.trim().length > 0;

  const generateDiscountCode = () => {
    const prefixes = ['SAVE', 'WELCOME', 'OFFER', 'DEAL', 'PROMO', 'FLASH', 'BIG', 'SUMMER', 'WINTER', 'NEW'];
    const suffixes = ['10', '15', '20', '25', '30', '50', 'FREE', 'EXTRA', 'PLUS', 'VIP'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    setDiscountCode(`${prefix}${suffix}`);
  };

  const handleCreateDiscount = async () => {
    if (!discountCode.trim() || !discountValue.trim()) {
      alert('Please fill Discount Code and Discount Value');
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setApiSuccess(false);

    const payload = {
      code: discountCode.trim().toUpperCase(),
      combinesWith: allowCombineManual === 'Yes',
      status: "active",
      visibility: showDiscountCode === 'Yes',
      metadata: {
        value: Number(discountValue) || 0,
        valueType: valueType === 'Percentage' ? 'percentage' : 'fixed_amount',
        appliesTo: applicableOn === 'All Products' ? 'entire_order' : 'specific_products',
        // You can add more fields here if your backend accepts them
      }
    };

    try {
      const response = await fetch('http://10.27.4.11:3000/api/discount/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API error: ${response.status}`);
      }

      setApiSuccess(true);
      alert('Discount created successfully!');

      // Optional: reset form after success
      // setCurrentStep(1);
      // setDiscountCode('');
      // ... other resets if needed

    } catch (err) {
      console.error('Create discount failed:', err);
      setApiError(err.message || 'Failed to create discount. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndProceed = () => {
    if (currentStep === 1 && (!discountCode.trim() || !discountValue.trim())) {
      alert('Please fill Discount Code and Discount Value to proceed.');
      return;
    }

    if (currentStep === 5) {
      handleCreateDiscount();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const steps = ['Setup', 'Conditions', 'Combination', 'Customer Eligibility', 'Visibility'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Create Manual Discount</h1>
          {/* <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Open Guide
          </button> */}
        </div>
        <button
          onClick={handleSaveAndProceed}
          disabled={isLoading}
          className={`px-6 py-2 rounded-md text-white font-medium transition ${
            currentStep === 5
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } disabled:opacity-60`}
        >
          {isLoading
            ? 'Creating...'
            : currentStep === 5
            ? 'Create Discount'
            : 'Save and Proceed'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left: Stepper and Form Area */}
        <div className="flex-1 p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index + 1 === currentStep
                        ? 'bg-blue-600'
                        : index + 1 < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </div>
                  <div
                    className={`ml-3 text-sm font-medium ${
                      index + 1 === currentStep
                        ? 'text-blue-600'
                        : index + 1 < currentStep
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-px mx-4 ${
                      index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-10">
            {/* Step 1: Setup */}
            {currentStep === 1 && (
              <>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Discount Code</h2>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="Enter code or generate one"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg uppercase"
                    />
                    <button
                      onClick={generateDiscountCode}
                      className="px-5 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 font-medium transition cursor-pointer"
                    >
                      Generate Code
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Customer must enter this code at checkout</p>
                </div>

                {showSetupFields && (
                  <>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">What should this discount do?</h3>
                      <div className="space-y-3">
                        {[
                          'Give Discount on Cart Items',
                          'Add Discounted Items to Cart',
                          'Give Bundle Discount',
                          'Give Tiered Discount',
                          'Give Shipping Discount',
                        ].map((option) => (
                          <label key={option} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="discount-type"
                              checked={discountType === option}
                              onChange={() => setDiscountType(option)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">What are the minimum purchase requirements?</h3>
                      <div className="flex flex-wrap gap-6">
                        {['No Minimum Requirements', 'Minimum Purchase Amount', 'Minimum Purchase Quantity'].map((opt) => (
                          <label key={opt} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="min-requirement"
                              checked={minRequirement === opt}
                              onChange={() => setMinRequirement(opt)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">What should this discount be applicable on?</h3>
                      <div className="flex flex-wrap gap-6">
                        {['All Products', 'Specific Collections', 'Specific Products'].map((opt) => (
                          <label key={opt} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="applicable-on"
                              checked={applicableOn === opt}
                              onChange={() => setApplicableOn(opt)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">Set discount properties</h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-6">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="discount-value-type"
                                checked={valueType === 'Percentage'}
                                onChange={() => setValueType('Percentage')}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="ml-3 text-gray-700">Percentage</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="discount-value-type"
                                checked={valueType === 'Fixed Amount'}
                                onChange={() => setValueType('Fixed Amount')}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="ml-3 text-gray-700">Fixed Amount</span>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={discountValue}
                              onChange={(e) => setDiscountValue(e.target.value)}
                              placeholder="Discount Value"
                              className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-600">{valueType === 'Percentage' ? '%' : '₹'}</span>
                          </div>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasCapping}
                            onChange={(e) => setHasCapping(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="ml-3 text-gray-700">Set Discount Capping</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">Top-up with gift?</h3>
                      <div className="flex gap-6">
                        {['No', 'Yes'].map((opt) => (
                          <label key={opt} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="topup-gift"
                              checked={topupGift === opt}
                              onChange={() => setTopupGift(opt)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="ml-3 text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-base font-medium text-gray-900 mb-4">Configure cashback on this coupon code</h3>
                      <div className="flex gap-6">
                        {['No', 'Yes'].map((opt) => (
                          <label key={opt} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="cashback"
                              checked={cashback === opt}
                              onChange={() => setCashback(opt)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="ml-3 text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 2: Conditions */}
            {currentStep === 2 && (
              <>
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Maximum discount usage</h3>
                  <div className="space-y-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="limit-usage"
                        checked={limitUsage === 'total'}
                        onChange={() => setLimitUsage('total')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">Limit Total Usage</span>
                    </label>
                    {limitUsage === 'total' && (
                      <div className="ml-8">
                        <input
                          type="number"
                          value={totalUsageLimit}
                          onChange={(e) => setTotalUsageLimit(e.target.value)}
                          placeholder="Enter total usage limit"
                          className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                      </div>
                    )}

                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="limit-usage"
                        checked={limitUsage === 'one-per-customer'}
                        onChange={() => setLimitUsage('one-per-customer')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">Limit One Usage Per Customer</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Active period</h3>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setEndDate}
                      onChange={(e) => setSetEndDate(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">Set End Date</span>
                  </label>
                </div>

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Start Date and Time</h3>
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {setEndDate && (
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">End Date and Time</h3>
                    <input
                      type="datetime-local"
                      value={endDateTime}
                      onChange={(e) => setEndDateTime(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={startDateTime}
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Payment specific controls</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disableCod}
                        onChange={(e) => setDisableCod(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">Disable Cash on Delivery on Application</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disablePrepaid}
                        onChange={(e) => setDisablePrepaid(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">Disable Prepaid Discounts on Application</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Combination */}
            {currentStep === 3 && (
              <div className="space-y-12">
                <h2 className="text-xl font-semibold text-gray-900">Combination</h2>

                <div className="space-y-10">
                  <div>
                    <p className="text-base font-medium text-gray-900 mb-5">
                      Allow customers to combine this discount with other manual discounts?
                    </p>
                    <div className="flex items-center gap-10">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="combine-manual"
                          checked={allowCombineManual === 'No'}
                          onChange={() => setAllowCombineManual('No')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">No</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="combine-manual"
                          checked={allowCombineManual === 'Yes'}
                          onChange={() => setAllowCombineManual('Yes')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">Yes</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-base font-medium text-gray-900 mb-5">
                      Allow customers to combine/overwrite pre-applied automatic discounts?
                    </p>
                    <div className="flex items-center gap-10">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="overwrite-auto"
                          checked={allowOverwriteAuto === 'No'}
                          onChange={() => setAllowOverwriteAuto('No')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">No</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="overwrite-auto"
                          checked={allowOverwriteAuto === 'Only Specific Discount Codes'}
                          onChange={() => setAllowOverwriteAuto('Only Specific Discount Codes')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">Only Specific Discount Codes</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Customer Eligibility */}
            {currentStep === 4 && (
              <div className="space-y-12">
                <h2 className="text-xl font-semibold text-gray-900">Customer eligibility</h2>

                <div className="space-y-10">
                  {/* Customer Type */}
                  <div>
                    <div className="space-y-4">
                      {[
                        'All Customers',
                        'New Customers Only',
                        'Existing Customers Only',
                        'Shopify Customer Segments',
                        'Specific Customers',
                      ].map((option) => (
                        <label key={option} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="customer-eligibility"
                            checked={customerEligibility === option}
                            onChange={() => setCustomerEligibility(option)}
                            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-4 text-gray-700 text-base">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sales channel control */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4">Sales channel control</h3>
                    <div className="space-y-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channelWebsite}
                          onChange={(e) => setChannelWebsite(e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">Website</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channelMobile}
                          onChange={(e) => setChannelMobile(e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">Mobile Application</span>
                      </label>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-blue-800">
                        GoKwik checkout needs to be active on your mobile app to control discounts on mobile app specifically.{' '}
                        <a href="#" className="underline hover:text-blue-900">Learn more.</a>
                      </p>
                    </div>
                  </div>

                  {/* UTM Parameters Toggle */}
                  <div>
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setUtmEnabled(!utmEnabled)}>
                      <p className="text-base font-medium text-gray-900">
                        Do you want this to work on specific UTM parameters?
                      </p>
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          utmEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            utmEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-blue-800">
                        Enabling this will ensure that this discount will only applicable on specific UTMs.
                      </p>
                    </div>

                    {utmEnabled && (
                      <div className="mt-8 space-y-8">
                        {/* Toggle Options */}
                        <div className="space-y-6">
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-base text-gray-900">Auto-apply this discount on Checkout</span>
                            <button
                              type="button"
                              onClick={() => setAutoApplyCheckout(!autoApplyCheckout)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                autoApplyCheckout ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoApplyCheckout ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </label>

                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-base text-gray-900">Allow discount application on all UTMs</span>
                            <button
                              type="button"
                              onClick={() => setAllowAllUtms(!allowAllUtms)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                allowAllUtms ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowAllUtms ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </label>

                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-base text-gray-900">Hide other coupon codes in View Offers</span>
                            <button
                              type="button"
                              onClick={() => setHideOtherCoupons(!hideOtherCoupons)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                hideOtherCoupons ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hideOtherCoupons ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </label>

                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-base text-gray-900">Make UTM discount default recommended</span>
                            <button
                              type="button"
                              onClick={() => setMakeUtmDefault(!makeUtmDefault)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                makeUtmDefault ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${makeUtmDefault ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </label>
                        </div>

                        {/* Match Type */}
                        <div>
                          <p className="text-base font-medium text-gray-900 mb-4">Select a Match Type</p>
                          <p className="text-sm text-gray-600 mb-4">This defines the matching criteria for the UTM parameters.</p>
                          <div className="flex gap-6 flex-wrap">
                            {['Exact Match', 'Starts With', 'Ends With', 'Contains'].map((type) => (
                              <label key={type} className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name="match-type"
                                  checked={matchType === type}
                                  onChange={() => setMatchType(type)}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="ml-3 text-gray-700">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* UTM Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="UTM Source"
                            value={newUtm.source}
                            onChange={(e) => setNewUtm({ ...newUtm, source: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="UTM Medium"
                            value={newUtm.medium}
                            onChange={(e) => setNewUtm({ ...newUtm, medium: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="UTM Campaign"
                            value={newUtm.campaign}
                            onChange={(e) => setNewUtm({ ...newUtm, campaign: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="UTM Term"
                            value={newUtm.term}
                            onChange={(e) => setNewUtm({ ...newUtm, term: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="UTM Content"
                            value={newUtm.content}
                            onChange={(e) => setNewUtm({ ...newUtm, content: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={addUtmRow}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition cursor-pointer"
                          >
                            Add UTM
                          </button>
                        </div>

                        {/* UTM Table */}
                        <div className="mt-6">
                          <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                              <tr>
                                <th className="px-4 py-3">UTM Source</th>
                                <th className="px-4 py-3">UTM Medium</th>
                                <th className="px-4 py-3">UTM Campaign</th>
                                <th className="px-4 py-3">UTM Term</th>
                                <th className="px-4 py-3">UTM Content</th>
                                <th className="px-4 py-3">Match Type</th>
                                <th className="px-4 py-3">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {utmRows.length === 0 ? (
                                <tr>
                                  <td colSpan="7" className="text-center py-10 text-gray-400">
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                                      No data
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                utmRows.map((row, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="px-4 py-3">{row.source || '-'}</td>
                                    <td className="px-4 py-3">{row.medium || '-'}</td>
                                    <td className="px-4 py-3">{row.campaign || '-'}</td>
                                    <td className="px-4 py-3">{row.term || '-'}</td>
                                    <td className="px-4 py-3">{row.content || '-'}</td>
                                    <td className="px-4 py-3">{row.matchType}</td>
                                    <td className="px-4 py-3">
                                      <button
                                        onClick={() => deleteUtmRow(index)}
                                        className="text-red-600 hover:text-red-800 cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Visibility + API Feedback */}
            {currentStep === 5 && (
              <div className="space-y-12">
                <h2 className="text-xl font-semibold text-gray-900">Visibility</h2>

                <div className="space-y-8">
                  <div>
                    <p className="text-base font-medium text-gray-900 mb-6">
                      Show discount code to the customer on checkout?
                    </p>
                    <div className="flex items-center gap-12">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="show-discount-code"
                          checked={showDiscountCode === 'No'}
                          onChange={() => setShowDiscountCode('No')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">No</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="show-discount-code"
                          checked={showDiscountCode === 'Yes'}
                          onChange={() => setShowDiscountCode('Yes')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-gray-700 text-base">Yes</span>
                      </label>
                    </div>
                  </div>

                  {apiError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      Error: {apiError}
                    </div>
                  )}

                  {apiSuccess && (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                      <div className="text-5xl mb-4">🎉</div>
                      <p className="text-xl font-medium text-green-800">
                        Discount created successfully!
                      </p>
                      <p className="mt-2 text-green-700">
                        Code: <strong>{discountCode}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Summary */}
        <div className="w-80 bg-gray-100 border-l border-gray-300 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-700">Manual Discount Code</span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-900">
                {discountCode || 'EDG'}
              </span>
              {currentStep === 5 && (
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                  Active
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-6 text-sm">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Setup</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• {discountType}</li>
                <li>• {minRequirement}</li>
                <li>• Discount applicable on {applicableOn.toLowerCase()}</li>
                <li>• Discount value: {discountValue || '6'}%</li>
                <li>• {topupGift === 'No' ? 'No' : 'With'} free gifts</li>
                <li>• {cashback === 'No' ? 'No' : 'With'} cashback</li>
              </ul>
            </div>

            {currentStep >= 2 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Conditions</h3>
                <ul className="space-y-1 text-gray-600">
                  {limitUsage === 'total' && totalUsageLimit && <li>• Can be used {totalUsageLimit} times</li>}
                  {limitUsage === 'one-per-customer' && <li>• One use per customer</li>}
                  <li>• Valid from 06 January to {setEndDate && endDateTime ? '08 January' : 'No end date'}</li>
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Combinations</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• {allowCombineManual === 'Yes' ? 'Can' : 'Does not'} combine with any manual discounts</li>
                <li>• {allowCombineManual === 'Yes' ? 'Can' : 'Does not'} combine with any automatic discounts</li>
                <li>• {allowOverwriteAuto === 'Only Specific Discount Codes' ? 'Can replace' : 'Does not replace'} any automatic discounts</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Customer Eligibility</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• {customerEligibility === 'All Customers' ? 'All customers are eligible for this discount' : customerEligibility}</li>
                <li>• Available on {channelWebsite && channelMobile ? 'both website and mobile app' : channelWebsite ? 'website only' : channelMobile ? 'mobile app only' : 'no channel'}</li>
                {utmEnabled && <li>• UTM parameters required</li>}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Visibility</h3>
              <ul className="space-y-1 text-gray-600">
               <li>• Discount {showDiscountCode === 'Yes' ? 'to be shown' : 'not to be shown'} on the checkout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateManualDiscount;