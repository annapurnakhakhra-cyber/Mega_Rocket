'use client';

import React, { useEffect, useState } from "react";
import {
  Download, Eye, RefreshCcw, Search, Users, Mail, Phone, MapPin, Package,
  ChevronLeft, ChevronRight, X,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const pageSize = 10;

const CustomerManager = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.27.4.11:3001";

  const [shopName, setShopName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Check token from localStorage + validate expiry
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const shop = decoded?.data?.shop || decoded?.shop || decoded?.email?.split("@")[0] || "My Store";
      setShopName(shop);

      // Check token expiry
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      toast.error("Invalid session. Logging you out...");
      router.push("/auth/login");
    }
  }, [router]);

  // Fetch customers using localStorage token
  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 20000,
      });

      const customerList = response.data?.customers || response.data?.data || [];

      if (Array.isArray(customerList)) {
        setCustomers(customerList);
        setFilteredCustomers(customerList);
        toast.success(`Loaded ${customerList.length} customers`);
      } else {
        toast.error("No customer data found");
      }
    } catch (err) {
      console.error("API Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired");
        setTimeout(() => router.push("/auth/login"), 1500);
      } else if (err.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server");
      } else {
        toast.error(err.response?.data?.message || "Failed to load customers");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load customers when shop name is ready
  useEffect(() => {
    if (shopName) {
      fetchCustomers();
    }
  }, [shopName]);

  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(c =>
      `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase().includes(term.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(term.toLowerCase())
    );

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const currentData = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Export to CSV
  const downloadCSV = () => {
    if (customers.length === 0) {
      toast.error("No customers to export");
      return;
    }

    const headers = ["First Name", "Last Name", "Email", "Phone", "Total Orders", "City", "Country"];
    const rows = customers.map(c => [
      c.firstName || "",
      c.lastName || "",
      c.email || "",
      c.phone || "N/A",
      c.totalOrders || 0,
      c.addresses?.[0]?.city || "",
      c.addresses?.[0]?.country || "",
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${shopName}_customers_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">

          {/* HEADER */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Customer Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Store: <strong className="text-blue-600">{shopName || "Loading..."}</strong>
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={fetchCustomers}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                >
                  <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <Download className="w-5 h-5" /> Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{customers.length.toLocaleString()}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 text-sm">Active Customers</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {customers.filter(c => (c.totalOrders || 0) > 0).length.toLocaleString()}
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-center py-20">
              <RefreshCcw className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-lg text-gray-700">Loading customers...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-700">No Customers Found</p>
              <p className="text-gray-600 mt-2">Try searching or refresh the list</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">#</th>
                    <th className="px-6 py-4 text-left">Customer</th>
                    <th className="px-6 py-4 text-left">Contact</th>
                    <th className="px-6 py-4 text-left">Orders</th>
                    <th className="px-6 py-4 text-left">Location</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.map((c, i) => {
                    const addr = c.addresses?.[0];
                    return (
                      <tr key={c.id || i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium">
                          {(currentPage - 1) * pageSize + i + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {c.firstName || ""} {c.lastName || ""}
                          </div>
                          <div className="text-xs text-gray-500">ID: {c.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail size={14} className="text-gray-400" />
                            <span className="truncate max-w-[200px]">{c.email}</span>
                          </div>
                          {c.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-400" />
                              <span>{c.phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                            {c.totalOrders || 0} orders
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {addr ? `${addr.city || "N/A"}, ${addr.country || "N/A"}` : "No address"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setModalData(c)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition"
                          >
                            <Eye size={16} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 bg-white rounded-xl shadow p-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <span className="text-lg font-bold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 flex items-center gap-2"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* MODAL */}
          {modalData && (
            <div 
              className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setModalData(null)}
            >
              <div 
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
                  <h2 className="text-xl font-bold">Customer Details</h2>
                  <button
                    onClick={() => setModalData(null)}
                    className="p-2 hover:bg-white/20 rounded-full transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
                      {modalData.firstName?.[0] || "?"}{modalData.lastName?.[0] || "?"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {modalData.firstName} {modalData.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {modalData.id}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-gray-800 break-all">{modalData.email}</span>
                    </div>
                    {modalData.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <span className="text-gray-800">{modalData.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-800 font-medium">
                        {modalData.totalOrders || 0} total orders
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      Addresses
                    </h4>
                    {modalData.addresses && modalData.addresses.length > 0 ? (
                      <div className="space-y-3">
                        {modalData.addresses.map((addr, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <p className="font-medium text-sm text-gray-900 mb-1">
                              {idx === 0 ? "Primary Address" : `Address ${idx + 1}`}
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {addr.address1}
                              {addr.address2 && `, ${addr.address2}`}
                              <br />
                              {[addr.city, addr.province].filter(Boolean).join(", ")} {addr.zip}
                              <br />
                              {addr.country}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No address available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerManager;