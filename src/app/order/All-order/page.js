'use client';

import React, { useState, useEffect } from "react";
import { Download, Filter, RefreshCw, Eye, X, Phone, Mail, User, Calendar, Package, Truck, Tag, MapPin, Printer } from "lucide-react";
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
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  const [isEditStickerModalOpen, setIsEditStickerModalOpen] = useState(false);
  const [stickersToEdit, setStickersToEdit] = useState([]);

  const ordersPerPage = 10;

  // Token check
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Please login first");
      router.push("/auth/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        router.push("/auth/login");
      }
    } catch (err) {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  }, [router]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/auth/login");

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
        router.push("/auth/login");
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

  const getPaymentStatusText = (status) => {
    if (!status) return "Unknown";
    const s = status.toLowerCase();
    if (s === "paid") return "full amount paid";
    if (s === "pending") return "paid amount 50 and other COD";
    return status;
  };

  const handlePrintSticker = (order) => {
    // This function will now open the edit modal instead of printing directly
    handleOpenSingleEdit(order);
  };

  const handleOpenBulkEdit = () => {
    if (selectedOrderIds.size === 0) {
      toast.error("Please select at least one order");
      return;
    }
    const selectedOrders = orders.filter(o => selectedOrderIds.has(o.id));
    const stickers = selectedOrders.map(order => ({
      id: order.id,
      name: order.name,
      createdAt: order.createdAt,
      financialStatus: order.financialStatus,
      total: order.total,
      items: order.items,
      shippingName: order.shippingAddress?.name || getCustomerDisplay(order.customer),
      address1: order.shippingAddress?.address1 || '',
      address2: order.shippingAddress?.address2 || '',
      city: order.shippingAddress?.city || '',
      province: order.shippingAddress?.province || '',
      zip: order.shippingAddress?.zip || '',
      country: order.shippingAddress?.country || '',
      phone: order.shippingAddress?.phone || order.customer?.phone || '',
      email: order.customer?.email || '',
      length: '',
      width: '',
      height: '',
      actualWeight: '',
      weightUnit: 'kg'
    }));
    setStickersToEdit(stickers);
    setIsEditStickerModalOpen(true);
  };

  const handleOpenSingleEdit = (order) => {
    const sticker = {
      id: order.id,
      name: order.name,
      createdAt: order.createdAt,
      financialStatus: order.financialStatus,
      total: order.total,
      items: order.items,
      shippingName: order.shippingAddress?.name || getCustomerDisplay(order.customer),
      address1: order.shippingAddress?.address1 || '',
      address2: order.shippingAddress?.address2 || '',
      city: order.shippingAddress?.city || '',
      province: order.shippingAddress?.province || '',
      zip: order.shippingAddress?.zip || '',
      country: order.shippingAddress?.country || '',
      phone: order.shippingAddress?.phone || order.customer?.phone || '',
      email: order.customer?.email || '',
      length: '',
      width: '',
      height: '',
      actualWeight: '',
      weightUnit: 'kg'
    };
    setStickersToEdit([sticker]);
    setIsEditStickerModalOpen(true);
  };

  const handleStickerChange = (id, field, value) => {
    setStickersToEdit(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelectOrder = (id) => {
    const newSelected = new Set(selectedOrderIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOrderIds(newSelected);
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};
    const shopifyUrl = user.shopUrl || user.shopifyStoreUrl || "";
    const isMegaScale = shopifyUrl.toLowerCase().includes("hit-megascale.myshopify.com");
    const logoUrl = isMegaScale ? "https://cdn.shopify.com/s/files/1/0953/6284/2993/files/logoedited.jpg?v=1770121430" : null;

    // Validation
    for (const sticker of stickersToEdit) {
      if (!sticker.length || !sticker.width || !sticker.height || !sticker.actualWeight) {
        toast.error(`Please fill all dimension and weight details for sticker: ${sticker.name}`);
        return;
      }
    }

    let allStickersHtml = `
      <html>
        <head>
          <title>Print Stickers</title>
          <style>
            @page { size: 4in 6in; margin: 0; }
            body { 
              font-family: 'Inter', system-ui, sans-serif; 
              margin: 0; 
              padding: 0;
              color: #1a1a1a;
            }
            .sticker-container {
              page-break-after: always;
              height: 6in;
              width: 4in;
              padding: 6px 6px 8px 6px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              border: 1px solid #000; /* Outer border for the physical label */
            }
            .sticker {
              padding: 10px;
              height: 100%;
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid #000;
              padding-bottom: 0px;
              margin-bottom: 4px;
            }
            .payment-badge {
              font-family: 'Inter', sans-serif;
            }
            .payment-label {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              margin-bottom: 0px;
              padding:0px;
            }
            .payment-amount {
              font-size: 20px;
              font-weight: 900;
              margin:0px;
              padding:0px;
            }
            .logo-placeholder {
              width: 165px;
              height: 75px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: #999;
            }
            .body-section {
              flex: 1;
            }
            .address-box {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
            }
            .to-section {
              flex: 2;
            }
            .order-id-section {
              flex: 1;
              text-align: right;
            }
            .label-small {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              color: #666;
              margin-bottom: 2px;
            }
            .recipient-name {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 2px;
            }
            .address-text {
              font-size: 13px;
              line-height: 1.3;
              font-weight: 500;
            }
            .order-id {
              font-size: 15px;
              font-weight: 800;
              font-family: monospace;
            }
            .product-section {
              border-top: 1px solid #eee;
              padding: 8px 0 0 0;
              margin-bottom: 12px;
            }
            .product-stat {
              text-align: center;
            }
            .stat-value {
              font-size: 16px;
              font-weight: 800;
            }
            .stat-label {
              font-size: 10px;
              color: #666;
              text-transform: uppercase;
            }
            .footer-section {
              margin-top: auto;
              padding-top: 10px;
              border-top: 1px solid #000;
            }
            .from-text {
              font-size: 11px;
              line-height: 1.3;
              font-weight: 500;
            }
            .product-table {
              width: 100%;
              border-collapse: collapse;
            }
            .product-table td {
              padding: 3px 0;
              border-bottom: 1px dotted #eee;
            }
            .product-table tr:last-child td {
              border-bottom: none;
            }
            .product-table .label {
              font-size: 12px;
              font-weight: 600;
              color: #555;
              text-transform: uppercase;
            }
            .product-table .value {
              font-size: 14px;
              font-weight: 600;
              text-align: right;
            }
            .highlight-row td {
              background-color: #f9f9f9;
              padding: 4px 4px !important;
              border-top: 1px solid #000 !important;
            }
            .highlight-row .value {
              font-size: 18px;
              color: #000;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
    `;

    stickersToEdit.forEach(sticker => {
      const isCod = sticker.financialStatus?.toLowerCase() === 'pending';
      const codAmount = (parseFloat(sticker.total || 0) - 50).toFixed(2);
      const totalItems = sticker.items?.length || 0;
      const totalPacks = sticker.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

      const volKg = (parseFloat(sticker.length || 0) * parseFloat(sticker.width || 0) * parseFloat(sticker.height || 0)) / 5000;
      const volDisplay = volKg < 1
        ? `${(volKg * 1000).toFixed(2)} g`
        : `${volKg.toFixed(2)} kg`;

      const actualWeightVal = parseFloat(sticker.actualWeight || 0);
      const isGrams = sticker.weightUnit === 'g' || sticker.weightUnit === 'gm';
      const actualWeightInKg = isGrams ? actualWeightVal / 1000 : actualWeightVal;

      const chargeableKg = Math.max(actualWeightInKg, volKg);
      const chargeableDisplay =
        chargeableKg < 1
          ? `${(chargeableKg * 1000).toFixed(2)} g`
          : `${chargeableKg.toFixed(2)} kg`;

      const actualWeightDisplay =
        actualWeightInKg < 1
          ? `${(actualWeightInKg * 1000).toFixed(2)} g`
          : `${actualWeightInKg.toFixed(2)} kg`;

      allStickersHtml += `
        <div class="sticker-container">
          <div class="sticker">
            <div class="header">
              <div class="logo-placeholder">
                 ${logoUrl ? `<img src="${logoUrl}" style="  max-width: 100%;  max-height: 100%;  object-fit: contain;  filter: grayscale(100%) contrast(120%); "/>` : 'LOGO HERE'}
              </div>
              <div class="payment-badge">
                ${isCod ? `
                  <div class="payment-label" style="">COD COLLECT</div>
                  <div class="payment-amount" style="">₹${codAmount}</div>
                ` : `
                  <div class="payment-label" style="">PREPAID ORDER</div>
                `}
              </div>
            </div>
            
            <div class="body-section">
              <div class="address-box">
                
                <div class="to-section" style="flex: 1; text-align: left;  ">
                  <div class="label-small">TO:</div>
                  <div class="recipient-name">${sticker.shippingName}</div>
                  <div class="address-text">
                    ${sticker.address1 || ''}${sticker.address2 ? '<br/>' + sticker.address2 : ''}<br/>
                    ${sticker.city || ''}${sticker.province ? ', ' + sticker.province : ''} - ${sticker.zip || ''}<br/>
                    ${sticker.country || ''}<br/>
                    <strong>Phone:</strong> ${sticker.phone || 'N/A'}${sticker.email ? `<br/><strong>Email:</strong> ${sticker.email}` : ''}
                  </div>
                </div>
                <div class="order-id-section" style="text-align: left; padding-left: 5px; flex: 0 0 140px; border-left: 1px solid #eee;">
                  <div class="label-small">ORDER ID:</div>
                  <div class="order-id">${sticker.name}</div>
                  
                  <!-- Dimensions & Weight Display -->
                  <div style="margin-top: 8px; font-size: 10px; font-weight: 600; text-align: left; border-top: 1px dotted #ccc; padding-top: 4px;">
                    <div>Dead Weight : ${actualWeightDisplay}</div>
                    <div>Dimensional Weight : ${volDisplay}</div>
                    <div>Chargeable Weight : ${chargeableDisplay}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="product-section">
              <table class="product-table">
               <tr>
                  <td class="label">Items</td>
                  <td class="value">${totalItems}</td>
                </tr>
                <tr>
                  <td class="label">Qty (Packs)</td>
                  <td class="value">${totalPacks}</td>
                </tr>
                <tr>
                  <td class="label">Total Amount</td>
                  <td class="value">₹${parseFloat(sticker.total || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td class="label">Paid Amount</td>
                  <td class="value">₹${isCod ? '50.00' : parseFloat(sticker.total || 0).toFixed(2)}</td>
                </tr>
                ${isCod ? `
                <tr class="highlight-row" style="border-bottom: none;">
                  <td class="label" style="border-bottom: none;">AMOUNT TO COLLECT</td>
                  <td class="value" style="border-bottom: none;">₹${(parseFloat(sticker.total || 0) - 50).toFixed(2)}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            <div class="footer-section">
              <div class="label-small">FROM:</div>
              <div class="from-text">
                <strong>Storeview</strong> - 412, New Escon Plaza,<br/>
                Chhaprabhatha Road, Amroli,<br/>
                Surat, Gujarat - 394107<br/>
                +91 9638478118
              </div>
            </div>
          </div>
        </div>
      `;
    });

    allStickersHtml += `
        </body>
      </html>
    `;

    printWindow.document.write(allStickersHtml);
    printWindow.document.close();
    setIsEditStickerModalOpen(false);
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

  const formatAddress = (addr) => {
    if (!addr) return "No shipping address";
    const parts = [
      addr.name,
      addr.address1,
      addr.address2,
      `${addr.city}${addr.province ? `, ${addr.province}` : ""}`,
      addr.zip,
      addr.country
    ].filter(Boolean);
    return parts.join(" • ") || "No address provided";
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

      {/* Edit Sticker Modal */}
      {isEditStickerModalOpen && stickersToEdit.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsEditStickerModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Review & Edit Stickers</h2>
                <p className="text-sm text-slate-500">Edit shipping details before printing</p>
              </div>
              <button
                onClick={() => setIsEditStickerModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-8">
              {stickersToEdit.map((sticker, idx) => (
                <div key={sticker.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative">
                  <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    Sticker {idx + 1}: {sticker.name}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    {/* Dimensions & Weight Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2 border-b pb-4 mb-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Length (cm) <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          value={sticker.length}
                          onChange={(e) => handleStickerChange(sticker.id, 'length', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Width (cm) <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          value={sticker.width}
                          onChange={(e) => handleStickerChange(sticker.id, 'width', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Height (cm) <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          value={sticker.height}
                          onChange={(e) => handleStickerChange(sticker.id, 'height', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dimensional Wgt</label>
                        <div className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-semibold">
                          {(() => {
                            if (sticker.length && sticker.width && sticker.height) {
                              const volKg = (parseFloat(sticker.length) * parseFloat(sticker.width) * parseFloat(sticker.height)) / 5000;
                              return volKg < 1
                                ? `${(volKg * 1000).toFixed(0)} g`
                                : `${volKg.toFixed(2)} kg`;
                            }
                            return '-';
                          })()}
                        </div>
                      </div>
                      <div className="space-y-1 md:col-span-4">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dead Weight <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={sticker.actualWeight}
                            onChange={(e) => handleStickerChange(sticker.id, 'actualWeight', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            placeholder="0.00"
                          />
                          <select
                            value={sticker.weightUnit || 'kg'}
                            onChange={(e) => handleStickerChange(sticker.id, 'weightUnit', e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-semibold text-slate-700"
                          >
                            <option value="kg">Kg</option>
                            <option value="gm">Gm</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipient Name</label>
                      <input
                        type="text"
                        value={sticker.shippingName}
                        onChange={(e) => handleStickerChange(sticker.id, 'shippingName', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="text"
                        value={sticker.phone}
                        onChange={(e) => handleStickerChange(sticker.id, 'phone', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={sticker.email}
                        onChange={(e) => handleStickerChange(sticker.id, 'email', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address Line 1</label>
                      <input
                        type="text"
                        value={sticker.address1}
                        onChange={(e) => handleStickerChange(sticker.id, 'address1', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        value={sticker.address2}
                        onChange={(e) => handleStickerChange(sticker.id, 'address2', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                        <input
                          type="text"
                          value={sticker.city}
                          onChange={(e) => handleStickerChange(sticker.id, 'city', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Province</label>
                        <input
                          type="text"
                          value={sticker.province}
                          onChange={(e) => handleStickerChange(sticker.id, 'province', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Zip Code</label>
                        <input
                          type="text"
                          value={sticker.zip}
                          onChange={(e) => handleStickerChange(sticker.id, 'zip', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label>
                        <input
                          type="text"
                          value={sticker.country}
                          onChange={(e) => handleStickerChange(sticker.id, 'country', e.target.value)}
                        />
                      </div>
                    </div>


                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsEditStickerModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePrintAll}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-5 h-5" /> Confirm & Print All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Modal with Shipping Address & Price Breakdown */}
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
                className="cursor-pointer p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
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

                {/* Shipping Address */}
                {/* Shipping Address - Beautiful New Presentation */}
                {selectedOrder.shippingAddress && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-emerald-600 rounded-xl">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Shipping Address</h3>
                    </div>

                    <div className="space-y-4 ml-1">
                      {selectedOrder.shippingAddress.name && (
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-emerald-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Recipient</p>
                            <p className="text-lg font-bold text-slate-900">{selectedOrder.shippingAddress.name}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Address</p>
                          <p className="text-base font-medium text-slate-800 leading-relaxed max-w-2xl">
                            {selectedOrder.shippingAddress.address1}
                            {selectedOrder.shippingAddress.address2 && <><br />{selectedOrder.shippingAddress.address2}</>}
                            <br />
                            {selectedOrder.shippingAddress.city}
                            {selectedOrder.shippingAddress.province && `, ${selectedOrder.shippingAddress.province}`}
                            {selectedOrder.shippingAddress.zip && ` - ${selectedOrder.shippingAddress.zip}`}
                            <br />
                            {selectedOrder.shippingAddress.country}
                          </p>
                        </div>
                      </div>

                      {selectedOrder.shippingAddress.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Phone</p>
                            <p className="text-base font-medium text-slate-900">{selectedOrder.shippingAddress.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}


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
                              <td className="px-6 py-4 text-right text-slate-700 font-medium">₹{item.price || "0.00"}</td>
                              <td className="px-6 py-4 text-right font-bold text-blue-600 text-lg">
                                ₹{item.total || "0.00"}
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

                {/* Price Breakdown */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Price Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900">₹{selectedOrder.subtotal || "0.00"}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold text-slate-900">₹{selectedOrder.shippingCost || "0.00"}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-slate-600">Tax (Included)</span>
                      <span className="font-semibold text-slate-900">₹{selectedOrder.tax || "0.00"}</span>
                    </div>
                    {parseFloat(selectedOrder.outstanding || 0) > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-dashed border-amber-300">
                        <span className="text-amber-700 font-medium">Outstanding</span>
                        <span className="font-bold text-amber-700">₹{selectedOrder.outstanding}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-lg font-bold text-slate-900">Total Paid</span>
                      <span className="text-2xl font-bold text-blue-600">₹{selectedOrder.total || "0.00"}</span>
                    </div>
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
                onClick={() => handlePrintSticker(selectedOrder)}
                className="cursor-pointer mr-3 flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Printer className="w-5 h-5" /> Print Sticker
              </button>
              <button
                onClick={closeModal}
                className="cursor-pointer px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard - unchanged except for table */}
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
                <button onClick={() => setShowFilters(!showFilters)} className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                  <Filter className="w-5 h-5" /> Filters
                </button>
                <button onClick={fetchOrders} disabled={loading} className="cursor-pointer flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-70">
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
                <button onClick={handleOpenBulkEdit} className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                  <Printer className="w-5 h-5" /> Generate Labels
                </button>
                <button onClick={downloadExcel} className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
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

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1600px]">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedOrderIds.size === filteredOrders.length && filteredOrders.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
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
                        className={`hover:bg-blue-50 transition-all duration-200 cursor-pointer ${selectedOrderIds.has(order.id) ? 'bg-blue-50/50' : ''}`}
                        onClick={() => openOrderDetail(order)}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedOrderIds.has(order.id)}
                            onChange={() => toggleSelectOrder(order.id)}
                          />
                        </td>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePrintSticker(order); }}
                              className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                            >
                              <Printer className="w-4 h-4" /> Generate
                            </button>
                            <button
                              onClick={() => openOrderDetail(order)}
                              className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                            >
                              <Eye className="w-4 h-4" /> View
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
