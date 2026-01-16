'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PaymentOffersPage() {
  const [offerType, setOfferType] = useState('');
  const [status, setStatus] = useState('Active');
  const [couponCode, setCouponCode] = useState('');

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [formData, setFormData] = useState({}); 
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        console.log("user data is", parsed);
      } catch (err) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const STORE_ID = user?.shopUrl;

  useEffect(() => {
  console.log("STORE_ID ready?", STORE_ID);
}, [STORE_ID]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (offerType) params.append('offerType', offerType);
      if (status && status !== 'All') params.append('status', status.toLowerCase());
      if (couponCode.trim()) params.append('couponCode', couponCode.trim());

      const url = `https://adminrocket,megascale.co.in/api/payment-offers?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Shop-Id': STORE_ID,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setOffers(Array.isArray(data) ? data : data.data || data.offers || []);

    } catch (err) {
      console.error('Failed to fetch payment offers:', err);
      setError('Failed to load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [STORE_ID,offerType, status, couponCode]);

  const handleReset = () => {
    setOfferType('');
    setStatus('Active');
    setCouponCode('');
  };

  // Open edit modal with pre-filled data
  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setFormData({
      discountCode: offer.discountCode || '',
      offerName: offer.offerName || '',
      offerTitle: offer.offerTitle || '',
      offerSubtitle: offer.offerSubtitle || '',
      offerDescription: offer.offerDescription || '',
      termsConditions: offer.termsConditions || '',
      logoUrl: offer.logoUrl || '',
      viewInListing: offer.viewInListing || 'Yes',
      isPartnerOffer: offer.isPartnerOffer || false,
      startDate: offer.startDate ? offer.startDate.slice(0, 10) : '',
      endDate: offer.endDate ? offer.endDate.slice(0, 10) : '',
      discountType: offer.discountType || 'Fixed',
      discountAmount: offer.discountAmount || '',
      maxTotalUsage: offer.maxTotalUsage || '',
      maxPerCustomer: offer.maxPerCustomer || '',
      minCartValue: offer.minCartValue || '',
      maxCartValue: offer.maxCartValue || '',
      skuRestriction: offer.skuRestriction || 'No',
      selectedPaymentMethod: offer.selectedPaymentMethod || '',
      methodOfApplication: offer.methodOfApplication || 'Coupon Based',
      status: offer.status || 'published',
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
    setFormData({});
  };

  // Handle input changes in modal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit updated offer via PUT
  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    if (!selectedOffer) return;

    try {
      setLoading(true);

      const response = await fetch(`https://adminrocket,megascale.co.in/api/payment-offers/${selectedOffer._id}`, {
        method: 'PUT',
        headers: {
          'X-Shop-Id': STORE_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Update failed: ${response.status} - ${errorText}`);
      }

      alert('Offer updated successfully!');
      closeModal();
      await fetchOffers(); // Refresh the list
    } catch (err) {
      console.error('Failed to update offer:', err);
      alert('Failed to update offer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle actual DELETE request
  const handleDelete = async (offerId) => {
    if (!confirm('Are you sure you want to delete this payment offer? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`https://adminrocket,megascale.co.in/api/payment-offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          'X-Shop-Id': STORE_ID,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Delete failed: ${response.status}`);
      }

      const result = await response.json();
      alert('Payment offer deleted successfully!');
      await fetchOffers(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete offer:', err);
      alert('Failed to delete offer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple date formatter
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Determine display status
  const getDisplayStatus = (apiStatus) => {
    if (apiStatus === 'published') return 'Active';
    if (apiStatus === 'draft') return 'Draft';
    return 'Inactive';
  };

  // Determine status badge color
  const getStatusColor = (apiStatus) => {
    if (apiStatus === 'published') return 'bg-green-100 text-green-800';
    if (apiStatus === 'draft') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Reusable SVG Icons
  const EditIcon = () => (
    <svg
      className="w-5 h-5 text-blue-600 hover:text-blue-800"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      className="w-5 h-5 text-red-600 hover:text-red-800"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-8">
          <button className="text-blue-600 font-semibold border-b-4 border-blue-600 pb-3 cursor-pointer">
            Payment Offers
          </button>
          <button className="text-gray-600 font-medium pb-3 cursor-pointer">
            Open Guide
          </button>
        </div>

        <Link href="/payment/paymentoffers/create">
          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800">
            Create Offer
          </button>
        </Link>
      </div>

      <p className="text-gray-600 mb-8">
        This section enables you to view and modify the payment offers made for your customers
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="relative min-w-[180px]">
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
              >
                <option value="">All Offer Types</option>
                <option value="discount">Discount</option>
                <option value="cashback">Cashback</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="All">All Status</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={fetchOffers}
              className="bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-blue-800 flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>

            <button
              onClick={handleReset}
              className="border border-gray-300 text-gray-700 px-8 py-2.5 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-gray-500 border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="py-4 px-4 font-medium">Coupon Code</th>
                  <th className="py-4 px-4 font-medium">Status</th>
                  <th className="py-4 px-4 font-medium">Offer Name</th>
                  <th className="py-4 px-4 font-medium">Offer Title</th>
                  <th className="py-4 px-4 font-medium">Start Date</th>
                  <th className="py-4 px-4 font-medium">End Date</th>
                  <th className="py-4 px-4 font-medium">Payment Method</th>
                  <th className="py-4 px-4 font-medium">Application Type</th>
                  <th className="py-4 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-20 text-gray-500">
                      Loading offers...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-24 text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-6" />
                        <p className="text-lg">No payment offers found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  offers.map((offer) => (
                    <tr key={offer._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{offer.discountCode || '-'}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            offer.status
                          )}`}
                        >
                          {getDisplayStatus(offer.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">{offer.offerName || '-'}</td>
                      <td className="py-4 px-4">{offer.offerTitle || '-'}</td>
                      <td className="py-4 px-4">{formatDate(offer.startDate)}</td>
                      <td className="py-4 px-4">{formatDate(offer.endDate)}</td>
                      <td className="py-4 px-4">{offer.selectedPaymentMethod || '-'}</td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {offer.methodOfApplication || 'Coupon Based'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => handleEdit(offer)}
                            title="Edit Offer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <EditIcon />
                          </button>

                          <button
                            onClick={() => handleDelete(offer._id)}
                            title="Delete Offer"
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">Edit Payment Offer</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateOffer} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    name="discountCode"
                    value={formData.discountCode || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Name *</label>
                  <input
                    type="text"
                    name="offerName"
                    value={formData.offerName || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input
                    type="text"
                    name="offerTitle"
                    value={formData.offerTitle || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Subtitle</label>
                  <input
                    type="text"
                    name="offerSubtitle"
                    value={formData.offerSubtitle || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    name="discountType"
                    value={formData.discountType || 'Fixed'}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount</label>
                  <input
                    type="text"
                    name="discountAmount"
                    value={formData.discountAmount || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selected Payment Method</label>
                  <input
                    type="text"
                    name="selectedPaymentMethod"
                    value={formData.selectedPaymentMethod || ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method of Application</label>
                  <select
                    name="methodOfApplication"
                    value={formData.methodOfApplication || 'Coupon Based'}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Coupon Based">Coupon Based</option>
                    <option value="Auto Apply">Auto Apply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || 'published'}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="published">Published (Active)</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPartnerOffer"
                      checked={formData.isPartnerOffer || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Is Partner Offer</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}