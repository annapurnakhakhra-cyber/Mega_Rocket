"use client";

import { useEffect, useState } from "react";
import { Mail, RefreshCw, Download, Search, HelpCircle } from "lucide-react";

export default function BrochureAdminPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/brochure-download-admin");
      const json = await res.json();

      if (json.success) {
        setData(json.data);
        setFilteredData(json.data);
      }
    } catch (err) {
      console.error("❌ Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Date"];
    const rows = filteredData.map((item) => [
      item.name,
      item.email,
      item.phone || "-",
      new Date(item.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brochure-downloads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Brochure Download List
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Refresh
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 sm:mb-8 inline-block">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Total Inquiries</p>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-4 py-4 text-left text-sm font-semibold">#</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Phone</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      {searchQuery ? "No results found" : "No records found"}
                    </td>
                  </tr>
                )}

                {filteredData.map((item, index) => (
                  <tr key={item._id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.phone || "-"}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {filteredData.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                {searchQuery ? "No results found" : "No records found"}
              </div>
            )}

            {filteredData.map((item, index) => (
              <div
                key={item._id}
                className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                      <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 break-all">{item.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-900 font-medium">{item.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {filteredData.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center sm:text-left">
            Showing {filteredData.length} of {data.length} {filteredData.length === 1 ? "entry" : "entries"}
          </div>
        )}
      </main>
    </div>
  );
}