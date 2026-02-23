'use client';

import React, { useState, useEffect } from "react";
import { Search, User, Mail, Phone, Calendar, Heart, ExternalLink, RefreshCw, X, ChevronDown } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const WishlistPage = () => {
    const router = useRouter();
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedCustomerId, setExpandedCustomerId] = useState(null);

    // Auth Check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            router.push("/auth/login");
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                toast.error("Session expired");
                router.push("/auth/login");
            }
        } catch (err) {
            localStorage.removeItem("token");
            router.push("/auth/login");
        }
    }, [router]);

    const fetchWishlistData = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        try {
            const response = await axios.get("/api/wishlist", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.customers || [];
            setCustomers(data);
            setFilteredCustomers(data);
            // Expand first customer by default if available
            if (data.length > 0) {
                setExpandedCustomerId(data[0].id);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to load wishlist data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlistData();
    }, []);

    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = customers.filter(c =>
            c.firstName?.toLowerCase().includes(lowerSearch) ||
            c.lastName?.toLowerCase().includes(lowerSearch) ||
            c.email?.toLowerCase().includes(lowerSearch) ||
            c.phone?.includes(searchTerm)
        );
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);

    const toggleAccordion = (id) => {
        setExpandedCustomerId(expandedCustomerId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-lg text-slate-600 font-medium">Fetching customer wishlists...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <Toaster position="top-right" />

            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Wishlists</h1>
                        <p className="text-slate-500 mt-1">Manage and view what your customers are eyeing.</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Customers Accordion List */}
                <div className="space-y-4">
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => {
                            const isExpanded = expandedCustomerId === customer.id;
                            return (
                                <div key={customer.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleAccordion(customer.id)}
                                        className={`w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-lg font-bold text-slate-900 truncate">
                                                    {customer.firstName} {customer.lastName}
                                                </h2>
                                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                                    <span className="truncate">{customer.email}</span>
                                                    <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span className="hidden sm:inline">{customer.phone || 'No phone'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold ring-1 ring-rose-200/50">
                                                <Heart className="w-3 h-3 fill-rose-600" />
                                                {customer.wishlist?.length || 0} Items
                                            </div>
                                            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    {/* Accordion Content */}
                                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                        <div className="p-6 bg-white">
                                            {/* Quick Stats/Details Section */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <Mail className="w-4 h-4 text-blue-500" />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email Address</p>
                                                        <p className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{customer.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-green-500" />
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone Number</p>
                                                        <p className="text-sm font-medium text-slate-700">{customer.phone || 'N/A'}</p>
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Vertical Product List */}
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    Wishlist Products
                                                </h3>
                                                {customer.wishlist && customer.wishlist.length > 0 ? (
                                                    customer.wishlist.map((product) => (
                                                        <div key={product.id} className="group flex items-center gap-4 p-3 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                                                            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                                                {product.featuredImage ? (
                                                                    <img
                                                                        src={product.featuredImage.url}
                                                                        alt={product.title}
                                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                                        <Heart className="w-6 h-6" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                                                                    {product.title}
                                                                </h4>
                                                                <p className="text-blue-600 font-extrabold text-sm mt-0.5">
                                                                    ₹{product.variants?.edges[0]?.node?.price || '0.00'}
                                                                </p>
                                                            </div>
                                                            {/* <div className="flex items-center gap-2">
                                                                <a
                                                                    href={`https://hit-megascale.myshopify.com/products/${product.handle}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                                                >
                                                                    View Product
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            </div> */}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                        <Heart className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                                        <p className="text-slate-400 text-sm font-medium">No items found</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No customers found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your search term to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
