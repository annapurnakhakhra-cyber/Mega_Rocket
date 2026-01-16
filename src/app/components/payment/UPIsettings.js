// components/payment/UPISettings.js
'use client';

import { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation'; // ← Added this import for router

export default function UPISettings() {
  const router = useRouter(); // ← Now we can use router.back()

  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    buttonTitle: 'UPI',
    buttonSubtext: '',
    buttonColor: '#F74435',
    buttonTextColor: '#FFFFFF',
    buttonBadgeText: '',
    buttonBadgeColor: '#03B696',
    buttonBadgeTextColor: '#FFFFFF',
    preferredPanel: false,
    showUPIQR: false,
    preferredPanelLayout: 'Default'
  });

  const [upiApps, setUpiApps] = useState([
    { id: 1, name: 'PhonePe', icon: '💜', enabled: true, badgeText: '2' },
    { id: 2, name: 'G Pay', icon: '🔵', enabled: true, badgeText: '' },
    { id: 3, name: 'Paytm', icon: '💙', enabled: true, badgeText: '' },
    { id: 4, name: 'Amazon Pay', icon: '⚫', enabled: true, badgeText: '' },
    { id: 5, name: 'BHIM App', icon: '💚', enabled: true, badgeText: '' },
    { id: 6, name: 'CRED UPI', icon: '🛡️', enabled: true, badgeText: '' },
    { id: 7, name: 'Airtel Payments Bank UPI', icon: '🔴', enabled: true, badgeText: '' }
  ]);

  const [preferredApps, setPreferredApps] = useState([
    { id: 1, name: 'PhonePe', icon: '💜', enabled: true },
    { id: 2, name: 'G Pay', icon: '🔵', enabled: true },
    { id: 3, name: 'Paytm', icon: '💙', enabled: true },
    { id: 4, name: 'Amazon Pay', icon: '⚫', enabled: true },
    { id: 5, name: 'BHIM App', icon: '💚', enabled: true },
    { id: 6, name: 'CRED UPI', icon: '🛡️', enabled: true },
    { id: 7, name: 'MobiKwik UPI', icon: '🔷', enabled: false },
    { id: 8, name: 'Jupiter UPI', icon: '🟠', enabled: false }
  ]);

  const handleGeneralChange = (field, value) => {
    setGeneralSettings({ ...generalSettings, [field]: value });
  };

  const toggleUpiApp = (id) => {
    setUpiApps(upiApps.map(app => 
      app.id === id ? { ...app, enabled: !app.enabled } : app
    ));
  };

  const togglePreferredApp = (id) => {
    setPreferredApps(preferredApps.map(app => 
      app.id === id ? { ...app, enabled: !app.enabled } : app
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with WORKING back button */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} // ← This now works perfectly
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">UPI</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('general')}
              className={`pb-3 text-sm font-medium whitespace-nowrap px-2 cursor-pointer ${
                activeTab === 'general'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('upiApps')}
              className={`pb-3 text-sm font-medium whitespace-nowrap px-2 cursor-pointer ${
                activeTab === 'upiApps'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              UPI Apps
            </button>
            <button
              onClick={() => setActiveTab('preferredApps')}
              className={`pb-3 text-sm font-medium whitespace-nowrap px-2 cursor-pointer ${
                activeTab === 'preferredApps'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preferred Apps
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-3xl mx-auto">
                {/* Button Title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Button Title</label>
                  <input
                    type="text"
                    value={generalSettings.buttonTitle}
                    onChange={(e) => handleGeneralChange('buttonTitle', e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Button Subtext */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Button Subtext</label>
                  <input
                    type="text"
                    placeholder="Enter Button Subtext"
                    value={generalSettings.buttonSubtext}
                    onChange={(e) => handleGeneralChange('buttonSubtext', e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Button Color */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Button Color</label>
                  <div className="flex items-center gap-2 w-full sm:w-64">
                    <input
                      type="color"
                      value={generalSettings.buttonColor}
                      onChange={(e) => handleGeneralChange('buttonColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={generalSettings.buttonColor}
                      onChange={(e) => handleGeneralChange('buttonColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Button Text Color */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Button Text Color</label>
                  <div className="flex items-center gap-2 w-full sm:w-64">
                    <input
                      type="color"
                      value={generalSettings.buttonTextColor}
                      onChange={(e) => handleGeneralChange('buttonTextColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={generalSettings.buttonTextColor}
                      onChange={(e) => handleGeneralChange('buttonTextColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Button Badge Text */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Button Badge Text</label>
                  <input
                    type="text"
                    placeholder="Enter Button Badge Text"
                    value={generalSettings.buttonBadgeText}
                    onChange={(e) => handleGeneralChange('buttonBadgeText', e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Button Badge Color */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Button Badge Color</label>
                  <div className="flex items-center gap-2 w-full sm:w-64">
                    <input
                      type="color"
                      value={generalSettings.buttonBadgeColor}
                      onChange={(e) => handleGeneralChange('buttonBadgeColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={generalSettings.buttonBadgeColor}
                      onChange={(e) => handleGeneralChange('buttonBadgeColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Button Badge Text Color */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 border-b border-gray-200">
                  <label className="text-sm font-medium text-gray-700">Button Badge Text Color</label>
                  <div className="flex items-center gap-2 w-full sm:w-64">
                    <input
                      type="color"
                      value={generalSettings.buttonBadgeTextColor}
                      onChange={(e) => handleGeneralChange('buttonBadgeTextColor', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={generalSettings.buttonBadgeTextColor}
                      onChange={(e) => handleGeneralChange('buttonBadgeTextColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Preferred Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">Preferred Panel</div>
                    <div className="text-sm text-gray-500 mt-1">Enable Preferred Panel</div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={generalSettings.preferredPanel}
                      onChange={(e) => handleGeneralChange('preferredPanel', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className={`h-6 w-11 rounded-full transition-colors ${
                        generalSettings.preferredPanel ? 'bg-blue-600' : 'bg-gray-200'
                      } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                    ></div>
                  </label>
                </div>

                {/* Show UPI QR on Desktop */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                  <div>
                    <div className="font-medium text-gray-900">Show UPI QR on Desktop Payment Page</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Enables the display of a UPI QR code on the payment page on desktop devices
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={generalSettings.showUPIQR}
                      onChange={(e) => handleGeneralChange('showUPIQR', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div
                      className={`h-6 w-11 rounded-full transition-colors ${
                        generalSettings.showUPIQR ? 'bg-blue-600' : 'bg-gray-200'
                      } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                    ></div>
                  </label>
                </div>

                {/* Preferred Panel Layout */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900">Preferred Panel Layout</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Choose between various layouts like List, Grid and Bento. The default layout is not available in Accordion Page Style
                    </div>
                  </div>
                  <select
                    value={generalSettings.preferredPanelLayout}
                    onChange={(e) => handleGeneralChange('preferredPanelLayout', e.target.value)}
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Default">Default</option>
                    <option value="List">List</option>
                    <option value="Grid">Grid</option>
                    <option value="Bento">Bento</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'upiApps' && (
              <div className="space-y-4">
                {upiApps.map((app) => (
                  <div 
                    key={app.id} 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      <span className="font-medium text-gray-900">{app.name}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      {app.badgeText && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Badge:</span>
                          <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium">
                            {app.badgeText}
                          </span>
                        </div>
                      )}
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={app.enabled}
                          onChange={() => toggleUpiApp(app.id)}
                          className="sr-only peer"
                        />
                        <div
                          className={`h-6 w-11 rounded-full transition-colors ${
                            app.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                        ></div>
                      </label>
                      <button className="px-4 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50 cursor-pointer">
                        Customise
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'preferredApps' && (
              <div className="space-y-4">
                {preferredApps.map((app) => (
                  <div 
                    key={app.id} 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      <span className="font-medium text-gray-900">{app.name}</span>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={app.enabled}
                        onChange={() => togglePreferredApp(app.id)}
                        className="sr-only peer"
                      />
                      <div
                        className={`h-6 w-11 rounded-full transition-colors ${
                          app.enabled ? 'bg-blue-600' : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                      ></div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row justify-end gap-4">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
              <RotateCcw size={16} />
              Revert Changes
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Confirm Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}