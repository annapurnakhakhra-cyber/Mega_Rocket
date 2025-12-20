"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Download, Mail, Calendar, User, MessageSquare } from "lucide-react";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchContacts();
  };

  const handleExportToExcel = () => {
    // Create CSV content
    const headers = ["Date", "Name", "Email", "Subject", "Message"];
    const csvContent = [
      headers.join(","),
      ...contacts.map(c => [
        new Date(c.createdAt).toLocaleString("en-IN"),
        `"${c.name}"`,
        c.email,
        `"${c.subject}"`,
        `"${c.message.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading contacts...</p>
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
                Contacts Management
              </h1>
              <p className="text-gray-600">
                View and manage all contact submissions
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
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
                  {contacts.filter(c => {
                    const today = new Date().toDateString();
                    return new Date(c.createdAt).toDateString() === today;
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
                  {contacts.filter(c => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(c.createdAt) >= weekAgo;
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
                  {contacts.filter(c => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(c.createdAt) >= monthAgo;
                  }).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a 
                        href={`mailto:${c.email}`} 
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        {c.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-700">
                      {c.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <div className="line-clamp-2" title={c.message}>
                        {c.message}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {contacts.map((c) => (
              <div key={c._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{c.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.createdAt).toLocaleString("en-IN", {
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
                      href={`mailto:${c.email}`} 
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {c.email}
                    </a>
                  </div>
                  
                  <div className="bg-purple-50 px-3 py-2 rounded">
                    <p className="text-xs text-purple-600 font-medium mb-1">Subject</p>
                    <p className="text-sm font-semibold text-purple-900">{c.subject}</p>
                  </div>
                  
                  <div className="bg-gray-50 px-3 py-2 rounded">
                    <p className="text-xs text-gray-600 font-medium mb-1">Message</p>
                    <p className="text-sm text-gray-700">{c.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {contacts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts yet</h3>
            <p className="text-gray-600">Contact submissions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}