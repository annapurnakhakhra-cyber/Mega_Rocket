'use client';
import { useState } from 'react';

export default function CreateBulkDiscount() {
  const [currentStep, setCurrentStep] = useState(1); // 1=Setup, 2=Conditions, 3=Combination, 4=Customer Eligibility, 5=Generate Codes
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); const [errorMessage, setErrorMessage] = useState('');

  // Step 1: Setup states (exactly as your original code - no changes, no cuts)
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState('cartDiscount');
  const [minRequirement, setMinRequirement] = useState('none');
  const [applicableOn, setApplicableOn] = useState('all');
  const [discountSelectType, setDiscountSelectType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [capping, setCapping] = useState(false);
  const [topUpGift, setTopUpGift] = useState('no');
  const [cashback, setCashback] = useState('no');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
  const [minPurchaseQuantity, setMinPurchaseQuantity] = useState('');
  const [discountCapValue, setDiscountCapValue] = useState('');
  const [topUpGiftValue, setTopUpGiftValue] = useState('');
  // Cashback states
  const [cashbackApplicableOn, setCashbackApplicableOn] = useState('specificProducts');
  const [cashbackType, setCashbackType] = useState('percentage');
  const [cashbackValue, setCashbackValue] = useState('');
  const [savingBannerMessage, setSavingBannerMessage] = useState('');
  const [cashbackCalculatedOn, setCashbackCalculatedOn] = useState('subtotal');
  // Step 2: Conditions states - exactly as your screenshot
  const [allowMultipleUsage, setAllowMultipleUsage] = useState(true);
  const [multipleUsageCount, setMultipleUsageCount] = useState('6');
  const [setEndDate, setSetEndDate] = useState(false);
  const [startDateTime, setStartDateTime] = useState('2026-01-08T11:22');
  const [disableCod, setDisableCod] = useState(false);
  // Step 3: Combination states
  const [combineWithManual, setCombineWithManual] = useState(false);
  const [combineWithAuto, setCombineWithAuto] = useState('no');
  // Step 4: Customer Eligibility states - NEW
  const [customerEligibility, setCustomerEligibility] = useState('all'); // default: All Customers
  const [salesChannelWebsite, setSalesChannelWebsite] = useState(true);
  const [salesChannelMobile, setSalesChannelMobile] = useState(true);
  const [specificCustomerMode, setSpecificCustomerMode] = useState('include');
  const [identificationMethod, setIdentificationMethod] = useState('email');
  // Step 5: Generate Codes states - NEW
  const [codeGenerationMethod, setCodeGenerationMethod] = useState('generate'); // 'generate' or 'upload'
  const [numberOfCodes, setNumberOfCodes] = useState('');
  const [codeLength, setCodeLength] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-04-08T23:59');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');

  // Visibility logic
  const showFormSections = title.trim().length > 0;
  const showCashbackSection = cashback === 'yes';
  const showStep1 = currentStep === 1;
  const showStep2 = currentStep === 2;
  const showStep3 = currentStep === 3;
  const showStep4 = currentStep === 4;
  const showStep5 = currentStep === 5;
  const showAutoDiscountSection = combineWithManual === true;
  const showSpecificCustomersSection = customerEligibility === 'specific';
  const showExistingCustomersSection = customerEligibility === 'existing';

  const handleSaveAndProceed = async () => {
    if (currentStep === 1 && title.trim().length > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Final submission
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const payload = {
        title: title.trim().toUpperCase(),
        discountType: discountType === 'cartDiscount' ? 'order' : discountType,
        minRequirement: minRequirement === 'none' ? null : minRequirement,
        minPurchaseAmount: minRequirement === 'amount' ? Number(minPurchaseAmount) || null : null,
        minPurchaseQuantity: minRequirement === 'quantity' ? Number(minPurchaseQuantity) || null : null,
        applicableOn:
          applicableOn === 'all' ? 'all_products' :
            applicableOn === 'collections' ? 'collections' :
              'specific_products',
        discountSelectType: discountSelectType,
        discountValue: Number(discountValue) || 0,
        capping: capping,
        discountCapValue: capping ? Number(discountCapValue) || null : null,
        topUpGift: topUpGift,
        cashback: cashback,
        allowMultipleUsage: allowMultipleUsage,
        multipleUsageCount: allowMultipleUsage ? Number(multipleUsageCount) || 1 : 1,
        setEndDate: setEndDate,
        // Properly convert datetime-local value to ISO string
        startDateTime: startDateTime ? new Date(startDateTime).toISOString() : null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        disableCod: disableCod,
        combineWithManual: combineWithManual,
        combineWithAuto: combineWithAuto !== 'no',
        customerEligibility: customerEligibility,
        salesChannelWebsite: salesChannelWebsite,
        salesChannelMobile: salesChannelMobile,
        codeGenerationMethod: codeGenerationMethod,
        numberOfCodes: codeGenerationMethod === 'generate' ? Number(numberOfCodes) || 0 : null,
        codeLength: codeGenerationMethod === 'generate' ? Number(codeLength) || null : null,
        prefix: prefix.trim().toUpperCase(),
        suffix: suffix.trim().toUpperCase(),
      };

      const response = await fetch('/api/discount/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': 'annapurnakhakhra', // You can make this dynamic later if needed
          'Origin': window.location.origin,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errData = {};
        try {
          errData = await response.json();
        } catch (e) {
          // If JSON parsing fails, fall back to text
          throw new Error(await response.text() || 'Failed to create bulk discount');
        }
        throw new Error(errData.message || 'Failed to create bulk discount');
      }

      const result = await response.json();
      console.log('Success:', result);
      setSubmitStatus('success');
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'An error occurred while creating the discount.');
    } finally {
      setLoading(false);
    }
  };

  // Helper texts for summary
  const discountTypeText = {
    cartDiscount: 'Give Discount on Cart Items',
    addItems: 'Add Discounted Items to Cart',
    bundle: 'Give Bundle Discount',
    shipping: 'Give Shipping Discount',
  }[discountType] || 'Give Discount on Cart Items';
  const minRequirementText =
    minRequirement === 'none'
      ? 'No minimum requirements'
      : minRequirement === 'amount'
        ? `Minimum purchase amount: ₹${minPurchaseAmount || '0'}`
        : `Minimum purchase quantity: ${minPurchaseQuantity || '0'}`;
  const applicableOnText =
    applicableOn === 'all'
      ? 'Discount applicable on all products'
      : applicableOn === 'collections'
        ? 'Specific Collections'
        : 'Specific Products';
  const discountValueText = discountValue ? `${discountValue}${discountSelectType === 'percentage' ? '%' : '₹'}` : '0%';
  const eligibilityText =
    customerEligibility === 'all'
      ? 'All customers are eligible for this discount'
      : customerEligibility === 'new'
        ? 'New customers only'
        : customerEligibility === 'existing'
          ? 'Existing customers only'
          : customerEligibility === 'shopify'
            ? 'Customers who match the selected Shopify segments are eligible'
            : 'Specific customers';
  const channelText = `Available on ${salesChannelWebsite && salesChannelMobile ? 'both website and mobile app' : salesChannelWebsite ? 'website' : 'mobile app'}`;
  const combinationManualText = combineWithManual ? 'Combines with all manual discounts' : 'Does not combine with any manual discounts';
  const combinationAutoText = combineWithAuto === 'no' ? 'Does not combine with any automatic discounts' : 'Automatic discounts to be selected';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Create Bulk Discount</h1>
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer">
              <span className="text-base">ℹ️</span> Open Guide
            </button>
          </div>
          <button
            onClick={handleSaveAndProceed}
            disabled={!showFormSections || loading}
            className={`px-4 py-2 rounded-md font-medium text-white text-sm transition-all cursor-pointer ${showFormSections && !loading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            {loading ? 'Processing...' : currentStep === 5 ? 'Create Discount Set' : 'Save and Proceed'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-6 flex gap-6">
        {/* Main Form */}
        <main className="flex-1">
          {/* Step Progress */}
          <div className="flex items-center gap-10 mb-6">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="text-sm font-medium">Setup</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="text-sm font-medium">Conditions</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="text-sm font-medium">Combination</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                4
              </div>
              <span className="text-sm font-medium">Customer Eligibility</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 5 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 5 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                5
              </div>
              <span className="text-sm font-medium">Generate Codes</span>
            </div>
          </div>

          {/* Success/Error Feedback */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-6 bg-green-50 border border-green-300 rounded-lg text-green-800 text-center font-medium">
              🎉 Bulk discount set created successfully!
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-6 p-6 bg-red-50 border border-red-300 rounded-lg text-red-800">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Step 1: Setup - exactly your original code */}
            {showStep1 && (
              <>
                {/* Title Section */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Discount Set Title</h2>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="e.g., FDGH"
                    autoFocus
                  />
                </div>
                {showFormSections && (
                  <>
                    {/* What should this discount do? */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-2">What should this discount do?</h2>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="cartDiscount" checked={discountType === 'cartDiscount'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Give Discount on Cart Items</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="addItems" checked={discountType === 'addItems'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Add Discounted Items to Cart</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="bundle" checked={discountType === 'bundle'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Give Bundle Discount</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="shipping" checked={discountType === 'shipping'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Give Shipping Discount</span>
                        </label>
                      </div>
                    </div>
                    {/* Minimum Purchase Requirements */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">What are the minimum purchase requirements?</h2>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="minReq" value="none" checked={minRequirement === 'none'} onChange={(e) => { setMinRequirement(e.target.value); setMinPurchaseAmount(''); setMinPurchaseQuantity(''); }} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">No Minimum Requirements</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="minReq" value="amount" checked={minRequirement === 'amount'} onChange={(e) => setMinRequirement(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Minimum Purchase Amount</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="minReq" value="quantity" checked={minRequirement === 'quantity'} onChange={(e) => setMinRequirement(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Minimum Purchase Quantity</span>
                        </label>
                      </div>
                      {minRequirement !== 'none' && (
                        <div className="mt-4">
                          <input
                            type="number"
                            value={minRequirement === 'amount' ? minPurchaseAmount : minPurchaseQuantity}
                            onChange={(e) => minRequirement === 'amount' ? setMinPurchaseAmount(e.target.value) : setMinPurchaseQuantity(e.target.value)}
                            className="w-56 px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder={minRequirement === 'amount' ? 'e.g., 1000' : 'e.g., 5'}
                          />
                        </div>
                      )}
                    </div>
                    {/* Applicable On */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">What should this discount be applicable on?</h2>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="applicable" value="all" checked={applicableOn === 'all'} onChange={(e) => setApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">All Products</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="applicable" value="collections" checked={applicableOn === 'collections'} onChange={(e) => setApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Specific Collections</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="applicable" value="products" checked={applicableOn === 'products'} onChange={(e) => setApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Specific Products</span>
                        </label>
                      </div>
                    </div>
                    {/* Discount Properties */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Set discount properties</h2>
                      <div className="flex items-center gap-10 mb-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="discountType" value="percentage" checked={discountSelectType === 'percentage'} onChange={(e) => setDiscountSelectType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Percentage</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="discountType" value="fixed" checked={discountSelectType === 'fixed'} onChange={(e) => setDiscountSelectType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Fixed Amount</span>
                        </label>
                        <div className="flex items-center gap-3 ml-8">
                          <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            className="w-28 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
                            placeholder="10"
                          />
                          <span className="text-base font-semibold text-gray-700">
                            {discountSelectType === 'percentage' ? '%' : '₹'}
                          </span>
                        </div>
                      </div>
                      <label className="flex items-center gap-3 mt-3 p-2.5 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={capping} onChange={(e) => setCapping(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-800">Set Discount Capping</span>
                      </label>
                      {capping && (
                        <div className="mt-3 ml-7">
                          <input
                            type="number"
                            value={discountCapValue}
                            onChange={(e) => setDiscountCapValue(e.target.value)}
                            className="w-56 px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Maximum discount amount"
                          />
                        </div>
                      )}
                    </div>
                    {/* Top-up with gift */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-2">Top-up with gift?</h2>
                      <div className="space-y-2 flex justify-between">
                        <div className='flex'>
                          <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="topUp" value="no" checked={topUpGift === 'no'} onChange={(e) => { setTopUpGift(e.target.value); setTopUpGiftValue(''); }} className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-800">No</span>
                          </label>
                          <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="topUp" value="yes" checked={topUpGift === 'yes'} onChange={(e) => setTopUpGift(e.target.value)} className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-800">Yes</span>
                          </label>
                        </div>
                        <div className=''>
                          {topUpGift === 'yes' && (
                            <div className="mt-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={topUpGiftValue}
                                  onChange={(e) => setTopUpGiftValue(e.target.value)}
                                  className="w-56 pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                                  placeholder="Search gifts, products..."
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Configure Cashback - Yes/No */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Configure cashback on this coupon code</h2>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="cashback" value="no" checked={cashback === 'no'} onChange={(e) => setCashback(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">No</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="cashback" value="yes" checked={cashback === 'yes'} onChange={(e) => setCashback(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Yes</span>
                        </label>
                      </div>
                    </div>
                    {/* Full Cashback Configuration Section */}
                    {showCashbackSection && (
                      <div className="p-6 bg-gray-50">
                        <div className="mb-3">
                          <h3 className="text-base font-medium text-gray-900 mb-2">What should the cashback discount be applicable on?</h3>
                          <div className='flex justify-between'>
                            <div className="flex items-center gap-8">
                              <label className="flex items-center gap-3">
                                <input type="radio" name="cashbackApplicable" value="all" checked={cashbackApplicableOn === 'all'} onChange={(e) => setCashbackApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-800">All Products</span>
                              </label>
                              <label className="flex items-center gap-3">
                                <input type="radio" name="cashbackApplicable" value="collections" checked={cashbackApplicableOn === 'collections'} onChange={(e) => setCashbackApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-800">Specific Collections</span>
                              </label>
                              <label className="flex items-center gap-3">
                                <input type="radio" name="cashbackApplicable" value="specificProducts" checked={cashbackApplicableOn === 'specificProducts'} onChange={(e) => setCashbackApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-800">Specific Products</span>
                              </label>
                            </div>
                            <div>
                              {(cashbackApplicableOn === 'collections' || cashbackApplicableOn === 'specificProducts') && (
                                <div className="mt-4">
                                  <div className="relative max-w-sm">
                                    <input
                                      type="text"
                                      placeholder={cashbackApplicableOn === 'collections' ? 'Search for collections' : 'Search for products'}
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                    />
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <h3 className="text-base font-medium text-gray-900 mb-4">Set cashback properties</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-700 mb-6">Select Type</span>
                              <div className="flex items-center gap-8 mt-2">
                                <label className="flex items-center gap-3">
                                  <input type="radio" name="cashbackType" value="percentage" checked={cashbackType === 'percentage'} onChange={(e) => setCashbackType(e.target.value)} className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-800">Percentage</span>
                                </label>
                                <label className="flex items-center gap-3">
                                  <input type="radio" name="cashbackType" value="fixed" checked={cashbackType === 'fixed'} onChange={(e) => setCashbackType(e.target.value)} className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-800">Fixed Amount</span>
                                </label>
                                <label className="flex items-center gap-3">
                                  <input type="radio" name="cashbackType" value="custom" checked={cashbackType === 'custom'} onChange={(e) => setCashbackType(e.target.value)} className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-800">Custom</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className='gap-2'>
                                <div>
                                  <span className="text-sm text-gray-700">
                                    {cashbackType === 'custom' ? 'Saving banner message' : 'Cashback Value'}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  {cashbackType === 'custom' ? (
                                    <input
                                      type="text"
                                      value={savingBannerMessage}
                                      onChange={(e) => setSavingBannerMessage(e.target.value)}
                                      className="w-64 px-4 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                      placeholder="e.g., Save extra ₹200 on this order!"
                                    />
                                  ) : (
                                    <input
                                      type="number"
                                      value={cashbackValue}
                                      onChange={(e) => setCashbackValue(e.target.value)}
                                      className="w-32 px-4 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                      placeholder="10"
                                    />
                                  )}
                                  <span className="text-base font-semibold text-gray-700 ml-2">
                                    {cashbackType === 'percentage' ? '%' : cashbackType === 'fixed' ? '₹' : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {cashbackType === 'percentage' && (
                          <div>
                            <span className="text-sm text-gray-700">Cashback to be calculated on</span>
                            <div className="mt-3 max-w-xs">
                              <select
                                value={cashbackCalculatedOn}
                                onChange={(e) => setCashbackCalculatedOn(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                              >
                                <option value="subtotal">Subtotal (product price)</option>
                                <option value="topay">To pay(final price)</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {/* Step 2: Conditions */}
            {showStep2 && (
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Maximum discount usage</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-700">Allow multiple usage of same code</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowMultipleUsage}
                        onChange={(e) => setAllowMultipleUsage(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                    {allowMultipleUsage && (
                      <input
                        type="number"
                        value={multipleUsageCount}
                        onChange={(e) => setMultipleUsageCount(e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        min="1"
                      />
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      Each code is limited to one use per customer when created as part of a set
                    </p>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Active period</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setEndDate}
                        onChange={(e) => setSetEndDate(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Set End Date</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-700 w-40">Start Date and Time</span>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        className="px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl pointer-events-none">📅</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Payment specific controls</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disableCod}
                      onChange={(e) => setDisableCod(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Disable Cash on Delivery on Application</span>
                  </label>
                </div>
              </div>
            )}
            {/* Step 3: Combination */}
            {showStep3 && (
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Allow customers to combine this discount with other manual discounts?
                  </h3>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="combineManual"
                        value="no"
                        checked={!combineWithManual}
                        onChange={() => setCombineWithManual(false)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">No</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="combineManual"
                        value="yes"
                        checked={combineWithManual}
                        onChange={() => setCombineWithManual(true)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Yes</span>
                    </label>
                  </div>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      BXGYK manual codes can not be combined.
                    </p>
                  </div>
                </div>
                {showAutoDiscountSection && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Allow customers to combine/overwrite pre-applied automatic discounts?
                    </h3>
                    <div className="flex items-center gap-8 mb-4">
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input
                          type="radio"
                          name="combineAuto"
                          value="no"
                          checked={combineWithAuto === 'no'}
                          onChange={() => setCombineWithAuto('no')}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-sm text-gray-800">No</span>
                      </label>
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input
                          type="radio"
                          name="combineAuto"
                          value="specific"
                          checked={combineWithAuto === 'specific'}
                          onChange={() => setCombineWithAuto('specific')}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-sm text-gray-800">Only Specific Discount Codes</span>
                      </label>
                    </div>
                    {combineWithAuto === 'specific' && (
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
                              readOnly
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Automatic Discount Codes</label>
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
                              readOnly
                            />
                          </div>
                          <div className="flex items-end">
                            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium cursor-pointer">
                              Add more
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-12 text-center">
                          <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl mx-auto mb-4"></div>
                          <p className="text-sm text-gray-500">No data</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <span className="text-lg">ℹ️</span>
                            Please make sure that automatic discount codes are configured on GoKwik.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Step 4: Customer Eligibility */}
            {showStep4 && (
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Customer eligibility</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="all"
                        checked={customerEligibility === 'all'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">All Customers</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="new"
                        checked={customerEligibility === 'new'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">New Customers Only</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="existing"
                        checked={customerEligibility === 'existing'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Existing Customers Only</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="shopify"
                        checked={customerEligibility === 'shopify'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Shopify Customer Segments</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="specific"
                        checked={customerEligibility === 'specific'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Specific Customers</span>
                    </label>
                  </div>
                  {customerEligibility === 'shopify' && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shopify Segments</label>
                      <div className="relative">
                        <select className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white appearance-none">
                          <option>Select Segments</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <span className="text-lg">ℹ️</span>
                          Segments created under customers sections on Shopify are automatically fetched.
                        </p>
                      </div>
                    </div>
                  )}
                  {showSpecificCustomersSection && (
                    <div className="mt-8">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        How do you want to identify users in the file?
                      </h4>
                      <div className="flex items-center gap-8 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="specificMode"
                            value="include"
                            checked={specificCustomerMode === 'include'}
                            onChange={(e) => setSpecificCustomerMode(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Include Customers</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="specificMode"
                            value="exclude"
                            checked={specificCustomerMode === 'exclude'}
                            onChange={(e) => setSpecificCustomerMode(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Exclude Customers</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <button className="px-6 py-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload a CSV
                        </button>
                        <button className="px-4 py-3 text-blue-600 hover:underline text-sm font-medium flex items-center gap-2 cursor-pointer">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Sample CSV
                        </button>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <span className="text-lg">ℹ️</span>
                          Upload a CSV file containing Phone Numbers eligible for this discount.
                        </p>
                      </div>
                    </div>
                  )}
                  {showExistingCustomersSection && (
                    <div className="mt-8">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        How do you want to identify these users?
                      </h4>
                      <div className="flex items-center gap-8 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="identification"
                            value="phone"
                            checked={identificationMethod === 'phone'}
                            onChange={(e) => setIdentificationMethod(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Phone</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="identification"
                            value="email"
                            checked={identificationMethod === 'email'}
                            onChange={(e) => setIdentificationMethod(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Email</span>
                        </label>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <span className="text-lg">ℹ️</span>
                          Identification is done based on your Shopify store data.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Sales channel control</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={salesChannelWebsite}
                        onChange={(e) => setSalesChannelWebsite(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">Website</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={salesChannelMobile}
                        onChange={(e) => setSalesChannelMobile(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">Mobile Application</span>
                    </label>
                  </div>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      GoKwik checkout needs to be active on your mobile app to control discounts on mobile app specifically. Learn more.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Step 5: Generate Codes */}
            {showStep5 && (
              <div className="p-8 space-y-8">
                <h3 className="text-base font-semibold text-gray-900 mb-8">
                  How do you want to create the discount codes for this set?
                </h3>
                <div className="flex items-center gap-16 mb-8">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="codeMethod"
                      value="generate"
                      checked={codeGenerationMethod === 'generate'}
                      onChange={(e) => setCodeGenerationMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-base text-gray-800">Generate Random Code</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer px-5">
                    <input
                      type="radio"
                      name="codeMethod"
                      value="upload"
                      checked={codeGenerationMethod === 'upload'}
                      onChange={(e) => setCodeGenerationMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-base text-gray-800">Upload a ZIP of CSV file(s)</span>
                  </label>
                </div>
                {codeGenerationMethod === 'generate' && (
                  <>
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 flex items-center gap-4">
                      <span className="text-sm">⚠️</span>
                      <p className="text-base text-yellow-900">
                        You can generate 20,00,000 more discount codes this month.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 max-w-5xl">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Number of codes to generate
                        </label>
                        <input
                          type="number"
                          value={numberOfCodes}
                          onChange={(e) => setNumberOfCodes(e.target.value)}
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                          placeholder="e.g., 1000"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Code Length
                        </label>
                        <input
                          type="number"
                          value={codeLength}
                          onChange={(e) => setCodeLength(e.target.value)}
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                          placeholder="e.g., 8"
                          min="4"
                          max="20"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full px-5 py-1.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 max-w-4xl">
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Prefix
                      </button>
                      <input
                        type="text"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., SALE"
                      />
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Suffix
                      </button>
                      <input
                        type="text"
                        value={suffix}
                        onChange={(e) => setSuffix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., 2026"
                      />
                    </div>
                  </>
                )}
                {codeGenerationMethod === 'upload' && (
                  <>
                    <div className="flex items-center gap-8 mb-8">
                      <button className="px-10 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center gap-4 text-base font-medium transition cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Click to upload (Max Size: 200MB)
                      </button>
                      <button className="text-blue-600 hover:underline text-base font-medium flex items-center gap-3 cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Sample CSV
                      </button>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <ul className="text-base text-blue-900 space-y-2 list-disc list-inside">
                        <li>Upload a Zip of CSV(s) with a single column of discount codes</li>
                        <li>Each code must be between 3 and 20 characters, using only letters and numbers—no special characters</li>
                        <li>Ensure no duplicate codes are present in the file</li>
                        <li>All codes should be uppercase (ALL CAPS)</li>
                        <li>Please ensure that the file contains correct prefix/suffix</li>
                        <li>Max file size 200MB</li>
                        <li>Supported format: .zip</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 flex items-center gap-4">
                      <span className="text-sm">⚠️</span>
                      <p className="text-base text-yellow-900">
                        You can generate 20,00,000 more discount codes this month.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 max-w-5xl mt-8">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Number of codes in Zip</label>
                        <input
                          type="text"
                          readOnly
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg bg-gray-50 text-base"
                          placeholder="Will be auto-detected"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Code Length</label>
                        <input
                          type="text"
                          readOnly
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg bg-gray-50 text-base"
                          placeholder="Will be auto-detected"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Expiry Date</label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full px-5 py-1.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 max-w-4xl mt-8">
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Prefix
                      </button>
                      <input
                        type="text"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., SALE"
                      />
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Suffix
                      </button>
                      <input
                        type="text"
                        value={suffix}
                        onChange={(e) => setSuffix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., 2026"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Summary Sidebar */}
        {showFormSections && (
          <aside className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Draft</span>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{title || '—'}</h3>
              <p className="text-sm text-gray-500">Bulk Discount Code</p>
            </div>
            <div className="mb-6">
              <p className="font-medium text-gray-900 mb-3">Setup</p>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>{discountTypeText}</li>
                <li>{minRequirementText}</li>
                <li>{applicableOnText}</li>
                <li>Discount value: {discountValueText}</li>
                <li>{topUpGift === 'yes' ? 'Free gift added' : 'No free gifts'}</li>
                <li>{cashback === 'yes' ? 'Cashback configured' : 'No cashback'}</li>
              </ul>
            </div>
            {currentStep >= 2 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Conditions</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Can be used {allowMultipleUsage ? multipleUsageCount : '1'} times</li>
                  <li>Can be used once per customer</li>
                  <li>Valid from 08 January 2026</li>
                </ul>
              </div>
            )}
            {currentStep >= 3 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Combinations</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>{combinationManualText}</li>
                  <li>{combinationAutoText}</li>
                </ul>
              </div>
            )}
            {currentStep >= 4 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Customer Eligibility</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>{eligibilityText}</li>
                  <li>{channelText}</li>
                </ul>
              </div>
            )}
            {currentStep >= 5 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Code Generation</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Codes to be {codeGenerationMethod === 'generate' ? 'generated' : 'uploaded'}</li>
                  <li>Expires on 08 April 2026 23:59</li>
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Floating Chat Button */}
      {showFormSections && (
        <button className="fixed bottom-5 right-5 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition-all cursor-pointer">
          💬
        </button>
      )}
    </div>
  );
}






































'use client';
import { useState } from 'react';
export default function CreateBulkDiscount() {
  const [currentStep, setCurrentStep] = useState(1); // 1=Setup, 2=Conditions, 3=Combination, 4=Customer Eligibility, 5=Generate Codes
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); const [errorMessage, setErrorMessage] = useState('');
  // Step 1: Setup states (exactly as your original code - no changes, no cuts)
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState('cartDiscount');
  const [minRequirement, setMinRequirement] = useState('none');
  const [applicableOn, setApplicableOn] = useState('all');
  const [discountSelectType, setDiscountSelectType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [capping, setCapping] = useState(false);
  const [topUpGift, setTopUpGift] = useState('no');
  const [cashback, setCashback] = useState('no');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState('');
  const [minPurchaseQuantity, setMinPurchaseQuantity] = useState('');
  const [discountCapValue, setDiscountCapValue] = useState('');
  const [topUpGiftValue, setTopUpGiftValue] = useState('');
  // Cashback states
  const [cashbackApplicableOn, setCashbackApplicableOn] = useState('specificProducts');
  const [cashbackType, setCashbackType] = useState('percentage');
  const [cashbackValue, setCashbackValue] = useState('');
  const [savingBannerMessage, setSavingBannerMessage] = useState('');
  const [cashbackCalculatedOn, setCashbackCalculatedOn] = useState('subtotal');
  // Step 2: Conditions states - exactly as your screenshot
  const [allowMultipleUsage, setAllowMultipleUsage] = useState(true);
  const [multipleUsageCount, setMultipleUsageCount] = useState('6');
  const [setEndDate, setSetEndDate] = useState(false);
  const [startDateTime, setStartDateTime] = useState('2026-01-08T11:22');
  const [endDateTime, setEndDateTime] = useState(''); // NEW: Added state for end date/time
  const [disableCod, setDisableCod] = useState(false);
  // Step 3: Combination states
  const [combineWithManual, setCombineWithManual] = useState(false);
  const [combineWithAuto, setCombineWithAuto] = useState('no');
  // Step 4: Customer Eligibility states - NEW
  const [customerEligibility, setCustomerEligibility] = useState('all'); // default: All Customers
  const [salesChannelWebsite, setSalesChannelWebsite] = useState(true);
  const [salesChannelMobile, setSalesChannelMobile] = useState(true);
  const [specificCustomerMode, setSpecificCustomerMode] = useState('include');
  const [identificationMethod, setIdentificationMethod] = useState('email');
  // Step 5: Generate Codes states - NEW
  const [codeGenerationMethod, setCodeGenerationMethod] = useState('generate'); // 'generate' or 'upload'
  const [numberOfCodes, setNumberOfCodes] = useState('');
  const [codeLength, setCodeLength] = useState('');
  const [expiryDate, setExpiryDate] = useState('2026-04-08T23:59');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  // Visibility logic
  const showFormSections = title.trim().length > 0;
  const showCashbackSection = cashback === 'yes';
  const showStep1 = currentStep === 1;
  const showStep2 = currentStep === 2;
  const showStep3 = currentStep === 3;
  const showStep4 = currentStep === 4;
  const showStep5 = currentStep === 5;
  const showAutoDiscountSection = combineWithManual === true;
  const showSpecificCustomersSection = customerEligibility === 'specific';
  const showExistingCustomersSection = customerEligibility === 'existing';
  const handleSaveAndProceed = async () => {
    if (currentStep === 1 && title.trim().length > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Final submission
      await handleFinalSubmit();
    }
  };
  const handleFinalSubmit = async () => {
    setLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      const payload = {
        title: title.trim().toUpperCase(),
        discountType: discountType === 'cartDiscount' ? 'order' : discountType,
        minRequirement: minRequirement === 'none' ? null : minRequirement,
        minPurchaseAmount: minRequirement === 'amount' ? Number(minPurchaseAmount) || null : null,
        minPurchaseQuantity: minRequirement === 'quantity' ? Number(minPurchaseQuantity) || null : null,
        applicableOn:
          applicableOn === 'all' ? 'all_products' :
            applicableOn === 'collections' ? 'collections' :
              'specific_products',
        discountSelectType: discountSelectType,
        discountValue: Number(discountValue) || 0,
        capping: capping,
        discountCapValue: capping ? Number(discountCapValue) || null : null,
        topUpGift: topUpGift,
        topUpGiftValue: topUpGift === 'yes' ? topUpGiftValue : null, // NEW: Added to payload
        cashback: cashback,
        cashbackApplicableOn: cashback === 'yes' ? (cashbackApplicableOn === 'all' ? 'all_products' : cashbackApplicableOn === 'collections' ? 'collections' : 'specific_products') : null, // NEW: Added to payload with mapping
        cashbackType: cashback === 'yes' ? cashbackType : null, // NEW: Added to payload
        cashbackValue: cashback === 'yes' && cashbackType !== 'custom' ? Number(cashbackValue) || 0 : null, // NEW: Added to payload
        savingBannerMessage: cashback === 'yes' && cashbackType === 'custom' ? savingBannerMessage : null, // NEW: Added to payload
        cashbackCalculatedOn: cashback === 'yes' ? cashbackCalculatedOn : null, // NEW: Added to payload
        allowMultipleUsage: allowMultipleUsage,
        multipleUsageCount: allowMultipleUsage ? Number(multipleUsageCount) || 1 : 1,
        setEndDate: setEndDate,
        // Properly convert datetime-local value to ISO string
        startDateTime: startDateTime ? new Date(startDateTime).toISOString() : null,
        endDateTime: setEndDate && endDateTime ? new Date(endDateTime).toISOString() : null, // NEW: Added to payload (renamed from expiryDate for discount validity)
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null, // This is now specifically for code expiry
        disableCod: disableCod,
        combineWithManual: combineWithManual,
        combineWithAuto: combineWithAuto !== 'no',
        customerEligibility: customerEligibility,
        salesChannelWebsite: salesChannelWebsite,
        salesChannelMobile: salesChannelMobile,
        codeGenerationMethod: codeGenerationMethod,
        numberOfCodes: codeGenerationMethod === 'generate' ? Number(numberOfCodes) || 0 : null,
        codeLength: codeGenerationMethod === 'generate' ? Number(codeLength) || null : null,
        prefix: prefix.trim().toUpperCase(),
        suffix: suffix.trim().toUpperCase(),
      };
      const response = await fetch('/api/discount/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': 'annapurnakhakhra', // You can make this dynamic later if needed
          'Origin': window.location.origin,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let errData = {};
        try {
          errData = await response.json();
        } catch (e) {
          // If JSON parsing fails, fall back to text
          throw new Error(await response.text() || 'Failed to create bulk discount');
        }
        throw new Error(errData.message || 'Failed to create bulk discount');
      }
      const result = await response.json();
      console.log('Success:', result);
      setSubmitStatus('success');
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'An error occurred while creating the discount.');
    } finally {
      setLoading(false);
    }
  };
  // Helper texts for summary
  const discountTypeText = {
    cartDiscount: 'Give Discount on Cart Items',
    addItems: 'Add Discounted Items to Cart',
    bundle: 'Give Bundle Discount',
    shipping: 'Give Shipping Discount',
  }[discountType] || 'Give Discount on Cart Items';
  const minRequirementText =
    minRequirement === 'none'
      ? 'No minimum requirements'
      : minRequirement === 'amount'
        ? `Minimum purchase amount: ₹${minPurchaseAmount || '0'}`
        : `Minimum purchase quantity: ${minPurchaseQuantity || '0'}`;
  const applicableOnText =
    applicableOn === 'all'
      ? 'Discount applicable on all products'
      : applicableOn === 'collections'
        ? 'Specific Collections'
        : 'Specific Products';
  const discountValueText = discountValue ? `${discountValue}${discountSelectType === 'percentage' ? '%' : '₹'}` : '0%';
  const eligibilityText =
    customerEligibility === 'all'
      ? 'All customers are eligible for this discount'
      : customerEligibility === 'new'
        ? 'New customers only'
        : customerEligibility === 'existing'
          ? 'Existing customers only'
          : customerEligibility === 'shopify'
            ? 'Customers who match the selected Shopify segments are eligible'
            : 'Specific customers';
  const channelText = `Available on ${salesChannelWebsite && salesChannelMobile ? 'both website and mobile app' : salesChannelWebsite ? 'website' : 'mobile app'}`;
  const combinationManualText = combineWithManual ? 'Combines with all manual discounts' : 'Does not combine with any manual discounts';
  const combinationAutoText = combineWithAuto === 'no' ? 'Does not combine with any automatic discounts' : 'Automatic discounts to be selected';
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">Create Bulk Discount</h1>
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer">
              <span className="text-base">ℹ️</span> Open Guide
            </button>
          </div>
          <button
            onClick={handleSaveAndProceed}
            disabled={!showFormSections || loading}
            className={`px-4 py-2 rounded-md font-medium text-white text-sm transition-all cursor-pointer ${showFormSections && !loading
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-300 cursor-not-allowed'
              }`}
          >
            {loading ? 'Processing...' : currentStep === 5 ? 'Create Discount Set' : 'Save and Proceed'}
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-5 py-6 flex gap-6">
        {/* Main Form */}
        <main className="flex-1">
          {/* Step Progress */}
          <div className="flex items-center gap-10 mb-6">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="text-sm font-medium">Setup</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="text-sm font-medium">Conditions</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="text-sm font-medium">Combination</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                4
              </div>
              <span className="text-sm font-medium">Customer Eligibility</span>
            </div>
            <div className={`flex items-center gap-2 ${currentStep >= 5 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${currentStep >= 5 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                5
              </div>
              <span className="text-sm font-medium">Generate Codes</span>
            </div>
          </div>
          {/* Success/Error Feedback */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-6 bg-green-50 border border-green-300 rounded-lg text-green-800 text-center font-medium">
              🎉 Bulk discount set created successfully!
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-6 p-6 bg-red-50 border border-red-300 rounded-lg text-red-800">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}
          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Step 1: Setup - exactly your original code */}
            {showStep1 && (
              <>
                {/* Title Section */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Discount Set Title</h2>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    placeholder="e.g., FDGH"
                    autoFocus
                  />
                </div>
                {showFormSections && (
                  <>
                    {/* What should this discount do? */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-2">What should this discount do?</h2>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="cartDiscount" checked={discountType === 'cartDiscount'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Give Discount on Cart Items</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="addItems" checked={discountType === 'addItems'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Add Discounted Items to Cart</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="bundle" checked={discountType === 'bundle'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Give Bundle Discount</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="discountDo" value="shipping" checked={discountType === 'shipping'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Give Shipping Discount</span>
                        </label>
                      </div>
                    </div>
                    {/* Minimum Purchase Requirements */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">What are the minimum purchase requirements?</h2>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="minReq" value="none" checked={minRequirement === 'none'} onChange={(e) => { setMinRequirement(e.target.value); setMinPurchaseAmount(''); setMinPurchaseQuantity(''); }} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">No Minimum Requirements</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="minReq" value="amount" checked={minRequirement === 'amount'} onChange={(e) => setMinRequirement(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Minimum Purchase Amount</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="minReq" value="quantity" checked={minRequirement === 'quantity'} onChange={(e) => setMinRequirement(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Minimum Purchase Quantity</span>
                        </label>
                      </div>
                      {minRequirement !== 'none' && (
                        <div className="mt-4">
                          <input
                            type="number"
                            value={minRequirement === 'amount' ? minPurchaseAmount : minPurchaseQuantity}
                            onChange={(e) => minRequirement === 'amount' ? setMinPurchaseAmount(e.target.value) : setMinPurchaseQuantity(e.target.value)}
                            className="w-56 px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder={minRequirement === 'amount' ? 'e.g., 1000' : 'e.g., 5'}
                          />
                        </div>
                      )}
                    </div>
                    {/* Applicable On */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">What should this discount be applicable on?</h2>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="applicable" value="all" checked={applicableOn === 'all'} onChange={(e) => setApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">All Products</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="applicable" value="collections" checked={applicableOn === 'collections'} onChange={(e) => setApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Specific Collections</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="applicable" value="products" checked={applicableOn === 'products'} onChange={(e) => setApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Specific Products</span>
                        </label>
                      </div>
                    </div>
                    {/* Discount Properties */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Set discount properties</h2>
                      <div className="flex items-center gap-10 mb-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="discountType" value="percentage" checked={discountSelectType === 'percentage'} onChange={(e) => setDiscountSelectType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Percentage</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="discountType" value="fixed" checked={discountSelectType === 'fixed'} onChange={(e) => setDiscountSelectType(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">Fixed Amount</span>
                        </label>
                        <div className="flex items-center gap-3 ml-8">
                          <input
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            className="w-28 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-medium"
                            placeholder="10"
                          />
                          <span className="text-base font-semibold text-gray-700">
                            {discountSelectType === 'percentage' ? '%' : '₹'}
                          </span>
                        </div>
                      </div>
                      <label className="flex items-center gap-3 mt-3 p-2.5 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={capping} onChange={(e) => setCapping(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                        <span className="text-sm text-gray-800">Set Discount Capping</span>
                      </label>
                      {capping && (
                        <div className="mt-3 ml-7">
                          <input
                            type="number"
                            value={discountCapValue}
                            onChange={(e) => setDiscountCapValue(e.target.value)}
                            className="w-56 px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Maximum discount amount"
                          />
                        </div>
                      )}
                    </div>
                    {/* Top-up with gift */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-2">Top-up with gift?</h2>
                      <div className="space-y-2 flex justify-between">
                        <div className='flex'>
                          <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="topUp" value="no" checked={topUpGift === 'no'} onChange={(e) => { setTopUpGift(e.target.value); setTopUpGiftValue(''); }} className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-800">No</span>
                          </label>
                          <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                            <input type="radio" name="topUp" value="yes" checked={topUpGift === 'yes'} onChange={(e) => setTopUpGift(e.target.value)} className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-800">Yes</span>
                          </label>
                        </div>
                        <div className=''>
                          {topUpGift === 'yes' && (
                            <div className="mt-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={topUpGiftValue}
                                  onChange={(e) => setTopUpGiftValue(e.target.value)}
                                  className="w-56 pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                  placeholder="Search gifts, products..."
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Configure Cashback - Yes/No */}
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-900 mb-4">Configure cashback on this coupon code</h2>
                      <div className="flex gap-8">
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="cashback" value="no" checked={cashback === 'no'} onChange={(e) => setCashback(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">No</span>
                        </label>
                        <label className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="cashback" value="yes" checked={cashback === 'yes'} onChange={(e) => setCashback(e.target.value)} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-800">Yes</span>
                        </label>
                      </div>
                    </div>
                    {/* Full Cashback Configuration Section */}
                    {showCashbackSection && (
                      <div className="p-6 bg-gray-50">
                        <div className="mb-3">
                          <h3 className="text-base font-medium text-gray-900 mb-2">What should the cashback discount be applicable on?</h3>
                          <div className='flex justify-between'>
                            <div className="flex items-center gap-8">
                              <label className="flex items-center gap-3">
                                <input type="radio" name="cashbackApplicable" value="all" checked={cashbackApplicableOn === 'all'} onChange={(e) => setCashbackApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-800">All Products</span>
                              </label>
                              <label className="flex items-center gap-3">
                                <input type="radio" name="cashbackApplicable" value="collections" checked={cashbackApplicableOn === 'collections'} onChange={(e) => setCashbackApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-800">Specific Collections</span>
                              </label>
                              <label className="flex items-center gap-3">
                                <input type="radio" name="cashbackApplicable" value="specificProducts" checked={cashbackApplicableOn === 'specificProducts'} onChange={(e) => setCashbackApplicableOn(e.target.value)} className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-800">Specific Products</span>
                              </label>
                            </div>
                            <div>
                              {(cashbackApplicableOn === 'collections' || cashbackApplicableOn === 'specificProducts') && (
                                <div className="mt-4">
                                  <div className="relative max-w-sm">
                                    <input
                                      type="text"
                                      placeholder={cashbackApplicableOn === 'collections' ? 'Search for collections' : 'Search for products'}
                                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                    />
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <h3 className="text-base font-medium text-gray-900 mb-4">Set cashback properties</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm text-gray-700 mb-6">Select Type</span>
                              <div className="flex items-center gap-8 mt-2">
                                <label className="flex items-center gap-3">
                                  <input type="radio" name="cashbackType" value="percentage" checked={cashbackType === 'percentage'} onChange={(e) => setCashbackType(e.target.value)} className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-800">Percentage</span>
                                </label>
                                <label className="flex items-center gap-3">
                                  <input type="radio" name="cashbackType" value="fixed" checked={cashbackType === 'fixed'} onChange={(e) => setCashbackType(e.target.value)} className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-800">Fixed Amount</span>
                                </label>
                                <label className="flex items-center gap-3">
                                  <input type="radio" name="cashbackType" value="custom" checked={cashbackType === 'custom'} onChange={(e) => setCashbackType(e.target.value)} className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-800">Custom</span>
                                </label>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className='gap-2'>
                                <div>
                                  <span className="text-sm text-gray-700">
                                    {cashbackType === 'custom' ? 'Saving banner message' : 'Cashback Value'}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  {cashbackType === 'custom' ? (
                                    <input
                                      type="text"
                                      value={savingBannerMessage}
                                      onChange={(e) => setSavingBannerMessage(e.target.value)}
                                      className="w-64 px-4 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                      placeholder="e.g., Save extra ₹200 on this order!"
                                    />
                                  ) : (
                                    <input
                                      type="number"
                                      value={cashbackValue}
                                      onChange={(e) => setCashbackValue(e.target.value)}
                                      className="w-32 px-4 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                      placeholder="10"
                                    />
                                  )}
                                  <span className="text-base font-semibold text-gray-700 ml-2">
                                    {cashbackType === 'percentage' ? '%' : cashbackType === 'fixed' ? '₹' : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {cashbackType === 'percentage' && (
                          <div>
                            <span className="text-sm text-gray-700">Cashback to be calculated on</span>
                            <div className="mt-3 max-w-xs">
                              <select
                                value={cashbackCalculatedOn}
                                onChange={(e) => setCashbackCalculatedOn(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                              >
                                <option value="subtotal">Subtotal (product price)</option>
                                <option value="topay">To pay(final price)</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {/* Step 2: Conditions */}
            {showStep2 && (
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Maximum discount usage</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-gray-700">Allow multiple usage of same code</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowMultipleUsage}
                        onChange={(e) => setAllowMultipleUsage(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                    {allowMultipleUsage && (
                      <input
                        type="number"
                        value={multipleUsageCount}
                        onChange={(e) => setMultipleUsageCount(e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        min="1"
                      />
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      Each code is limited to one use per customer when created as part of a set
                    </p>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Active period</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setEndDate}
                        onChange={(e) => setSetEndDate(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Set End Date</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-700 w-40">Start Date and Time</span>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={startDateTime}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        className="px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl pointer-events-none">📅</span>
                    </div>
                  </div>
                  {setEndDate && ( // NEW: Conditional rendering for end date input
                    <div className="flex items-center gap-6 mt-4">
                      <span className="text-sm text-gray-700 w-40">End Date and Time</span>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={endDateTime}
                          onChange={(e) => setEndDateTime(e.target.value)}
                          className="px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl pointer-events-none">📅</span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Payment specific controls</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disableCod}
                      onChange={(e) => setDisableCod(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Disable Cash on Delivery on Application</span>
                  </label>
                </div>
              </div>
            )}
            {/* Step 3: Combination */}
            {showStep3 && (
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Allow customers to combine this discount with other manual discounts?
                  </h3>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="combineManual"
                        value="no"
                        checked={!combineWithManual}
                        onChange={() => setCombineWithManual(false)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">No</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="combineManual"
                        value="yes"
                        checked={combineWithManual}
                        onChange={() => setCombineWithManual(true)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Yes</span>
                    </label>
                  </div>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      BXGYK manual codes can not be combined.
                    </p>
                  </div>
                </div>
                {showAutoDiscountSection && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                      Allow customers to combine/overwrite pre-applied automatic discounts?
                    </h3>
                    <div className="flex items-center gap-8 mb-4">
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input
                          type="radio"
                          name="combineAuto"
                          value="no"
                          checked={combineWithAuto === 'no'}
                          onChange={() => setCombineWithAuto('no')}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-sm text-gray-800">No</span>
                      </label>
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input
                          type="radio"
                          name="combineAuto"
                          value="specific"
                          checked={combineWithAuto === 'specific'}
                          onChange={() => setCombineWithAuto('specific')}
                          className="w-5 h-5 text-blue-600"
                        />
                        <span className="text-sm text-gray-800">Only Specific Discount Codes</span>
                      </label>
                    </div>
                    {combineWithAuto === 'specific' && (
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
                              readOnly
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Automatic Discount Codes</label>
                            <input
                              type="text"
                              placeholder=""
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-sm"
                              readOnly
                            />
                          </div>
                          <div className="flex items-end">
                            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium cursor-pointer">
                              Add more
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-12 text-center">
                          <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-xl mx-auto mb-4"></div>
                          <p className="text-sm text-gray-500">No data</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800 flex items-center gap-2">
                            <span className="text-lg">ℹ️</span>
                            Please make sure that automatic discount codes are configured on GoKwik.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Step 4: Customer Eligibility */}
            {showStep4 && (
              <div className="p-6">
                <div className="mb-8">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Customer eligibility</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="all"
                        checked={customerEligibility === 'all'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">All Customers</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="new"
                        checked={customerEligibility === 'new'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">New Customers Only</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="existing"
                        checked={customerEligibility === 'existing'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Existing Customers Only</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="shopify"
                        checked={customerEligibility === 'shopify'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Shopify Customer Segments</span>
                    </label>
                    <label className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="eligibility"
                        value="specific"
                        checked={customerEligibility === 'specific'}
                        onChange={(e) => setCustomerEligibility(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-sm text-gray-800">Specific Customers</span>
                    </label>
                  </div>
                  {customerEligibility === 'shopify' && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shopify Segments</label>
                      <div className="relative">
                        <select className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white appearance-none">
                          <option>Select Segments</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <span className="text-lg">ℹ️</span>
                          Segments created under customers sections on Shopify are automatically fetched.
                        </p>
                      </div>
                    </div>
                  )}
                  {showSpecificCustomersSection && (
                    <div className="mt-8">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        How do you want to identify users in the file?
                      </h4>
                      <div className="flex items-center gap-8 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="specificMode"
                            value="include"
                            checked={specificCustomerMode === 'include'}
                            onChange={(e) => setSpecificCustomerMode(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Include Customers</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="specificMode"
                            value="exclude"
                            checked={specificCustomerMode === 'exclude'}
                            onChange={(e) => setSpecificCustomerMode(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Exclude Customers</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <button className="px-6 py-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-medium cursor-pointer">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Upload a CSV
                        </button>
                        <button className="px-4 py-3 text-blue-600 hover:underline text-sm font-medium flex items-center gap-2 cursor-pointer">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Sample CSV
                        </button>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <span className="text-lg">ℹ️</span>
                          Upload a CSV file containing Phone Numbers eligible for this discount.
                        </p>
                      </div>
                    </div>
                  )}
                  {showExistingCustomersSection && (
                    <div className="mt-8">
                      <h4 className="text-base font-medium text-gray-900 mb-4">
                        How do you want to identify these users?
                      </h4>
                      <div className="flex items-center gap-8 mb-6">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="identification"
                            value="phone"
                            checked={identificationMethod === 'phone'}
                            onChange={(e) => setIdentificationMethod(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Phone</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="identification"
                            value="email"
                            checked={identificationMethod === 'email'}
                            onChange={(e) => setIdentificationMethod(e.target.value)}
                            className="w-5 h-5 text-blue-600"
                          />
                          <span className="text-sm text-gray-800">Email</span>
                        </label>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                          <span className="text-lg">ℹ️</span>
                          Identification is done based on your Shopify store data.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Sales channel control</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={salesChannelWebsite}
                        onChange={(e) => setSalesChannelWebsite(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">Website</span>
                    </label>
                    <label className="flex items-center gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={salesChannelMobile}
                        onChange={(e) => setSalesChannelMobile(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">Mobile Application</span>
                    </label>
                  </div>
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 flex items-center gap-2">
                      <span className="text-lg">ℹ️</span>
                      GoKwik checkout needs to be active on your mobile app to control discounts on mobile app specifically. Learn more.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Step 5: Generate Codes */}
            {showStep5 && (
              <div className="p-8 space-y-8">
                <h3 className="text-base font-semibold text-gray-900 mb-8">
                  How do you want to create the discount codes for this set?
                </h3>
                <div className="flex items-center gap-16 mb-8">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="codeMethod"
                      value="generate"
                      checked={codeGenerationMethod === 'generate'}
                      onChange={(e) => setCodeGenerationMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-base text-gray-800">Generate Random Code</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer px-5">
                    <input
                      type="radio"
                      name="codeMethod"
                      value="upload"
                      checked={codeGenerationMethod === 'upload'}
                      onChange={(e) => setCodeGenerationMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-base text-gray-800">Upload a ZIP of CSV file(s)</span>
                  </label>
                </div>
                {codeGenerationMethod === 'generate' && (
                  <>
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 flex items-center gap-4">
                      <span className="text-sm">⚠️</span>
                      <p className="text-base text-yellow-900">
                        You can generate 20,00,000 more discount codes this month.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 max-w-5xl">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Number of codes to generate
                        </label>
                        <input
                          type="number"
                          value={numberOfCodes}
                          onChange={(e) => setNumberOfCodes(e.target.value)}
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                          placeholder="e.g., 1000"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Code Length
                        </label>
                        <input
                          type="number"
                          value={codeLength}
                          onChange={(e) => setCodeLength(e.target.value)}
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                          placeholder="e.g., 8"
                          min="4"
                          max="20"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">
                          Expiry Date
                        </label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full px-5 py-1.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 max-w-4xl">
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Prefix
                      </button>
                      <input
                        type="text"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., SALE"
                      />
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Suffix
                      </button>
                      <input
                        type="text"
                        value={suffix}
                        onChange={(e) => setSuffix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., 2026"
                      />
                    </div>
                  </>
                )}
                {codeGenerationMethod === 'upload' && (
                  <>
                    <div className="flex items-center gap-8 mb-8">
                      <button className="px-10 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center gap-4 text-base font-medium transition cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Click to upload (Max Size: 200MB)
                      </button>
                      <button className="text-blue-600 hover:underline text-base font-medium flex items-center gap-3 cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Sample CSV
                      </button>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <ul className="text-base text-blue-900 space-y-2 list-disc list-inside">
                        <li>Upload a Zip of CSV(s) with a single column of discount codes</li>
                        <li>Each code must be between 3 and 20 characters, using only letters and numbers—no special characters</li>
                        <li>Ensure no duplicate codes are present in the file</li>
                        <li>All codes should be uppercase (ALL CAPS)</li>
                        <li>Please ensure that the file contains correct prefix/suffix</li>
                        <li>Max file size 200MB</li>
                        <li>Supported format: .zip</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-5 flex items-center gap-4">
                      <span className="text-sm">⚠️</span>
                      <p className="text-base text-yellow-900">
                        You can generate 20,00,000 more discount codes this month.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 max-w-5xl mt-8">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Number of codes in Zip</label>
                        <input
                          type="text"
                          readOnly
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg bg-gray-50 text-base"
                          placeholder="Will be auto-detected"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Code Length</label>
                        <input
                          type="text"
                          readOnly
                          className="w-full px-5 py-1.5 border border-gray-300 rounded-lg bg-gray-50 text-base"
                          placeholder="Will be auto-detected"
                        />
                      </div>
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Expiry Date</label>
                        <div className="relative">
                          <input
                            type="datetime-local"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full px-5 py-1.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 max-w-4xl mt-8">
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Prefix
                      </button>
                      <input
                        type="text"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., SALE"
                      />
                      <button className="px-6 py-1.5 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-50 cursor-pointer">
                        Suffix
                      </button>
                      <input
                        type="text"
                        value={suffix}
                        onChange={(e) => setSuffix(e.target.value.toUpperCase())}
                        className="flex-1 px-5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="e.g., 2026"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
        {/* Summary Sidebar */}
        {showFormSections && (
          <aside className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">Draft</span>
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{title || '—'}</h3>
              <p className="text-sm text-gray-500">Bulk Discount Code</p>
            </div>
            <div className="mb-6">
              <p className="font-medium text-gray-900 mb-3">Setup</p>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>{discountTypeText}</li>
                <li>{minRequirementText}</li>
                <li>{applicableOnText}</li>
                <li>Discount value: {discountValueText}</li>
                <li>{topUpGift === 'yes' ? 'Free gift added' : 'No free gifts'}</li>
                <li>{cashback === 'yes' ? 'Cashback configured' : 'No cashback'}</li>
              </ul>
            </div>
            {currentStep >= 2 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Conditions</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Can be used {allowMultipleUsage ? multipleUsageCount : '1'} times</li>
                  <li>Can be used once per customer</li>
                  <li>Valid from 08 January 2026</li>
                </ul>
              </div>
            )}
            {currentStep >= 3 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Combinations</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>{combinationManualText}</li>
                  <li>{combinationAutoText}</li>
                </ul>
              </div>
            )}
            {currentStep >= 4 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Customer Eligibility</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>{eligibilityText}</li>
                  <li>{channelText}</li>
                </ul>
              </div>
            )}
            {currentStep >= 5 && (
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-3">Code Generation</p>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                  <li>Codes to be {codeGenerationMethod === 'generate' ? 'generated' : 'uploaded'}</li>
                  <li>Expires on 08 April 2026 23:59</li>
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>
      {/* Floating Chat Button */}
      {showFormSections && (
        <button className="fixed bottom-5 right-5 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition-all cursor-pointer">
          💬
        </button>
      )}
    </div>
  );
}