'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Calendar, AlertTriangle } from 'lucide-react';

const DiscountsDashboard = () => {
  const [discounts, setDiscounts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Fetch Discounts
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/discounts');
      const data = await res.json();

      if (data.success) {
        const { priceRules = [], automaticDiscounts = [] } = data.discounts;

        const allDiscounts = [
          ...priceRules.map(rule => ({
            id: rule.id,
            title: rule.title,
            value: rule.value,
            value_type: rule.value_type,
            starts_at: rule.starts_at,
            ends_at: rule.ends_at,
            type: 'price_rule',
          })),
          ...automaticDiscounts.map(node => ({
            id: node.node.id,
            title: node.node.automaticDiscount?.title || 'Automatic Discount',
            value:
              node.node.automaticDiscount?.customerGets?.value?.percentage ||
              node.node.automaticDiscount?.customerGets?.value?.amount?.amount ||
              null,
            value_type:
              node.node.automaticDiscount?.customerGets?.value?.percentage
                ? 'percentage'
                : 'amount',
            starts_at: node.node.automaticDiscount?.startsAt,
            ends_at: node.node.automaticDiscount?.endsAt,
            type: 'automatic_discount',
          })),
        ];

        setDiscounts(allDiscounts);
        setFiltered(allDiscounts);
      } else {
        setDiscounts([]);
        setFiltered([]);
        console.error('Invalid discounts data:', data.discounts);
      }
    } catch (err) {
      console.error('Failed to fetch discounts:', err);
      setDiscounts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // Filter by search term
  useEffect(() => {
    const filteredData = discounts.filter(
      d =>
        (d.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(d.value || '').includes(searchTerm)
    );
    setFiltered(filteredData);
  }, [searchTerm, discounts]);

  // CSV Export
  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ['ID', 'Title', 'Value', 'Type', 'Starts At', 'Ends At'];
    const rows = filtered.map(d => [
      d.id,
      d.title,
      d.value,
      d.value_type,
      d.starts_at,
      d.ends_at || '',
    ]);
    const csv = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'discounts.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Discounts Manager</h1>
        </div>

        {/* Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <p className="text-sm text-orange-800 flex-1">
            Discounts data fetched from Shopify Admin API.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Discounts</p>
                <p className="text-2xl font-bold text-gray-900">{discounts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Download */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search discounts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Download All
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Value</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Starts</th>
                <th className="px-4 py-3 text-left">Ends</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center">Loading discounts...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-gray-400 font-semibold">
                    No discounts found.
                  </td>
                </tr>
              ) : (
                filtered.map(d => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{d.title}</td>
                    <td className="px-4 py-3">{d.value}</td>
                    <td className="px-4 py-3">{d.value_type}</td>
                    <td className="px-4 py-3">{d.starts_at}</td>
                    <td className="px-4 py-3">{d.ends_at || '--'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DiscountsDashboard;
