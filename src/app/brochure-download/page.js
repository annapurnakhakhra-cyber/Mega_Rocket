
"use client";

import { useEffect, useState } from "react";
import { Mail, RefreshCw, Download, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BrochureAdminPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [storeName, setStoreName] = useState("Your Store");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      // Not logged in → redirect to login
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      
      if (user.email) {
        setUserEmail(user.email);
        setIsAuthenticated(true);
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Invalid user data in localStorage", err);
      localStorage.clear();
      router.push("/auth/login");
    }
  }, [router]);


  useEffect(() => {
    if (isAuthenticated && userEmail) {
      loadData();
    }
  }, [isAuthenticated, userEmail]);

  async function loadData() {
    if (!userEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/brochure-download-admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
      });
      const json = await res.json();
      console.log("Brochure API Response:", json);

      if (json.success) {
        setData(json.data);
        setFilteredData(json.data);
        setStoreName(json.storeName || "Brochure Downloads");
      } else {
        alert(json.message || "Failed to load data");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Search
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

  // CSV Export with Store
  const exportToCSV = () => {
    if (filteredData.length === 0) return alert("No data to export");

    const headers = ["Name", "Email", "Phone", "Store", "Date"];
    const rows = filteredData.map((item) => [
      item.name,
      item.email,
      item.phone || "-",
      item.store,
      new Date(item.createdAt).toLocaleDateString("en-IN"),
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brochure-${storeName}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <main className="max-w-7xl mx-auto">
        {/* Header */}
        {/* Minimal Header - Only Card + Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          {/* Total Downloads Card - Small & Clean */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{data.length}</p>
            </div>
          </div>

          {/* Buttons - Refresh & Export CSV */}
          <div className="flex gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-sm"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Store</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-500">No records found</td></tr>
              ) : (
                filteredData.map((item, i) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{item.phone || "-"}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">{item.store}</td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredData.map((item, i) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-5 border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-500">#{i + 1}</p>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-gray-600">{item.email}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {item.store}
                </span>
              </div>
              <div className="grid grid-cols-2 text-sm">
                <div><span className="text-gray-500">Phone:</span> {item.phone || "-"}</div>
                <div><span className="text-gray-500">Date:</span> {new Date(item.createdAt).toLocaleDateString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}