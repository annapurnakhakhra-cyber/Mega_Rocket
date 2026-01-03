'use client';

import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  Calendar,
  AlertTriangle,
  FileText,
  RefreshCw,
  Filter,
  DollarSign,
  User,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const RefundsDashboard = () => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [refunds, setRefunds] = useState([]);
  const [allRefunds, setAllRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopName, setShopName] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.27.4.11:3000";

  // Check token from localStorage + validate
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      toast.error("Please login to continue");
      router.push("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Extract shop name
      const shop = decoded.data?.shop || decoded.shop || decoded.email?.split("@")[0] || "My Shop";
      setShopName(shop);

      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      toast.error("Invalid session. Redirecting to login...");
      router.push("/auth/login");
    }
  }, [router]);

  // Fetch refunds when shopName is ready
  useEffect(() => {
    if (!shopName) return;

    const fetchRefunds = async (retryCount = 0, maxRetries = 3) => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication missing. Please login again.");
        setLoading(false);
        return;
      }

      try {
        // Try multiple API endpoints
        const endpoints = [
          `${API_BASE_URL}/api/refunds`,
          `${API_BASE_URL}/api/prepaid-orders`,
          `${API_BASE_URL}/api/orders/refunds`,
          `${API_BASE_URL}/api/orders`,
        ];

        let response = null;
        let lastError = null;

        for (const endpoint of endpoints) {
          try {
            console.log(`[Refunds] Trying endpoint: ${endpoint}`);

            response = await fetch(endpoint, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              mode: "cors",
              credentials: "include",
            });

            if (response.ok) {
              console.log(`[Refunds] Success at: ${endpoint}`);
              break;
            } else {
              lastError = new Error(`HTTP ${response.status} at ${endpoint}`);
              console.warn(`[Refunds] Failed at ${endpoint}:`, response.status);
            }
          } catch (err) {
            lastError = err;
            console.warn(`[Refunds] Error trying ${endpoint}:`, err.message);
          }
        }

        // Handle 401 first
        if (response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Session expired. Please login again.");
          router.push("/auth/login");
          return;
        }

        // Retry on network failures
        if (!response || !response.ok) {
          if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(
              `[Refunds] Retrying in ${delay}ms... (${retryCount + 1}/${maxRetries})`
            );
            toast.loading(`Retrying... (${retryCount + 1}/${maxRetries})`, {
              id: "refunds-retry",
            });
            setTimeout(() => fetchRefunds(retryCount + 1, maxRetries), delay);
            return;
          }

          throw (
            lastError || new Error("All API endpoints failed. Server unreachable.")
          );
        }

        // Parse response
        const data = await response.json();
        console.log("[Refunds] Raw response:", data);

        // Extract refunds from various response structures
        let refundsData = [];

        if (Array.isArray(data)) {
          refundsData = data;
        } else if (data?.data && Array.isArray(data.data)) {
          refundsData = data.data;
        } else if (data?.refunds && Array.isArray(data.refunds)) {
          refundsData = data.refunds;
        } else if (data?.orders && Array.isArray(data.orders)) {
          refundsData = data.orders;
        } else if (data?.result && Array.isArray(data.result)) {
          refundsData = data.result;
        } else if (typeof data === "object") {
          // Try to find any array in the response
          const arrays = Object.values(data).filter((v) => Array.isArray(v));
          refundsData = arrays.length > 0 ? arrays[0] : [];
        }

        console.log(
          `[Refunds] Extracted data:`,
          refundsData.length,
          "items"
        );

        if (!Array.isArray(refundsData) || refundsData.length === 0) {
          console.warn("[Refunds] No data found in response");
          toast.info("No refund records found");
          setRefunds([]);
          setAllRefunds([]);
          return;
        }

        // Normalize data fields for consistent display
        const normalizedData = refundsData.map((item) => ({
          ...item,
          // Normalize order ID fields
          order_id: item.client_order_id || item.order_id || item.id || item.name || "N/A",
          // Normalize amount fields
          amount: item.refunded_amount || item.amount || item.totalAmount || 0,
          // Normalize date fields
          date: item.refund_date_time || item.refund_date || item.createdAt || item.created_at || new Date().toISOString(),
          // Normalize customer fields
          customer_name: item.customer?.firstName || item.customerName || item.name || "Guest",
          // Normalize gateway fields
          gateway: item.payment_gateway || item.paymentGatewayNames?.[0] || item.gateway || "N/A",
          // Normalize status fields
          status: item.payment_status || item.status || item.refund_status || "Pending",
        }));

        console.log("[Refunds] Normalized data:", normalizedData);
        setRefunds(normalizedData);
        setAllRefunds(normalizedData);
        toast.success(`Loaded ${normalizedData.length} refund(s)`);
      } catch (err) {
        console.error("[Refunds] Fetch error:", {
          message: err.message,
          stack: err.stack,
          api: API_BASE_URL,
        });

        let msg = "Failed to load refunds";

        if (
          err.message.includes("Failed to fetch") ||
          err.message.includes("unreachable")
        ) {
          msg =
            "Cannot connect to server. Check if it's running and CORS is configured.";
        } else if (err.message.includes("401")) {
          msg = "Unauthorized. Please login again.";
        } else if (err.message.includes("403")) {
          msg = "Access denied. Check your permissions.";
        } else if (err.message.includes("500")) {
          msg = "Server error. Please try again later.";
        } else if (err.message.includes("JSON")) {
          msg = "Invalid response from server.";
        }

        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, [shopName, router, API_BASE_URL]);

  // Filter by search + date
  useEffect(() => {
    let filtered = [...allRefunds];

    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((r) => {
        const date = new Date(r.refund_date_time || r.created_at || r.createdAt);
        return date >= start && date <= end;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((r) =>
        JSON.stringify(Object.values(r)).toLowerCase().includes(term)
      );
    }

    setRefunds(filtered);
    setCurrentPage(1);
  }, [searchTerm, dateRange, allRefunds]);

  // Excel Download
  const downloadExcel = () => {
    if (refunds.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = refunds.map((r) => ({
      "Order ID": r.order_id || "N/A",
      "Refund Date": new Date(r.date).toLocaleDateString("en-IN"),
      "Refunded Amount": r.amount || "0",
      "Customer": r.customer_name || "Guest",
      "Gateway": r.gateway || "N/A",
      "Status": r.status || "Unknown",
      "Amount": formatCurrency(r.amount),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Refunds");
    XLSX.writeFile(wb, `refunds_${shopName}_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Excel downloaded!");
  };

  // Helpers
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return `₹${num.toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination
  const totalPages = Math.ceil(refunds.length / itemsPerPage);
  const currentItems = refunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Refunds Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Track all refund transactions</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg lg:hidden"
                >
                  <Filter className="w-5 h-5" /> Filters
                </button>
                <button
                  onClick={downloadExcel}
                  disabled={loading || refunds.length === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 font-medium"
                >
                  <Download className="w-5 h-5" /> Export Excel
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-lg text-gray-700">Loading refunds...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-8 rounded-2xl text-center mb-6">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-bold mb-2">Error</p>
              <p className="mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Total Refunds</p>
                  <p className="text-4xl font-bold text-gray-800 mt-2">{refunds.length}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-lg">
                      <DollarSign className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Total Refunded</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {formatCurrency(refunds.reduce((sum, r) => sum + (parseFloat(r.refunded_amount) || 0), 0))}
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <User className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Shop</p>
                  <p className="text-xl font-bold text-gray-800 mt-2">{shopName}</p>
                </div>
              </div>

              {/* Filters */}
              <div className={`bg-white rounded-2xl shadow-xl p-6 mb-6 ${filterOpen ? "block" : "hidden lg:block"}`}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search order, customer, amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              {currentItems.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Order ID</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Gateway</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.map((r, i) => {
                        const statusColor = 
                          r.status?.toLowerCase().includes("success") || r.status?.toLowerCase().includes("completed")
                            ? "bg-green-100 text-green-700"
                            : r.status?.toLowerCase().includes("pending")
                            ? "bg-yellow-100 text-yellow-700"
                            : r.status?.toLowerCase().includes("failed")
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700";

                        return (
                          <tr key={i} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-bold text-blue-600">
                              #{String(r.order_id).replace("#", "") || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-gray-700 text-sm">
                              {formatDate(r.date)}
                            </td>
                            <td className="px-6 py-4 font-bold text-red-600">
                              -{formatCurrency(r.amount)}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {r.customer_name || "Guest"}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                {String(r.status || "Pending").charAt(0).toUpperCase() + String(r.status || "Pending").slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {r.gateway || "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-700">No Refunds Found</p>
                  <p className="text-gray-600 mt-2">Try adjusting filters</p>
                </div>
              )}

              {/* Pagination */}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RefundsDashboard;
