"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'https://adminrocket,megascale.co.in/api';
// const STORE_ID = 'swing-9926.myshopify.com';

const AllDiscounts = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('codes');

  // Data states
  const [codesDiscounts, setCodesDiscounts] = useState([]);
  const [setsDiscounts, setSetsDiscounts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    manualStackingEnabled: false,
    manualStackingLimit: 5,
    bundleDiscountStackingEnabled: false,
    specificStackingEnabled: false,
    specificStackingMatchType: 'exact',
    specificStackingCodes: [],
  });

  const [newCodeInput, setNewCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
    const [user, setUser] = useState(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editForm, setEditForm] = useState({
    code: '',
    type: 'manual',
    combinesWith: false,
    status: 'inactive',
    visibility: false,
    metadata: {
      value: 0,
      valueType: 'percentage',
      minimumPurchase: 0,
      appliesTo: '',
    },
  });

  const currentDiscounts = activeTab === 'codes' ? codesDiscounts : setsDiscounts;
  const totalRecords = currentDiscounts.length;

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

  // ── Unified Fetch Function for both Codes and Sets ─────────────────────────────────
  const fetchDiscounts = async () => {
    try {
      setLoadingData(true);
      setDataError('');

      const res = await fetch(`${API_BASE}/discount`, {
        headers: { 'x-store-id': STORE_ID },
      });

      if (!res.ok) {
        throw new Error(`Failed to load discounts (${res.status})`);
      }

      const result = await res.json();

      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }

      const { codes = [], sets = [] } = result.data;

      // Normalize codes
      const normalizedCodes = codes.map(item => ({
        ...item,
        id: item._id,
        status: item.status === 'active' ? 'Active' : 'Inactive',
        visibility: item.visibility ? 'Active' : 'Inactive',
      }));

      // Normalize sets
      const normalizedSets = sets.map(item => ({
        ...item,
        id: item._id,
        code: item.name || 'Unnamed Set', // Display as code in table
        status: item.status === 'active' ? 'Active' : 'Inactive',
        numberOfCodes: item.numberOfCodes || 0,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
        endDate: item.endDate ? new Date(item.endDate).toLocaleDateString() : '-',
        tags: item.tags || [],
        combinesWith: item.combinesWith || false,
      }));

      setCodesDiscounts(normalizedCodes);
      setSetsDiscounts(normalizedSets);
    } catch (err) {
      console.error('Error loading discounts:', err);
      setDataError(err.message || 'Failed to load discounts');
      setCodesDiscounts([]);
      setSetsDiscounts([]);
    } finally {
      setLoadingData(false);
    }
  };
  // Delete Confirmation + API Call
const handleDeleteDiscount = async (discountId) => {
  const discount = currentDiscounts.find(d => d.id === discountId);
  if (!discount) return;

  const isCode = activeTab === 'codes';
  const displayName = isCode ? discount.code : discount.code || discount.name || 'this set';

  const confirmed = window.confirm(
    `Are you sure you want to delete "${displayName}"?\nThis action cannot be undone.`
  );

  if (!confirmed) return;

  // Optimistic UI update - remove immediately
  setCurrentDiscounts(prev => prev.filter(d => d.id !== discountId));

  try {
    const endpoint = isCode 
      ? `${API_BASE}/discount/code/${discountId}`
      : `${API_BASE}/discount/set/${discountId}`;

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-store-id': STORE_ID,
        // 'Origin': window.location.origin, // optional - usually not needed
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Delete failed with status ${response.status}`);
    }

    // Success - maybe show toast in future
    console.log(`Successfully deleted ${isCode ? 'code' : 'set'}: ${discountId}`);

  } catch (err) {
    console.error('Delete error:', err);

    alert(`Failed to delete discount: ${err.message || 'Server error'}`);

    // Rollback - put it back
    setCurrentDiscounts(prev => {
      // Prevent duplicate if already present somehow
      if (prev.some(d => d.id === discountId)) return prev;
      return [...prev, discount].sort((a, b) => 
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      ); // optional: sort by date if you want
    });
  }
};

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/discount/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to load settings: ${response.status} ${text}`);
      }

      const data = await response.json();
      setSettings({
        manualStackingEnabled: data.manualStackingEnabled ?? false,
        manualStackingLimit: data.manualStackingLimit ?? 5,
        bundleDiscountStackingEnabled: data.bundleDiscountStackingEnabled ?? false,
        specificStackingEnabled: data.specificStackingEnabled ?? false,
        specificStackingMatchType: data.specificStackingMatchType ?? 'exact',
        specificStackingCodes: data.specificStackingCodes ?? [],
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load settings (using defaults)');
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (!user?.shopUrl) return;
    if (activeTab === 'settings') {
      fetchSettings();
    } else {
      fetchDiscounts();
    }
  }, [user?.shopUrl,activeTab]);

  // ── Save Settings ───────────────────────────────────────────────────────────────
  const saveSettings = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        manualStackingEnabled: settings.manualStackingEnabled,
        manualStackingLimit: settings.manualStackingEnabled ? settings.manualStackingLimit : null,
        bundleDiscountStackingEnabled: settings.bundleDiscountStackingEnabled,
        specificStackingEnabled: settings.specificStackingEnabled,
        specificStackingMatchType: settings.specificStackingEnabled ? settings.specificStackingMatchType : null,
        specificStackingCodes: settings.specificStackingEnabled ? settings.specificStackingCodes : [],
      };

      const response = await fetch(`${API_BASE}/discount/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Save failed: ${response.status} ${text}`);
      }

      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addSpecificCode = () => {
    const code = newCodeInput.trim().toUpperCase();
    if (code && !settings.specificStackingCodes.includes(code)) {
      setSettings(prev => ({
        ...prev,
        specificStackingCodes: [...prev.specificStackingCodes, code]
      }));
      setNewCodeInput('');
    }
  };

  const removeSpecificCode = (codeToRemove) => {
    setSettings(prev => ({
      ...prev,
      specificStackingCodes: prev.specificStackingCodes.filter(c => c !== codeToRemove)
    }));
  };

  const openEditModal = (discount) => {
    setEditingDiscount(discount);
    setEditForm({
      code: discount.code || discount.name || '',
      type: discount.tags?.includes('Automatic') ? 'automatic' : 'manual',
      combinesWith: discount.combinesWith || discount.tags?.includes('Combine') || false,
      status: discount.status === 'Active' || discount.status === 'active' ? 'active' : 'inactive',
      visibility: discount.visibility !== false && discount.visibility !== 'Inactive',
      metadata: {
        value: discount.metadata?.value ?? 0,
        valueType: discount.metadata?.valueType ?? 'percentage',
        minimumPurchase: discount.metadata?.minimumPurchase ?? 0,
        appliesTo: discount.metadata?.appliesTo ?? '',
      },
    });
    setEditModalOpen(true);
  };

  const saveEditedDiscount = async () => {
    if (!editingDiscount?.id) return;

    setSaving(true);
    try {
      const payload = {
        code: editForm.code?.trim(),
        type: editForm.type,
        combinesWith: editForm.combinesWith,
        status: editForm.status,
        visibility: editForm.visibility,
        metadata: {
          value: Number(editForm.metadata.value) || 0,
          valueType: editForm.metadata.valueType || 'percentage',
          minimumPurchase: Number(editForm.metadata.minimumPurchase) || 0,
          appliesTo: editForm.metadata.appliesTo?.trim() || '',
        },
      };

      const response = await fetch(`${API_BASE}/discount/code/${editingDiscount.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Update failed: ${response.status} ${text}`);
      }

      alert('Discount updated successfully!');
      setEditModalOpen(false);
      fetchDiscounts(); // Refresh both tabs
    } catch (err) {
      console.error(err);
      alert('Failed to update discount: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleMenuClick = (path) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  // Reusable SVG Icons
const EditIcon = () => (
  <svg
    className="w-5 h-5 text-blue-600 hover:text-blue-800 transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5 text-red-600 hover:text-red-800 transition-colors"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// Ye function ADD KARO – component ke top pe, states ke neeche
const setCurrentDiscounts = (updater) => {
  if (activeTab === 'codes') {
    setCodesDiscounts((prev) => {
      const newList = updater(prev);
      return newList;
    });
  } else if (activeTab === 'sets') {
    setSetsDiscounts((prev) => {
      const newList = updater(prev);
      return newList;
    });
  }
};

// Toggle Status (Active ↔ Inactive)
const handleToggleStatus = async (discountId, currentIsActive) => {
  console.log("=== TOGGLE STATUS DEBUG ===");
  console.log("Discount ID:", discountId);
  console.log("Current STORE_ID (header):", STORE_ID);
  console.log("New status:", currentIsActive ? 'inactive' : 'active');

  const newStatus = currentIsActive ? 'inactive' : 'active';

  setCurrentDiscounts(prev =>
    prev.map(d =>
      d.id === discountId ? { ...d, status: newStatus === 'active' ? 'Active' : 'Inactive' } : d
    )
  );

  try {
    const response = await fetch(`${API_BASE}/discount/code/${discountId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-store-id': STORE_ID,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    console.log("Response status:", response.status);
    const responseData = await response.json();
    console.log("Full server response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to update status');
    }
  } catch (err) {
    console.error('Toggle failed:', err);
    alert('Failed to update status: ' + (err.message || 'Unknown error'));

    // Rollback
    setCurrentDiscounts(prev =>
      prev.map(d =>
        d.id === discountId ? { ...d, status: currentIsActive ? 'Active' : 'Inactive' } : d
      )
    );
  }
};

// Toggle Visibility (only for codes)
const handleToggleVisibility = async (discountId, currentIsVisible) => {
  const newVisibility = currentIsVisible ? 'Inactive' : 'Active';

  // Optimistic update
  setCurrentDiscounts(prev =>
    prev.map(d =>
      d.id === discountId ? { ...d, visibility: newVisibility } : d
    )
  );

  try {
    const response = await fetch(`${API_BASE}/discount/code/${discountId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-store-id': STORE_ID,
      },
      body: JSON.stringify({ visibility: newVisibility === 'Active' }), // true/false for backend
    });

    if (!response.ok) throw new Error('Failed to update visibility');
  } catch (err) {
    console.error(err);
    alert('Failed to update visibility');

    // Rollback
    setCurrentDiscounts(prev =>
      prev.map(d =>
        d.id === discountId ? { ...d, visibility: currentIsVisible ? 'Active' : 'Inactive' } : d
      )
    );
  }
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">All Discounts</h1>
            {/* <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center cursor-pointer">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Open Guide
            </button> */}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium flex items-center transition cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Discount
              <svg className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <ul className="py-2">
                  <li>
                    <button onClick={() => handleMenuClick('/checkout/Discount/Create/Manual')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Create Manual Discount
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleMenuClick('/checkout/Discount/Create/Automatic')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Configure Automatic Discount
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleMenuClick('/checkout/Discount/Create/Bulkdiscount')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer">
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-6 0h6" />
                      </svg>
                      Create Bulk Discount Set
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          This section allows you to create a new manual discount code or configure a pre-created automatic/script based discount on Shopify and apply custom use cases and control levers powered by GoKwik.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-300 px-6">
        <div className="flex space-x-8 py-4">
          <button
            onClick={() => setActiveTab('codes')}
            className={`font-medium pb-4 cursor-pointer flex items-center ${activeTab === 'codes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Codes
          </button>
          <button
            onClick={() => setActiveTab('sets')}
            className={`font-medium pb-4 cursor-pointer flex items-center ${activeTab === 'sets' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-6 0h6" />
            </svg>
            Sets
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`font-medium pb-4 cursor-pointer ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Other Discounts Setting
          </button>
        </div>
      </div>

      {/* Content area */}
      {activeTab === 'settings' ? (
        <div className="px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Other Settings</h2>
              <button
                onClick={saveSettings}
                disabled={saving || loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-600">Loading settings...</div>
            ) : (
              <>
                {/* Manual Stacking */}
                <div className="mb-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Stacking Settings</h3>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Limit Number of Discounts to be clubbed in case of Manual Stacking</p>
                      <p className="text-sm text-gray-500">Maximum of 5 discounts can be clubbed.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.manualStackingEnabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, manualStackingEnabled: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  {settings.manualStackingEnabled && (
                    <div>
                      <p className="text-sm text-gray-700 mb-2">Enter the number of discounts to be clubbed (1-5)</p>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={settings.manualStackingLimit}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setSettings(prev => ({ ...prev, manualStackingLimit: Math.max(1, Math.min(5, val)) }));
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm w-32"
                      />
                    </div>
                  )}
                </div>

                {/* Bundle Discount */}
                <div className="mb-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Bundle Discount Settings</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">Allows discounts to be applied on top of bundle discounts from 3rd party apps.</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.bundleDiscountStackingEnabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, bundleDiscountStackingEnabled: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>

                {/* Specific Stacking */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Specific Stacking</h3>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-700">Enable rules for which discount codes can be clubbed together</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.specificStackingEnabled}
                        onChange={(e) => setSettings(prev => ({ ...prev, specificStackingEnabled: e.target.checked }))}
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>

                  {settings.specificStackingEnabled && (
                    <>
                      <div className="flex items-center space-x-8 mb-6">
                        {['exact', 'starts_with', 'ends_with', 'contains'].map((type) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="radio"
                              name="matchType"
                              value={type}
                              checked={settings.specificStackingMatchType === type}
                              onChange={(e) => setSettings(prev => ({ ...prev, specificStackingMatchType: e.target.value }))}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 capitalize">{type.replace('_', ' ')}</span>
                          </label>
                        ))}
                      </div>

                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected Discount Codes</p>
                        <div className="flex flex-wrap gap-2">
                          {settings.specificStackingCodes.length === 0 ? (
                            <span className="text-sm text-gray-500">No codes added yet</span>
                          ) : (
                            settings.specificStackingCodes.map((code) => (
                              <span key={code} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {code}
                                <button onClick={() => removeSpecificCode(code)} className="ml-2 hover:text-blue-900 cursor-pointer">
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={newCodeInput}
                          onChange={(e) => setNewCodeInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && addSpecificCode()}
                          placeholder="e.g. VIP, INFLUENCER"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm flex-1"
                        />
                        <button onClick={addSpecificCode} className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 cursor-pointer">
                          Add
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="bg-white px-6 py-4 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
  {/* Tags */}
  <div className="relative">
    <select
      className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm bg-white"
    >
      <option>Tags</option>
    </select>

    {/* SVG Icon */}
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  {/* Status */}
  <div className="relative">
    <select
      className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm bg-white"
    >
      <option>Status</option>
    </select>

    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  {/* Visibility */}
  <div className="relative">
    <select
      className="appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm bg-white"
    >
      <option>Visibility</option>
    </select>

    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  {/* Discount Code Input */}
  <input
    type="text"
    placeholder="Discount Code"
    className="px-4 py-2 border border-gray-300 rounded-md text-sm w-64"
  />
</div>

              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center cursor-pointer">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
                <button className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 cursor-pointer">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Table area */}
          <div className="px-6 py-4">
            {loadingData ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center text-gray-600">
                Loading discounts...
              </div>
            ) : dataError ? (
              <div className="bg-white rounded-lg shadow-sm border border-red-300 p-12 text-center text-red-600">
                {dataError}
              </div>
            ) : currentDiscounts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center text-gray-600">
                No discounts found
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-between">
                  <span>Showing 1-{totalRecords} of {totalRecords} Records</span>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600 cursor-pointer">&lt;</button>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded">1</span>
                    <button className="text-gray-400 hover:text-gray-600 cursor-pointer">&gt;</button>
                  </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      {activeTab === 'codes' && (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
      )}
      {activeTab === 'sets' && (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Codes</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
        </>
      )}
      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200">
  {currentDiscounts.map((discount) => (
    <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{discount.code}</td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          {(discount.tags || []).map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs ${
                tag?.includes('Manual') ? 'bg-blue-100 text-blue-700' :
                tag?.includes('Automatic') ? 'bg-purple-100 text-purple-700' :
                'bg-green-100 text-green-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* Status Toggle - Always clickable */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={discount.status === 'Active'}
              onChange={() => handleToggleStatus(discount.id, discount.status === 'Active')}
            />
            <div
              className={`
                w-11 h-6 rounded-full transition-all duration-300 ease-in-out
                ${discount.status === 'Active' 
                  ? 'bg-blue-600 shadow-md shadow-blue-300/50' 
                  : 'bg-gray-300'}
                peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                group-hover:scale-105 group-hover:shadow-lg
              `}
            >
              <div
                className={`
                  absolute top-[2px] left-[2px] bg-white border border-gray-300
                  rounded-full h-5 w-5 transition-all duration-300 ease-in-out
                  ${discount.status === 'Active' ? 'translate-x-5' : 'translate-x-0'}
                  shadow-sm
                `}
              />
            </div>
          </label>

          <span 
            className={`
              text-sm font-medium transition-colors
              ${discount.status === 'Active' ? 'text-blue-700' : 'text-gray-600'}
            `}
          >
            {discount.status}
          </span>
        </div>
      </td>

      {/* Visibility Toggle - Only for codes tab */}
      {activeTab === 'codes' && (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={discount.visibility === 'Active'}
                onChange={() => handleToggleVisibility(discount.id, discount.visibility === 'Active')}
              />
              <div
                className={`
                  w-11 h-6 rounded-full transition-all duration-300 ease-in-out
                  ${discount.visibility === 'Active' 
                    ? 'bg-green-600 shadow-md shadow-green-300/50' 
                    : 'bg-gray-300'}
                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300
                  group-hover:scale-105 group-hover:shadow-lg
                `}
              >
                <div
                  className={`
                    absolute top-[2px] left-[2px] bg-white border border-gray-300
                    rounded-full h-5 w-5 transition-all duration-300 ease-in-out
                    ${discount.visibility === 'Active' ? 'translate-x-5' : 'translate-x-0'}
                    shadow-sm
                  `}
                />
              </div>
            </label>

            <span 
              className={`
                text-sm font-medium transition-colors
                ${discount.visibility === 'Active' ? 'text-green-700' : 'text-gray-600'}
              `}
            >
              {discount.visibility}
            </span>
          </div>
        </td>
      )}

      {/* Sets columns */}
      {activeTab === 'sets' && (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{discount.numberOfCodes || '-'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{discount.createdAt || '-'}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{discount.endDate || '-'}</td>
        </>
      )}

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end items-center gap-5">
          <button
            onClick={() => openEditModal(discount)}
            title="Edit Discount"
            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <EditIcon />
          </button>

          <button
            onClick={() => handleDeleteDiscount(discount.id)}
            title="Delete Discount"
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <DeleteIcon />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
</table>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-between">
                  <span>Showing 1-{totalRecords} of {totalRecords} Records</span>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600 cursor-pointer">&lt;</button>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded">1</span>
                    <button className="text-gray-400 hover:text-gray-600 cursor-pointer">&gt;</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Discount</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                <input
                  type="text"
                  value={editForm.code}
                  onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatic">Automatic</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.combinesWith}
                    onChange={(e) => setEditForm(prev => ({ ...prev, combinesWith: e.target.checked }))}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Combines With Other Discounts</label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.visibility}
                    onChange={(e) => setEditForm(prev => ({ ...prev, visibility: e.target.checked }))}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <label className="ml-3 text-sm font-medium text-gray-700">Visible to Customers</label>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                    <input
                      type="number"
                      value={editForm.metadata.value}
                      onChange={(e) => setEditForm(prev => ({ ...prev, metadata: { ...prev.metadata, value: Number(e.target.value) || 0 } }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value Type</label>
                    <select
                      value={editForm.metadata.valueType}
                      onChange={(e) => setEditForm(prev => ({ ...prev, metadata: { ...prev.metadata, valueType: e.target.value } }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed_amount">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase</label>
                    <input
                      type="number"
                      value={editForm.metadata.minimumPurchase}
                      onChange={(e) => setEditForm(prev => ({ ...prev, metadata: { ...prev.metadata, minimumPurchase: Number(e.target.value) || 0 } }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Applies To</label>
                    <input
                      type="text"
                      value={editForm.metadata.appliesTo}
                      onChange={(e) => setEditForm(prev => ({ ...prev, metadata: { ...prev.metadata, appliesTo: e.target.value } }))}
                      placeholder="e.g. electronics"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button onClick={() => setEditModalOpen(false)} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={saveEditedDiscount}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Learn Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-white border border-gray-300 text-blue-600 px-4 py-3 rounded-full shadow-lg flex items-center text-sm font-medium hover:bg-gray-50 cursor-pointer">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Learn how to setup discounts
        </button>
      </div>
    </div>
  );
};

export default AllDiscounts;