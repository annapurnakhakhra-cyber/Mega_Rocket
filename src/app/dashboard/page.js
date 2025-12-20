'use client';

import React, { useEffect, useState } from "react";
import { 
  Download, Calendar, Users, CreditCard, TrendingUp, RefreshCw, 
  ShoppingBag, DollarSign, Clock, Package, UserCheck, AlertCircle 
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
 // ✅ fixed import

export default function Dashboard() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.27.4.11:3001";

  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Token validation
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Redirecting to login...");
        router.push("/auth/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      toast.error("Invalid session");
      router.push("/auth/login");
    }
  }, [router]);

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" // ensure correct header
        },
        timeout: 20000,
      });

      if (res.data && res.data.dashboard) {
        setDashboardData(res.data.dashboard);
        toast.success("Dashboard updated!");
      } else {
        setError("No dashboard data returned");
        toast.error("Empty response from server");
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        toast.error("Session expired");
        setTimeout(() => router.push("/auth/login"), 1500);
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server");
        toast.error("Server unreachable");
      } else {
        const msg = err.response?.data?.error || "Failed to load dashboard";
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboard();
  }, []);

  const { customers, orders, refunds } = dashboardData || {};

  const shopifyStats = {
    total: orders?.total || 0,
    paid: orders?.prepaidCount || 0,
    pending: orders?.pendingCount || 0,
    revenue: orders?.recent?.reduce((acc, o) => acc + Number(o.total || 0), 0) || 0,
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
                  Dashboard Overview
                </h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your store summary</p>
              </div>

              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition font-medium"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                Refresh Data
              </button>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-lg text-gray-700">Loading dashboard...</p>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-8 rounded-2xl text-center mb-8">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-70" />
              <p className="text-xl font-bold mb-2">Error</p>
              <p className="mb-4">{error}</p>
              <button
                onClick={fetchDashboard}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          )}

          {/* MAIN CONTENT */}
          {!loading && !error && (
            <>
              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-4xl font-bold text-gray-800 mt-2">{shopifyStats.total.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 text-sm">Paid Orders</p>
                  <p className="text-4xl font-bold text-green-600 mt-2">{shopifyStats.paid.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="bg-yellow-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-gray-600 text-sm">Pending Orders</p>
                  <p className="text-4xl font-bold text-yellow-600 mt-2">{shopifyStats.pending.toLocaleString()}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    ₹{shopifyStats.revenue.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* GRID: Recent Customers & Refunds */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Customers */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Recent Customers</h2>
                      <p className="text-sm text-gray-600">Latest registered users</p>
                    </div>
                  </div>

                  {customers?.recent && customers.recent.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {customers.recent.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition border"
                        >
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {c.firstName?.[0] || "?"}{c.lastName?.[0] || "?"}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {c.firstName} {c.lastName}
                            </p>
                            <p className="text-sm text-gray-600 truncate">{c.email}</p>
                          </div>
                          <UserCheck className="w-5 h-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No recent customers</p>
                    </div>
                  )}
                </div>

                {/* Recent Refunds */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Recent Refunds</h2>
                      <p className="text-sm text-gray-600">Latest refund requests</p>
                    </div>
                  </div>

                  {refunds?.recent && refunds.recent.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {refunds.recent.map((r, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-50 hover:bg-orange-50 rounded-lg transition border"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">
                                Refund ID: <span className="text-orange-600">#{r.id || r.refundId}</span>
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(r.createdAt || r.date).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                              Pending
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No recent refunds</p>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER - Live Clock */}
              <footer className="text-center">
                <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white px-8 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <span className="text-gray-700 font-medium">Last updated:</span>
                  </div>
                  <span className="font-bold text-blue-600 text-lg">
                    {currentTime.toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "medium"
                    })}
                  </span>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </>
  );
}
