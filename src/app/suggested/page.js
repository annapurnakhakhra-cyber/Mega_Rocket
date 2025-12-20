"use client";

import { useState, useEffect } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://10.27.4.11:3001";
import { Search, Filter, Loader2, Plus, Trash2, Check } from "lucide-react";

export default function ManageSuggestedProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedVendor, sortBy, allProducts, suggestedProducts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching all products...');
      const productsRes = await fetch(`${API_BASE}/api/products/list`);
      console.log('Products response status:', productsRes.status);
      
      if (!productsRes.ok) {
        throw new Error(`Failed to fetch products: ${productsRes.status}`);
      }
      
      const productsData = await productsRes.json();
      const products = productsData.products || productsData.data || productsData || [];
      console.log('Parsed products:', products.length);
      
      if (!Array.isArray(products)) {
        throw new Error('Products is not an array');
      }

      setAllProducts(products);

      console.log('Fetching suggested products...');
      const suggestedRes = await fetch(`${API_BASE}/api/suggested/list`);
      console.log('Suggested response status:', suggestedRes.status);
      
      if (suggestedRes.ok) {
        const suggestedData = await suggestedRes.json();
        console.log('Suggested data:', suggestedData);
        const suggested = suggestedData.products || [];
        setSuggestedProducts(suggested);
      } else {
        console.log('Suggested products API not available yet');
        setSuggestedProducts([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...allProducts];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedVendor !== "all") {
      filtered = filtered.filter(product => product.vendor === selectedVendor);
    }

    filtered.sort((a, b) => {
      const aIsSuggested = isSuggested(a.id);
      const bIsSuggested = isSuggested(b.id);

      if (aIsSuggested && !bIsSuggested) return -1;
      if (!aIsSuggested && bIsSuggested) return 1;

      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price?.amount || 0) - parseFloat(b.price?.amount || 0);
        case "price-high":
          return parseFloat(b.price?.amount || 0) - parseFloat(a.price?.amount || 0);
        case "name-az":
          return a.title.localeCompare(b.title);
        case "name-za":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const isSuggested = (productId) => {
    return suggestedProducts.some(p => p.shopifyProductId === productId);
  };

  const handleAddToSuggested = async (product) => {
    setProcessing({ ...processing, [product.id]: true });

    try {
      console.log('Adding product to suggested:', product.id);
      console.log('Request payload:', {
        shopifyProductId: product.id,
        productHandle: product.handle,
        title: product.title,
        vendor: product.vendor,
        price: parseFloat(product.price?.amount || 0),
      });

      const res = await fetch(`${API_BASE}/api/suggested/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          shopifyProductId: product.id,
          productHandle: product.handle,
          title: product.title,
          vendor: product.vendor || '',
          price: parseFloat(product.price?.amount || 0),
          compareAtPrice: product.compareAtPrice?.amount 
            ? parseFloat(product.compareAtPrice.amount) 
            : null,
          featuredImageUrl: product.featuredImage?.url || '',
          variantId: product.variantId || '',
        }),
      });

      console.log('Add response status:', res.status);
      console.log('Add response headers:', res.headers);

      // Check if response has content
      const contentType = res.headers.get('content-type');
      console.log('Content-Type:', contentType);

      let data;
      const responseText = await res.text();
      console.log('Response text:', responseText);

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
        }
      } else {
        throw new Error('Empty response from server');
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Server error: ${res.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to add product');
      }

      console.log('Product added successfully!');
      await fetchData();
      alert('✅ Product added to suggested list!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setProcessing({ ...processing, [product.id]: false });
    }
  };

  const handleRemoveFromSuggested = async (product) => {
    setProcessing({ ...processing, [product.id]: true });

    try {
      console.log('Removing product from suggested:', product.id);

      const res = await fetch(`${API_BASE}/api/suggested/remove`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          shopifyProductId: product.id,
        }),
      });

      console.log('Remove response status:', res.status);

      const responseText = await res.text();
      console.log('Response text:', responseText);

      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
        }
      } else {
        throw new Error('Empty response from server');
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Server error: ${res.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to remove product');
      }

      console.log('Product removed successfully!');
      await fetchData();
      alert('✅ Product removed from suggested list!');
    } catch (error) {
      console.error('Error removing product:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setProcessing({ ...processing, [product.id]: false });
    }
  };

  const vendors = ["all", ...new Set(allProducts.map(p => p.vendor).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#7C4A0E] mb-2">
            Manage Suggested Products
          </h1>
          <p className="text-gray-600">
            Add or remove products from the suggested list. Suggested products appear first.
          </p>
          <div className="mt-4 flex gap-4">
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-blue-800 font-semibold">
                {allProducts.length} Total Products
              </span>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <span className="text-green-800 font-semibold">
                {suggestedProducts.length} Suggested Products
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              onClick={fetchData}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
              >
                {vendors.map(vendor => (
                  <option key={vendor} value={vendor}>
                    {vendor === "all" ? "All Vendors" : vendor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-center text-gray-600">
            Showing {filteredProducts.length} of {allProducts.length} products
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products List */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#7C4A0E] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Vendor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const price = Number(product?.price?.amount || 0);
                    const compareAt = Number(product?.compareAtPrice?.amount || 0);
                    const hasDiscount = compareAt > price;
                    const isInSuggested = isSuggested(product.id);
                    const isProcessing = processing[product.id];

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 transition ${
                          isInSuggested ? 'bg-green-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            {product.featuredImage?.url ? (
                              <img
                                src={product.featuredImage.url}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 line-clamp-2 max-w-xs">
                              {product.title}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              ID: {product.id.split('/').pop()}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {product.vendor || 'Unknown'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-orange-600">
                              ₹{price}
                            </span>
                            {hasDiscount && (
                              <span className="text-sm line-through text-gray-400">
                                ₹{compareAt}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {isInSuggested ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              <Check className="w-4 h-4" />
                              Suggested
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              Not Added
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {isInSuggested ? (
                              <button
                                onClick={() => handleRemoveFromSuggested(product)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                Remove
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAddToSuggested(product)}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                                Add
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}