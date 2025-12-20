"use client";
import { useState } from "react";

export default function ShopTokenPage() {
  const [shopDomain, setShopDomain] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    // Client-side validation
    if (!shopDomain || !accessToken || !shopName) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (!shopDomain.includes(".myshopify.com")) {
      setMessage("Shop domain must end with .myshopify.com");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopDomain, accessToken, shopName, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Token saved successfully!");
        // Reset form
        setShopDomain("");
        setAccessToken("");
        setShopName("");
        setEmail("");
      } else {
        setMessage(`❌ ${data.error || "Failed to save token."}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2 text-gray-800">
          🔑 Save Shop Token
        </h1>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Domain <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., example.myshopify.com"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={shopDomain}
            onChange={(e) => setShopDomain(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Access Token <span className="text-red-500">*</span>
          </label>
          <input
            type="password" // Hide token for security
            placeholder="shpat_..."
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shop Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-md hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? "⏳ Saving..." : "🔑 Save Token"}
        </button>

        {message && (
          <p className="mt-4 text-center p-3 rounded-md bg-blue-50 border border-blue-200 text-sm">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}