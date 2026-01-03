"use client";
import { useEffect, useState } from "react";
import {
  RefreshCw,
  Download,
  ShoppingCart,
  Calendar,
  User,
  DollarSign,
  Mail,
  Phone,
  Package,
  Eye,
  X,
} from "lucide-react";

export default function AbandonedCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [filteredCheckouts, setFilteredCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [shopUrl, setShopUrl] = useState("");
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const fetchShopUrl = async () => {
    const email = getUserEmail();
    if (!email) throw new Error("User email not found");

    const res = await fetch("/api/me", {
      headers: {
        "x-user-email": email,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const data = await res.json();
    setShopUrl(data.shopUrl);
    return data.shopUrl;
  };

  const getUserEmail = () => {
    if (typeof window === "undefined") return "";

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.email || "";
    } catch (err) {
      return "";
    }
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    return url
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "")
      .trim();
  };

  const fetchCheckouts = async () => {
    try {
      setLoading(true);

      const userShopUrl = await fetchShopUrl();

      const res = await fetch(`/api/track/checkout/get?shopurl=${encodeURIComponent(userShopUrl)}`);

      if (!res.ok) throw new Error("Failed to fetch checkouts");

      const response = await res.json();

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch checkouts");
      }

      const data = response.data || [];

      const filtered = data.filter((checkout) => {
        if (!checkout.shopurl) return false;
        return normalizeUrl(checkout.shopurl) === normalizeUrl(userShopUrl);
      });

      setCheckouts(data);
      setFilteredCheckouts(filtered);
    } catch (error) {
      console.error("Error fetching checkouts:", error);
      alert("Error loading checkouts: " + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCheckouts();
  };

  const handleExportToExcel = () => {
    if (filteredCheckouts.length === 0) {
      alert("No checkouts to export");
      return;
    }

    const headers = [
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Status",
      "Items Count",
      "Subtotal",
      "Shipping",
      "Tax",
      "Total",
      "Currency",
      "Products",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredCheckouts.map((c) => {
        const customerName =
          `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
        const items = c.cart?.items || [];
        const productsInfo = items
          .map((item) => `${item.product_title || item.title || "Unknown"} (${item.quantity}x)`)
          .join("; ");

        const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
        const shipping = c.shippingLine?.price || 0;
        const tax = c.totalTax || 0;
        const total = subtotal + shipping + tax;

        return [
          new Date(c.createdAt).toLocaleString("en-IN"),
          `"${customerName}"`,
          c.customer?.email || "N/A",
          c.customer?.phone || "N/A",
          c.status || "N/A",
          c.cart?.totalQuantity || items.length || 0,
          subtotal,
          shipping,
          tax,
          total,
          c.cart?.currency || c.pricing?.currency || "INR",
          `"${productsInfo}"`,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `abandoned_checkouts_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateDraftOrder = async () => {
    if (!selectedCheckout?._id) return;

    let adminEmail = "";
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      adminEmail = user?.email || "";
    } catch (e) { }

    if (!adminEmail) {
      alert("Admin email not found. Please login again.");
      return;
    }

    try {
      setCreatingOrder(true);

      const res = await fetch("/api/shopify/create-draft-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutId: selectedCheckout._id,
          adminEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.invoiceUrl) {
        throw new Error(
          Array.isArray(data.error)
            ? data.error.map((e) => e.message).join(", ")
            : data.error || "Failed to create draft order"
        );
      }

      window.open(data.invoiceUrl, "_blank");

      setSelectedCheckout((prev) => ({
        ...prev,
        status: "invoice_sent",
        invoiceUrl: data.invoiceUrl,
      }));
    } catch (err) {
      console.error("Create draft order failed:", err);
      alert(err.message || "Unable to create draft order");
    } finally {
      setCreatingOrder(false);
    }
  };

  const calculateTotalRevenue = () => {
    return filteredCheckouts.reduce((sum, c) => {
      const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
      const shipping = c.shippingLine?.price || 0;
      const tax = c.totalTax || 0;
      return sum + subtotal + shipping + tax;
    }, 0);
  };

  const openModal = (checkout) => {
    setSelectedCheckout(checkout);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCheckout(null), 300);
  };


  // hit
  const [note, setNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);


  const handleSaveNote = async () => {
    try {
      setNoteLoading(true);

      const email = localStorage.getItem("user");

      await fetch("/api/abandoned-checkouts/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          abandonedCartId: selectedCheckout._id,
          email,
          note,
        }),
      });

      setNote("");
      fetchNotes(selectedCheckout._id); // 🔥 refresh notes
    } catch (err) {
      console.error(err);
    } finally {
      setNoteLoading(false);
    }
  };


  const fetchNotes = async (abandonedCartId) => {
    try {
      setNotesLoading(true);

      const res = await fetch(
        `/api/abandoned-checkouts/notes?abandonedCartId=${abandonedCartId}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setNotes(data.data || []);
    } catch (error) {
      console.error("Fetch notes error:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCheckout?._id) return;

    fetchNotes(selectedCheckout._id);
  }, [selectedCheckout]);



  // hit



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading checkouts...</p>
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
                Abandoned Checkouts
              </h1>
              <p className="text-gray-600">
                Track and recover abandoned shopping carts from your store
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleExportToExcel}
                disabled={filteredCheckouts.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Abandoned</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCheckouts.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Potential Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{calculateTotalRevenue().toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCheckouts.filter((c) => {
                    const today = new Date().toDateString();
                    return new Date(c.createdAt).toDateString() === today;
                  }).length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredCheckouts.filter((c) => {
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
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Checkout Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCheckouts.map((c) => {
                  const customerName =
                    `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
                  const items = c.cart?.items || [];
                  const totalQuantity =
                    c.cart?.totalQuantity ||
                    items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                  const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
                  const shipping = c.shippingLine?.price || 0;
                  const tax = c.totalTax || 0;
                  const total = subtotal + shipping + tax;
                  const currency = c.cart?.currency || c.pricing?.currency || "INR";

                  return (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {customerName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          {c.customer?.email && (
                            <a
                              href={`mailto:${c.customer.email}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              {c.customer.email}
                            </a>
                          )}
                          {c.customer?.phone && (
                            <div className="text-gray-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {c.customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === "started"
                            ? "bg-yellow-100 text-yellow-800"
                            : c.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {c.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-700">
                        {currency === "INR" ? "₹" : currency} {total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openModal(c)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 mb-6">
          {filteredCheckouts.map((c) => {
            const customerName =
              `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
            const items = c.cart?.items || [];
            const totalQuantity =
              c.cart?.totalQuantity ||
              items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
            const shipping = c.shippingLine?.price || 0;
            const tax = c.totalTax || 0;
            const total = subtotal + shipping + tax;
            const currency = c.cart?.currency || c.pricing?.currency || "INR";

            return (
              <div key={c._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{customerName}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(c.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === "started"
                      ? "bg-yellow-100 text-yellow-800"
                      : c.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {c.status || "N/A"}
                  </span>
                </div>
                <div className="text-sm font-semibold text-green-700 mb-4">
                  {currency === "INR" ? "₹" : currency}
                  {total.toLocaleString()} ({totalQuantity} items)
                </div>
                <button
                  onClick={() => openModal(c)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCheckouts.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No abandoned checkouts</h3>
            <p className="text-gray-600">Abandoned checkout data for your store will appear here</p>
          </div>
        )}

        {/* ==================== MODAL ==================== */}
        {isModalOpen && selectedCheckout && (
          <div
            className="fixed inset-0 bg-[#00000096] bg-opacity-50 z-50 overflow-y-auto"
            onClick={closeModal}
          >
            <div className="flex min-h-screen items-start justify-center p-4 pt-16 md:pt-20">
              <div
                className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8 hide-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      #{selectedCheckout._id?.slice(-8).toUpperCase() || "N/A"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(selectedCheckout.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      • India
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      Not Recovered
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Not Sent
                    </span>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Recovery Email Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 font-medium mb-3">
                      <Mail className="w-5 h-5" />
                      Email your customer this link to recover their cart
                    </div>
                    <div className="bg-white rounded border border-gray-300 p-3 flex items-center justify-between">
                      <code className="text-sm text-gray-700 break-all select-all">
                        {`${selectedCheckout.meta.url.split('/').slice(0, 3).join('/')}/recover/${selectedCheckout._id}`}
                      </code>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Send a cart recovery email
                    </button>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Checkout Details */}
                    <div className="lg:col-span-2 space-y-6">
                      <h3 className="text-lg font-medium text-gray-900">Checkout details</h3>

                      {/* Items List */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {(selectedCheckout.cart?.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.product_title || item.title}
                                className="w-16 h-16 object-cover rounded border border-gray-300"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {item.product_title || item.title || "Unknown Product"}
                              </p>
                              {item.variant_title && item.variant_title !== "Default Title" && (
                                <p className="text-sm text-gray-500 mt-1">{item.variant_title}</p>
                              )}
                              <p className="text-sm text-gray-500">SKU: {item.sku || "N/A"}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ₹{(item.price || 0).toLocaleString()} × {item.quantity || 1}
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Updated Pricing Summary - Handles Your Actual Data Structure */}
                      <div className="space-y-4 text-right pr-4">
                        <div className="flex justify-between gap-12">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            ₹{(selectedCheckout.cart?.subtotal || selectedCheckout.pricing?.subtotal?.shopMoney?.amount || selectedCheckout.pricing?.subtotal || 0).toLocaleString()}
                          </span>
                        </div>

                        {/* Shipping - Supports both normalized and raw nested format */}
                        <div className="flex justify-between gap-12">
                          <span className="text-gray-600">Shipping</span>

                          <span className="font-medium">
                            {selectedCheckout.shippingLine ? (
                              selectedCheckout.shippingLine.price === 0 ? (
                                <span className="text-green-600 font-bold text-lg">Free</span>
                              ) : (
                                <>
                                  ₹{Number(selectedCheckout.shippingLine.price).toLocaleString()}
                                </>
                              )
                            ) : selectedCheckout.pricing?.shipping ? (
                              Number(selectedCheckout.pricing.shipping.price) === 0 ? (
                                <span className="text-green-600 font-bold text-lg">Free</span>
                              ) : (
                                <>
                                  ₹{Number(selectedCheckout.pricing.shipping.price).toLocaleString()}
                                  <span className="text-sm text-gray-500 ml-2">
                                    ({selectedCheckout.pricing.shipping.title || "Standard"})
                                  </span>
                                </>
                              )
                            ) : (
                              <span className="text-gray-500 italic">Not selected yet</span>
                            )}
                          </span>
                        </div>


                        {/* Taxes - Supports both totalTax and nested pricing.tax */}
                        <div className="flex justify-between gap-12">
                          <span className="text-gray-600">Taxes (included)</span>

                          <span className="font-medium opacity-50">
                            {selectedCheckout.pricing?.tax?.amount > 0 &&
                              selectedCheckout.cart?.totalQuantity > 0 ? (
                              <>
                                ₹
                                {(
                                  Number(selectedCheckout.pricing.tax.amount) *
                                  Number(selectedCheckout.cart.totalQuantity)
                                ).toLocaleString()}
                              </>
                            ) : (
                              <span className="text-gray-500 italic">
                                Calculated at checkout
                              </span>
                            )}
                          </span>
                        </div>



                        {/* Total - Uses best available data */}
                        {(() => {
                          const subtotal = Number(
                            selectedCheckout.cart?.subtotal ||
                            selectedCheckout.pricing?.subtotal?.shopMoney?.amount ||
                            selectedCheckout.pricing?.subtotal ||
                            0
                          );

                          const shipping = Number(
                            selectedCheckout.shippingLine?.price ||
                            parseFloat(selectedCheckout.pricing?.shipping?.price?.amount || 0)
                          );

                          const tax = Number(
                            selectedCheckout.totalTax ||
                            parseFloat(selectedCheckout.pricing?.tax?.shopMoney?.amount || 0)
                          );

                          const total = subtotal + shipping + tax;

                          return (
                            <>
                              <div className="flex justify-end gap-12 border-t-2 border-gray-400 pt-4">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-2xl text-green-700">
                                  ₹{total.toLocaleString()}
                                </span>
                              </div>

                              <div className="flex justify-end gap-12 text-green-700 font-semibold mt-2">
                                <span>To be paid by customer</span>
                                <span className="text-xl">₹{total.toLocaleString()}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="space-y-2 mt-3">
                        {notesLoading && (
                          <p className="text-sm text-gray-400">Loading notes...</p>
                        )}

                        {!notesLoading && notes.length === 0 && (
                          <p className="text-sm text-gray-400">No notes added yet</p>
                        )}

                        {notes.map((n) => (
                          <div
                            key={n._id}
                            className="bg-blue-50 border border-blue-100 shadow-xl rounded-md p-2"
                          >
                            <p className="text-sm text-gray-800">{n.note}</p>

                            <div className="flex justify-between items-center mt-1">
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">Notes added by:</span>{" "}
                                {(() => {
                                  try {
                                    const parsed = typeof n.email === "string" ? JSON.parse(n.email) : n.email;
                                    return parsed?.email || "Unknown";
                                  } catch {
                                    return n.email; // fallback if already plain email
                                  }
                                })()}
                              </p>

                              <p className="text-xs text-gray-400">
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>



                    </div>

                    {/* Right: Customer Info */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="font-medium text-gray-900">
                            {`${selectedCheckout.customer?.firstName || ""} ${selectedCheckout.customer?.lastName || ""
                              }`.trim() || "Guest Customer"}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">No orders</p>

                          <div className="mt-4 space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Contact information</p>
                              <a
                                href={`mailto:${selectedCheckout.customer?.email}`}
                                className="text-sm text-blue-600 hover:underline block"
                              >
                                {selectedCheckout.customer?.email || "N/A"}
                              </a>
                              <p className="text-xs text-gray-500 mt-1">No account</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium text-gray-700">Shipping address</p>

                              <p className="text-sm text-gray-900 leading-relaxed">
                                {(selectedCheckout.address?.firstName ||
                                  selectedCheckout.customer?.firstName ||
                                  "")}{" "}
                                {(selectedCheckout.address?.lastName ||
                                  selectedCheckout.customer?.lastName ||
                                  "")}
                                <br />

                                {selectedCheckout.address?.address1 || "N/A"}
                                <br />

                                {selectedCheckout.address?.city || "N/A"}{" "}
                                {selectedCheckout.address?.province || ""}
                                <br />

                                India
                                {selectedCheckout.address?.zip
                                  ? ` - ${selectedCheckout.address.zip}`
                                  : ""}
                              </p>
                            </div>


                            <div>
                              <p className="text-sm font-medium text-gray-700">Billing address</p>
                              <p className="text-sm text-gray-600">Same as shipping address</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Marketing & Notes */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Marketing</h4>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="radio" checked disabled className="text-blue-600" />
                            Email not subscribed
                          </label>
                          <label className="flex items-center gap-2 text-sm mt-2">
                            <input type="radio" checked disabled className="text-blue-600" />
                            SMS not subscribed
                          </label>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                          <textarea
                            placeholder="Add a note to this checkout"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                            rows="3"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>

                        <button
                          onClick={handleSaveNote}
                          disabled={noteLoading}
                          className="w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium disabled:opacity-50"
                        >
                          {noteLoading ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>




                {/* Sticky Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
                  <button
                    onClick={handleCreateDraftOrder}
                    disabled={creatingOrder || selectedCheckout.status === "completed"}
                    className={`px-8 py-3 rounded font-medium flex items-center gap-2 transition-colors ${creatingOrder
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                  >
                    {creatingOrder ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <style>{`
/* Hide scrollbar but allow scrolling */
.hide-scrollbar {
  scrollbar-width: none;          /* Firefox */
  -ms-overflow-style: none;       /* IE & Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;                  /* Chrome, Safari */
}

          `}</style>
      </div>
    </div>
  );
}
// "use client";
// import { useEffect, useState } from "react";
// import {
//   RefreshCw,
//   Download,
//   ShoppingCart,
//   Calendar,
//   User,
//   DollarSign,
//   Mail,
//   Phone,
//   Package,
//   Eye,
//   X,
// } from "lucide-react";

// export default function AbandonedCheckouts() {
//   const [checkouts, setCheckouts] = useState([]);
//   const [filteredCheckouts, setFilteredCheckouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [shopUrl, setShopUrl] = useState("");
//   const [selectedCheckout, setSelectedCheckout] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [creatingOrder, setCreatingOrder] = useState(false);

//   const fetchShopUrl = async () => {
//     const email = getUserEmail();
//     if (!email) throw new Error("User email not found");

//     const res = await fetch("/api/me", {
//       headers: {
//         "x-user-email": email,
//       },
//     });

//     if (!res.ok) throw new Error("Failed to fetch user");

//     const data = await res.json();
//     setShopUrl(data.shopUrl);
//     return data.shopUrl;
//   };

//   const getUserEmail = () => {
//     if (typeof window === "undefined") return "";

//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       return user?.email || "";
//     } catch (err) {
//       return "";
//     }
//   };

//   const normalizeUrl = (url) => {
//     if (!url) return "";
//     return url
//       .toLowerCase()
//       .replace(/^https?:\/\//, "")
//       .replace(/^www\./, "")
//       .replace(/\/$/, "")
//       .trim();
//   };

//   const fetchCheckouts = async () => {
//     try {
//       setLoading(true);

//       const userShopUrl = await fetchShopUrl();

//       const res = await fetch(`/api/track/checkout/get?shopurl=${encodeURIComponent(userShopUrl)}`);

//       if (!res.ok) throw new Error("Failed to fetch checkouts");

//       const response = await res.json();

//       if (!response.success) {
//         throw new Error(response.error || "Failed to fetch checkouts");
//       }

//       const data = response.data || [];

//       const filtered = data.filter((checkout) => {
//         if (!checkout.shopurl) return false;
//         return normalizeUrl(checkout.shopurl) === normalizeUrl(userShopUrl);
//       });

//       setCheckouts(data);
//       setFilteredCheckouts(filtered);
//     } catch (error) {
//       console.error("Error fetching checkouts:", error);
//       alert("Error loading checkouts: " + error.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchCheckouts();
//   }, []);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchCheckouts();
//   };

//   const handleExportToExcel = () => {
//     if (filteredCheckouts.length === 0) {
//       alert("No checkouts to export");
//       return;
//     }

//     const headers = [
//       "Date",
//       "Customer Name",
//       "Email",
//       "Phone",
//       "Status",
//       "Items Count",
//       "Subtotal",
//       "Currency",
//       "Products",
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...filteredCheckouts.map((c) => {
//         const customerName =
//           `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
//         const items = c.cart?.items || [];
//         const productsInfo = items
//           .map((item) => `${item.product_title || item.title || "Unknown"} (${item.quantity}x)`)
//           .join("; ");

//         return [
//           new Date(c.createdAt).toLocaleString("en-IN"),
//           `"${customerName}"`,
//           c.customer?.email || "N/A",
//           c.customer?.phone || "N/A",
//           c.status || "N/A",
//           c.cart?.totalQuantity || items.length || 0,
//           c.cart?.subtotal || c.pricing?.subtotal || 0,
//           c.cart?.currency || c.pricing?.currency || "INR",
//           `"${productsInfo}"`,
//         ].join(",");
//       }),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `abandoned_checkouts_${new Date().toISOString().split("T")[0]}.csv`);
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleCreateDraftOrder = async () => {
//     if (!selectedCheckout?._id) return;

//     let adminEmail = "";
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       adminEmail = user?.email || "";
//     } catch (e) { }

//     if (!adminEmail) {
//       alert("Admin email not found. Please login again.");
//       return;
//     }

//     try {
//       setCreatingOrder(true);

//       const res = await fetch("/api/shopify/create-draft-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           checkoutId: selectedCheckout._id,
//           adminEmail,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.invoiceUrl) {
//         throw new Error(
//           Array.isArray(data.error)
//             ? data.error.map((e) => e.message).join(", ")
//             : data.error || "Failed to create draft order"
//         );
//       }

//       window.open(data.invoiceUrl, "_blank");

//       setSelectedCheckout((prev) => ({
//         ...prev,
//         status: "invoice_sent",
//         invoiceUrl: data.invoiceUrl,
//       }));
//     } catch (err) {
//       console.error("Create draft order failed:", err);
//       alert(err.message || "Unable to create draft order");
//     } finally {
//       setCreatingOrder(false);
//     }
//   };

//   const calculateTotalRevenue = () => {
//     return filteredCheckouts.reduce((sum, c) => {
//       const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
//       const shipping = c.shippingLine?.price || 0;
//       const tax = c.totalTax || 0;
//       return sum + subtotal + shipping + tax;
//     }, 0);
//   };

//   const openModal = (checkout) => {
//     setSelectedCheckout(checkout);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelectedCheckout(null), 300);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading checkouts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                 Abandoned Checkouts
//               </h1>
//               <p className="text-gray-600">
//                 Track and recover abandoned shopping carts from your store
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
//                 <span className="hidden sm:inline">Refresh</span>
//               </button>

//               <button
//                 onClick={handleExportToExcel}
//                 disabled={filteredCheckouts.length === 0}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Download className="w-4 h-4" />
//                 <span className="hidden sm:inline">Export CSV</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards - Updated to include shipping + tax in potential revenue */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Total Abandoned</p>
//                 <p className="text-2xl font-bold text-gray-900">{filteredCheckouts.length}</p>
//               </div>
//               <div className="bg-red-100 p-3 rounded-lg">
//                 <ShoppingCart className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Potential Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₹{calculateTotalRevenue().toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Today</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredCheckouts.filter((c) => {
//                     const today = new Date().toDateString();
//                     return new Date(c.createdAt).toDateString() === today;
//                   }).length}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">This Week</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredCheckouts.filter((c) => {
//                     const weekAgo = new Date();
//                     weekAgo.setDate(weekAgo.getDate() - 7);
//                     return new Date(c.createdAt) >= weekAgo;
//                   }).length}
//                 </p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <User className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Table */}
//         <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden mb-6">
//           <table className="w-full">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredCheckouts.map((c) => {
//                 const customerName =
//                   `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
//                 const items = c.cart?.items || [];
//                 const totalQuantity =
//                   c.cart?.totalQuantity ||
//                   items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//                 const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
//                 const shipping = c.shippingLine?.price || 0;
//                 const tax = c.totalTax || 0;
//                 const total = subtotal + shipping + tax;
//                 const currency = c.cart?.currency || c.pricing?.currency || "INR";

//                 return (
//                   <tr key={c._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                       {new Date(c.createdAt).toLocaleString("en-IN", {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                       {customerName}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <div className="space-y-1">
//                         {c.customer?.email && (
//                           <a
//                             href={`mailto:${c.customer.email}`}
//                             className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
//                           >
//                             <Mail className="w-3 h-3" />
//                             {c.customer.email}
//                           </a>
//                         )}
//                         {c.customer?.phone && (
//                           <div className="text-gray-600 flex items-center gap-1">
//                             <Phone className="w-3 h-3" />
//                             {c.customer.phone}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                           c.status === "started"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : c.status === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {c.status || "N/A"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
//                       {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-bold text-green-700">
//                       {currency === "INR" ? "₹" : currency} {total.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => openModal(c)}
//                         className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile Cards */}
//         <div className="lg:hidden space-y-4 mb-6">
//           {filteredCheckouts.map((c) => {
//             const customerName =
//               `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
//             const items = c.cart?.items || [];
//             const totalQuantity =
//               c.cart?.totalQuantity ||
//               items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//             const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
//             const shipping = c.shippingLine?.price || 0;
//             const tax = c.totalTax || 0;
//             const total = subtotal + shipping + tax;
//             const currency = c.cart?.currency || c.pricing?.currency || "INR";

//             return (
//               <div key={c._id} className="bg-white rounded-lg shadow-sm p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{customerName}</h3>
//                     <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
//                       <Calendar className="w-4 h-4" />
//                       {new Date(c.createdAt).toLocaleDateString("en-IN")}
//                     </p>
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                       c.status === "started"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : c.status === "completed"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {c.status || "N/A"}
//                   </span>
//                 </div>
//                 <div className="text-sm font-semibold text-green-700 mb-4">
//                   {currency === "INR" ? "₹" : currency}
//                   {total.toLocaleString()} ({totalQuantity} items)
//                 </div>
//                 <button
//                   onClick={() => openModal(c)}
//                   className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//                 >
//                   View Details
//                 </button>
//               </div>
//             );
//           })}
//         </div>

//         {/* Empty State */}
//         {filteredCheckouts.length === 0 && !loading && (
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No abandoned checkouts</h3>
//             <p className="text-gray-600">Abandoned checkout data for your store will appear here</p>
//           </div>
//         )}

//         {/* ==================== MODAL ==================== */}
//         {isModalOpen && selectedCheckout && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
//             onClick={closeModal}
//           >
//             <div className="flex min-h-screen items-start justify-center p-4 pt-16 md:pt-20">
//               <div
//                 className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Sticky Header */}
//                 <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900">
//                       #{selectedCheckout._id?.slice(-8).toUpperCase() || "N/A"}
//                     </h2>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {new Date(selectedCheckout.createdAt).toLocaleString("en-IN", {
//                         day: "numeric",
//                         month: "long",
//                         year: "numeric",
//                         hour: "numeric",
//                         minute: "2-digit",
//                       })}{" "}
//                       • India
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
//                       Not Recovered
//                     </span>
//                     <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
//                       Not Sent
//                     </span>
//                     <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
//                       <X className="w-6 h-6" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="p-6 space-y-6">
//                   {/* Recovery Email Section */}
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-center gap-2 text-blue-800 font-medium mb-3">
//                       <Mail className="w-5 h-5" />
//                       Email your customer this link to recover their cart
//                     </div>
//                     <div className="bg-white rounded border border-gray-300 p-3 flex items-center justify-between">
//                       <code className="text-sm text-gray-700 break-all select-all">
//                         {`${selectedCheckout.meta.url.split('/').slice(0, 3).join('/')}/recover/${selectedCheckout._id}`}
//                       </code>
//                     </div>
//                     <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
//                       Send a cart recovery email
//                     </button>
//                   </div>

//                   {/* Main Content Grid */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left: Checkout Details */}
//                     <div className="lg:col-span-2 space-y-6">
//                       <h3 className="text-lg font-medium text-gray-900">Checkout details</h3>

//                       {/* Items List */}
//                       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                         {(selectedCheckout.cart?.items || []).map((item, idx) => (
//                           <div
//                             key={idx}
//                             className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0"
//                           >
//                             {item.image ? (
//                               <img
//                                 src={item.image}
//                                 alt={item.product_title || item.title}
//                                 className="w-16 h-16 object-cover rounded border border-gray-300"
//                               />
//                             ) : (
//                               <div className="w-16 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
//                                 <Package className="w-8 h-8 text-gray-400" />
//                               </div>
//                             )}
//                             <div className="flex-1">
//                               <p className="font-medium text-gray-900">
//                                 {item.product_title || item.title || "Unknown Product"}
//                               </p>
//                               {item.variant_title && item.variant_title !== "Default Title" && (
//                                 <p className="text-sm text-gray-500 mt-1">{item.variant_title}</p>
//                               )}
//                               <p className="text-sm text-gray-500">SKU: {item.sku || "N/A"}</p>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-medium">
//                                 ₹{(item.price || 0).toLocaleString()} × {item.quantity || 1}
//                               </p>
//                               <p className="text-lg font-semibold text-gray-900">
//                                 ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Updated Pricing Summary - Dynamic */}
//                       <div className="space-y-3 text-right pr-4">
//                         <div className="flex justify-end gap-12">
//                           <span className="text-gray-600">Subtotal</span>
//                           <span className="font-medium">
//                             ₹{(selectedCheckout.cart?.subtotal || selectedCheckout.pricing?.subtotal || 0).toLocaleString()}
//                           </span>
//                         </div>

//                         <div className="flex justify-end gap-12">
//                           <span className="text-gray-600">Shipping</span>
//                           <span className="font-medium">
//                             {selectedCheckout.shippingLine ? (
//                               <>₹{(selectedCheckout.shippingLine.price || 0).toLocaleString()}</>
//                             ) : (
//                               <span className="text-gray-500 italic">Not selected yet</span>
//                             )}
//                           </span>
//                         </div>

//                         <div className="flex justify-end gap-12">
//                           <span className="text-gray-600">Taxes</span>
//                           <span className="font-medium">
//                             {selectedCheckout.totalTax > 0 ? (
//                               <>₹{(selectedCheckout.totalTax || 0).toLocaleString()}</>
//                             ) : (
//                               <span className="text-gray-500 italic">Calculated at checkout</span>
//                             )}
//                           </span>
//                         </div>

//                         {(() => {
//                           const subtotal = selectedCheckout.cart?.subtotal || selectedCheckout.pricing?.subtotal || 0;
//                           const shipping = selectedCheckout.shippingLine?.price || 0;
//                           const tax = selectedCheckout.totalTax || 0;
//                           const total = subtotal + shipping + tax;

//                           return (
//                             <>
//                               <div className="flex justify-end gap-12 border-t-2 border-gray-400 pt-3">
//                                 <span className="font-bold text-lg">Total</span>
//                                 <span className="font-bold text-xl text-green-700">
//                                   ₹{total.toLocaleString()}
//                                 </span>
//                               </div>

//                               <div className="flex justify-end gap-12 text-green-700 font-semibold">
//                                 <span>To be paid by customer</span>
//                                 <span>₹{total.toLocaleString()}</span>
//                               </div>
//                             </>
//                           );
//                         })()}
//                       </div>
//                     </div>

//                     {/* Right: Customer Info */}
//                     <div className="space-y-6">
//                       <div>
//                         <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
//                         <div className="bg-white border border-gray-200 rounded-lg p-4">
//                           <p className="font-medium text-gray-900">
//                             {`${selectedCheckout.customer?.firstName || ""} ${selectedCheckout.customer?.lastName || ""
//                               }`.trim() || "Guest Customer"}
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">No orders</p>

//                           <div className="mt-4 space-y-4">
//                             <div>
//                               <p className="text-sm font-medium text-gray-700">Contact information</p>
//                               <a
//                                 href={`mailto:${selectedCheckout.customer?.email}`}
//                                 className="text-sm text-blue-600 hover:underline block"
//                               >
//                                 {selectedCheckout.customer?.email || "N/A"}
//                               </a>
//                               <p className="text-xs text-gray-500 mt-1">No account</p>
//                             </div>

//                             <div>
//                               <p className="text-sm font-medium text-gray-700">Shipping address</p>
//                               <p className="text-sm text-gray-900 leading-relaxed">
//                                 {selectedCheckout.customer?.firstName || ""}{" "}
//                                 {selectedCheckout.customer?.lastName || ""}
//                                 <br />
//                                 {selectedCheckout.shippingAddress?.address1 || "N/A"}
//                                 <br />
//                                 {selectedCheckout.shippingAddress?.city || "N/A"}{" "}
//                                 {selectedCheckout.shippingAddress?.province || ""}
//                                 <br />
//                                 India
//                               </p>
//                             </div>

//                             <div>
//                               <p className="text-sm font-medium text-gray-700">Billing address</p>
//                               <p className="text-sm text-gray-600">Same as shipping address</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Marketing & Notes */}
//                       <div className="space-y-4">
//                         <div>
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">Marketing</h4>
//                           <label className="flex items-center gap-2 text-sm">
//                             <input type="radio" checked disabled className="text-blue-600" />
//                             Email not subscribed
//                           </label>
//                           <label className="flex items-center gap-2 text-sm mt-2">
//                             <input type="radio" checked disabled className="text-blue-600" />
//                             SMS not subscribed
//                           </label>
//                         </div>

//                         <div>
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
//                           <textarea
//                             placeholder="Add a note to this checkout"
//                             className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
//                             rows="3"
//                           />
//                         </div>

//                         <button className="w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium">
//                           Save
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Sticky Footer */}
//                 <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
//                   <button
//                     onClick={handleCreateDraftOrder}
//                     disabled={creatingOrder || selectedCheckout.status === "completed"}
//                     className={`px-8 py-3 rounded font-medium flex items-center gap-2 transition-colors ${
//                       creatingOrder
//                         ? "bg-gray-400 text-white cursor-not-allowed"
//                         : "bg-green-600 hover:bg-green-700 text-white"
//                     }`}
//                   >
//                     {creatingOrder ? (
//                       <>
//                         <RefreshCw className="w-5 h-5 animate-spin" />
//                         Creating Order...
//                       </>
//                     ) : (
//                       <>
//                         <ShoppingCart className="w-5 h-5" />
//                         Place Order
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";
// import {
//   RefreshCw,
//   Download,
//   ShoppingCart,
//   Calendar,
//   User,
//   DollarSign,
//   Mail,
//   Phone,
//   Package,
//   Eye,
//   X,
// } from "lucide-react";

// export default function AbandonedCheckouts() {
//   const [checkouts, setCheckouts] = useState([]);
//   const [filteredCheckouts, setFilteredCheckouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [shopUrl, setShopUrl] = useState("");
//   const [selectedCheckout, setSelectedCheckout] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [creatingOrder, setCreatingOrder] = useState(false);

//   const fetchShopUrl = async () => {
//     const email = getUserEmail();
//     if (!email) throw new Error("User email not found");

//     const res = await fetch("/api/me", {
//       headers: {
//         "x-user-email": email,
//       },
//     });

//     if (!res.ok) throw new Error("Failed to fetch user");

//     const data = await res.json();
//     setShopUrl(data.shopUrl);
//     return data.shopUrl;
//   };

//   const getUserEmail = () => {
//     if (typeof window === "undefined") return "";

//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       return user?.email || "";
//     } catch (err) {
//       return "";
//     }
//   };

//   const normalizeUrl = (url) => {
//     if (!url) return "";
//     return url
//       .toLowerCase()
//       .replace(/^https?:\/\//, "")
//       .replace(/^www\./, "")
//       .replace(/\/$/, "")
//       .trim();
//   };

//   const fetchCheckouts = async () => {
//     try {
//       setLoading(true);

//       const userShopUrl = await fetchShopUrl();

//       const res = await fetch(`/api/track/checkout/get?shopurl=${encodeURIComponent(userShopUrl)}`);

//       if (!res.ok) throw new Error("Failed to fetch checkouts");

//       const response = await res.json();

//       if (!response.success) {
//         throw new Error(response.error || "Failed to fetch checkouts");
//       }

//       const data = response.data || [];

//       const filtered = data.filter((checkout) => {
//         if (!checkout.shopurl) return false;
//         return normalizeUrl(checkout.shopurl) === normalizeUrl(userShopUrl);
//       });

//       setCheckouts(data);
//       setFilteredCheckouts(filtered);
//     } catch (error) {
//       console.error("Error fetching checkouts:", error);
//       alert("Error loading checkouts: " + error.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchCheckouts();
//   }, []);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchCheckouts();
//   };

//   const handleExportToExcel = () => {
//     if (filteredCheckouts.length === 0) {
//       alert("No checkouts to export");
//       return;
//     }

//     const headers = [
//       "Date",
//       "Customer Name",
//       "Email",
//       "Phone",
//       "Status",
//       "Items Count",
//       "Subtotal",
//       "Currency",
//       "Products",
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...filteredCheckouts.map((c) => {
//         const customerName =
//           `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
//         const items = c.cart?.items || [];
//         const productsInfo = items
//           .map((item) => `${item.product_title || item.title || "Unknown"} (${item.quantity}x)`)
//           .join("; ");

//         return [
//           new Date(c.createdAt).toLocaleString("en-IN"),
//           `"${customerName}"`,
//           c.customer?.email || "N/A",
//           c.customer?.phone || "N/A",
//           c.status || "N/A",
//           c.cart?.totalQuantity || items.length || 0,
//           c.cart?.subtotal || c.pricing?.subtotal || 0,
//           c.cart?.currency || c.pricing?.currency || "INR",
//           `"${productsInfo}"`,
//         ].join(",");
//       }),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `abandoned_checkouts_${new Date().toISOString().split("T")[0]}.csv`);
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleCreateDraftOrder = async () => {
//     if (!selectedCheckout?._id) return;

//     let adminEmail = "";
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       adminEmail = user?.email || "";
//     } catch (e) { }

//     if (!adminEmail) {
//       alert("Admin email not found. Please login again.");
//       return;
//     }

//     try {
//       setCreatingOrder(true);

//       const res = await fetch("/api/shopify/create-draft-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           checkoutId: selectedCheckout._id,
//           adminEmail,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.invoiceUrl) {
//         throw new Error(
//           Array.isArray(data.error)
//             ? data.error.map((e) => e.message).join(", ")
//             : data.error || "Failed to create draft order"
//         );
//       }

//       window.open(data.invoiceUrl, "_blank");

//       setSelectedCheckout((prev) => ({
//         ...prev,
//         status: "invoice_sent",
//         invoiceUrl: data.invoiceUrl,
//       }));
//     } catch (err) {
//       console.error("Create draft order failed:", err);
//       alert(err.message || "Unable to create draft order");
//     } finally {
//       setCreatingOrder(false);
//     }
//   };

//   const calculateTotalRevenue = () => {
//     return filteredCheckouts.reduce((sum, c) => {
//       return sum + (c.cart?.subtotal || c.pricing?.subtotal || 0);
//     }, 0);
//   };

//   const openModal = (checkout) => {
//     setSelectedCheckout(checkout);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelectedCheckout(null), 300);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading checkouts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                 Abandoned Checkouts
//               </h1>
//               <p className="text-gray-600">
//                 Track and recover abandoned shopping carts from your store
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
//                 <span className="hidden sm:inline">Refresh</span>
//               </button>

//               <button
//                 onClick={handleExportToExcel}
//                 disabled={filteredCheckouts.length === 0}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Download className="w-4 h-4" />
//                 <span className="hidden sm:inline">Export CSV</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Total Abandoned</p>
//                 <p className="text-2xl font-bold text-gray-900">{filteredCheckouts.length}</p>
//               </div>
//               <div className="bg-red-100 p-3 rounded-lg">
//                 <ShoppingCart className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Potential Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₹{calculateTotalRevenue().toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Today</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredCheckouts.filter((c) => {
//                     const today = new Date().toDateString();
//                     return new Date(c.createdAt).toDateString() === today;
//                   }).length}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">This Week</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredCheckouts.filter((c) => {
//                     const weekAgo = new Date();
//                     weekAgo.setDate(weekAgo.getDate() - 7);
//                     return new Date(c.createdAt) >= weekAgo;
//                   }).length}
//                 </p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <User className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Table */}
//         <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden mb-6">
//           <table className="w-full">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Contact</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
//                 <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
//                 <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredCheckouts.map((c) => {
//                 const customerName =
//                   `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
//                 const items = c.cart?.items || [];
//                 const totalQuantity =
//                   c.cart?.totalQuantity ||
//                   items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//                 const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
//                 const currency = c.cart?.currency || c.pricing?.currency || "INR";

//                 return (
//                   <tr key={c._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                       {new Date(c.createdAt).toLocaleString("en-IN", {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                       {customerName}
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <div className="space-y-1">
//                         {c.customer?.email && (
//                           <a
//                             href={`mailto:${c.customer.email}`}
//                             className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
//                           >
//                             <Mail className="w-3 h-3" />
//                             {c.customer.email}
//                           </a>
//                         )}
//                         {c.customer?.phone && (
//                           <div className="text-gray-600 flex items-center gap-1">
//                             <Phone className="w-3 h-3" />
//                             {c.customer.phone}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === "started"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : c.status === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-gray-100 text-gray-800"
//                           }`}
//                       >
//                         {c.status || "N/A"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
//                       {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-bold text-green-700">
//                       {currency === "INR" ? "₹" : currency} {subtotal.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => openModal(c)}
//                         className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile Cards */}
//         <div className="lg:hidden space-y-4 mb-6">
//           {filteredCheckouts.map((c) => {
//             const customerName =
//               `${c.customer?.firstName || ""} ${c.customer?.lastName || ""}`.trim() || "N/A";
//             const items = c.cart?.items || [];
//             const totalQuantity =
//               c.cart?.totalQuantity ||
//               items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//             const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
//             const currency = c.cart?.currency || c.pricing?.currency || "INR";

//             return (
//               <div key={c._id} className="bg-white rounded-lg shadow-sm p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{customerName}</h3>
//                     <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
//                       <Calendar className="w-4 h-4" />
//                       {new Date(c.createdAt).toLocaleDateString("en-IN")}
//                     </p>
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-semibold ${c.status === "started"
//                       ? "bg-yellow-100 text-yellow-800"
//                       : c.status === "completed"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                       }`}
//                   >
//                     {c.status || "N/A"}
//                   </span>
//                 </div>
//                 <div className="text-sm font-semibold text-green-700 mb-4">
//                   {currency === "INR" ? "₹" : currency}
//                   {subtotal.toLocaleString()} ({totalQuantity} items)
//                 </div>
//                 <button
//                   onClick={() => openModal(c)}
//                   className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//                 >
//                   View Details
//                 </button>
//               </div>
//             );
//           })}
//         </div>

//         {/* Empty State */}
//         {filteredCheckouts.length === 0 && !loading && (
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No abandoned checkouts</h3>
//             <p className="text-gray-600">Abandoned checkout data for your store will appear here</p>
//           </div>
//         )}

//         {/* ==================== FIXED MODAL ==================== */}
//         {isModalOpen && selectedCheckout && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto"
//             onClick={closeModal}
//           >
//             <div className="flex min-h-screen items-start justify-center p-4 pt-16 md:pt-20">
//               <div
//                 className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Sticky Header */}
//                 <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-900">
//                       #{selectedCheckout._id?.slice(-8).toUpperCase() || "N/A"}
//                     </h2>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {new Date(selectedCheckout.createdAt).toLocaleString("en-IN", {
//                         day: "numeric",
//                         month: "long",
//                         year: "numeric",
//                         hour: "numeric",
//                         minute: "2-digit",
//                       })}{" "}
//                       • India
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
//                       Not Recovered
//                     </span>
//                     <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
//                       Not Sent
//                     </span>
//                     <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
//                       <X className="w-6 h-6" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="p-6 space-y-6">
//                   {/* Recovery Email Section */}
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                     <div className="flex items-center gap-2 text-blue-800 font-medium mb-3">
//                       <Mail className="w-5 h-5" />
//                       Email your customer this link to recover their cart
//                     </div>
//                     <div className="bg-white rounded border border-gray-300 p-3 flex items-center justify-between">
//                       <code className="text-sm text-gray-700 break-all select-all">
//                         {`${selectedCheckout.meta.url.split('/').slice(0, 3).join('/')}/recover/${selectedCheckout._id}`}
//                       </code>
//                     </div>
//                     <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
//                       Send a cart recovery email
//                     </button>
//                   </div>

//                   {/* Main Content Grid */}
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left: Checkout Details */}
//                     <div className="lg:col-span-2 space-y-6">
//                       <h3 className="text-lg font-medium text-gray-900">Checkout details</h3>

//                       {/* Items List */}
//                       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                         {(selectedCheckout.cart?.items || []).map((item, idx) => (
//                           <div
//                             key={idx}
//                             className="flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0"
//                           >
//                             {item.image ? (
//                               <img
//                                 src={item.image}
//                                 alt={item.product_title || item.title}
//                                 className="w-16 h-16 object-cover rounded border border-gray-300"
//                               />
//                             ) : (
//                               <div className="w-16 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
//                                 <Package className="w-8 h-8 text-gray-400" />
//                               </div>
//                             )}
//                             <div className="flex-1">
//                               <p className="font-medium text-gray-900">
//                                 {item.product_title || item.title || "Unknown Product"}
//                               </p>
//                               {item.variant_title && item.variant_title !== "Default Title" && (
//                                 <p className="text-sm text-gray-500 mt-1">{item.variant_title}</p>
//                               )}
//                               <p className="text-sm text-gray-500">SKU: {item.sku || "N/A"}</p>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-medium">
//                                 ₹{(item.price || 0).toLocaleString()} × {item.quantity || 1}
//                               </p>
//                               <p className="text-lg font-semibold text-gray-900">
//                                 ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {/* Pricing Summary */}
//                       <div className="space-y-2 text-right pr-4">
//                         <div className="flex justify-end gap-12">
//                           <span className="text-gray-600">Subtotal</span>
//                           <span className="font-medium">
//                             ₹{(selectedCheckout.cart?.subtotal || 0).toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex justify-end gap-12">
//                           <span className="text-gray-600">Shipping</span>
//                           <span className="font-medium">₹0.00</span>
//                         </div>
//                         <div className="flex justify-end gap-12">
//                           <span className="text-gray-600">Estimated tax</span>
//                           <span className="font-medium">₹2.00</span>
//                         </div>
//                         <div className="flex justify-end gap-12 border-t border-gray-300 pt-2">
//                           <span className="font-semibold text-lg">Total</span>
//                           <span className="font-bold text-lg">
//                             ₹{(selectedCheckout.cart?.subtotal || 0) + 2}
//                           </span>
//                         </div>
//                         <div className="flex justify-end gap-12 text-green-700 font-semibold">
//                           <span>To be paid by customer</span>
//                           <span>₹{(selectedCheckout.cart?.subtotal || 0) + 2}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Right: Customer Info */}
//                     <div className="space-y-6">
//                       <div>
//                         <h3 className="text-lg font-medium text-gray-900 mb-4">Customer</h3>
//                         <div className="bg-white border border-gray-200 rounded-lg p-4">
//                           <p className="font-medium text-gray-900">
//                             {`${selectedCheckout.customer?.firstName || ""} ${selectedCheckout.customer?.lastName || ""
//                               }`.trim() || "Guest Customer"}
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">No orders</p>

//                           <div className="mt-4 space-y-4">
//                             <div>
//                               <p className="text-sm font-medium text-gray-700">Contact information</p>
//                               <a
//                                 href={`mailto:${selectedCheckout.customer?.email}`}
//                                 className="text-sm text-blue-600 hover:underline block"
//                               >
//                                 {selectedCheckout.customer?.email || "N/A"}
//                               </a>
//                               <p className="text-xs text-gray-500 mt-1">No account</p>
//                             </div>

//                             <div>
//                               <p className="text-sm font-medium text-gray-700">Shipping address</p>
//                               <p className="text-sm text-gray-900 leading-relaxed">
//                                 {selectedCheckout.customer?.firstName || ""}{" "}
//                                 {selectedCheckout.customer?.lastName || ""}
//                                 <br />
//                                 {selectedCheckout.shippingAddress?.address1 || "N/A"}
//                                 <br />
//                                 {selectedCheckout.shippingAddress?.city || "N/A"}{" "}
//                                 {selectedCheckout.shippingAddress?.province || ""}
//                                 <br />
//                                 India
//                               </p>
//                             </div>

//                             <div>
//                               <p className="text-sm font-medium text-gray-700">Billing address</p>
//                               <p className="text-sm text-gray-600">Same as shipping address</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Marketing & Notes */}
//                       <div className="space-y-4">
//                         <div>
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">Marketing</h4>
//                           <label className="flex items-center gap-2 text-sm">
//                             <input type="radio" checked disabled className="text-blue-600" />
//                             Email not subscribed
//                           </label>
//                           <label className="flex items-center gap-2 text-sm mt-2">
//                             <input type="radio" checked disabled className="text-blue-600" />
//                             SMS not subscribed
//                           </label>
//                         </div>

//                         <div>
//                           <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
//                           <textarea
//                             placeholder="Add a note to this checkout"
//                             className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
//                             rows="3"
//                           />
//                         </div>

//                         <button className="w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium">
//                           Save
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Sticky Footer */}
//                 <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end">
//                   <button
//                     onClick={handleCreateDraftOrder}
//                     disabled={creatingOrder || selectedCheckout.status === "completed"}
//                     className={`px-8 py-3 rounded font-medium flex items-center gap-2 transition-colors ${creatingOrder
//                       ? "bg-gray-400 text-white cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-700 text-white"
//                       }`}
//                   >
//                     {creatingOrder ? (
//                       <>
//                         <RefreshCw className="w-5 h-5 animate-spin" />
//                         Creating Order...
//                       </>
//                     ) : (
//                       <>
//                         <ShoppingCart className="w-5 h-5" />
//                         Place Order
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


















// "use client";
// import { useEffect, useState } from "react";
// import {
//   RefreshCw,
//   Download,
//   ShoppingCart,
//   Calendar,
//   User,
//   DollarSign,
//   Store,
//   Mail,
//   Phone,
//   Package,
//   Eye,
//   X,
//   Check,
//   Percent,
//   FileText,
// } from "lucide-react";

// export default function AbandonedCheckouts() {
//   const [checkouts, setCheckouts] = useState([]);
//   const [filteredCheckouts, setFilteredCheckouts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [shopUrl, setShopUrl] = useState("");
//   const [selectedCheckout, setSelectedCheckout] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [creatingOrder, setCreatingOrder] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [selectedCheckoutIds, setSelectedCheckoutIds] = useState([]);
//   const [note, setNote] = useState("");
//   const [discountCode, setDiscountCode] = useState("");

//   // Fetch the user's shop URL
//   const fetchShopUrl = async () => {
//     const email = getUserEmail();
//     if (!email) throw new Error("User email not found");
//     const res = await fetch("/api/me", {
//       headers: { "x-user-email": email },
//     });
//     if (!res.ok) throw new Error("Failed to fetch user");
//     const data = await res.json();
//     setShopUrl(data.shopUrl);
//     return data.shopUrl;
//   };

//   // Get user email from localStorage
//   const getUserEmail = () => {
//     if (typeof window === "undefined") return "";
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       return user?.email || "";
//     } catch (err) {
//       return "";
//     }
//   };

//   // Normalize URL for comparison
//   const normalizeUrl = (url) => {
//     if (!url) return "";
//     return url
//       .toLowerCase()
//       .replace(/^https?:\/\//, "")
//       .replace(/^www\./, "")
//       .replace(/\/$/, "")
//       .trim();
//   };

//   // Fetch abandoned checkouts
//   const fetchCheckouts = async () => {
//     try {
//       setLoading(true);
//       const userShopUrl = await fetchShopUrl();
//       const res = await fetch(
//         `/api/track/checkout/get?shopurl=${encodeURIComponent(userShopUrl)}`
//       );
//       if (!res.ok) throw new Error("Failed to fetch checkouts");
//       const response = await res.json();
//       if (!response.success) {
//         throw new Error(response.error || "Failed to fetch checkouts");
//       }
//       const data = response.data || [];
//       const filtered = data.filter((checkout) => {
//         if (!checkout.shopurl) return false;
//         return normalizeUrl(checkout.shopurl) === normalizeUrl(userShopUrl);
//       });
//       setCheckouts(data);
//       setFilteredCheckouts(filtered);
//     } catch (error) {
//       console.error("Error fetching checkouts:", error);
//       alert("Error loading checkouts: " + error.message);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchCheckouts();
//   }, []);

//   // Refresh checkouts
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchCheckouts();
//   };

//   // Export checkouts to CSV
//   const handleExportToExcel = () => {
//     if (filteredCheckouts.length === 0) {
//       alert("No checkouts to export");
//       return;
//     }
//     const headers = [
//       "Date",
//       "Customer Name",
//       "Email",
//       "Phone",
//       "Status",
//       "Items Count",
//       "Subtotal",
//       "Currency",
//       "Products",
//     ];
//     const csvContent = [
//       headers.join(","),
//       ...filteredCheckouts.map((c) => {
//         const customerName = `${c.customer?.firstName || ""} ${
//           c.customer?.lastName || ""
//         }`.trim() || "N/A";
//         const items = c.cart?.items || [];
//         const productsInfo = items
//           .map(
//             (item) =>
//               `${item.product_title || item.title || "Unknown"} (${
//                 item.quantity
//               }x)`
//           )
//           .join("; ");
//         return [
//           new Date(c.createdAt).toLocaleString("en-IN"),
//           `"${customerName}"`,
//           c.customer?.email || "N/A",
//           c.customer?.phone || "N/A",
//           c.status || "N/A",
//           c.cart?.totalQuantity || items.length || 0,
//           c.cart?.subtotal || c.pricing?.subtotal || 0,
//           c.cart?.currency || c.pricing?.currency || "INR",
//           `"${productsInfo}"`,
//         ].join(",");
//       }),
//     ].join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `abandoned_checkouts_${new Date().toISOString().split("T")[0]}.csv`
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Create a draft order
//   const handleCreateDraftOrder = async () => {
//     if (!selectedCheckout?._id) return;
//     let adminEmail = "";
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       adminEmail = user?.email || "";
//     } catch (e) {}
//     if (!adminEmail) {
//       alert("Admin email not found. Please login again.");
//       return;
//     }
//     try {
//       setCreatingOrder(true);
//       const res = await fetch("/api/shopify/create-draft-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           checkoutId: selectedCheckout._id,
//           adminEmail,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         let errorMessage = "Unknown error";
//         if (Array.isArray(data?.error)) {
//           errorMessage = data.error.map((e) => e.message).join(", ");
//         } else if (typeof data?.error === "string") {
//           errorMessage = data.error;
//         } else {
//           errorMessage = JSON.stringify(data);
//         }
//         throw new Error(errorMessage);
//       }
//       if (data.invoiceUrl) {
//         window.open(data.invoiceUrl, "_blank");
//       }
//       setSelectedCheckout((prev) => ({
//         ...prev,
//         status: "invoice_sent",
//         invoiceUrl: data.invoiceUrl || null,
//       }));
//     } catch (err) {
//       console.error("Create draft order failed:", err);
//       alert(err.message);
//     } finally {
//       setCreatingOrder(false);
//     }
//   };

//   // Place the order (convert draft to completed)
//   const handlePlaceOrder = async () => {
//     if (!selectedCheckout?._id) return;
//     try {
//       setCreatingOrder(true);
//       const res = await fetch("/api/shopify/complete-draft-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           checkoutId: selectedCheckout._id,
//           adminEmail: getUserEmail(),
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.error || "Failed to place order");
//       }
//       alert("Order placed successfully!");
//       setSelectedCheckout((prev) => ({
//         ...prev,
//         status: "completed",
//       }));
//     } catch (err) {
//       console.error("Place order failed:", err);
//       alert(err.message);
//     } finally {
//       setCreatingOrder(false);
//     }
//   };

//   // Calculate total potential revenue
//   const calculateTotalRevenue = () => {
//     return filteredCheckouts.reduce((sum, c) => {
//       return sum + (c.cart?.subtotal || c.pricing?.subtotal || 0);
//     }, 0);
//   };

//   // Open modal with checkout details
//   const openModal = (checkout) => {
//     setSelectedCheckout(checkout);
//     setIsModalOpen(true);
//   };

//   // Close modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelectedCheckout(null), 300);
//   };

//   // Send recovery email
//   const sendRecoveryEmail = async () => {
//     try {
//       const response = await fetch("/api/send-recovery-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: selectedCheckout.customer.email,
//           checkoutUrl: `${selectedCheckout.cart.checkoutUrl}/recover?key=${
//             selectedCheckout.token || selectedCheckout.cart.token
//           }`,
//           customerName: `${selectedCheckout.customer.firstName || ""} ${
//             selectedCheckout.customer.lastName || ""
//           }`.trim(),
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to send email");
//       alert("Recovery email sent successfully!");
//     } catch (err) {
//       alert("Failed to send email: " + err.message);
//     }
//   };

//   // Mark as recovered
//   const markAsRecovered = async () => {
//     try {
//       const response = await fetch("/api/track/checkout/update", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           checkoutId: selectedCheckout._id,
//           status: "recovered",
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to update status");
//       setSelectedCheckout((prev) => ({ ...prev, status: "recovered" }));
//       alert("Checkout marked as recovered!");
//     } catch (err) {
//       alert("Failed to update status: " + err.message);
//     }
//   };

//   // Save note
//   const saveNote = async () => {
//     try {
//       const response = await fetch("/api/track/checkout/add-note", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           checkoutId: selectedCheckout._id,
//           note,
//         }),
//       });
//       if (!response.ok) throw new Error("Failed to save note");
//       alert("Note saved!");
//       setNote("");
//     } catch (err) {
//       alert("Failed to save note: " + err.message);
//     }
//   };

//   // Apply discount
//   const applyDiscount = () => {
//     alert(`Discount code "${discountCode}" applied to this checkout!`);
//   };

//   // Filter by date
//   const filterByDate = () => {
//     const filtered = checkouts.filter((checkout) => {
//       const checkoutDate = new Date(checkout.createdAt);
//       return (
//         (!startDate || checkoutDate >= new Date(startDate)) &&
//         (!endDate || checkoutDate <= new Date(endDate))
//       );
//     });
//     setFilteredCheckouts(filtered);
//   };

//   // Toggle checkout selection
//   const toggleCheckoutSelection = (checkoutId) => {
//     setSelectedCheckoutIds((prev) =>
//       prev.includes(checkoutId)
//         ? prev.filter((id) => id !== checkoutId)
//         : [...prev, checkoutId]
//     );
//   };

//   // Send bulk recovery emails
//   const sendBulkRecoveryEmails = async () => {
//     try {
//       const response = await fetch("/api/send-bulk-recovery-emails", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ checkoutIds: selectedCheckoutIds }),
//       });
//       if (!response.ok) throw new Error("Failed to send emails");
//       alert("Bulk recovery emails sent!");
//     } catch (err) {
//       alert("Failed to send emails: " + err.message);
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading checkouts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                 Abandoned Checkouts
//               </h1>
//               <p className="text-gray-600">
//                 Track and recover abandoned shopping carts from your store
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
//                 <span className="hidden sm:inline">Refresh</span>
//               </button>
//               <button
//                 onClick={handleExportToExcel}
//                 disabled={filteredCheckouts.length === 0}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Download className="w-4 h-4" />
//                 <span className="hidden sm:inline">Export CSV</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Date Filter */}
//         <div className="flex gap-3 mb-4">
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
//           />
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
//           />
//           <button
//             onClick={filterByDate}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//           >
//             Filter
//           </button>
//           {selectedCheckoutIds.length > 0 && (
//             <button
//               onClick={sendBulkRecoveryEmails}
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
//             >
//               Send Bulk Emails
//             </button>
//           )}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Total Abandoned</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredCheckouts.length}
//                 </p>
//               </div>
//               <div className="bg-red-100 p-3 rounded-lg">
//                 <ShoppingCart className="w-6 h-6 text-red-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Potential Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₹{calculateTotalRevenue().toLocaleString()}
//                 </p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <DollarSign className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">Today</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredCheckouts.filter((c) => {
//                     const today = new Date().toDateString();
//                     return new Date(c.createdAt).toDateString() === today;
//                   }).length}
//                 </p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <Calendar className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow-sm p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm mb-1">This Week</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {filteredCheckouts.filter((c) => {
//                     const weekAgo = new Date();
//                     weekAgo.setDate(weekAgo.getDate() - 7);
//                     return new Date(c.createdAt) >= weekAgo;
//                   }).length}
//                 </p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <User className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           {/* Desktop Table */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-800 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     <input
//                       type="checkbox"
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedCheckoutIds(filteredCheckouts.map((c) => c._id));
//                         } else {
//                           setSelectedCheckoutIds([]);
//                         }
//                       }}
//                     />
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Customer
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Contact
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Items
//                   </th>
//                   <th className="px-6 py-4 text-left text-sm font-semibold">
//                     Amount
//                   </th>
//                   <th className="px-6 py-4 text-center text-sm font-semibold">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredCheckouts.map((c) => {
//                   const customerName = `${c.customer?.firstName || ""} ${
//                     c.customer?.lastName || ""
//                   }`.trim() || "N/A";
//                   const items = c.cart?.items || [];
//                   const totalQuantity =
//                     c.cart?.totalQuantity ||
//                     items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//                   const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
//                   const currency = c.cart?.currency || c.pricing?.currency || "INR";
//                   return (
//                     <tr key={c._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                         <input
//                           type="checkbox"
//                           checked={selectedCheckoutIds.includes(c._id)}
//                           onChange={() => toggleCheckoutSelection(c._id)}
//                         />
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
//                         {new Date(c.createdAt).toLocaleString("en-IN", {
//                           day: "2-digit",
//                           month: "2-digit",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                         {customerName}
//                       </td>
//                       <td className="px-6 py-4 text-sm">
//                         <div className="space-y-1">
//                           {c.customer?.email && (
//                             <a
//                               href={`mailto:${c.customer.email}`}
//                               className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
//                             >
//                               <Mail className="w-3 h-3" />
//                               {c.customer.email}
//                             </a>
//                           )}
//                           {c.customer?.phone && (
//                             <div className="text-gray-600 flex items-center gap-1">
//                               <Phone className="w-3 h-3" />
//                               {c.customer.phone}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm">
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                             c.status === "started"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : c.status === "completed"
//                               ? "bg-green-100 text-green-800"
//                               : c.status === "recovered"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {c.status || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
//                         {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
//                       </td>
//                       <td className="px-6 py-4 text-sm font-bold text-green-700">
//                         {currency === "INR" ? "₹" : currency}{" "}
//                         {subtotal.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => openModal(c)}
//                           className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                         >
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="lg:hidden divide-y divide-gray-200">
//             {filteredCheckouts.map((c) => {
//               const customerName = `${c.customer?.firstName || ""} ${
//                 c.customer?.lastName || ""
//               }`.trim() || "N/A";
//               const items = c.cart?.items || [];
//               const totalQuantity =
//                 c.cart?.totalQuantity ||
//                 items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//               const subtotal = c.cart?.subtotal || c.pricing?.subtotal || 0;
//               const currency = c.cart?.currency || c.pricing?.currency || "INR";
//               return (
//                 <div key={c._id} className="p-4 hover:bg-gray-50 transition-colors">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900 mb-1">
//                         {customerName}
//                       </h3>
//                       <p className="text-sm text-gray-600 flex items-center gap-1">
//                         <Calendar className="w-3 h-3" />
//                         {new Date(c.createdAt).toLocaleString("en-IN", {
//                           day: "2-digit",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </p>
//                     </div>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         c.status === "started"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : c.status === "completed"
//                           ? "bg-green-100 text-green-800"
//                           : c.status === "recovered"
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {c.status || "N/A"}
//                     </span>
//                   </div>
//                   <div className="space-y-2">
//                     {c.customer?.email && (
//                       <div className="flex items-center gap-2">
//                         <Mail className="w-4 h-4 text-gray-400" />
//                         <a
//                           href={`mailto:${c.customer.email}`}
//                           className="text-sm text-blue-600 hover:underline"
//                         >
//                           {c.customer.email}
//                         </a>
//                       </div>
//                     )}
//                     {c.customer?.phone && (
//                       <div className="flex items-center gap-2">
//                         <Phone className="w-4 h-4 text-gray-400" />
//                         <span className="text-sm text-gray-700">
//                           {c.customer.phone}
//                         </span>
//                       </div>
//                     )}
//                     <div className="bg-blue-50 px-3 py-2 rounded">
//                       <p className="text-xs text-blue-600 font-medium mb-1">
//                         Cart Summary
//                       </p>
//                       <p className="text-sm font-semibold text-blue-900">
//                         {totalQuantity} item{totalQuantity !== 1 ? "s" : ""} •{" "}
//                         {currency === "INR" ? "₹" : currency}
//                         {subtotal.toLocaleString()}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => openModal(c)}
//                       className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                     >
//                       <Eye className="w-4 h-4" />
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Empty State */}
//         {filteredCheckouts.length === 0 && (
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               No abandoned checkouts
//             </h3>
//             <p className="text-gray-600">
//               Abandoned checkout data for your store will appear here
//             </p>
//           </div>
//         )}

//         {/* Detail Modal */}
//         {isModalOpen && selectedCheckout && (
//           <div
//             className="fixed inset-0 bg-[#00000096] bg-opacity-50 flex items-center justify-center p-4 z-50"
//             onClick={closeModal}
//           >
//             <div
//               className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div className="bg-gray-50 p-6 border-b border-gray-200 rounded-t-xl">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold text-gray-900">Abandoned Checkout</h2>
//                   <button
//                     onClick={closeModal}
//                     className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <div className="mt-2 flex items-center gap-2">
//                   <span className="text-sm text-gray-600">Order:</span>
//                   <span className="text-sm font-medium text-gray-900">
//                     #{selectedCheckout._id}
//                   </span>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${
//                       selectedCheckout.status === "started"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : selectedCheckout.status === "completed"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {selectedCheckout.status === "recovered"
//                       ? "Recovered"
//                       : selectedCheckout.status || "Not Recovered"}
//                   </span>
//                 </div>
//               </div>

//               {/* Modal Content */}
//               <div className="p-6">
//                 {/* Checkout Details */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                     <ShoppingCart className="w-5 h-5 text-blue-600" />
//                     Checkout details
//                     <span className="text-sm text-gray-500 ml-4">
//                       From Online Store
//                     </span>
//                   </h3>
//                   <div className="space-y-4">
//                     {selectedCheckout.cart?.items?.map((item, idx) => (
//                       <div key={idx} className="flex items-start gap-4 p-3 border-b border-gray-100">
//                         {item.image && (
//                           <img
//                             src={item.image}
//                             alt={item.product_title || item.title}
//                             className="w-16 h-16 object-cover rounded border border-gray-200"
//                           />
//                         )}
//                         <div className="flex-1">
//                           <h4 className="font-medium text-gray-900">
//                             {item.product_title || item.title || "Unknown Product"}
//                           </h4>
//                           <p className="text-sm text-gray-600">
//                             {item.variant_title || ""}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {item.quantity} × ₹{item.price?.toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm font-medium text-gray-900">
//                             ₹{(item.price * item.quantity).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                     <div className="flex justify-end space-y-2 flex-col pt-4 border-t border-gray-200">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Subtotal</span>
//                         <span className="text-gray-900 font-medium">
//                           ₹{(selectedCheckout.cart?.subtotal || 0).toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Shipping</span>
//                         <span className="text-gray-900 font-medium">
//                           ₹{(selectedCheckout.cart?.shipping || 0).toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Estimated tax</span>
//                         <span className="text-gray-900 font-medium">
//                           ₹{(selectedCheckout.cart?.tax || 0).toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between font-bold text-lg mt-2">
//                         <span className="text-gray-900">Total</span>
//                         <span className="text-gray-900">
//                           ₹{(
//                             (selectedCheckout.cart?.subtotal || 0) +
//                             (selectedCheckout.cart?.shipping || 0) +
//                             (selectedCheckout.cart?.tax || 0)
//                           ).toLocaleString()}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm text-gray-500 mt-1">
//                         <span>To be paid by customer</span>
//                         <span>
//                           ₹{(
//                             (selectedCheckout.cart?.subtotal || 0) +
//                             (selectedCheckout.cart?.shipping || 0) +
//                             (selectedCheckout.cart?.tax || 0)
//                           ).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Customer Info and Recovery Link */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-white border border-gray-200 rounded-lg p-5">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {`${selectedCheckout.customer?.firstName || ""} ${selectedCheckout.customer?.lastName || ""}`.trim() || "N/A"}
//                         </p>
//                         <p className="text-sm text-gray-500">No orders</p>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500 mb-1">Contact information</h4>
//                         <p className="text-gray-900">
//                           {selectedCheckout.customer?.email || "N/A"}
//                         </p>
//                         <p className="text-sm text-gray-500">No account</p>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping address</h4>
//                         <p className="text-gray-900">
//                           {`${selectedCheckout.customer?.firstName || ""} ${selectedCheckout.customer?.lastName || ""}`.trim() || "N/A"}<br />
//                           {selectedCheckout.customer?.address?.street || "N/A"}<br />
//                           {selectedCheckout.customer?.address?.city || "N/A"},{" "}
//                           {selectedCheckout.customer?.address?.state || "N/A"}<br />
//                           {selectedCheckout.customer?.address?.country || "India"}
//                         </p>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500 mb-1">Billing address</h4>
//                         <p className="text-gray-500 text-sm">Same as shipping address</p>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-500 mb-1">Marketing</h4>
//                         <div className="flex items-center gap-3">
//                           <div className="flex items-center gap-1.5">
//                             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
//                             <span className="text-sm text-gray-600">Email not subscribed</span>
//                           </div>
//                           <div className="flex items-center gap-1.5">
//                             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
//                             <span className="text-sm text-gray-600">SMS not subscribed</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Recovery Link */}
//                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                       Email your customer this link to recover their cart
//                     </h3>
//                     <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
//                       <p className="text-sm text-blue-600 break-all">
//                         {`${selectedCheckout.cart?.checkoutUrl}/recover?key=${selectedCheckout.token || selectedCheckout.cart?.token}`}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => {
//                         navigator.clipboard.writeText(
//                           `${selectedCheckout.cart?.checkoutUrl}/recover?key=${selectedCheckout.token || selectedCheckout.cart?.token}`
//                         );
//                         alert("Recovery link copied to clipboard!");
//                       }}
//                       className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 mb-2"
//                     >
//                       <Mail className="w-4 h-4" />
//                       Send a cart recovery email
//                     </button>
//                     {/* Place Order Button */}
//                     <button
//                       onClick={handlePlaceOrder}
//                       disabled={creatingOrder}
//                       className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
//                     >
//                       <Check className="w-4 h-4" />
//                       {creatingOrder ? "Placing Order..." : "Place Order"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Notes Section */}
//                 <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
//                   <div className="flex items-center gap-2">
//                     <input
//                       type="text"
//                       placeholder="Add a note to this checkout"
//                       value={note}
//                       onChange={(e) => setNote(e.target.value)}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                     <button
//                       onClick={saveNote}
//                       className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
