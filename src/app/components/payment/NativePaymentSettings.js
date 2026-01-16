'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

// const STORE_ID = 'swing-9926.myshopify.com';
const API_URL = '/api/native-payment-settings';

export default function NativePaymentSettings() {
  // Current editable state
  const [buttonTitle, setButtonTitle] = useState('');
  const [buttonSubtext, setButtonSubtext] = useState('');
  const [buttonColor, setButtonColor] = useState('#F74435');
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');
  const [buttonBadgeText, setButtonBadgeText] = useState('');
  const [buttonBadgeColor, setButtonBadgeColor] = useState('#03B696');
  const [buttonBadgeTextColor, setButtonBadgeTextColor] = useState('#FFFFFF');

  // Backup state (for revert)
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
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

  /* -------------------- GET SETTINGS -------------------- */
  useEffect(() => {

    if (!STORE_ID) return;

    async function fetchSettings() {
      try {
        setLoading(true);

        const res = await fetch(API_URL, {
          headers: {
            'x-store-id': STORE_ID,
          },
        });

        const json = await res.json();
        const data = json?.data || {};

        setButtonTitle(data.buttonTitle || 'Other Payment Methods');
        setButtonSubtext(data.buttonSubtext || '');
        setButtonColor(data.buttonColor || '#F74435');
        setButtonTextColor(data.buttonTextColor || '#FFFFFF');
        setButtonBadgeText(data.buttonBadgeText || '');
        setButtonBadgeColor(data.buttonBadgeColor || '#03B696');
        setButtonBadgeTextColor(data.buttonBadgeTextColor || '#FFFFFF');

        setInitialData(data);
      } catch (err) {
        console.error('Failed to fetch native payment settings', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [STORE_ID]);

  /* -------------------- PUT SETTINGS -------------------- */
  async function saveSettings() {
    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': STORE_ID,
        },
        body: JSON.stringify({
          data: {
            buttonTitle,
            buttonSubtext,
            buttonColor,
            buttonTextColor,
            buttonBadgeText,
            buttonBadgeColor,
            buttonBadgeTextColor,
          },
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || 'Failed to save settings');
      }

      setInitialData(json.data);
      alert('Settings saved successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  /* -------------------- REVERT -------------------- */
  function revertChanges() {
    if (!initialData) return;

    setButtonTitle(initialData.buttonTitle || '');
    setButtonSubtext(initialData.buttonSubtext || '');
    setButtonColor(initialData.buttonColor || '#F74435');
    setButtonTextColor(initialData.buttonTextColor || '#FFFFFF');
    setButtonBadgeText(initialData.buttonBadgeText || '');
    setButtonBadgeColor(initialData.buttonBadgeColor || '#03B696');
    setButtonBadgeTextColor(initialData.buttonBadgeTextColor || '#FFFFFF');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <ArrowLeft
            className="h-5 w-5 cursor-pointer text-gray-600"
            onClick={() => window.history.back()}
          />
          <h1 className="text-2xl font-bold">Native Payment Method</h1>
        </div>

        {/* Main Card */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-6 space-y-5 max-w-3xl mx-auto">
            <Input label="Button Title" value={buttonTitle} setValue={setButtonTitle} />
            <Input label="Button Subtext" value={buttonSubtext} setValue={setButtonSubtext} />
            <ColorInput label="Button Color" value={buttonColor} setValue={setButtonColor} />
            <ColorInput label="Button Text Color" value={buttonTextColor} setValue={setButtonTextColor} />
            <Input label="Button Badge Text" value={buttonBadgeText} setValue={setButtonBadgeText} />
            <ColorInput label="Button Badge Color" value={buttonBadgeColor} setValue={setButtonBadgeColor} />
            <ColorInput label="Button Badge Text Color" value={buttonBadgeTextColor} setValue={setButtonBadgeTextColor} />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 border-t px-6 py-4">
            <button
              onClick={revertChanges}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 cursor-pointer"
            >
              <RotateCcw size={16} />
              Revert Changes
            </button>

            <button
              onClick={saveSettings}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Confirm Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */
function Input({ label, value, setValue }) {
  return (
    <div className="flex justify-between items-center">
      <div className="font-medium">{label}</div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-72 rounded border px-3 py-2"
      />
    </div>
  );
}

function ColorInput({ label, value, setValue }) {
  return (
    <div className="flex justify-between items-center">
      <div className="font-medium">{label}</div>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full border" style={{ backgroundColor: value }} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-28 rounded border px-2 py-1"
        />
      </div>
    </div>
  );
}
