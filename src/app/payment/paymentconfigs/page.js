// app/payment/paymentconfigs/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Import your component
import ONPLSettings from '@/app/components/payment/ONPLSettings';
import C2PSettings from '@/app/components/payment/C2PSettings';
import RecommendedSettings from '@/app/components/payment/RecommendedSettings';
import PaymentPageSettings from '@/app/components/payment/PaymentPageSettings';
import CODSettings from '@/app/components/payment/CODSettings';
import CardsSettings from '@/app/components/payment/CardsSettings';
import UPIsettings from '@/app/components/payment/UPIsettings.js';
import NetbankingSettings from '@/app/components/payment/NetbankingSettings';
import WalletsSettings from '@/app/components/payment/WalletsSettings';
import NativePaymentSettings from '@/app/components/payment/NativePaymentSettings';

export default function PaymentConfigsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeSection = searchParams.get('section') || null;

  // ── Loading, saving & error states ───────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ── Your original states (completely unchanged) ────────────────────────
  const [onplEnabled, setOnplEnabled] = useState(false);
  const [c2pEnabled, setC2pEnabled] = useState(false);
  const [recommendedEnabled, setRecommendedEnabled] = useState(false);

  const [codEnabled, setCodEnabled] = useState(true);
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [cardsEnabled, setCardsEnabled] = useState(true);
  const [walletsEnabled, setWalletsEnabled] = useState(true);
  const [netbankingEnabled, setNetbankingEnabled] = useState(true);
  const [nativeEnabled, setNativeEnabled] = useState(false);

  const [methodStyle, setMethodStyle] = useState('default');
  const [user, setUser] = useState(null);

  // ── Your original preview styling logic (unchanged) ────────────────────
  let itemClass = 'bg-black text-white rounded-xl p-4 shadow-md';
  let iconColor = 'text-white';
  let previewSpacing = 'space-y-4';
  if (methodStyle === 'minimal') {
    itemClass = 'bg-white text-black border border-gray-300 rounded-xl p-4 shadow-md';
    iconColor = 'text-black';
    previewSpacing = 'space-y-4';
  } else if (methodStyle === 'accordion') {
    itemClass = 'bg-white text-black border border-gray-300 rounded-lg p-4 shadow-md';
    iconColor = 'text-black';
    previewSpacing = 'space-y-2';
  }

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

  // ── Load configuration from API when component mounts ──────────────────
  useEffect(() => {
    if (!STORE_ID) {
      console.warn("STORE_ID not ready yet — skipping config load");
      return; // Don't fetch until STORE_ID exists
    }

    const loadConfig = async () => {
      try {
        const response = await fetch('/api/payment-config', {
          method: 'GET',
          headers: {
            'X-Shop-Id': STORE_ID,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }

        const data = await response.json();

        // Apply values from API (use ?? fallback for safety)
        setOnplEnabled(data?.features?.onplEnabled ?? false);
        setC2pEnabled(data?.features?.c2pEnabled ?? false);
        setRecommendedEnabled(data?.features?.recommendedEnabled ?? false);

        setMethodStyle(data?.methodUiStyle ?? 'default');

        setCodEnabled(data?.paymentMethods?.cod?.enabled ?? true);
        setUpiEnabled(data?.paymentMethods?.upi?.enabled ?? true);
        setCardsEnabled(data?.paymentMethods?.cards?.enabled ?? true);
        setWalletsEnabled(data?.paymentMethods?.wallets?.enabled ?? true);
        setNetbankingEnabled(data?.paymentMethods?.netbanking?.enabled ?? true);
        setNativeEnabled(data?.paymentMethods?.native?.enabled ?? false);
      } catch (err) {
        console.error('Load error:', err);
        setError('Could not load settings. Using default values.');
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [STORE_ID]);

  // ── Save all current states to API ─────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const payload = {
      features: {
        onplEnabled,
        c2pEnabled,
        recommendedEnabled,
      },
      methodUiStyle: methodStyle,
      paymentMethods: {
        cod: { enabled: codEnabled },
        upi: { enabled: upiEnabled },
        cards: { enabled: cardsEnabled },
        wallets: { enabled: walletsEnabled },
        netbanking: { enabled: netbankingEnabled },
        native: { enabled: nativeEnabled },
      },
    };

    try {
      const response = await fetch('/api/payment-config', {
        method: 'PUT',
        headers: {
          'X-Shop-Id': STORE_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      alert('Configuration saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      setError('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }


    
  };

  

  // Navigation functions - when click Customise
  const openONPLSettings = () => {
    router.push('/payment/paymentconfigs?section=onpl', { scroll: false });
  };

  const openC2PSettings = () => {
    router.push('/payment/paymentconfigs?section=c2p', { scroll: false });
  };

  const openRecommendedSettings = () => {
    router.push('/payment/paymentconfigs?section=recommended', { scroll: false });
  };

  const openPaymentPageSettings = () => {
    router.push('/payment/paymentconfigs?section=payment-page', { scroll: false });
  };

  const openCODSettings = () => {
    router.push('/payment/paymentconfigs?section=cod', { scroll: false });
  };

  const openCardsSettings = () => {
    router.push('/payment/paymentconfigs?section=cards', { scroll: false });
  };

  const openupiSettings = () => {
    router.push('/payment/paymentconfigs?section=upiSetting', { scroll: false });
  };

  const openNetbankingSettings = () => {
    router.push('/payment/paymentconfigs?section=netbanking', { scroll: false });
  };

  const openWalletsSettings = () => {
    router.push('/payment/paymentconfigs?section=wallets', { scroll: false });
  };

  const openNativePaymentSettings = () => {
    router.push('/payment/paymentconfigs?section=native-payment', { scroll: false });
  };

  const goBackToMain = () => {
    router.push('/payment/paymentconfigs', { scroll: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600 animate-pulse">Loading payment configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Payment Configuration
            </h1>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
              Open Guide
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
            This section enables you to customize the UI for payment methods on checkout
          </p>
        </>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 md:p-8 order-2 lg:order-1">

            {/* When Customise clicked → show your ONPLSettings component */}
            {activeSection === 'onpl' ? (
              <ONPLSettings />
            ) : activeSection === 'c2p' ? (
              <C2PSettings />
            ) : activeSection === 'recommended' ? (
              <RecommendedSettings />
            ) : activeSection === 'payment-page' ? (
              <PaymentPageSettings />
            ) : activeSection === 'cod' ? (
              <CODSettings />
            ) : activeSection === 'cards' ? (
              <CardsSettings />
            ) : activeSection === 'upiSetting' ? (
              <UPIsettings />
            ) : activeSection === 'netbanking' ? (
              <NetbankingSettings />
            ) : activeSection === 'wallets' ? (
              <WalletsSettings />
            ) : activeSection === 'native-payment' ? (
              <NativePaymentSettings />
            ) : (
              <>
                {/* Feature Controls */}
                <h2 className="text-xl font-medium mb-6">Feature Controls</h2>

                {/* ONPL */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-medium text-base">Order Now Pay Later (ONPL)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Nudge your customers to place cash on delivery orders in case of payment failures
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOnplEnabled(!onplEnabled)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${onplEnabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${onplEnabled ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                        />
                      </button>

                      <button
                        onClick={openONPLSettings}
                        className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                      >
                        Customise
                      </button>
                    </div>
                  </div>
                </div>

                {/* C2P */}
                <div className="mb-10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-medium text-base">Cash to Prepaid (C2P)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Convert COD orders into prepaid using post order time-bound nudges & discounts on WhatsApp and order confirmation page
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setC2pEnabled(!c2pEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${c2pEnabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c2pEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>

                      <button
                        onClick={() => router.push('/payment/paymentconfigs?section=c2p', { scroll: false })}
                        className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                      >
                        Customise
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recommended */}
                <div className="mb-10 pb-8 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-medium text-base">Recommended payment methods</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Show previously used UPI app, saved card or COD/PPCOD on top as recommended payment methods
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRecommendedEnabled(!recommendedEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${recommendedEnabled ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${recommendedEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                      <button
                        onClick={openRecommendedSettings}
                        className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                      >
                        Customise
                      </button>
                    </div>
                  </div>
                </div>

                {/* Method Controls */}
                <div className="mb-10 pb-8 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">Method Controls</h2>
                    <button
                      onClick={openPaymentPageSettings}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                      Customise
                    </button>
                  </div>

                  <h3 className="text-base font-medium mb-6">Method UI Style</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Default */}
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <div className="w-32 h-36 bg-gray-50 rounded-xl shadow-lg flex flex-col justify-end p-4 gap-3">
                          <div className="h-10 bg-black rounded-lg"></div>
                          <div className="h-10 bg-black rounded-lg"></div>
                          <div className="h-10 bg-black rounded-lg"></div>
                        </div>
                        {methodStyle === 'default' && (
                          <div className="absolute -inset-1 rounded-xl border-4 border-blue-500 pointer-events-none"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="methodStyle"
                          value="default"
                          checked={methodStyle === 'default'}
                          onChange={() => setMethodStyle('default')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="text-center">
                          <p className="font-medium">Default</p>
                          <p className="text-sm text-gray-600">Customised button colors</p>
                        </div>
                      </div>
                    </label>

                    {/* Minimal */}
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <div className="w-32 h-36 bg-gray-50 rounded-xl shadow-lg flex flex-col justify-end p-4 gap-3">
                          <div className="h-10 bg-white border-2 border-gray-300 rounded-lg"></div>
                          <div className="h-10 bg-white border-2 border-gray-300 rounded-lg"></div>
                          <div className="h-10 bg-white border-2 border-gray-300 rounded-lg"></div>
                        </div>
                        {methodStyle === 'minimal' && (
                          <div className="absolute -inset-1 rounded-xl border-4 border-blue-500 pointer-events-none"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="methodStyle"
                          value="minimal"
                          checked={methodStyle === 'minimal'}
                          onChange={() => setMethodStyle('minimal')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="text-center">
                          <p className="font-medium">Minimal</p>
                          <p className="text-sm text-gray-600">Only White button colors</p>
                        </div>
                      </div>
                    </label>

                    {/* Accordion */}
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <div className="w-32 h-36 bg-gray-50 rounded-xl shadow-lg flex items-center justify-center p-4">
                          <div className="w-full bg-white border-2 border-gray-300 rounded-lg p-4 flex items-center justify-between shadow-sm">
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-700 rounded"></div>
                              <div className="h-3 w-3/4 bg-gray-400 rounded"></div>
                            </div>
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {methodStyle === 'accordion' && (
                          <div className="absolute -inset-1 rounded-xl border-4 border-blue-500 pointer-events-none"></div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="methodStyle"
                          value="accordion"
                          checked={methodStyle === 'accordion'}
                          onChange={() => setMethodStyle('accordion')}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="text-center">
                          <p className="font-medium">Accordion</p>
                          <p className="text-sm text-gray-600">Compact styling</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-medium mb-6">Payment Methods</h2>
                    <p className="text-sm text-gray-600">
                      Customise payment method visibility, sorting order as well as button colors, text, and badges
                    </p>
                  </div>

                  {/* COD */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10z" />
                        </svg>
                      </div>
                      <span className="font-medium">COD / Partial COD</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setCodEnabled(!codEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${codEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${codEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button
                        onClick={openCODSettings}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Customise</button>
                    </div>
                  </div>

                  {/* UPI */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <span className="font-medium">UPI</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setUpiEnabled(!upiEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${upiEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${upiEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button
                        onClick={openupiSettings}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Customise</button>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                        </svg>
                      </div>
                      <span className="font-medium">Cards</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setCardsEnabled(!cardsEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${cardsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${cardsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button
                        onClick={openCardsSettings}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Customise</button>
                    </div>
                  </div>

                  {/* Wallets */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zM21 8h-9v8h9V8z" />
                        </svg>
                      </div>
                      <span className="font-medium">Wallets</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setWalletsEnabled(!walletsEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${walletsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${walletsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button
                        onClick={openWalletsSettings}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Customise</button>
                    </div>
                  </div>

                  {/* Netbanking */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-200 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="2" />
                          <path d="M4 8h16M4 12h16M4 16h16" />
                        </svg>
                      </div>
                      <span className="font-medium">Netbanking</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setNetbankingEnabled(!netbankingEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${netbankingEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${netbankingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <button
                        onClick={openNetbankingSettings}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">Customise</button>
                    </div>
                  </div>

                  {/* Native Payment Method */}
                  <div className="mt-8">
                    <div className="mb-4">
                      <h3 className="font-medium">Native Payment Method</h3>
                      <p className="text-sm text-gray-600">Payment Redirection To Shopify</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path d="M4 8h16M4 12h16M4 16h16" />
                          </svg>
                        </div>
                        <span className="font-medium">Native Payment Method</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setNativeEnabled(!nativeEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${nativeEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${nativeEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <button
                          onClick={openNativePaymentSettings}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 opacity-50 cursor-not-allowed">
                          Customise
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Preview Panel - always visible */}
          <div className="w-full lg:w-96 bg-white rounded-lg shadow-sm p-6 order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Preview</h2>
              <div className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1">
                Checkout 1.0 ▼
              </div>
            </div>

            <div className="bg-gray-200 h-32 rounded-lg mb-8 flex items-center justify-center text-gray-500 text-lg">
              YOUR LOGO
            </div>

            <h3 className="font-medium mb-4">Payment Options</h3>
            <div className={previewSpacing}>
              {codEnabled && (
                <div className={`flex justify-between items-center ${itemClass}`}>
                  <div className="flex items-center gap-4">
                    <svg className={`w-8 h-8 ${iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10z" />
                    </svg>
                    <span className="truncate">COD / Partial COD</span>
                  </div>
                  <span className="flex-shrink-0">₹123.00 ➜</span>
                </div>
              )}

              {upiEnabled && (
                <div className={`flex justify-between items-center ${itemClass}`}>
                  <div className="flex items-center gap-4">
                    <svg className={`w-8 h-8 ${iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span>UPI</span>
                  </div>
                  <span className="flex-shrink-0">₹123.00 ➜</span>
                </div>
              )}

              {cardsEnabled && (
                <div className={`flex justify-between items-center ${itemClass}`}>
                  <div className="flex items-center gap-4">
                    <svg className={`w-8 h-8 ${iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span>Cards</span>
                  </div>
                  <span className="flex-shrink-0">₹123.00 ➜</span>
                </div>
              )}

              {walletsEnabled && (
                <div className={`flex justify-between items-center ${itemClass}`}>
                  <div className="flex items-center gap-4">
                    <svg className={`w-8 h-8 ${iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zM21 8h-9v8h9V8z" />
                    </svg>
                    <span>Wallets</span>
                  </div>
                  <span className="flex-shrink-0">₹123.00 ➜</span>
                </div>
              )}

              {netbankingEnabled && (
                <div className={`flex justify-between items-center ${itemClass}`}>
                  <div className="flex items-center gap-4">
                    <svg className={`w-8 h-8 ${iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 8h16M4 12h16M4 16h16" />
                    </svg>
                    <span>Netbanking</span>
                  </div>
                  <span className="flex-shrink-0">₹123.00 ➜</span>
                </div>
              )}

              {nativeEnabled && (
                <div className={`flex justify-between items-center ${itemClass}`}>
                  <div className="flex items-center gap-4">
                    <svg className={`w-8 h-8 ${iconColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 8h16M4 12h16M4 16h16" />
                    </svg>
                    <span className="truncate">Native Payment Method</span>
                  </div>
                  <span className="flex-shrink-0">₹123.00 ➜</span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                <span>T&C</span>
                <span>Privacy</span>
                <span>PCI DSS Compliant</span>
                <span>Secured Payments</span>
                <span>Verified Merchant</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span>Powered by</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Fixed Buttons - with save functionality */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-end gap-4">
          <button className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 order-2 sm:order-1 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
            Revert Changes
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 order-1 sm:order-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Confirm Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}