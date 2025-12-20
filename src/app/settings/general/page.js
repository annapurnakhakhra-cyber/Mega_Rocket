'use client'; // Mark as client component for Next.js App Router
import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  Save,
  Settings as SettingsIcon,
  Palette,
  Type,
  Globe,
  Shield,
  FileText,
  CreditCard,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

function Settings() {
  const [activeSection, setActiveSection] = useState("general");
  const [formData, setFormData] = useState({
    // COD Button
    codButtonText: "",
    codButtonTextColor: "#000000",
    codButtonColor: "#ffffff",
    codButtonAnimate: false,
    // Prepaid Button
    prepaidButtonText: "",
    prepaidButtonTextColor: "#000000",
    prepaidButtonColor: "#ffffff",
    prepaidButtonAnimate: false,
    // Form Settings
    enableExitForm: false,
    enableSingleExitReasons: false,
    // General Settings
    sendOrderConfirmation: false,
    enableHeadless: false,
    companyId: "885360",
    onboardVersion: "Version 3",
    // Pre Login Banner
    preLoginText: "",
    preLoginTextColor: "#000000",
    preLoginBgColor: "#ffffff",
    // Post Login Banner
    postLoginText: "",
    postLoginTextColor: "#000000",
    postLoginBgColor: "#ffffff",
    // Additional Settings
    gstNumber: false,
    billingAddress: false,
    // Store Settings
    storeName: "",
    logo: null,
    // Links
    shippingPolicy: "",
    refundPolicy: "",
    privacyPolicy: "",
    termsOfService: "",
  });
  // const shop = 'divyeshab.myshopify.com';
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [isVisible, setIsVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [settings, setsettings] = useState([]);
  const [shop, setShopName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded.data);
        setShopName(decoded.data.shop);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found in sessionStorage");
    }
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // fetchSettings();
    if (shop) {
      fetchSettings();
    }
  }, [shop]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${api}/settings.php?shop=${shop}`);
      console.log(response);
      const result = await response.json();
      console.log(result);
      setsettings(result);
    } catch (error) {
      console.error("API Error", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = () => {
    setSavedMessage("Settings saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const sections = [
    { id: "general", label: "General Settings", icon: SettingsIcon },
    // { id: 'buttons', label: 'Button Configuration', icon: Palette },
    // { id: 'banners', label: 'Banner Settings', icon: Type },
    { id: "policies", label: "Policies & Links", icon: FileText },
    { id: "checkout", label: "Checkout Options", icon: CreditCard },
  ];

  const renderToggle = (field, label) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        onClick={() => handleToggle(field)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          formData[field] ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            formData[field] ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const renderColorInput = (field, label) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="h-10 w-16 rounded border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
        />
        <input
          type="text"
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Hex code"
        />
      </div>
    </div>
  );

  const renderTextInput = (field, label, placeholder = "") => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
        placeholder={placeholder}
      />
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Your fastly checkout is inactive, please complete the form to activate fasstr-checkout.
              </p>
            </div> */}
            {settings?.store_data && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={settings.store_data.shop_name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                   bg-gray-100 text-gray-700
                   cursor-default select-none pointer-events-none"
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Access Token
                  </label>
                  <input
                    type="text"
                    value={
                      settings.store_data.access_token.slice(0, 5) +
                      "_••••••••••••••••••••"
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
             bg-gray-100 text-gray-700
             cursor-default select-none pointer-events-none"
                  />
                </div>
              </div>
            )}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
             
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload</p>
                </div>
              </div>
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {renderTextInput('companyId', 'Company ID')}
              </div>
             
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Onboard Version <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.onboardVersion}
                  onChange={(e) => handleInputChange('onboardVersion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Version 3">Version 3</option>
                  <option value="Version 2">Version 2</option>
                  <option value="Version 1">Version 1</option>
                </select>
              </div>
            </div> */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderToggle('sendOrderConfirmation', 'Send Order Confirmation')}
              {renderToggle('enableHeadless', 'Enable Headless')}
            </div> */}
          </div>
        );
      case "buttons":
        return (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                Otp-less COD Button
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {renderTextInput(
                    "codButtonText",
                    "Button Text",
                    "Enter button text"
                  )}
                  {renderColorInput("codButtonColor", "Button Color")}
                </div>
                <div className="space-y-4">
                  {renderColorInput("codButtonTextColor", "Button Text Color")}
                  {renderToggle("codButtonAnimate", "Button Animate")}
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                Otp-less Prepaid Button
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {renderTextInput(
                    "prepaidButtonText",
                    "Button Text",
                    "Enter button text"
                  )}
                  {renderColorInput("prepaidButtonColor", "Button Color")}
                </div>
                <div className="space-y-4">
                  {renderColorInput(
                    "prepaidButtonTextColor",
                    "Button Text Color"
                  )}
                  {renderToggle("prepaidButtonAnimate", "Button Animate")}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderToggle("enableExitForm", "Enable Exit Form")}
              {renderToggle(
                "enableSingleExitReasons",
                "Enable Single Exit Reasons"
              )}
            </div>
          </div>
        );
      case "banners":
        return (
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="mr-2 h-5 w-5 text-purple-600" />
                Pre Login Banner
              </h3>
              <div className="space-y-4">
                <div>
                  {renderTextInput(
                    "preLoginText",
                    "Text",
                    "Maximum 80 characters"
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderColorInput("preLoginTextColor", "Text Color")}
                  {renderColorInput("preLoginBgColor", "Background Color")}
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Type className="mr-2 h-5 w-5 text-indigo-600" />
                Post Login Banner
              </h3>
              <div className="space-y-4">
                <div>
                  {renderTextInput(
                    "postLoginText",
                    "Text",
                    "Maximum 80 characters"
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderColorInput("postLoginTextColor", "Text Color")}
                  {renderColorInput("postLoginBgColor", "Background Color")}
                </div>
              </div>
            </div>
          </div>
        );
      case "policies":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderTextInput(
                "shippingPolicy",
                "Shipping Policy",
                "Enter shipping policy URL"
              )}
              {renderTextInput(
                "refundPolicy",
                "Refund Policy",
                "Enter refund policy URL"
              )}
              {renderTextInput(
                "privacyPolicy",
                "Privacy Policy",
                "Enter privacy policy URL"
              )}
              {renderTextInput(
                "termsOfService",
                "Terms of Service",
                "Enter terms of service URL"
              )}
            </div>
          </div>
        );
      case "checkout":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderToggle("gstNumber", "GST Number")}
              {renderToggle("billingAddress", "Billing Address")}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            General Settings
          </h1>
          <p className="text-gray-600">
            Configure your application settings and preferences
          </p>
        </div>
        {/* Success Message */}
        {savedMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
            <p className="text-green-800 font-medium">{savedMessage}</p>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-6 min-h-[600px] transform transition-all duration-300 hover:shadow-xl">
              <div className="animate-fadeIn">{renderSection()}</div>
            </div>
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Save className="mr-2 h-5 w-5" />
                Save & Proceed
              </button>
              {/* <button className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Plus className="mr-2 h-5 w-5" />
                Add Another Option
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Settings;  
