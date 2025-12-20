'use client';

import React, { useEffect, useState } from "react";
import {
  Search,
  Download,
  Calendar,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Filter,
  CreditCard,
  Clock,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import * as XLSX from "xlsx";
import { jwtDecode } from "jwt-decode";

const RefundsDashboard = () => {
  const [activeTab, setActiveTab] = useState("TRANSACTION HISTORY");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allRefunds, setAllRefunds] = useState([]);
  const [shopName, setShopName] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tabs = ["TRANSACTION HISTORY"];
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setShopName(decoded.data.shop);
      } catch (err) {
        setError("Invalid authentication token");
      }
    } else {
      setError("No authentication token found");
    }
  }, []);

  useEffect(() => {
    if (!shopName) return;
    const fetchRefunds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${api}/refund.php?shop=${shopName}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setRefunds(data.refunds || []);
        setAllRefunds(data.refunds || []);
      } catch (err) {
        setError(err.message || "Failed to fetch refunds");
      } finally {
        setLoading(false);
      }
    };
    fetchRefunds();
  }, [shopName]);

  useEffect(() => {
    const filterRefunds = () => {
      let filtered = [...allRefunds];
      if (dateRange.start && dateRange.end) {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setDate(end.getDate() + 1);
        filtered = filtered.filter((r) => {
          const date = new Date(r.refund_date_time);
          return date >= start && date <= end;
        });
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter((r) =>
          [r.client_order_id, r.refund_transaction_id, r.refund_date_time, r.refunded_amount, r.refund_initiated_by, r.payment_status, r.payment_transaction_id]
            .some((field) => field?.toString().toLowerCase().includes(term))
        );
      }
      setRefunds(filtered);
      setCurrentPage(1); // Reset to first page on filter change
    };
    filterRefunds();
  }, [dateRange, searchTerm, allRefunds]);

  const downloadExcel = () => {
    if (refunds.length === 0) {
      setError("No data available to download");
      return;
    }
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        refunds.map((r) => ({
          "Client Order ID": r.client_order_id || "N/A",
          "Refund Transaction ID": r.refund_transaction_id || "N/A",
          "Refund Date & Time": r.refund_date_time ? new Date(r.refund_date_time).toLocaleString() : "N/A",
          "Refunded Amount": r.refunded_amount || "N/A",
          "Refund Initiated By": r.refund_initiated_by || "N/A",
          "Payment Status": r.payment_status || "N/A",
          "Payment Gateway": r.payment_gateway || "N/A",
          "Payment Transaction ID": r.payment_transaction_id || "N/A",
          "Payment Date & Time": r.payment_date_time ? new Date(r.payment_date_time).toLocaleString() : "N/A",
          "Payment Total": r.payment_total || "N/A",
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, "Refunds");
      const filename = `refunds_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (err) {
      console.error("Excel error:", err);
      setError("Failed to generate Excel file");
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${parseFloat(amount).toFixed(2)}` : 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = refunds.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(refunds.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Refunds Dashboard</h1>
                <p className="text-sm text-gray-600">Manage and track all refund transactions</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Refunds</p>
                <p className="text-2xl font-bold text-gray-900">{refunds.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          {/* <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {refunds.filter(r => r.payment_status?.toLowerCase() === 'completed').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {refunds.filter(r => r.payment_status?.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div> */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(refunds.reduce((sum, r) => sum + (parseFloat(r.refunded_amount) || 0), 0))}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Filter className="w-4 h-4" />
                <span>Toggle Filters</span>
              </button>
            </div>
            <div className={`${filterOpen ? 'block' : 'hidden'} md:block`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  {/* <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div> */}
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-2 space-y-3 md:space-y-0">
  <div className="relative w-full">
    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="date"
      value={dateRange.start}
      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  <span className="text-gray-500 text-center md:text-left">to</span>
  <div className="relative w-full">
    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="date"
      value={dateRange.end}
      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders, transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={downloadExcel}
                    disabled={loading || refunds.length === 0}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex items-center justify-center space-x-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading refunds...</p>
            </div>
          </div>
        )}
        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Order ID",
                    "Refund Transaction",
                    "Refund Date",
                    "Amount",
                    "Initiated By",
                    "Status",
                    "Gateway",
                    "Payment ID",
                    "Payment Date",
                    "Total"
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <FileText className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500">No refunds found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((refund, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{refund.client_order_id || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{refund.refund_transaction_id || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(refund.refund_date_time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(refund.refunded_amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{refund.refund_initiated_by || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(refund.payment_status)}`}>
                          {getStatusIcon(refund.payment_status)}
                          <span className="ml-1">{refund.payment_status || 'Unknown'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{refund.payment_gateway || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{refund.payment_transaction_id || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(refund.payment_date_time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(refund.payment_total)}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, refunds.length)}</span> of{' '}
                    <span className="font-medium">{refunds.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Mobile & Tablet Cards */}
        <div className="lg:hidden space-y-4">
          {currentItems.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex flex-col items-center space-y-3">
                <FileText className="w-12 h-12 text-gray-400" />
                <p className="text-gray-500">No refunds found</p>
              </div>
            </div>
          ) : (
            currentItems.map((refund, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">#{refund.client_order_id || 'N/A'}</p>
                        <p className="text-sm text-gray-600">{formatDate(refund.refund_date_time)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(refund.refunded_amount)}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(refund.payment_status)}`}>
                          {getStatusIcon(refund.payment_status)}
                          <span className="ml-1">{refund.payment_status || 'Unknown'}</span>
                        </span>
                      </div>
                      {expandedIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                {expandedIndex === index && (
                  <div className="border-t border-gray-200 px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <RefreshCw className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Refund Transaction ID</p>
                            <p className="text-sm font-medium text-gray-900">{refund.refund_transaction_id || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Initiated By</p>
                            <p className="text-sm font-medium text-gray-900">{refund.refund_initiated_by || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Payment Gateway</p>
                            <p className="text-sm font-medium text-gray-900">{refund.payment_gateway || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Payment Transaction ID</p>
                            <p className="text-sm font-medium text-gray-900">{refund.payment_transaction_id || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Payment Date</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(refund.payment_date_time)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Payment Total</p>
                            <p className="text-sm font-medium text-gray-900">{formatCurrency(refund.payment_total)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          {/* Pagination for Mobile & Tablet */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundsDashboard;