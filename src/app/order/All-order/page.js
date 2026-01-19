'use client';

import React, { useState, useEffect } from "react";
import { Download, Filter, RefreshCw, Eye, X, Phone, Mail, User, Calendar, Package, Truck, Tag } from "lucide-react";
import * as XLSX from 'xlsx';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.27.4.11:3000";

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000,
      });

      const ordersList = Array.isArray(response.data.orders) ? response.data.orders : [];
      setOrders(ordersList);
      setFilteredOrders(ordersList);
      toast.success(`Loaded ${ordersList.length} orders`);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Unauthorized. Logging you out...");
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

  // Filtering logic
  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.name?.toLowerCase().includes(term) ||
        order.customer?.firstName?.toLowerCase().includes(term) ||
        order.customer?.lastName?.toLowerCase().includes(term) ||
        order.customer?.email?.toLowerCase().includes(term) ||
        order.customer?.phone?.includes(term)
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
    const data = filteredOrders.map(order => {
      const customer = order.customer || {};
      const customerDisplay = customer.firstName
        ? `${customer.firstName} ${customer.lastName || ""}`.trim()
        : customer.email || customer.phone || "Guest";

      return {
        "Order": order.name || "-",
        "Date": new Date(order.createdAt).toLocaleDateString('en-IN'),
        "Customer": customerDisplay,
        "Phone": customer.phone || "-",
        "Email": customer.email || "-",
        "Channel": order.channel || "-",
        "Total": `₹${parseFloat(order.total || 0).toFixed(2)}`,
        "Payment Status": order.financialStatus || "Unknown",
        "Fulfillment Status": order.fulfillmentStatus || "Unknown",
        "Items": order.items?.length || 0,
        "Delivery Status": order.deliveryStatus || "-",
        "Delivery Method": order.deliveryMethod || "-",
        "Tags": order.tags || "-",
      };
    });

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
    if (!status) return "bg-gray-200 text-gray-700";
    const s = status.toUpperCase();
    if (s.includes("PAID")) return "bg-green-100 text-green-800";
    if (s.includes("PENDING")) return "bg-amber-100 text-amber-800";
    if (s.includes("REFUNDED")) return "bg-red-100 text-red-800";
    return "bg-gray-200 text-gray-700";
  };

  const getFulfillmentColor = (status) => {
    if (!status) return "bg-gray-200 text-gray-700";
    const s = status.toUpperCase();
    if (s.includes("FULFILLED")) return "bg-green-100 text-green-800";
    if (s.includes("UNFULFILLED")) return "bg-orange-100 text-orange-800";
    return "bg-gray-200 text-gray-700";
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getCustomerDisplay = (customer) => {
    if (!customer) return "Guest";
    if (customer.firstName || customer.lastName) {
      return `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
    }
    if (customer.email) return customer.email;
    if (customer.phone) return customer.phone;
    return "Guest";
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      {/* Modal - Professional & Minimal with Blurred Background */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Order {selectedOrder.name}</h2>
                <p className="text-sm text-slate-500 mt-1">Complete order details and information</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-8 space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Order Date</p>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Total Amount</p>
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      ₹{parseFloat(selectedOrder.total || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Items</p>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedOrder.items?.length || 0} {selectedOrder.items?.length === 1 ? 'Item' : 'Items'}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-600 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Full Name</p>
                      <p className="text-base font-semibold text-slate-900">{getCustomerDisplay(selectedOrder.customer)}</p>
                    </div>
                    {selectedOrder.customer?.email && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> Email Address
                        </p>
                        <p className="text-base font-medium text-slate-700">{selectedOrder.customer.email}</p>
                      </div>
                    )}
                    {selectedOrder.customer?.phone && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" /> Phone Number
                        </p>
                        <p className="text-base font-medium text-slate-700">{selectedOrder.customer.phone}</p>
                      </div>
                    )}
                  </div>
                  {!selectedOrder.customer && <p className="text-slate-500 font-medium mt-4">Guest Checkout</p>}
                </div>

                {/* Status Section */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Order Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Payment Status</p>
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(selectedOrder.financialStatus)}`}>
                        {selectedOrder.financialStatus || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Fulfillment</p>
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${getFulfillmentColor(selectedOrder.fulfillmentStatus)}`}>
                        {selectedOrder.fulfillmentStatus || "Unknown"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" /> Delivery Status
                      </p>
                      <p className="font-bold text-slate-900">{selectedOrder.deliveryStatus || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Delivery Method</p>
                      <p className="font-bold text-slate-900">{selectedOrder.deliveryMethod || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Order Items</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items?.length > 0 ? (
                          selectedOrder.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-slate-900 font-medium">{item.title || "Unknown Product"}</td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">
                                  {item.quantity || 1}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right text-slate-700 font-medium">₹{parseFloat(item.price || 0).toFixed(2)}</td>
                              <td className="px-6 py-4 text-right font-bold text-blue-600 text-lg">
                                ₹{parseFloat((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center py-12 text-slate-400 font-medium">No items found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tags */}
                {selectedOrder.tags && (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex items-center gap-4">
                    <div className="p-2.5 bg-blue-600 rounded-lg">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Order Tags</p>
                      <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                        {selectedOrder.tags}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-8 py-5 flex justify-end">
              <button
                onClick={closeModal}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders Management</h1>
                <p className="text-gray-600 mt-1">Track and manage all orders</p>
              </div>
              <div className="flex flex-wrap gap-3">
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
              <input type="text" placeholder="Search by name, email, phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500" />
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

          {/* Orders Table - Row Clickable + View Button Always Visible */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1600px]">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Order</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Channel</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Payment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Fulfillment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Delivery</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="13" className="text-center py-12 text-gray-500">No orders found matching your criteria.</td>
                    </tr>
                  ) : (
                    currentOrders.map(order => (
                      <tr 
                        key={order.id} 
                        className="hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                        onClick={() => openOrderDetail(order)}
                      >
                        <td className="px-4 py-3 font-bold text-blue-600">{order.name || "-"}</td>
                        <td className="px-4 py-3 text-gray-700">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="px-4 py-3 text-gray-700 font-medium">{getCustomerDisplay(order.customer)}</td>
                        <td className="px-4 py-3 text-gray-700">{order.customer?.phone || "-"}</td>
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
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{order.tags || "-"}</span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openOrderDetail(order)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
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
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-5 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">
                Previous
              </button>
              <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-5 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition">
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
