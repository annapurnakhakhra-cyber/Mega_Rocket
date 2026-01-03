"use client";
import { useEffect, useState } from "react";
import { Search, RefreshCcw, Download, Mail, X, Store, Calendar, Phone, MessageSquare, User } from "lucide-react";

export default function AskExpertList() {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [shopUrl, setShopUrl] = useState("");

  // Get user email from localStorage
  const getUserEmail = () => {
    if (typeof window === "undefined") return "";

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.email || "";
    } catch (err) {
      return "";
    }
  };

  // Fetch shop URL from User model
  const fetchShopUrl = async () => {
    const email = getUserEmail();
    if (!email) throw new Error("User email not found");

    const res = await fetch("/api/me", {
      headers: {
        "x-user-email": email,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const data = await res.json();
    setShopUrl(data.shopUrl);
    return data.shopUrl;
  };

  // Normalize URL for comparison
  const normalizeUrl = (url) => {
    if (!url) return "";
    return url
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .trim();
  };

  // Fetch and filter inquiries
  const loadData = async () => {
    try {
      setLoading(true);

      // Get user's shop URL
      const userShopUrl = await fetchShopUrl();

      // Fetch all inquiries
      const res = await fetch("/api/ask-experts");
      if (!res.ok) throw new Error("Failed to load inquiries");
      
      const data = await res.json();

      // Filter inquiries by shop URL
      const filtered = data.filter(inquiry => {
        if (!inquiry.store) return false;

        return (
          normalizeUrl(inquiry.store) ===
          normalizeUrl(userShopUrl)
        );
      });

      setInquiries(data);
      setFilteredInquiries(filtered);
    } catch (err) {
      console.error("Failed to load inquiries", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Search filter on already filtered inquiries
  const searchedData = filteredInquiries.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)
    );
  });

  // Export CSV with filtered data only
  const exportCSV = () => {
    if (filteredInquiries.length === 0) {
      alert("No inquiries to export");
      return;
    }

    const csvHeader = "Name,Email,Phone,Message,Store,Created At\n";
    const csvRows = filteredInquiries
      .map(
        (i) =>
          `"${i.name}","${i.email}","${i.phone}","${i.message.replace(/"/g, '""')}","${i.store || ''}","${new Date(i.createdAt).toLocaleString()}"`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ask-expert-inquiries_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Ask an Expert Inquiry List
              </h1>
              <p className="text-gray-600">
                View and manage expert inquiries for your store
              </p>
              {/* {shopUrl && (
                <div className="flex items-center gap-2 mt-2">
                  <Store className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-600 font-medium">
                    {shopUrl}
                  </p>
                </div>
              )} */}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={exportCSV}
                disabled={filteredInquiries.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{filteredInquiries.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredInquiries.filter(i => {
                    const today = new Date().toDateString();
                    return new Date(i.createdAt).toDateString() === today;
                  }).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredInquiries.filter(i => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(i.createdAt) >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredInquiries.filter(i => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(i.createdAt) >= monthAgo;
                  }).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow-sm p-4 rounded-lg flex items-center gap-3 mb-6">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, phone, message..."
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Message</th>
                  {/* <th className="px-6 py-4 text-left text-sm font-semibold">Store</th> */}
                  <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searchedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-600 italic">
                      {search ? "No matching inquiries found" : "No inquiries found"}
                    </td>
                  </tr>
                ) : (
                  searchedData.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                          {item.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {item.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="line-clamp-2" title={item.message}>
                          {item.message}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="line-clamp-1" title={item.store}>
                          {item.store}
                        </div>
                      </td> */}
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelected(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {searchedData.length === 0 ? (
              <div className="p-8 text-center text-gray-600 italic">
                {search ? "No matching inquiries found" : "No inquiries found"}
              </div>
            ) : (
              searchedData.map((item, index) => (
                <div key={item._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${item.email}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {item.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{item.phone}</span>
                    </div>

                    <div className="bg-gray-50 px-3 py-2 rounded">
                      <p className="text-xs text-gray-600 font-medium mb-1">Message</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{item.message}</p>
                    </div>

                    {/* <div className="bg-amber-50 px-3 py-2 rounded">
                      <p className="text-xs text-amber-700 font-medium mb-1">Store</p>
                      <p className="text-sm text-amber-900">{item.store}</p>
                    </div> */}

                    <button
                      onClick={() => setSelected(item)}
                      className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredInquiries.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center mt-6">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries yet</h3>
            <p className="text-gray-600">Expert inquiries for your store will appear here</p>
            {/* {shopUrl && (
              <p className="text-sm text-gray-500 mt-2">
                Showing inquiries for: <span className="font-medium text-blue-600">{shopUrl}</span>
              </p>
            )} */}
          </div>
        )}
      </div>

      {/* Details Popup */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-600 font-semibold mb-1">Name</p>
                  <p className="text-gray-900 font-medium">{selected.name}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Email</p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-purple-900 hover:underline font-medium"
                  >
                    {selected.email}
                  </a>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-green-600 font-semibold mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{selected.phone}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-orange-600 font-semibold mb-1">Date</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(selected.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-2">Message</p>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>

              {/* {selected.store && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-xs text-amber-700 font-semibold mb-1">Store</p>
                  <p className="text-amber-900 font-medium">{selected.store}</p>
                </div>
              )} */}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                Send Email
              </a>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}