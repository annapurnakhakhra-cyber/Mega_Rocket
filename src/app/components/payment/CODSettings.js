'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';

export default function CODSettings() {
  // COD Tab States (bilkul same)
  const [codButtonTitle, setCodButtonTitle] = useState('Cash on Delivery');
  const [codButtonSubtext, setCodButtonSubtext] = useState('');
  const [codButtonColor, setCodButtonColor] = useState('#F74435');
  const [codButtonTextColor, setCodButtonTextColor] = useState('#FFFFFF');
  const [codBadgeText, setCodBadgeText] = useState('');
  const [codBadgeColor, setCodBadgeColor] = useState('#F73536');
  const [codBadgeTextColor, setCodBadgeTextColor] = useState('#FFFFFF');
  const [minCodOrderValue, setMinCodOrderValue] = useState('0');
  const [codOtpRequirement, setCodOtpRequirement] = useState(false);
  const [maxCodOrderValue, setMaxCodOrderValue] = useState('1500');

  // Partial COD (PPCOD) Tab States (bilkul same)
  const [enablePpcod, setEnablePpcod] = useState(false);
  const [ppcodButtonTitle, setPpcodButtonTitle] = useState('Cash on Delivery');
  const [ppcodButtonSubtext, setPpcodButtonSubtext] = useState('Amount Non-Refundable');
  const [ppcodButtonColor, setPpcodButtonColor] = useState('#F74435');
  const [ppcodButtonTextColor, setPpcodButtonTextColor] = useState('#FFFFFF');
  const [ppcodBadgeText, setPpcodBadgeText] = useState('');
  const [ppcodBadgeColor, setPpcodBadgeColor] = useState('#03B696');
  const [ppcodBadgeTextColor, setPpcodBadgeTextColor] = useState('#FFFFFF');
  const [fixedPpcodAmount, setFixedPpcodAmount] = useState('0');
  const [tagBasedPpcodActivation, setTagBasedPpcodActivation] = useState(false);
  const [ppcodDeductionType, setPpcodDeductionType] = useState('Fixed');

  const [activeTab, setActiveTab] = useState('cod');
   const [user, setUser] = useState(null);

  // API ke liye extra states (naya add kiya)
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isValidHexColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

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

  const handleColorChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || isValidHexColor(value)) {
      setter(value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const payload = {
      codButtonTitle,
      codButtonSubtext,
      codButtonColor,
      codButtonTextColor,
      codBadgeText,
      codBadgeColor,
      codBadgeTextColor,
      minCodOrderValue: Number(minCodOrderValue) || 0,
      codOtpRequirement,
      maxCodOrderValue: Number(maxCodOrderValue) || 0,
      enablePpcod,
      ppcodButtonTitle,
      ppcodButtonSubtext,
      ppcodButtonColor,
      ppcodButtonTextColor,
      ppcodBadgeText,
      ppcodBadgeColor,
      ppcodBadgeTextColor,
      fixedPpcodAmount: Number(fixedPpcodAmount) || 0,
      tagBasedPpcodActivation,
      ppcodDeductionType,
    };

    try {
      const response = await fetch('https://adminrocket.megascale.co.in/api/cod-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Store-Id': STORE_ID,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setSaveError(
        err.message.includes('Failed to fetch')
          ? 'Backend server se connect nahi ho raha\nBackend chal raha hai? Port 3000 sahi hai?'
          : err.message || 'Settings save nahi ho payi'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header – bilkul same */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <ArrowLeft
              className="h-5 w-5 text-gray-600 cursor-pointer"
              onClick={() => window.history.back()}
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              COD / Partial COD
            </h1>
          </div>
        </div>

        {/* Tabs – bilkul same */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto gap-8 pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab('cod')}
              className={`pb-3 text-sm font-medium whitespace-nowrap cursor-pointer ${
                activeTab === 'cod'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              COD
            </button>
            <button
              onClick={() => setActiveTab('partial-cod')}
              className={`pb-3 text-sm font-medium whitespace-nowrap cursor-pointer ${
                activeTab === 'partial-cod'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Partial COD
            </button>
          </div>
        </div>

        {/* Main Content – sab kuch same */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {activeTab === 'cod' ? (
                <>
                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Title</div>
                    <input
                      type="text"
                      value={codButtonTitle}
                      onChange={(e) => setCodButtonTitle(e.target.value)}
                      className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Subtext</div>
                    <input
                      type="text"
                      value={codButtonSubtext}
                      onChange={(e) => setCodButtonSubtext(e.target.value)}
                      placeholder="Enter Button Subtext"
                      className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: codButtonColor }}
                      />
                      <input
                        type="text"
                        value={codButtonColor}
                        onChange={handleColorChange(setCodButtonColor)}
                        placeholder="#F74435"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Text Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: codButtonTextColor }}
                      />
                      <input
                        type="text"
                        value={codButtonTextColor}
                        onChange={handleColorChange(setCodButtonTextColor)}
                        placeholder="#FFFFFF"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Badge Text</div>
                    <input
                      type="text"
                      value={codBadgeText}
                      onChange={(e) => setCodBadgeText(e.target.value)}
                      placeholder="Enter Button Badge Text"
                      className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Badge Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: codBadgeColor }}
                      />
                      <input
                        type="text"
                        value={codBadgeColor}
                        onChange={handleColorChange(setCodBadgeColor)}
                        placeholder="#F73536"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Badge Text Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: codBadgeTextColor }}
                      />
                      <input
                        type="text"
                        value={codBadgeTextColor}
                        onChange={handleColorChange(setCodBadgeTextColor)}
                        placeholder="#FFFFFF"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div>
                    <div className="font-medium text-gray-900 mb-2">Minimum COD Order Value</div>
                    <div className="text-sm text-gray-500 mb-3">
                      The minimum order value required to enable the Cash on Delivery (COD) payment method
                    </div>
                    </div>
                    <div>
                    <input
                      type="number"
                      value={minCodOrderValue}
                      onChange={(e) => setMinCodOrderValue(e.target.value)}
                      className="block w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">COD Order OTP Requirement</div>
                      <div className="mt-1 text-sm text-gray-500">
                        If enabled, customers selecting COD will receive an OTP for additional order confirmation, improving security and reducing fake orders
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={codOtpRequirement}
                        onChange={() => setCodOtpRequirement(!codOtpRequirement)}
                        className="sr-only peer"
                      />
                      <div
                        className={`h-6 w-11 rounded-full transition-colors ${
                          codOtpRequirement ? 'bg-blue-600' : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                      ></div>
                    </label>
                  </div>

                  <div className="py-4 flex justify-between">
                    <div>
                    <div className="font-medium text-gray-900 mb-2">Maximum COD Order Value</div>
                    <div className="text-sm text-gray-500 mb-3">
                      The maximum order value allowed for choosing the Cash on Delivery (COD) option
                    </div>
                    </div>
                    <div>
                    <input
                      type="number"
                      value={maxCodOrderValue}
                      onChange={(e) => setMaxCodOrderValue(e.target.value)}
                      className="block w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Enable PPCOD</div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={enablePpcod}
                        onChange={() => setEnablePpcod(!enablePpcod)}
                        className="sr-only peer"
                      />
                      <div
                        className={`h-6 w-11 rounded-full transition-colors ${
                          enablePpcod ? 'bg-blue-600' : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                      ></div>
                    </label>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Title</div>
                    <input
                      type="text"
                      value={ppcodButtonTitle}
                      onChange={(e) => setPpcodButtonTitle(e.target.value)}
                      className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Subtext</div>
                    <input
                      type="text"
                      value={ppcodButtonSubtext}
                      onChange={(e) => setPpcodButtonSubtext(e.target.value)}
                      className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    
                    <div className="font-medium text-gray-900 mb-2">Button Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: ppcodButtonColor }}
                      />
                      <input
                        type="text"
                        value={ppcodButtonColor}
                        onChange={handleColorChange(setPpcodButtonColor)}
                        placeholder="#F74435"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Text Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: ppcodButtonTextColor }}
                      />
                      <input
                        type="text"
                        value={ppcodButtonTextColor}
                        onChange={handleColorChange(setPpcodButtonTextColor)}
                        placeholder="#FFFFFF"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Badge Text</div>
                    <input
                      type="text"
                      value={ppcodBadgeText}
                      onChange={(e) => setPpcodBadgeText(e.target.value)}
                      placeholder="Enter Button Badge Text"
                      className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Badge Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: ppcodBadgeColor }}
                      />
                      <input
                        type="text"
                        value={ppcodBadgeColor}
                        onChange={handleColorChange(setPpcodBadgeColor)}
                        placeholder="#03B696"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div className="font-medium text-gray-900 mb-2">Button Badge Text Color</div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: ppcodBadgeTextColor }}
                      />
                      <input
                        type="text"
                        value={ppcodBadgeTextColor}
                        onChange={handleColorChange(setPpcodBadgeTextColor)}
                        placeholder="#FFFFFF"
                        className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-200 flex justify-between">
                    <div>
                    <div className="font-medium text-gray-900 mb-2">Fixed PPCOD Amount</div>
                    <div className="text-sm text-gray-500 mb-3">
                      If deduction type is 'fixed', this is the flat amount the customer must pay upfront when choosing PPCOD
                    </div>
                    </div>
                    <div>
                    <input
                      type="number"
                      value={fixedPpcodAmount}
                      onChange={(e) => setFixedPpcodAmount(e.target.value)}
                      className="block w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Tag-Based PPCOD Activation</div>
                      <div className="mt-1 text-sm text-gray-500">
                        Enables dynamic PPCOD behavior based on product or customer tags. Useful for targeting PPCOD rules to specific segments
                      </div>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={tagBasedPpcodActivation}
                        onChange={() => setTagBasedPpcodActivation(!tagBasedPpcodActivation)}
                        className="sr-only peer"
                      />
                      <div
                        className={`h-6 w-11 rounded-full transition-colors ${
                          tagBasedPpcodActivation ? 'bg-blue-600' : 'bg-gray-200'
                        } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all`}
                      ></div>
                    </label>
                  </div>

                  <div className="py-4 flex justify-between">
                    <div>
                    <div className="font-medium text-gray-900 mb-2">PPCOD Deduction Type</div>
                    <div className="text-sm text-gray-500 mb-3">
                      Determines whether the partial payment is calculated as a fixed amount or a percentage of the total order value
                    </div>
                    </div>
                    <div>
                    <select
                      value={ppcodDeductionType}
                      onChange={(e) => setPpcodDeductionType(e.target.value)}
                      className="block w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Fixed">Fixed</option>
                      <option value="Percentage">Percentage</option>
                    </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer – yaha save + error + success message add hua */}
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            {saveError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm whitespace-pre-line">
                {saveError}
              </div>
            )}

            {saveSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                Settings successfully saved!
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto w-full cursor-pointer"
                disabled={saving}
                onClick={() => window.location.reload()}
              >
                <RotateCcw size={16} />
                Revert Changes
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto w-full cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Confirm Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}