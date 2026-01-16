// components/payment/PaymentPageSettings.js
'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function PaymentPageSettings() {
  const [showPrice, setShowPrice] = useState(true);
  const [showComparedPrice, setShowComparedPrice] = useState(false);
  const [paymentPageTitle, setPaymentPageTitle] = useState('');
  const [showDecimalValue, setShowDecimalValue] = useState(true);
  const [paymentPageOfferCarousel, setPaymentPageOfferCarousel] = useState(false);
  const [pageTitleColor, setPageTitleColor] = useState('#D61E1E');
  const [methodPageOfferCarousel, setMethodPageOfferCarousel] = useState(true);
  const [buttonBadgePosition, setButtonBadgePosition] = useState('Center');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <ArrowLeft 
              className="h-5 w-5 text-gray-600 cursor-pointer" 
              onClick={() => window.history.back()} 
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Payment Page
            </h1>
          </div>

         
        </div>

        {/* Tabs - Only General */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
            <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 whitespace-nowrap cursor-pointer ">
              General
            </button>
            {/* You can add more tabs later */}
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Toggle 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Show Price</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={() => setShowPrice(!showPrice)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      showPrice ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Toggle 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Show Compared Price</div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={showComparedPrice}
                    onChange={() => setShowComparedPrice(!showComparedPrice)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      showComparedPrice ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Text Input */}
              <div className="py-4 border-b border-gray-200">
                <div className="font-medium text-gray-900 mb-2">Payment Page Title</div>
                <div className="text-sm text-gray-500 mb-3">
                  Title of Payment Page, shown at the top of the payment options
                </div>
                <input
                  type="text"
                  value={paymentPageTitle}
                  onChange={(e) => setPaymentPageTitle(e.target.value)}
                  placeholder="Enter Payment Page Title"
                  className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Toggle 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Show Decimal Value</div>
                  <div className="mt-1 text-sm text-gray-500">
                    When enabled, prices will always show two decimal places — ₹10.00 instead of ₹10.
                    Fractional prices like ₹10.50 will be shown as is, regardless of the toggle setting.
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={showDecimalValue}
                    onChange={() => setShowDecimalValue(!showDecimalValue)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      showDecimalValue ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Toggle 4 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Payment Page Offer Carousel</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Show offer carousel on the payment page. Payment page title will be disabled when this toggle is on.
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={paymentPageOfferCarousel}
                    onChange={() => setPaymentPageOfferCarousel(!paymentPageOfferCarousel)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      paymentPageOfferCarousel ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Color Picker */}
              <div className="py-4 border-b border-gray-200">
                <div className="font-medium text-gray-900 mb-2">Page Title Color</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300" 
                    style={{ backgroundColor: pageTitleColor }}
                  />
                  <input
                    type="text"
                    value={pageTitleColor}
                    onChange={(e) => setPageTitleColor(e.target.value)}
                    className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Toggle 5 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Method Page Offer Carousel</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Show offer carousel on the individual payment method page.
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={methodPageOfferCarousel}
                    onChange={() => setMethodPageOfferCarousel(!methodPageOfferCarousel)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      methodPageOfferCarousel ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Dropdown */}
              <div className="py-4">
                <div className="font-medium text-gray-900 mb-2">Button Badge Position</div>
                <div className="text-sm text-gray-500 mb-3">
                  The alignment of the payment button badge.
                </div>
                <select
                  value={buttonBadgePosition}
                  onChange={(e) => setButtonBadgePosition(e.target.value)}
                  className="block w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm cursor-pointer"
                >
                  <option value="Center">Center</option>
                  <option value="Left">Left</option>
                  <option value="Right">Right</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 px-4 py-4 sm:px-6">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto w-full cursor-pointer">
              <RotateCcw size={16} />
              Revert Changes
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto w-full cursor-pointer">
              Confirm Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}