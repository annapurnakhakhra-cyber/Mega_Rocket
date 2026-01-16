// components/payment/C2PSettings.jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const API_BASE = '/api/c2p-settings';
// const STORE_ID = 'annapurnakhakhra'; // ← should come from auth/context in real app

export default function C2PSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState(null);
    const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    // General
    showQRUpiOnConfirmation: false,

    // Timers (minutes)
    confirmationExpirationTimer: '5',
    messageDelayTimer: '30',
    whatsappExpirationTimer: '1440', // 24 hours default
    totalConversionWindow: '2880',   // 48 hours default

    // Discount
    discountType: 'percentage',
    discountValue: '5',
    enableUpiExtraDiscount: false,
    enableDiscountCapping: true,
    discountCapAmount: '150',

    // WhatsApp
    sendWhatsappReminder: true,
    whatsappProvider: 'Gupshup',

    // Order constraints (from your curl example)
    c2pEnabled: true,
    minOrderValue: '399',
    maxOrderValue: '9999',
    convenienceFee: '0',
    convenienceFeeType: 'fixed',
  });

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

  useEffect(() => {
    if (!STORE_ID) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_BASE, {
          headers: { 'x-store-id': STORE_ID },
          cache: 'no-store',
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            toast.error('Session expired – please log in again');
            router.push('/login');
            return;
          }
          throw new Error('Cannot load settings');
        }

        const json = await res.json();
        const serverData = json.data || {};

        if (ignore) return;

        const merged = { ...form, ...serverData };
        setForm(merged);
        setInitialData(merged);
        toast.success('Settings loaded');
      } catch (err) {
        console.error(err);
        toast.error(err.message || 'Failed to load C2P settings');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => { ignore = true; };
  }, [STORE_ID, router]);

  // Load data once
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE, {
        headers: { 'x-store-id': STORE_ID },
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to load settings');

      const json = await res.json();
      const serverData = json.data || {};

      const merged = { ...form, ...serverData };

      setForm(merged);
      setInitialData(merged);
      toast.success('Settings loaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load C2P settings');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(form) !== JSON.stringify(initialData);
  }, [form, initialData]);

  const saveSettings = async () => {
    if (!hasChanges) return;

    try {
      setSaving(true);

      // Prepare payload - convert strings to numbers where appropriate
      const payload = {
        data: {
          showQRUpiOnConfirmation: form.showQRUpiOnConfirmation,

          confirmationExpirationTimer: Number(form.confirmationExpirationTimer),
          messageDelayTimer: Number(form.messageDelayTimer),
          whatsappExpirationTimer: Number(form.whatsappExpirationTimer),
          totalConversionWindow: Number(form.totalConversionWindow),

          discountType: form.discountType,
          discountValue: Number(form.discountValue) || 0,
          enableUpiExtraDiscount: form.enableUpiExtraDiscount,
          enableDiscountCapping: form.enableDiscountCapping,
          discountCapAmount: form.enableDiscountCapping ? Number(form.discountCapAmount) : null,

          sendWhatsappReminder: form.sendWhatsappReminder,
          whatsappProvider: form.whatsappProvider,

          c2pEnabled: form.c2pEnabled,
          minOrderValue: Number(form.minOrderValue),
          maxOrderValue: Number(form.maxOrderValue),
          convenienceFee: Number(form.convenienceFee),
          convenienceFeeType: form.convenienceFeeType,
        },
      };

      const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save settings');
      }

      const result = await res.json();
      const savedData = result.data || payload.data;

      setInitialData(savedData);
      toast.success('C2P settings saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const revertChanges = () => {
    if (!initialData || !hasChanges) return;
    setForm({ ...initialData });
    toast('Changes reverted', { icon: '↺' });
  };

  const updateField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading Cash to Prepaid settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Cash to Prepaid Settings
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto pb-2 scrollbar-hide">
            {['general', 'timers', 'discount', 'whatsapp', 'constraints'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer
                  ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                {tab === 'constraints' ? 'Order Rules' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-6 lg:p-8">
            <div className="max-w-4xl space-y-8">
              {/* GENERAL */}
              {activeTab === 'general' && (
                <>
                  <ToggleField
                    title="Show QR/UPI payment options on Order Confirmation"
                    description="Display UPI/QR code selection section after placing COD order"
                    checked={form.showQRUpiOnConfirmation}
                    onChange={updateField('showQRUpiOnConfirmation')}
                  />
                </>
              )}

              {/* TIMERS */}
              {activeTab === 'timers' && (
                <div className="grid gap-8 sm:grid-cols-2">
                  <NumberField
                    label="Confirmation Page Visibility"
                    helper="How long C2P option is shown on confirmation page (minutes)"
                    value={form.confirmationExpirationTimer}
                    onChange={updateField('confirmationExpirationTimer')}
                    min={1}
                    max={1440}
                  />

                  <NumberField
                    label="Message Delay"
                    helper="Delay before sending first WhatsApp reminder (minutes)"
                    value={form.messageDelayTimer}
                    onChange={updateField('messageDelayTimer')}
                    min={0}
                    max={1440}
                  />

                  <NumberField
                    label="WhatsApp Link Expiry"
                    helper="How long payment link remains valid (minutes)"
                    value={form.whatsappExpirationTimer}
                    onChange={updateField('whatsappExpirationTimer')}
                    min={60}
                    max={10080}
                  />

                  <NumberField
                    label="Total Conversion Window"
                    helper="Total time customer can convert COD → Prepaid (minutes)"
                    value={form.totalConversionWindow}
                    onChange={updateField('totalConversionWindow')}
                    min={1440}
                    max={10080}
                  />
                </div>
              )}

              {/* DISCOUNT */}
              {activeTab === 'discount' && (
                <div className="space-y-8">
                  <SelectField
                    label="Discount Type"
                    helper="Type of incentive for converting to prepaid"
                    value={form.discountType}
                    onChange={updateField('discountType')}
                    options={[
                      { value: 'percentage', label: 'Percentage (%)' },
                      { value: 'fixed', label: 'Fixed Amount (₹)' },
                    ]}
                  />

                  <NumberField
                    label={`Discount Value (${form.discountType === 'percentage' ? '%' : '₹'})`}
                    value={form.discountValue}
                    onChange={updateField('discountValue')}
                    min={0}
                    max={form.discountType === 'percentage' ? 50 : 1000}
                    step={form.discountType === 'percentage' ? 0.5 : 1}
                  />

                  <ToggleField
                    title="Allow stacking with UPI discount"
                    description="Customer gets both C2P discount + active UPI checkout discount"
                    checked={form.enableUpiExtraDiscount}
                    onChange={updateField('enableUpiExtraDiscount')}
                  />

                  <ToggleField
                    title="Enable discount capping"
                    description="Limit maximum discount amount for percentage-based discounts"
                    checked={form.enableDiscountCapping}
                    onChange={updateField('enableDiscountCapping')}
                  />

                  {form.enableDiscountCapping && (
                    <NumberField
                      label="Maximum Discount Cap (₹)"
                      value={form.discountCapAmount}
                      onChange={updateField('discountCapAmount')}
                      min={10}
                      max={1000}
                    />
                  )}
                </div>
              )}

              {/* WHATSAPP */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-8">
                  <div className="rounded-lg bg-blue-50 p-5 text-sm text-blue-800">
                    For advanced message templates, branding and multi-nudge sequences
                    consider integrating <strong>Kwikchat</strong> or <strong>Limechat</strong>.
                  </div>

                  <ToggleField
                    title="Send WhatsApp reminders"
                    description="Notify customers about C2P option via WhatsApp"
                    checked={form.sendWhatsappReminder}
                    onChange={updateField('sendWhatsappReminder')}
                  />

                  <SelectField
                    label="WhatsApp Service Provider"
                    helper="Platform used for sending transactional & reminder messages"
                    value={form.whatsappProvider}
                    onChange={updateField('whatsappProvider')}
                    options={[
                      { value: 'Gupshup', label: 'Gupshup' },
                      { value: 'Limechat', label: 'Limechat' },
                      { value: 'Zoko', label: 'Zoko' },
                      { value: 'Interakt', label: 'Interakt' },
                    ]}
                  />
                </div>
              )}

              {/* ORDER CONSTRAINTS */}
              {activeTab === 'constraints' && (
                <div className="grid gap-8 sm:grid-cols-2">
                  <ToggleField
                    title="Cash to Prepaid Feature Enabled"
                    description="Turn on/off entire C2P flow for this store"
                    checked={form.c2pEnabled}
                    onChange={updateField('c2pEnabled')}
                  />

                  <NumberField
                    label="Minimum Order Value (₹)"
                    value={form.minOrderValue}
                    onChange={updateField('minOrderValue')}
                    min={99}
                    max={5000}
                  />

                  <NumberField
                    label="Maximum Order Value (₹)"
                    value={form.maxOrderValue}
                    onChange={updateField('maxOrderValue')}
                    min={500}
                    max={50000}
                  />

                  <div className="space-y-6">
                    <NumberField
                      label="Convenience Fee"
                      value={form.convenienceFee}
                      onChange={updateField('convenienceFee')}
                      min={0}
                      max={99}
                    />

                    <SelectField
                      label="Fee Type"
                      value={form.convenienceFeeType}
                      onChange={updateField('convenienceFeeType')}
                      options={[
                        { value: 'fixed', label: 'Fixed (₹)' },
                        { value: 'percentage', label: 'Percentage (%)' },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 border-t bg-gray-50/70 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={revertChanges}
              disabled={saving || !hasChanges}
              className={`
                inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
            >
              <RotateCcw size={16} />
              Revert Changes
            </button>

            <button
              onClick={saveSettings}
              disabled={saving || !hasChanges}
              className={`
                inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px] cursor-pointer`}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Reusable Form Components
───────────────────────────────────────────────── */

function ToggleField({ title, description, checked, onChange }) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        {description && <div className="mt-1 text-sm text-gray-600">{description}</div>}
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300" />
      </label>
    </div>
  );
}

function NumberField({ label, helper, value, onChange, min, max, step = 1 }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`
          block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 
          placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed sm:text-sm
        `}
      />
    </div>
  );
}

function SelectField({ label, helper, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
      <select
        value={value}
        onChange={onChange}
        className={`
          block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900
          focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}