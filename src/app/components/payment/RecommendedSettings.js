// components/payment/RecommendedSettings.js
'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function RecommendedSettings() {
  const [usedUpiApp, setUsedUpiApp] = useState(true);
  const [usedSavedCards, setUsedSavedCards] = useState(true);
  const [codPpcod, setCodPpcod] = useState(false);
  const [hideUpiPreferredPanel, setHideUpiPreferredPanel] = useState(true);
  const [hideUpiCollectVpas, setHideUpiCollectVpas] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <ArrowLeft className="h-5 w-5 text-gray-600 cursor-pointer" onClick={() => window.history.back()} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Recommended payment methods
            </h1>
          </div>
        </div>

        {/* Tabs - Only General active */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
            <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 whitespace-nowrap">
              General
            </button>
            {/* Other tabs can be added later */}
            {/* <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap">Other</button> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Toggle 1 */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Used UPI App</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Show previously used UPI apps as recommended options
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={usedUpiApp}
                    onChange={() => setUsedUpiApp(!usedUpiApp)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      usedUpiApp ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Toggle 2 */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Used saved cards</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Show saved cards as recommended options
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={usedSavedCards}
                    onChange={() => setUsedSavedCards(!usedSavedCards)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      usedSavedCards ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Toggle 3 */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">COD/PCOD</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Show COD or PPCOD as recommended options
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={codPpcod}
                    onChange={() => setCodPpcod(!codPpcod)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      codPpcod ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Toggle 4 */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-4 border-b border-gray-200">
                <div>
                  <div className="font-medium text-gray-900">Hide UPI Preferred Panel</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Hide the preferred UPI panel as it is already shown in recommended methods
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={hideUpiPreferredPanel}
                    onChange={() => setHideUpiPreferredPanel(!hideUpiPreferredPanel)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      hideUpiPreferredPanel ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
              </div>

              {/* Toggle 5 */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 py-4">
                <div>
                  <div className="font-medium text-gray-900">Hide UPI Collect VPAs</div>
                  <div className="mt-1 text-sm text-gray-500">
                    Don't show previously used VPAs or UPI Collect apps in recommended options
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={hideUpiCollectVpas}
                    onChange={() => setHideUpiCollectVpas(!hideUpiCollectVpas)}
                    className="sr-only peer"
                  />
                  <div
                    className={`h-6 w-11 rounded-full transition-colors ${
                      hideUpiCollectVpas ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                  ></div>
                </label>
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