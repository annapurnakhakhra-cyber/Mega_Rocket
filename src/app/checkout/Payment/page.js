'use client';

import React, { useState, useEffect } from 'react';

const API_BASE = 'https://adminrocket,megascale.co.in/api/payments/cod';
// const STORE_ID = 'annapurnakhakhra';
const ORIGIN = 'https://adminrocket,megascale.co.in';



export default function CODLimitsSettings() {
  const [activeTab, setActiveTab] = useState('cod');
  const [isTieredEnabled, setIsTieredEnabled] = useState(true);
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(1500);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


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

   const headers = {
  'x-store-id': STORE_ID,
  'Origin': ORIGIN,
  'Content-Type': 'application/json',
};
  

  // New discount form state
  const [newDiscount, setNewDiscount] = useState({
    paymentMethod: '',
    discountCode: '',
    discountType: 'Non Freebie',
    lowerLimit: '',
    upperLimit: '',
    discountValue: '',
    freebies: 'NA',
    rtoDriven: false,
    capping: '',
  });

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editingDiscount, setEditingDiscount] = useState({});

  // Helper to format payment method display
  const formatPaymentMethod = (method) => {
    const map = {
      'upi': 'UPI',
      'netbanking': 'Netbanking',
      'wallet-paytm': 'Paytm Wallet',
      'wallet-airtelmoney': 'Airtel Money',
      'wallet-phonepe': 'PhonePe',
      'wallet-bajajpay': 'Bajaj Pay',
      'wallet-jomoney': 'Jio Money',
      'wallet-mobikwik': 'MobiKwik',
    };
    return map[method] || method.charAt(0).toUpperCase() + method.slice(1);
  };

  // Fetch settings on load
  useEffect(() => {
    if (!user?.shopUrl) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

       const res = await fetch(`${API_BASE}/settings`, {
        headers: {
          'x-store-id': user.shopUrl,        // ← use directly here
          'Origin': ORIGIN,
          'Content-Type': 'application/json',
        }
      });

        if (!res.ok) {
          throw new Error(`Failed to load settings (${res.status})`);
        }

        const response = await res.json();

        if (!response.success || !response.settings) {
          throw new Error('Invalid response format');
        }

        const settings = response.settings;

        // Set COD Limits
        if (settings.codLimits) {
          setLowerLimit(settings.codLimits.lowerLimit ?? 10);
          setUpperLimit(settings.codLimits.upperLimit ?? 1500);
        }

        // Set Tiered Enabled Toggle
        setIsTieredEnabled(settings.tiered?.enabled ?? true);

        // Set Tiered Discounts
        if (settings.tiered?.discounts && Array.isArray(settings.tiered.discounts)) {
          setDiscounts(settings.tiered.discounts);
        } else {
          setDiscounts([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to load settings. Check network or API.');
        setDiscounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user?.shopUrl]);

  // Save COD limits and tiered toggle
  const saveMainSettings = async () => {
    try {
      setSaving(true);
      const body = JSON.stringify({
        codLimits: { lowerLimit, upperLimit },
        tieredEnabled: isTieredEnabled,
      });

      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers,
        body,
      });

      if (!res.ok) throw new Error('Save failed');
      alert('Main settings saved successfully!');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add or Update Tiered Discount
  const addOrUpdateDiscount = async (discount, isUpdate = false) => {
    if (!discount.paymentMethod || !discount.discountCode) {
      alert('Payment Method and Discount Code are required!');
      return;
    }

    const payload = {
      paymentMethod: discount.paymentMethod,
      discountCode: discount.discountCode,
      discountType: discount.discountType === 'Freebie' ? 'FREEBIE' : 'NON_FREEBIE',
      lowerLimit: Number(discount.lowerLimit) || 1,
      upperLimit: discount.upperLimit ? Number(discount.upperLimit) : null,
      discountValue: Number(discount.discountValue) || 0,
      freebies: discount.freebies || 'NA',
      rtoDriven: !!discount.rtoDriven,
      capping: Number(discount.capping) || 999,
    };

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE}/settings/tiered`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('Failed to save discount: ' + errorText);
      }

      // Refresh full data after save
      const refreshed = await fetch(`${API_BASE}/settings`, { headers });
      const refreshedData = await refreshed.json();

      if (refreshedData.success && refreshedData.settings?.tiered?.discounts) {
        setDiscounts(refreshedData.settings.tiered.discounts);
      }

      // Reset form if adding new
      if (!isUpdate) {
        setNewDiscount({
          paymentMethod: '',
          discountCode: '',
          discountType: 'Non Freebie',
          lowerLimit: '',
          upperLimit: '',
          discountValue: '',
          freebies: 'NA',
          rtoDriven: false,
          capping: '',
        });
      }

      setEditingId(null);
      alert('Discount saved successfully!');
    } catch (err) {
      alert('Error saving discount: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (disc) => {
    setEditingId(disc._id);
    setEditingDiscount({
      ...disc,
      discountType: disc.discountType === 'FREEBIE' ? 'Freebie' : 'Non Freebie',
      lowerLimit: disc.lowerLimit || '',
      upperLimit: disc.upperLimit || '',
      discountValue: disc.discountValue || '',
      freebies: disc.freebies || 'NA',
      rtoDriven: disc.rtoDriven || false,
      capping: disc.capping || '',
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingDiscount({});
  };

  const deleteDiscount = (id) => {
    if (!confirm('Are you sure you want to delete this discount?')) return;
    setDiscounts((prev) => prev.filter((d) => d._id !== id));
    // TODO: Add backend DELETE endpoint when available
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-600">Loading settings...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Tabs */}
        <div className="border-b border-gray-300 mb-8 overflow-x-auto">
          <nav className="flex space-x-8 whitespace-nowrap pb-4 -mb-px">
            <button
              onClick={() => setActiveTab('cod')}
              className={`text-sm font-medium border-b-2 pb-4 px-2 transition-colors cursor-pointer ${
                activeTab === 'cod'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              COD Limits
            </button>
            <button
              onClick={() => setActiveTab('tiered')}
              className={`text-sm font-medium border-b-2 pb-4 px-2 transition-colors cursor-pointer ${
                activeTab === 'tiered'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Tiered Prepaid Discounts
            </button>
          </nav>
        </div>

        {/* COD Limits Tab */}
        {activeTab === 'cod' && (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-800">
                This setting overrides Kwik Flow rules and works independently. Check Kwik Flows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">COD Lower Limit</label>
                <input
                  type="number"
                  value={lowerLimit}
                  onChange={(e) => setLowerLimit(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">COD Upper Limit</label>
                <input
                  type="number"
                  value={upperLimit}
                  onChange={(e) => setUpperLimit(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

       {/* Tiered Prepaid Discounts Tab */}
{activeTab === 'tiered' && (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 className="text-lg font-semibold text-gray-900">Tiered Prepaid Discounts</h2>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Currently {isTieredEnabled ? 'Enabled' : 'Disabled'}
        </span>
        <label className="relative inline-flex items-center cursor-not-allowed opacity-70">
          <input type="checkbox" checked={isTieredEnabled} disabled className="sr-only peer" />
          <div className={`w-12 h-7 rounded-full ${isTieredEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition ${isTieredEnabled ? 'translate-x-5' : ''}`} />
        </label>
      </div>
    </div>

    {/* Add New / Edit Discount Form */}
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <h3 className="text-md font-medium text-gray-900 mb-4">
        {editingId ? 'Edit Discount' : 'Add New Discount'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {/* Discount Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={editingId ? editingDiscount.discountType : newDiscount.discountType}
              onChange={(e) => {
                const val = e.target.value;
                if (editingId) {
                  setEditingDiscount({ ...editingDiscount, discountType: val });
                } else {
                  setNewDiscount({ ...newDiscount, discountType: val });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Non Freebie</option>
              <option>Freebie</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method <span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              value={editingId ? editingDiscount.paymentMethod : newDiscount.paymentMethod}
              onChange={(e) => {
                const val = e.target.value;
                if (editingId) {
                  setEditingDiscount({ ...editingDiscount, paymentMethod: val });
                } else {
                  setNewDiscount({ ...newDiscount, paymentMethod: val });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="netbanking">Netbanking</option>
              <option value="wallet-paytm">Paytm Wallet</option>
              <option value="upi">UPI</option>
              <option value="wallet-airtelmoney">Airtel Money</option>
              <option value="wallet-phonepe">PhonePe</option>
              <option value="wallet-bajajpay">Bajaj Pay</option>
              <option value="wallet-jomoney">Jio Money</option>
              <option value="wallet-mobikwik">MobiKwik</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Discount Code - input (no change) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={editingId ? editingDiscount.discountCode : newDiscount.discountCode}
            onChange={(e) => {
              const val = e.target.value;
              if (editingId) {
                setEditingDiscount({ ...editingDiscount, discountCode: val });
              } else {
                setNewDiscount({ ...newDiscount, discountCode: val });
              }
            }}
            placeholder="e.g. PREPAID10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Lower & Upper Limit - inputs (no change) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lower Order Limit <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={editingId ? editingDiscount.lowerLimit : newDiscount.lowerLimit}
            onChange={(e) => {
              const val = e.target.value;
              if (editingId) {
                setEditingDiscount({ ...editingDiscount, lowerLimit: val });
              } else {
                setNewDiscount({ ...newDiscount, lowerLimit: val });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upper Order Limit</label>
          <input
            type="number"
            value={editingId ? editingDiscount.upperLimit : newDiscount.upperLimit}
            onChange={(e) => {
              const val = e.target.value;
              if (editingId) {
                setEditingDiscount({ ...editingDiscount, upperLimit: val });
              } else {
                setNewDiscount({ ...newDiscount, upperLimit: val });
              }
            }}
            placeholder="No limit if blank"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Discount Value - input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value (%)</label>
          <input
            type="number"
            value={editingId ? editingDiscount.discountValue : newDiscount.discountValue}
            onChange={(e) => {
              const val = e.target.value;
              if (editingId) {
                setEditingDiscount({ ...editingDiscount, discountValue: val });
              } else {
                setNewDiscount({ ...newDiscount, discountValue: val });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Free Gift */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Free Gift</label>
          <div className="relative">
            <select
              value={editingId ? editingDiscount.freebies : newDiscount.freebies}
              onChange={(e) => {
                const val = e.target.value;
                if (editingId) {
                  setEditingDiscount({ ...editingDiscount, freebies: val });
                } else {
                  setNewDiscount({ ...newDiscount, freebies: val });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NA">Not Applicable</option>
              {/* Add more options if needed */}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* RTO Driven */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RTO Driven</label>
          <div className="relative">
            <select
              value={editingId ? editingDiscount.rtoDriven : newDiscount.rtoDriven}
              onChange={(e) => {
                const val = e.target.value === 'true';
                if (editingId) {
                  setEditingDiscount({ ...editingDiscount, rtoDriven: val });
                } else {
                  setNewDiscount({ ...newDiscount, rtoDriven: val });
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={false}>False</option>
              <option value={true}>True</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Capping Amount - input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capping Amount</label>
          <input
            type="number"
            value={editingId ? editingDiscount.capping : newDiscount.capping}
            onChange={(e) => {
              const val = e.target.value;
              if (editingId) {
                setEditingDiscount({ ...editingDiscount, capping: val });
              } else {
                setNewDiscount({ ...newDiscount, capping: val });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-3">
          <button
            onClick={() => addOrUpdateDiscount(editingId ? editingDiscount : newDiscount, !!editingId)}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium py-2.5 rounded-md transition cursor-pointer"
          >
            {saving ? 'Saving...' : editingId ? 'Update Discount' : '+ Add New Discount'}
          </button>
          {editingId && (
            <button
              onClick={cancelEditing}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Table - no change needed */}
     {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Payment Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">Discount Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Lower Limit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Upper Limit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">Discount (%)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden xl:table-cell">Free Gift</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden xl:table-cell">RTO Driven</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">Capping</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {discounts.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center py-10 text-gray-500">
                          No tiered prepaid discounts configured yet.
                        </td>
                      </tr>
                    ) : (
                      discounts.map((disc) => (
                        <tr key={disc._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatPaymentMethod(disc.paymentMethod)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 hidden sm:table-cell">{disc.discountCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 hidden md:table-cell">
                            {disc.discountType === 'FREEBIE' ? 'Freebie' : 'Non Freebie'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">₹{disc.lowerLimit}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{disc.upperLimit ? `₹${disc.upperLimit}` : 'No limit'}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 hidden lg:table-cell">{disc.discountValue || 0}%</td>
                          <td className="px-4 py-3 text-sm text-gray-900 hidden xl:table-cell">{disc.freebies}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 hidden xl:table-cell">{disc.rtoDriven ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 hidden lg:table-cell">₹{disc.capping ?? '999'}</td>
                          <td className="px-4 py-3 text-sm">
                            <button onClick={() => startEditing(disc)} className="text-blue-600 hover:text-blue-800 mr-4 font-medium cursor-pointer">Edit</button>
                            <button onClick={() => deleteDiscount(disc._id)} className="text-red-600 hover:text-red-800 font-medium cursor-pointer">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
  </div>
)}

        {/* Save Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={saveMainSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium px-8 py-3 rounded-md transition shadow-sm cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}