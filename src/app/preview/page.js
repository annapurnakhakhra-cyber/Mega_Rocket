// app/preview/page.js
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PreviewContent() {
  const searchParams = useSearchParams();
  const storeId = searchParams.get('storeId');

  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState('Login');

  useEffect(() => {
    if (!storeId) {
      setError('Missing storeId. Usage: /preview?storeId=yourstore.myshopify.com');
      setIsLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`/api/checkout-ui?storeId=${encodeURIComponent(storeId)}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to load UI settings');
        }
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        console.error('Preview load error:', err);
        setError(err.message || 'Unable to load preview for this store.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading checkout preview...</p>
          <p className="text-sm text-gray-500 mt-2">{storeId}</p>
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Preview Unavailable</h2>
          <p className="text-gray-600 text-sm">{error || 'No settings saved for this store yet.'}</p>
        </div>
      </div>
    );
  }

  const {
    logo,
    primaryColor = '#F74435',
    displayBanner = true,
    bannerBgColor = '#F74435',
    bannerTextColor = '#FFFFFF',
    bannerText = 'Over 6L+ Happy Customer | Shop with confidence',
    ctaTextEnabled = true,
    ctaText = 'More Discount',
    autoSelectConsent = true,
    consentTextEnabled = true,
    consentText = 'Shop Rs. 499/- & Get Free Shipping | Coupon Code - fship',
    addressCtaEnabled = false,
    addressCtaText = 'Shop Now',
    paymentDisplayBanner = true,
    paymentBannerBgColor = '#F74435',
    paymentBannerTextColor = '#FFFFFF',
    paymentBannerText = 'Prepaid No Fees + 5% discount | COD Rs.40 Extra + No Discount',
  } = settings;

  return (
    <>
      {/* Full-screen mobile preview - no app layout, no navigation, no padding from parent */}
      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Optional minimal top bar - remove if you want 100% clean */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            )}
            <span className="font-medium text-gray-700">Checkout</span>
          </div>
          <span className="text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Live
          </span>
        </div>

        {/* Step Switcher - subtle and non-intrusive */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex justify-center gap-8 py-2 text-sm font-medium text-gray-600">
            {['Login', 'Address', 'Payments'].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`pb-2 border-b-2 transition-colors ${activeStep === step
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent hover:text-gray-900'
                  }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>

        {/* Main Preview Content - centered mobile width */}
        <div className="flex-1 flex items-start justify-center py-4 px-4">
          <div className="w-full max-w-md bg-white shadow-xl rounded-t-3xl overflow-hidden">

            {/* Login Step */}
            {activeStep === 'Login' && (
              <div className="p-5 pb-8">
                {displayBanner && (
                  <div
                    className="rounded-xl px-4 py-3 text-center text-sm font-medium mb-5"
                    style={{ backgroundColor: bannerBgColor, color: bannerTextColor }}
                  >
                    {bannerText}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="h-12 bg-gray-100 rounded-lg"></div>
                  <div className="h-12 bg-gray-100 rounded-lg"></div>
                </div>

                {consentTextEnabled && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center mb-6">
                    <p className="text-sm text-gray-800 mb-3">{consentText}</p>
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        checked={autoSelectConsent}
                        readOnly
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-xs text-gray-600">I agree to receive offers</span>
                    </div>
                  </div>
                )}

                <button
                  style={{ backgroundColor: ctaTextEnabled ? '#000000' : primaryColor }}
                  className="w-full text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  {ctaTextEnabled ? ctaText : 'Continue'} →
                </button>
              </div>
            )}

            {/* Address Step */}
            {activeStep === 'Address' && (
              <div className="p-5 pb-8">
                <div className="mb-6">
                  <p className="font-semibold text-sm mb-4">Shipping Address</p>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-10 bg-gray-100 rounded-lg"></div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm">
                    + Add Address
                  </button>
                </div>

                <div className="mb-8">
                  <p className="font-semibold text-sm mb-4">Shipping methods</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div>
                        <p className="font-medium text-sm">Free</p>
                        <p className="text-xs text-gray-600">Free</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div>
                        <p className="font-medium text-sm">Paid</p>
                        <p className="text-xs text-gray-600">₹10</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  style={{ backgroundColor: primaryColor }}
                  className="w-full text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  {addressCtaEnabled ? addressCtaText : 'Continue'} →
                </button>
              </div>
            )}

            {/* Payments Step */}
            {activeStep === 'Payments' && (
              <div className="p-5 pb-8">
                {paymentDisplayBanner && (
                  <div
                    className="px-4 py-3 text-center text-sm font-medium mb-6 rounded-xl"
                    style={{ backgroundColor: paymentBannerBgColor, color: paymentBannerTextColor }}
                  >
                    {paymentBannerText}
                  </div>
                )}

                <p className="text-center text-sm font-medium text-gray-600 uppercase mb-4">
                  Payment Options
                </p>

                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-gray-100 px-4 py-3 text-center text-xs text-gray-500 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-3">
                <span>Terms</span>
                <span>Privacy</span>
                <span>Secured</span>
                <span>Payment</span>
                <span className="font-bold text-blue-600">GoKwik</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function StandaloneCheckoutPreview({ settings, error }) { // Added props here too
  return (
    <Suspense fallback={<div>Loading preview...</div>}>
      <PreviewContent settings={settings} error={error} />
    </Suspense>
  );
}
