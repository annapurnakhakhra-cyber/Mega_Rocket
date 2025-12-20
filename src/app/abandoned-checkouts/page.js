'use client';
import { useState, useEffect, useCallback } from 'react';

export default function AbandonedCheckoutsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recovering, setRecovering] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    averageValue: 0
  });
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetailCheckout, setSelectedDetailCheckout] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [lastCursor, setLastCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load checkouts (now using cursor-based pagination for Shopify GraphQL)
  const loadCheckouts = useCallback(async (append = false, afterCursor = null) => {
    try {
      if (!append) {
        setData([]);
        setLastCursor(null);
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      const params = new URLSearchParams({ limit: '50' });
      if (afterCursor) params.append('after', afterCursor);
      const response = await fetch(`/api/abandoned-checkouts?${params}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        // Map API response to frontend structure (matches your API's formatted data)
        const newData = result.data.map(item => ({
          id: item.id.split('/').pop(), // Extract numeric ID from GID for display
          createdAt: item.timestamp, // ISO string for formatDate
          customer: item.customerName,
          email: item.email,
          region: 'India', // Hardcoded as per your store; add billing_address if available in API
          emailStatus: 'Not Sent', // Default; track in DB if needed
          recoveryStatus: 'Not Recovered', // Default; track in DB if needed
          total: item.totalValue,
          totalNumeric: item.totalNumeric,
          recoveryLink: item.recoveryUrl,
          items: item.items.map(i => ({
            title: `${i.title} - ${i.variant}`,
            sku: 'SKU: N/A', // Add variant SKU if available in future API update
            price: i.unitPrice,
            priceNumeric: parseFloat(i.unitPrice.split(' ')[1]) || 0,
            quantity: i.quantity,
            image: i.image || '/placeholder-image.jpg'
          }))
        }));
        const allData = append ? [...data, ...newData] : newData;
        setData(allData);
        calculateStats(allData);
        // For pagination: assume API returns pageInfo with hasNextPage (update API to include it)
        // For now, use length check; update API to return pageInfo.endCursor and hasNextPage
        setLastCursor(result.pageInfo?.endCursor || null); // Placeholder; implement in API
        setHasMore(result.data.length === 50 && !!result.pageInfo?.hasNextPage); // Placeholder
        addNotification(append ? 'More checkouts loaded successfully' : 'Checkouts loaded successfully', 'success');
      } else {
        setError(result.error || 'Unknown error occurred');
        addNotification(result.error, 'error');
      }
    } catch (err) {
      setError('Fetch failed: ' + err.message);
      addNotification('Failed to load checkouts: ' + err.message, 'error');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [data]);

  useEffect(() => {
    loadCheckouts(false);
  }, []);

  const handleRefresh = () => loadCheckouts(false);

  const handleLoadMore = () => {
    if (lastCursor && hasMore) {
      loadCheckouts(true, lastCursor);
    }
  };

  // Fetch checkout details (use existing data or fallback; add /details route later if needed)
  const fetchCheckoutDetails = useCallback(async (checkoutId) => {
    // For now, find in data or fallback; ideally fetch from /api/abandoned-checkouts/${id}/details
    const existing = data.find(item => item.id === checkoutId);
    if (existing) {
      setDetailsLoading(false);
      return {
        ...existing,
        store: 'Online store',
        orders: 'No orders', // Fetch from customer if available
        account: existing.email !== 'No email' ? 'Has account' : 'No account',
        shippingAddress: 'Shipping address not available\nCity, State\nIndia', // Add to API
        billingAddress: 'Same as shipping address',
        notes: '',
        subscribedEmail: false,
        subscribedSMS: false,
        subtotalNumeric: existing.totalNumeric * 0.95, // Estimate
        shippingNumeric: existing.totalNumeric * 0.05, // Estimate
        cgstNumeric: existing.totalNumeric * 0.025,
        sgstNumeric: existing.totalNumeric * 0.025
      };
    }
    // Fallback mock
    return {
      id: checkoutId,
      createdAt: new Date().toISOString(),
      customer: 'Fallback Customer',
      email: 'fallback@example.com',
      region: 'India',
      emailStatus: 'Not Sent',
      recoveryStatus: 'Not Recovered',
      store: 'Online store',
      orders: 'No orders',
      account: 'No account',
      subscribedEmail: false,
      subscribedSMS: false,
      notes: '',
      totalNumeric: 100.00,
      subtotalNumeric: 95.00,
      shippingNumeric: 5.00,
      cgstNumeric: 2.50,
      sgstNumeric: 2.50,
      shippingAddress: 'Fallback Address\n12345 City State\nIndia',
      billingAddress: 'Same as shipping address',
      recoveryLink: `https://example.com/checkouts/${checkoutId}/recover`,
      items: [
        {
          title: 'Fallback Item',
          sku: 'SKU: FALLBACK',
          priceNumeric: 100.00,
          quantity: 1,
          image: '/placeholder-image.jpg'
        }
      ]
    };
  }, [data]);

  // Calculate stats
  const calculateStats = (checkouts) => {
    const total = checkouts.length;
    const totalValue = checkouts.reduce((sum, checkout) => sum + (checkout.totalNumeric || 0), 0);
    const averageValue = total > 0 ? totalValue / total : 0;
    setStats({ total, totalValue, averageValue });
  };

  // Filtered data
  const filteredData = data.filter(checkout => {
    const matchesSearch = checkout.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          checkout.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          checkout.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || checkout.emailStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Notifications
  const addNotification = (message, type = 'info', autoClose = true) => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    if (autoClose) {
      setTimeout(() => removeNotification(id), 5000);
    }
  };

  const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Open details modal dynamically
  const handleOpenDetails = async (checkout) => {
    const details = await fetchCheckoutDetails(checkout.id);
    setSelectedDetailCheckout(details);
    setShowDetailsModal(true);
  };

  // Close details modal
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedDetailCheckout(null);
  };

  // Recover cart
  const handleRecoverCart = (checkout) => {
    setSelectedCheckout(checkout);
    setCustomEmail(checkout.email || '');
    setShowRecoveryModal(true);
  };

  const confirmRecoverCart = async () => {
    if (!selectedCheckout) return;
    const checkoutId = selectedCheckout.id;
    setRecovering(prev => ({ ...prev, [checkoutId]: true }));
    try {
      const response = await fetch('/api/recover-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId,
          email: customEmail,
          subject: `Complete Your Purchase - ${selectedCheckout.customer || 'Customer'}`,
          message: `Hi ${selectedCheckout.customer || 'there'},\n\nWe noticed you left items in your cart worth ${selectedCheckout.total}:\n\nComplete your purchase here:\n${selectedCheckout.recoveryLink || `https://example.com/checkouts/${checkoutId}`}\n\nThank you,\nThe Store Team`
        }),
      });
      const result = await response.json();
      if (result.success) {
        addNotification(`Recovery email sent to ${customEmail}`, 'success');
        // Update local status
        setData(prev => prev.map(item =>
          item.id === checkoutId
            ? { ...item, emailStatus: 'Sent', recoveryStatus: 'In Progress' }
            : item
        ));
      } else {
        addNotification(result.message || 'Failed to send email', 'error');
      }
    } catch (err) {
      addNotification('Failed to send recovery email: ' + err.message, 'error');
    } finally {
      setRecovering(prev => ({ ...prev, [checkoutId]: false }));
      setShowRecoveryModal(false);
      setSelectedCheckout(null);
    }
  };

  // Copy recovery link
  const handleCopyRecoveryLink = (checkout) => {
    const recoveryLink = checkout.recoveryLink || `https://example.com/checkouts/${checkout.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(recoveryLink)
        .then(() => addNotification('Recovery link copied to clipboard!', 'success'))
        .catch(() => addNotification('Failed to copy link', 'error'));
    } else {
      const manualCopy = window.prompt("Copy this link:", recoveryLink);
      if (manualCopy !== null) addNotification('Recovery link copied manually!', 'success');
    }
  };

  // Open cart
  const handleOpenCart = (checkout) => {
    const url = checkout.recoveryLink || `https://example.com/checkouts/${checkout.id}`;
    window.open(url, '_blank');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date(); // Uses current date: Dec 10, 2025
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
   
    if (diffDays === 0) {
      return time.toLowerCase();
    } else if (diffDays === 1) {
      return `Yesterday at ${time.toLowerCase()}`;
    } else {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return `${days[date.getDay()]} at ${time.toLowerCase()}`;
    }
  };

  // Format currency (assumes INR; update if multi-currency needed)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Export function (placeholder)
  const handleExport = () => {
    addNotification('Exporting data...', 'info');
    console.log('Export triggered');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <span className="mt-4 text-lg text-gray-700 font-medium">Loading abandoned checkouts...</span>
          <p className="mt-2 text-gray-500">Fetching data from Shopify</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded-lg shadow-lg border-l-4 ${
            n.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
            n.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
            'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className="flex justify-between items-start">
              <p className="font-medium">{n.message}</p>
              <button onClick={() => removeNotification(n.id)} className="ml-4 text-gray-500 hover:text-gray-700">✕</button>
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Abandoned Checkouts</h1>
            <p className="text-gray-600 mt-2">Recover lost sales by reaching out to customers</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Abandoned</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Potential Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(stats.totalValue)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Average Cart Value</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{formatCurrency(stats.averageValue)}</p>
          </div>
        </div>
        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Error Loading Checkouts</h3>
                <div className="mt-2 text-red-700"><p>{error}</p></div>
                <div className="mt-4">
                  <button onClick={handleRefresh} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">Try Again</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Main Content - Table */}
        {!error && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">🛒 Abandoned checkouts</span>
                <span className="text-sm text-gray-500">( {filteredData.length} )</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>All</option>
                  <option>Not Sent</option>
                  <option>Sent</option>
                </select>
                <button onClick={handleExport} className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors">
                  Export
                </button>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checkout</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recovery Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Abandoned Checkouts</h3>
                        <p className="mb-6">All carts have been recovered or completed.</p>
                        <button onClick={handleRefresh} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">Check Again</button>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((checkout, idx) => (
                      <tr key={checkout.id || idx} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenDetails(checkout)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-900 underline"
                          >
                            #{checkout.id}
                          </button>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(checkout.createdAt)}
                        </td>
                        <td className="px-4 py-4 max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">{checkout.customer}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{checkout.region}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            checkout.emailStatus === 'Not Sent' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {checkout.emailStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            checkout.recoveryStatus === 'Not Recovered' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {checkout.recoveryStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <div className="font-bold">{checkout.total}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            {filteredData.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Learn more about abandoned checkouts
                </a>
                {hasMore && (
                  <button 
                    onClick={handleLoadMore} 
                    disabled={isLoadingMore}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {isLoadingMore ? 'Loading...' : 'Load More'}
                  </button>
                )}
                <button className="text-sm text-gray-500 hover:text-gray-700">+</button>
              </div>
            )}
          </div>
        )}
        {/* Details Modal - Updated to use mapped data */}
        {showDetailsModal && selectedDetailCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900">#{selectedDetailCheckout.id}</span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800`}>
                    {selectedDetailCheckout.recoveryStatus}
                  </span>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 ml-2`}>
                    {selectedDetailCheckout.emailStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleOpenCart(selectedDetailCheckout)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Print</button>
                  <button onClick={handleCloseDetails} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
              </div>
              {/* Location and Date */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{selectedDetailCheckout.region}</span>
                  <span>•</span>
                  <span>{new Date(selectedDetailCheckout.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(selectedDetailCheckout.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}</span>
                </div>
              </div>
              {/* Recovery Email Section */}
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Email your customer this link to recover their cart</h3>
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <input
                        type="text"
                        value={selectedDetailCheckout.recoveryLink}
                        readOnly
                        className="w-full text-sm bg-transparent border-0 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleRecoverCart(selectedDetailCheckout)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Send a cart recovery email
                    </button>
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Checkout Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Checkout details</h3>
                  <div className="space-y-4">
                    {selectedDetailCheckout.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{item.price} × {item.quantity}</p>
                          <p className="text-sm text-gray-900 font-bold">{item.price}</p>
                        </div>
                      </div>
                    ))}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(selectedDetailCheckout.subtotalNumeric)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Standard (0 kg) {formatCurrency(selectedDetailCheckout.shippingNumeric)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Estimated tax</span>
                        <span>CGST 2.5% {formatCurrency(selectedDetailCheckout.cgstNumeric)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span></span>
                        <span>SGST 2.5% {formatCurrency(selectedDetailCheckout.sgstNumeric)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                        <span>Total to be paid by customer</span>
                        <span>{selectedDetailCheckout.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Customer Panel */}
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">From {selectedDetailCheckout.store}</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Customer</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{selectedDetailCheckout.customer}</p>
                        <p className="text-xs text-gray-500">{selectedDetailCheckout.orders}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Contact information</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-900">{selectedDetailCheckout.email}</p>
                        <p className="text-xs text-gray-500">{selectedDetailCheckout.account}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping address</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap">{selectedDetailCheckout.shippingAddress}</pre>
                        <button className="mt-2 text-xs text-blue-600 hover:underline">Edit</button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Billing address</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">{selectedDetailCheckout.billingAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Notes and Marketing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 border-t border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                  <textarea
                    placeholder="Add a note to this checkout"
                    defaultValue={selectedDetailCheckout.notes}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  <button className="mt-2 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700">Save</button>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Marketing</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="rounded mr-2" checked={selectedDetailCheckout.subscribedEmail} readOnly />
                      <span>{selectedDetailCheckout.subscribedEmail ? 'Email subscribed' : 'Email not subscribed'}</span>
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="rounded mr-2" checked={selectedDetailCheckout.subscribedSMS} readOnly />
                      <span>{selectedDetailCheckout.subscribedSMS ? 'SMS subscribed' : 'SMS not subscribed'}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Recovery Modal */}
        {showRecoveryModal && selectedCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send Recovery Email</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
                <p className="text-xs text-gray-500 mt-1">Default: {selectedCheckout.email}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600">This will send a recovery email with a link back to the cart containing:</p>
                <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
                  <li>{selectedCheckout.items?.length || 1} item(s)</li>
                  <li>Total value: {selectedCheckout.total}</li>
                  <li>Customer: {selectedCheckout.customer}</li>
                </ul>
              </div>
              <div className="flex gap-3">  
                <button
                  onClick={confirmRecoverCart}
                  disabled={recovering[selectedCheckout.id] || !customEmail}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                    recovering[selectedCheckout.id] || !customEmail
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {recovering[selectedCheckout.id] ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Email'
                  )}
                </button>
                <button
                  onClick={() => { setShowRecoveryModal(false); setSelectedCheckout(null); }}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}