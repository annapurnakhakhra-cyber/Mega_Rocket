'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [shopName, setShopName] = useState(""); // Fixed naming consistency
  const api = process.env.NEXT_PUBLIC_API_URL; // Changed for Next.js env vars

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded.data);
        setShopName(decoded.data.shop);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in sessionStorage"); // Changed to warn for less noise
    }
  }, []);

  useEffect(() => {
    if (shopName) { // Use shopName consistently
      fetchInventory();
    }
  }, [shopName]); // Added shopName to deps

  const fetchInventory = async () => {
    try {
      setLoading(true);
      console.log(`Fetching inventory for shop: ${shopName}`); // Debug log
      const res = await axios.get(`${api}/inventory.php?shop=${shopName}`);
      console.log("API Response:", res.data); // Debug log
      const edges = res.data.data.products.edges;

      const parsed = edges.map(({ node }) => {
        const { title, featuredImage, variants } = node;

        return {
          title,
          image: featuredImage?.url ?? '',
          variants: variants.edges.map(({ node }) => {
            const available = node.inventoryQuantity || 0;
            const committed = 0; // Not exposed
            const onHand = available + committed;

            return {
              id: node.id,
              title: node.title,
              sku: node.sku || 'No SKU',
              available,
              committed,
              onHand,
            };
          }),
        };
      });

      setProducts(parsed);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      // Optional: Set mock data for testing if API fails
      // setProducts(mockProducts); // Define mockProducts if needed
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.variants.some(v => v.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'low') return matchesSearch && product.variants.some(v => v.available < 10);
    if (filterStatus === 'out') return matchesSearch && product.variants.some(v => v.available === 0);
    return matchesSearch;
  });

  const getStockStatus = (available) => {
    if (available === 0) return { status: 'Out of Stock', color: 'text-red-500', bg: 'bg-red-50', icon: AlertCircle };
    if (available < 10) return { status: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle };
    return { status: 'In Stock', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Package className="w-8 h-8 text-blue-600 absolute top-6 left-1/2 transform -translate-x-1/2" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Inventory</h3>
          <p className="text-gray-500">Fetching your product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Product Inventory
                </h1>
                <p className="text-gray-600 mt-1">Manage your product stock levels</p>
              </div>
            </div>
{/*             
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-200 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products or SKUs..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Products</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Stock</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.reduce((acc, p) => acc + p.variants.filter(v => v.available > 10).length, 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {products.reduce((acc, p) => acc + p.variants.filter(v => v.available > 0 && v.available < 10).length, 0)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.reduce((acc, p) => acc + p.variants.filter(v => v.available === 0).length, 0)}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">SKU</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Available</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Committed</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">On Hand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, idx) =>
                  product.variants.map((variant, vIdx) => {
                    const stockInfo = getStockStatus(variant.available);
                    const StatusIcon = stockInfo.icon;

                    return (
                      <tr key={variant.id} className="hover:bg-blue-50 transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            {vIdx === 0 && (
                              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                {product.image ? (
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-blue-600" />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className={vIdx === 0 ? "" : "ml-20"}>
                              <div className="font-semibold text-gray-800">
                                {vIdx === 0 ? product.title : ''}
                              </div>
                              {variant.title && (
                                <div className="text-sm text-gray-600 mt-1">{variant.title}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-mono">
                            {variant.sku}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockInfo.bg} ${stockInfo.color}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {stockInfo.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-lg font-semibold text-gray-800">
                          {variant.available}
                        </td>
                        <td className="px-6 py-4 text-center text-lg font-semibold text-gray-600">
                          {variant.committed}
                        </td>
                        <td className="px-6 py-4 text-center text-lg font-semibold text-blue-600">
                          {variant.onHand}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredProducts.map((product) =>
            product.variants.map((variant, idx) => {
              const stockInfo = getStockStatus(variant.available);
              const StatusIcon = stockInfo.icon;

              return (
                <div
                  key={variant.id}
                  className="bg-white rounded-2xl shadow border border-blue-100 p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">
                        {product.title}
                      </div>
                      {variant.title && (
                        <div className="text-xs text-gray-600">{variant.title}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">SKU:</span>{" "}
                    <span className="bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-800">
                      {variant.sku}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between text-sm">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${stockInfo.bg} ${stockInfo.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {stockInfo.status}
                    </div>
                    <div className="text-gray-800 font-semibold">Available: {variant.available}</div>
                    <div className="text-gray-600 font-medium">Committed: {variant.committed}</div>
                    <div className="text-blue-600 font-semibold">On Hand: {variant.onHand}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductInventory;