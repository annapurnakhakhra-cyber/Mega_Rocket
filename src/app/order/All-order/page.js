'use client';

import React, { useState, useEffect } from "react";
import { Download, Search, Filter, RefreshCw } from "lucide-react";
import * as XLSX from 'xlsx';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.27.4.11:3001";

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Token check
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        router.push("/login");
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const fetchOrders = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Authentication token missing. Redirecting to login...");
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000,
      });

      let ordersList = Array.isArray(response.data.orders) ? response.data.orders : [];

      setOrders(ordersList);
      setFilteredOrders(ordersList);
      toast.success(`Loaded ${ordersList.length} orders`);
    } catch (err) {
      console.error("API ERROR:", err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized. Logging you out...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59);
        return orderDate >= start && orderDate <= end;
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(o =>
        o.financialStatus?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, dateRange, statusFilter, orders]);

  const downloadExcel = () => {
    const data = filteredOrders.map(order => ({
      "Order": order.name || "-",
      "Date": new Date(order.createdAt).toLocaleDateString('en-IN'),
      "Customer": `${order.customer?.firstName || "Guest"} ${order.customer?.lastName || ""}`.trim(),
      "Channel": order.channel || "-",
      "Total": `₹${parseFloat(order.total || 0).toFixed(2)}`,
      "Payment Status": order.financialStatus || "Unknown",
      "Fulfillment Status": order.fulfillmentStatus || "Unknown",
      "Items": order.items?.length || 0,
      "Delivery Status": order.deliveryStatus || "Unknown",
      "Delivery Method": order.deliveryMethod || "-",
      "Tags": order.tags || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success("Excel downloaded successfully!");
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const s = status.toUpperCase();
    if (s.includes("PAID")) return "bg-green-100 text-green-800";
    if (s.includes("PENDING")) return "bg-yellow-100 text-yellow-800";
    if (s.includes("REFUNDED")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getFulfillmentColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    const s = status.toUpperCase();
    if (s.includes("FULFILLED")) return "bg-green-100 text-green-800";
    if (s.includes("UNFULFILLED")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-lg text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders Management</h1>
                <p className="text-gray-600 mt-1">Track and manage all orders</p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  <Filter className="w-5 h-5" /> Filters
                </button>
                <button onClick={fetchOrders} disabled={loading} className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-70">
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button onClick={downloadExcel} className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                  <Download className="w-5 h-5" /> Excel
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-3 border rounded-lg focus:outline-none focus:border-indigo-500" />
              <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="px-4 py-3 border rounded-lg" />
              <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="px-4 py-3 border rounded-lg" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 border rounded-lg">
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          )}

          {/* Table - Matched to screenshot */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Channel</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Payment Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Fulfillment Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Delivery Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Delivery Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-12 text-gray-500">No orders found matching your criteria.</td>
                    </tr>
                  ) : (
                    currentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-bold text-blue-600">{order.name || "-"}</td>
                        <td className="px-4 py-3 text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3 text-gray-700">{order.customer?.firstName ? `${order.customer.firstName} ${order.customer.lastName || ""}` : "Guest"}</td>
                        <td className="px-4 py-3 text-gray-700">{order.channel || "-"}</td>
                        <td className="px-4 py-3 font-bold text-green-600">₹{parseFloat(order.total || 0).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.financialStatus)}`}>
                            {order.financialStatus || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFulfillmentColor(order.fulfillmentStatus)}`}>
                            {order.fulfillmentStatus || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{order.items?.length || 0}</td>
                        <td className="px-4 py-3 text-gray-700">{order.deliveryStatus || "-"}</td>
                        <td className="px-4 py-3 text-gray-700">{order.deliveryMethod || "-"}</td>
                        <td className="px-4 py-3 text-gray-700">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{order.tags || "-"}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 bg-white rounded-xl shadow p-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
                Previous
              </button>
              <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;