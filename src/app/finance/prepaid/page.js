

//localstorage token
'use client';

import { useEffect, useState } from 'react';
import { 
  Download, ChevronLeft, ChevronRight, TrendingUp, ShoppingCart, 
  Users, DollarSign, Search, RefreshCw 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const ShopifyOrdersDashboard = () => {
  const router = useRouter();
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://10.27.4.11:3000'}/api/prepaid-orders`;

  const [prepaidOrders, setPrepaidOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [prepaidPage, setPrepaidPage] = useState(1);
  const itemsPerPage = 10;

  // Token validation
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast.error('Please login first');
      router.push('/auth/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        toast.error('Session expired');
        router.push('/auth/login');
      }
    } catch (err) {
      localStorage.removeItem('token');
      toast.error('Invalid session');
      router.push('/auth/login');
    }
  }, [router]);

  const fetchPrepaidOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired');
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed');
      }

      const data = await res.json();
      const orders = data.prepaidOrders || data.data || [];

      const formatted = orders.map(order => ({
        ...order,
        totalPrice: order.total || order.totalPriceSet?.shopMoney?.amount || 0,
        financialStatus: order.financialStatus || order.displayFinancialStatus || 'PAID'
      }));

      setPrepaidOrders(formatted);
      toast.success(`Loaded ${formatted.length} orders`);
    } catch (err) {
      console.error(err);
      setPrepaidOrders([]);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrepaidOrders();
  }, []);

  // FIXED: Correct variable name here
  const calculateStats = (orders) => {
    const total = orders.length;
    const revenue = orders.reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0);
    const avg = total > 0 ? revenue / total : 0;
    const unique = new Set(orders.map(o => o.customer?.email).filter(Boolean)).size;
    return { total, revenue, avg, unique };
  };

  const prepaidStats = calculateStats(prepaidOrders);  // ← FIXED: was "preprepaidOrders"

  const filtered = prepaidOrders.filter(o => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      o.name?.toLowerCase().includes(search) ||
      o.customer?.email?.toLowerCase().includes(search) ||
      `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.toLowerCase().includes(search);

    const matchesStatus = filterStatus === 'all' || o.financialStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentPageData = filtered.slice((prepaidPage - 1) * itemsPerPage, prepaidPage * itemsPerPage);

  const exportExcel = () => {
    if (filtered.length === 0) return toast.error('No data');

    const data = filtered.map(o => ({
      'Order ID': o.name || 'N/A',
      'Date': o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'N/A',
      'Customer': `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.trim() || 'Guest',
      'Email': o.customer?.email || 'N/A',
      'Amount': `₹${parseFloat(o.totalPrice || 0).toFixed(2)}`,
      'Status': o.financialStatus || 'UNKNOWN'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Prepaid Orders");
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), `Prepaid_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel downloaded!');
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto p-6">

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Prepaid Orders</h1>
                <p className="text-gray-600">High-priority prepaid transactions</p>
              </div>
              <div className="flex gap-3">
                <button onClick={fetchPrepaidOrders} disabled={loading} className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
                <button onClick={exportExcel} className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2">
                  <Download className="w-5 h-5" /> Excel
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <p>Loading orders...</p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <ShoppingCart className="w-10 h-10 text-blue-600 mb-3" />
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-3xl font-bold">{prepaidStats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <DollarSign className="w-10 h-10 text-green-600 mb-3" />
                  <p className="text-gray-600 text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-green-600">₹{prepaidStats.revenue.toFixed(0)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-gray-600 text-sm">Avg Order</p>
                  <p className="text-3xl font-bold text-purple-600">₹{prepaidStats.avg.toFixed(0)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <Users className="w-10 h-10 text-orange-600 mb-3" />
                  <p className="text-gray-600 text-sm">Customers</p>
                  <p className="text-3xl font-bold text-orange-600">{prepaidStats.unique}</p>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-6 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {filtered.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Order</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageData.map((o, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-bold text-blue-600">{o.name}</td>
                          <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="px-6 py-4">{o.customer?.firstName} {o.customer?.lastName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{o.customer?.email}</td>
                          <td className="px-6 py-4 font-bold text-green-600">₹{parseFloat(o.totalPrice || 0).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              o.financialStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {o.financialStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-700">No Orders Found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={() => setPrepaidPage(p => Math.max(1, p - 1))} disabled={prepaidPage === 1} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                    Previous
                  </button>
                  <span className="self-center text-lg font-bold">{prepaidPage} / {totalPages}</span>
                  <button onClick={() => setPrepaidPage(p => Math.min(totalPages, p + 1))} disabled={prepaidPage === totalPages} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                    Next
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

export default ShopifyOrdersDashboard;