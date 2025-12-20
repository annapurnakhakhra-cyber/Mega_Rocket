'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, AlertTriangle, Zap, Wallet, RefreshCw } from 'lucide-react';

const PaymentTransactionsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '2025-06-29', end: '2025-07-05' });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Payment Transactions</h1>
           
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-orange-800">
              Almost there! Complete your KYC and billing setup to go live. Your checkout will stay inactive until onboarding is done.
            </p>
          </div>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Update now
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No. of Payments</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payment Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹0.00</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">₹</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Date Range */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">Client Order ID</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="text-sm border-none outline-none text-gray-700"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="text-sm border-none outline-none text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Payment Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Search and Download Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border-b border-gray-200">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    PG Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Prepaid Transaction ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Payment Method
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Payment Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Empty tbody for the table structure */}
              </tbody>
            </table>
          </div>

          {/* No Data Illustration */}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative">
              {/* Computer Monitor */}
              <div className="w-56 h-36 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg border-4 border-purple-300 relative shadow-lg">
                <div className="absolute inset-3 bg-white rounded border-2 border-purple-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold">NO DATA</p>
                  </div>
                </div>
              </div>
              
              {/* Monitor Stand */}
              <div className="w-12 h-6 bg-gray-300 rounded-b-lg mx-auto -mt-1"></div>
              <div className="w-20 h-2 bg-gray-400 rounded-full mx-auto mt-1"></div>
              
              {/* Person Figure */}
              <div className="absolute -right-6 -bottom-2 transform scale-90">
                {/* Head */}
                <div className="w-7 h-7 bg-gray-800 rounded-full mb-1 mx-auto"></div>
                
                {/* Body */}
                <div className="w-10 h-14 bg-purple-600 rounded-t-lg relative mx-auto">
                  {/* Arms - pointing gesture */}
                  <div className="absolute -left-2 top-2 w-5 h-2 bg-purple-600 rounded-full transform -rotate-45"></div>
                  <div className="absolute -right-2 top-2 w-5 h-2 bg-purple-600 rounded-full transform rotate-45"></div>
                </div>
                
                {/* Legs */}
                <div className="flex justify-center gap-1">
                  <div className="w-2 h-7 bg-gray-800 rounded-full"></div>
                  <div className="w-2 h-7 bg-gray-800 rounded-full"></div>
                </div>
                
                {/* Feet */}
                <div className="flex justify-center gap-1 -mt-1">
                  <div className="w-3 h-2 bg-gray-900 rounded-full"></div>
                  <div className="w-3 h-2 bg-gray-900 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTransactionsDashboard;