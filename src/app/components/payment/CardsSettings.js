'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react';

export default function CardsSettings() {
  // ── States ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [user, setUser] = useState(null);

  // Form fields
  const [buttonTitle, setButtonTitle] = useState('Debit/Credit Cards');
  const [buttonSubtext, setButtonSubtext] = useState('');
  const [buttonColor, setButtonColor] = useState('#F74435');
  const [buttonTextColor, setButtonTextColor] = useState('#FFFFFF');
  const [buttonBadgeText, setButtonBadgeText] = useState('');
  const [buttonBadgeColor, setButtonBadgeColor] = useState('#03B696');
  const [buttonBadgeTextColor, setButtonBadgeTextColor] = useState('#FFFFFF');
  const [enableSavedCards, setEnableSavedCards] = useState(false);

  // Original values (for revert)
  const [original, setOriginal] = useState(null);

  const API_URL = 'https://adminrocket.megascale.co.in/api/cards-settings';

  // ── Color input helper ────────────────────────────────────────────────────
  const handleColorChange = (setter) => (e) => {
    let value = e.target.value.toUpperCase();
    if (value === '' || value === '#') {
      setter(value);
      return;
    }
    if (/^#[0-9A-F]{0,6}$/.test(value)) {
      setter(value);
    }
  };

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
    if (!STORE_ID) return;
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL, {
          headers: {
            'x-store-id': STORE_ID,
          },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to load settings');

        const data = await res.json();

 
        setButtonTitle(data.buttonTitle ?? 'Debit/Credit Cards');
        setButtonSubtext(data.buttonSubtext ?? '');
        setButtonColor(data.buttonColor ?? '#F74435');
        setButtonTextColor(data.buttonTextColor ?? '#FFFFFF');
        setButtonBadgeText(data.buttonBadgeText ?? '');
        setButtonBadgeColor(data.buttonBadgeColor ?? '#03B696');
        setButtonBadgeTextColor(data.buttonBadgeTextColor ?? '#FFFFFF');
        setEnableSavedCards(!!data.enableSavedCards);

        setOriginal({
          buttonTitle: data.buttonTitle ?? 'Debit/Credit Cards',
          buttonSubtext: data.buttonSubtext ?? '',
          buttonColor: data.buttonColor ?? '#F74435',
          buttonTextColor: data.buttonTextColor ?? '#FFFFFF',
          buttonBadgeText: data.buttonBadgeText ?? '',
          buttonBadgeColor: data.buttonBadgeColor ?? '#03B696',
          buttonBadgeTextColor: data.buttonBadgeTextColor ?? '#FFFFFF',
          enableSavedCards: !!data.enableSavedCards,
        });
      } catch (err) {
        console.error('Load error:', err);
        alert('Failed to load card settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [STORE_ID]);

  useEffect(() => {
    if (!original) return;

    const current = {
      buttonTitle,
      buttonSubtext,
      buttonColor,
      buttonTextColor,
      buttonBadgeText,
      buttonBadgeColor,
      buttonBadgeTextColor,
      enableSavedCards,
    };

    const changed = Object.keys(current).some(
      (key) => current[key] !== original[key]
    );

    setHasChanges(changed);
  }, [
    original,
    buttonTitle,
    buttonSubtext,
    buttonColor,
    buttonTextColor,
    buttonBadgeText,
    buttonBadgeColor,
    buttonBadgeTextColor,
    enableSavedCards,
  ]);

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      setSaving(true);

      const payload = {
        buttonTitle,
        buttonSubtext,
        buttonColor,
        buttonTextColor,
        buttonBadgeText,
        buttonBadgeColor,
        buttonBadgeTextColor,
        enableSavedCards,
      };

      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'x-store-id': STORE_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save settings');
      }

      alert('Settings saved successfully!');
      setOriginal({ ...payload }); 
      setHasChanges(false);
    } catch (err) {
      console.error('Save error:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleRevert = () => {
    if (!original || !hasChanges) return;

    setButtonTitle(original.buttonTitle);
    setButtonSubtext(original.buttonSubtext);
    setButtonColor(original.buttonColor);
    setButtonTextColor(original.buttonTextColor);
    setButtonBadgeText(original.buttonBadgeText);
    setButtonBadgeColor(original.buttonBadgeColor);
    setButtonBadgeTextColor(original.buttonBadgeTextColor);
    setEnableSavedCards(original.enableSavedCards);

    alert('Changes reverted');
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading card settings...</p>
        </div>
      </div>
    );
  }

  return (

    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <ArrowLeft
            className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
            onClick={() => window.history.back()}
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cards</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex overflow-x-auto gap-6 pb-2 scrollbar-hide">
          <button className="pb-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 whitespace-nowrap cursor-pointer">
            Cards
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            {/* Button Title */}
            <div className="py-5 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Label */}
                <div className="font-medium text-gray-900 min-w-[140px] sm:min-w-[160px]">
                  Button Title
                </div>

                {/* Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={buttonTitle}
                    onChange={(e) => setButtonTitle(e.target.value)}
                    placeholder="Enter button text..."
                    className={`block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 sm:text-sm transition-all duration-200`}
                  />
                </div>
              </div>
            </div>

            {/* Button Subtext */}
            <div className="py-5 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                {/* Label */}
                <div className="font-medium text-gray-900 min-w-[140px] sm:min-w-[160px]">
                  Button Subtext
                </div>

                {/* Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={buttonSubtext}
                    onChange={(e) => setButtonSubtext(e.target.value)}
                    placeholder="Optional subtext / description"
                    className={`block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 sm:text-sm transition-all duration-200`}
                  />
                </div>
              </div>
            </div>

            {/* Button Color */}
            <div className="py-4 border-b border-gray-200 flex justify-between">
              <div className="font-medium text-gray-900 mb-2">Button Color</div>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="color"
                  value={buttonColor || '#000000'}
                  onChange={(e) => setButtonColor(e.target.value.toUpperCase())}
                  className="h-10 w-10 rounded-md cursor-pointer border border-gray-300 p-1 shadow-sm"
                />
                <input
                  type="text"
                  value={buttonColor}
                  onChange={handleColorChange(setButtonColor)}
                  className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono uppercase"
                />
                <div
                  className="w-10 h-10 rounded-full border border-gray-300 shadow-sm "
                  style={{ backgroundColor: buttonColor || '#000000' }}
                />
              </div>
            </div>

            {/* Button Text Color */}
            <div className="py-4 border-b border-gray-200 flex justify-between">
              <div className="font-medium text-gray-900 mb-2">Button Text Color</div>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="color"
                  value={buttonTextColor || '#000000'}
                  onChange={(e) => setButtonTextColor(e.target.value.toUpperCase())}
                  className="h-10 w-10 rounded-md cursor-pointer border border-gray-300 p-1 shadow-sm"
                />
                <input
                  type="text"
                  value={buttonTextColor}
                  onChange={handleColorChange(setButtonTextColor)}
                  className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono uppercase"
                />
                <div
                  className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: buttonTextColor || '#000000' }}
                />
              </div>
            </div>

            {/* Badge Text */}
            <div className="py-4 border-b border-gray-200 flex justify-between">
              <div className="font-medium text-gray-900 mb-2">Button Badge Text</div>
              <div>
                <input
                  type="text"
                  value={buttonBadgeText}
                  onChange={(e) => setButtonBadgeText(e.target.value)}
                  placeholder="e.g. New, Popular, Recommended"
                  className="block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Badge Color */}
            <div className="py-4 border-b border-gray-200 flex justify-between">
              <div className="font-medium text-gray-900 mb-2">Badge Color</div>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="color"
                  value={buttonBadgeColor || '#000000'}
                  onChange={(e) => setButtonBadgeColor(e.target.value.toUpperCase())}
                  className="h-10 w-10 rounded-md cursor-pointer border border-gray-300 p-1 shadow-sm"
                />
                <input
                  type="text"
                  value={buttonBadgeColor}
                  onChange={handleColorChange(setButtonBadgeColor)}
                  className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono uppercase"
                />
                <div
                  className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: buttonBadgeColor || '#000000' }}
                />
              </div>
            </div>

            {/* Badge Text Color */}
            <div className="py-4 border-b border-gray-200 flex justify-between">
              <div className="font-medium text-gray-900 mb-2">Badge Text Color</div>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  type="color"
                  value={buttonBadgeTextColor || '#000000'}
                  onChange={(e) => setButtonBadgeTextColor(e.target.value.toUpperCase())}
                  className="h-10 w-10 rounded-md cursor-pointer border border-gray-300 p-1 shadow-sm"
                />
                <input
                  type="text"
                  value={buttonBadgeTextColor}
                  onChange={handleColorChange(setButtonBadgeTextColor)}
                  className="block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono uppercase"
                />
                <div
                  className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: buttonBadgeTextColor || '#000000' }}
                />
              </div>
            </div>

            {/* Enable Saved Cards */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
              <div>
                <div className="font-medium text-gray-900">Enable Saved Cards</div>
                <div className="mt-1 text-sm text-gray-500">
                  Allow customers to securely save their cards for faster checkout
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={enableSavedCards}
                  onChange={() => setEnableSavedCards(!enableSavedCards)}
                  className="sr-only peer"
                />
                <div
                  className={`h-6 w-11 rounded-full transition-colors duration-200 ease-in-out ${enableSavedCards ? 'bg-blue-600' : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-5 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:duration-200`}
                />
              </label>
            </div>
          </div>
        </div>

       
      </div>
    </div>

  );
}