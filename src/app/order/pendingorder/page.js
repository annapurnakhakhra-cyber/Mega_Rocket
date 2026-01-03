


// Frontend Component: PendingOrdersPage.jsx (Fully Updated)
'use client';

import React, { useState, useEffect } from "react";
import { Download, Search, Filter, X, RefreshCw, Package, IndianRupee, User, AlertCircle } from "lucide-react";
import * as XLSX from 'xlsx';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.27.4.11:3000";

const PendingOrdersPage = () => {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Check token on mount + validate expiry
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      toast.error("Please login to continue");
      router.push("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  }, [router]);

  const fetchPendingOrders = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      toast.error("Authentication required");
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API_URL}/api/orders/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      let ordersData = [];

      if (response.data?.pendingOrders && Array.isArray(response.data.pendingOrders)) {
        ordersData = response.data.pendingOrders;
      } else if (response.data?.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      }

      setOrders(ordersData);
      setFilteredOrders(ordersData);

      if (ordersData.length === 0) {
        toast.info("No pending orders found");
      } else {
        toast.success(`Loaded ${ordersData.length} pending order(s)`);
      }

    } catch (err) {
      console.error("API Error:", err);

      let message = "Failed to load pending orders";

      if (err.code === "ERR_NETWORK") {
        message = "Cannot connect to server. Check your internet.";
      } else if (err.response?.status === 401) {
        message = "Session expired. Redirecting to login...";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired");
        setTimeout(() => router.push("/auth/login"), 1500);
      } else if (err.response?.status === 404) {
        message = "Pending orders endpoint not found";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(order =>
      (order.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  // Excel Export - Adjusted for backend structure
  const downloadExcel = () => {
    if (filteredOrders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const data = filteredOrders.map(order => ({
      "Order ID": order.name || "N/A",
      "Date": order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : "N/A",
      "Customer": order.customer ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || "Guest" : "Guest",
      "Email": order.customer?.email || "N/A",
      "Amount": `₹${order.total || "0"}`,
      "Payment": order.paymentGatewayNames?.[0] || order.financialStatus || "Pending",
      "Items": (order.items || []).map(i => `${i.title} ×${i.quantity}`).join("; ") || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pending Orders");
    XLSX.writeFile(wb, `pending_orders_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Excel downloaded successfully!");
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIdx = (currentPage - 1) * ordersPerPage;
  const endIdx = startIdx + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIdx, endIdx);

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">

          {/* HEADER */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Pending Orders
                </h1>
                <p className="text-gray-600 mt-1">Orders waiting for payment</p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg w-full sm:w-auto transition"
                >
                  <Filter className="w-5 h-5" /> Filters
                </button>

                <button
                  onClick={fetchPendingOrders}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full sm:w-auto transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                <button
                  onClick={downloadExcel}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg w-full sm:w-auto transition"
                >
                  <Download className="w-5 h-5" /> Excel
                </button>
              </div>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-20 text-gray-600">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-lg">Loading pending orders...</p>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-6 rounded-xl mb-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-bold mb-2">Error</p>
              <p className="mb-4">{error}</p>
              <button
                onClick={fetchPendingOrders}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* NO ORDERS */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-700">No Pending Orders</p>
              <p className="text-gray-600 mt-2">All orders are paid or cancelled</p>
            </div>
          )}

          {/* FILTERS */}
          {showFilters && !loading && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* ORDERS GRID */}
          {!loading && !error && filteredOrders.length > 0 && (
            <>
              <div className="space-y-4 sm:space-y-6 mb-6">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer p-4 sm:p-6 border border-gray-100 hover:border-yellow-300"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                          <p className="text-xl sm:text-2xl font-bold text-gray-800">{order.name || "N/A"}</p>
                          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold self-start">
                            PENDING PAYMENT
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                          {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : "No date"}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-gray-600 font-medium text-sm">Customer</p>
                            <p className="font-bold text-base sm:text-lg">
                              {order.customer ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || "Guest" : "Guest"}
                            </p>
                            {order.customer?.email && <p className="text-sm text-gray-500 truncate max-w-xs">{order.customer.email}</p>}
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium text-sm">Payment Method</p>
                            <p className="font-bold text-base sm:text-lg">{order.paymentGatewayNames?.[0] || order.financialStatus || "COD"}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-medium text-sm">Total Items</p>
                            <p className="font-bold text-base sm:text-lg">{(order.items || []).length || 0} item(s)</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-left lg:text-right w-full lg:w-auto">
                        <p className="text-3xl sm:text-4xl font-bold text-green-600">
                          ₹{order.total || "0"}
                        </p>
                        <p className="text-gray-600 mt-1 text-sm">Amount Due</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-3 bg-white rounded-xl shadow p-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition font-medium"
                  >
                    Previous
                  </button>
                  <span className="text-lg font-bold text-gray-700 px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition font-medium"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* MODAL - Adjusted for backend structure */}
          {showModal && selectedOrder && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 sm:p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-bold">Order {selectedOrder.name} (Pending)</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-full transition">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-blue-50 p-4 sm:p-6 rounded-2xl">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" /> Customer Details
                      </h3>
                      <p className="text-lg sm:text-xl font-bold">
                        {selectedOrder.customer?.firstName || "Guest Customer"}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 mt-2 break-words">
                        {selectedOrder.customer?.email || "No email provided"}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 sm:p-6 rounded-2xl text-left lg:text-right">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 lg:justify-end">
                        <span className="lg:order-2">Amount Due</span>
                        <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 lg:order-1" />
                      </h3>
                      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600">
                        ₹{selectedOrder.total || "0"}
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 mt-2">
                        Method: {selectedOrder.paymentGatewayNames?.[0] || selectedOrder.financialStatus || "Cash on Delivery"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6" /> Items Ordered
                    </h3>
                    <div className="space-y-4">
                      {(selectedOrder.items || []).map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                          <span className="text-sm sm:text-base font-medium flex-1 pr-4">{item.title}</span>
                          <span className="text-base sm:text-lg font-bold text-gray-700 whitespace-nowrap">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
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

export default PendingOrdersPage;