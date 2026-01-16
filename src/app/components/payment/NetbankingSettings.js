// components/payment/NetbankingSettings.js
'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function NetbankingSettings() {
  // Netbanking Tab States
  const [buttonTitle, setButtonTitle] = useState('Netbanking');
  const [buttonSubtext, setButtonSubtext] = useState('');
  const [buttonColor, setButtonColor] = useState('#F74435');
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');
  const [buttonBadgeText, setButtonBadgeText] = useState('');
  const [buttonBadgeColor, setButtonBadgeColor] = useState('#03B696');
  const [buttonBadgeTextColor, setButtonBadgeTextColor] = useState('#FFFFFF');

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
              Netbanking
            </h1>
          </div>

        
        </div>

        {/* Tabs - Only Netbanking active */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
            <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 whitespace-nowrap cursor-pointer">
              Netbanking
            </button>
            {/* You can add more tabs later if needed */}
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Button Title */}
              <div className="py-4 border-b border-gray-200 flex justify-between">
                <div className="font-medium text-gray-900 mb-2">Button Title</div>
                <div>
                <input
                  type="text"
                  value={buttonTitle}
                  onChange={(e) => setButtonTitle(e.target.value)}
                  className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                </div>
              </div>

              {/* Button Subtext */}
              <div className="py-4 border-b border-gray-200 flex justify-between">
                <div className="font-medium text-gray-900 mb-2">Button Subtext</div>
                <div>
                <input
                  type="text"
                  value={buttonSubtext}
                  onChange={(e) => setButtonSubtext(e.target.value)}
                  placeholder="Enter Button Subtext"
                  className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                </div>
              </div>

              {/* Button Color */}
              <div className="py-4 border-b border-gray-200 flex justify-between">
                <div className="font-medium text-gray-900 mb-2">Button Color</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300" 
                    style={{ backgroundColor: buttonColor }}
                  />
                  <input
                    type="text"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Button Text Color */}
              <div className="py-4 border-b border-gray-200 flex justify-between">
                <div className="font-medium text-gray-900 mb-2">Button Text Color</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300" 
                    style={{ backgroundColor: buttonTextColor }}
                  />
                  <input
                    type="text"
                    value={buttonTextColor}
                    onChange={(e) => setButtonTextColor(e.target.value)}
                    className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Button Badge Text */}
              <div className="py-4 border-b border-gray-200 flex justify-between">
                <div className="font-medium text-gray-900 mb-2">Button Badge Text</div>
                <div>
                <input
                  type="text"
                  value={buttonBadgeText}
                  onChange={(e) => setButtonBadgeText(e.target.value)}
                  placeholder="Enter Button Badge Text"
                  className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                </div>
              </div>

              {/* Button Badge Color */}
              <div className="py-4 border-b border-gray-200 flex justify-between">
                <div className="font-medium text-gray-900 mb-2">Button Badge Color</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300" 
                    style={{ backgroundColor: buttonBadgeColor }}
                  />
                  <input
                    type="text"
                    value={buttonBadgeColor}
                    onChange={(e) => setButtonBadgeColor(e.target.value)}
                    className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Button Badge Text Color */}
              <div className="py-4 flex justify-between">7
                <div className="font-medium text-gray-900 mb-2">Button Badge Text Color</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300" 
                    style={{ backgroundColor: buttonBadgeTextColor }}
                  />
                  <input
                    type="text"
                    value={buttonBadgeTextColor}
                    onChange={(e) => setButtonBadgeTextColor(e.target.value)}
                    className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
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