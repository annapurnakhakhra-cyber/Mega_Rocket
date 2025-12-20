'use client';

import React, { useState } from "react";
import { saveAs } from "file-saver";

const OrderReportGenerator = () => {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://your-backend-url.com";
  const [shop, setShop] = useState("maitri-kh.myshopify.com");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Store all fetched orders
  const apiUrl = `${api}/allorderget.php`;

  const fetchOrders = async () => {
    if (!shop) {
      setMessage("Please enter a shop domain");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Build the URL with just the shop parameter
      let url = `${apiUrl}?shop=${shop}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Process all orders data
      const processedOrders = data.data.orders.edges.map((edge) => {
        const o = edge.node;
        return {
          id: o.id.split('/').pop(),
          name: o.name,
          date: o.createdAt.slice(0, 10), // Format: YYYY-MM-DD
          customer: `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.trim() || "Guest",
          email: o.customer?.email || "N/A",
          total: parseFloat(o.totalPriceSet.shopMoney.amount).toFixed(2),
          discount: parseFloat(o.totalDiscountsSet.shopMoney.amount).toFixed(2),
          status: o.displayFinancialStatus,
          payment: o.paymentGatewayNames.join(', ') || "N/A",
          shipping: o.shippingLines.edges[0]?.node.title || "N/A",
          items: o.lineItems.edges.map(item => ({
            product: item.node.title,
            quantity: item.node.quantity
          }))
        };
      });

      // Store all orders
      setAllOrders(processedOrders);

      // Filter orders by date range if dates are provided
      let filteredOrders = [...processedOrders];

      if (from || to) {
        filteredOrders = processedOrders.filter(order => {
          const orderDate = new Date(order.date);
          const fromDate = from ? new Date(from) : null;
          const toDate = to ? new Date(to) : null;

          // If only "from" date is provided
          if (fromDate && !toDate) {
            return orderDate >= fromDate;
          }

          // If only "to" date is provided
          if (!fromDate && toDate) {
            return orderDate <= toDate;
          }

          // If both dates are provided
          if (fromDate && toDate) {
            return orderDate >= fromDate && orderDate <= toDate;
          }

          return true;
        });
      }

      setOrders(filteredOrders);
      console.log("Filtered Orders:", filteredOrders);
      setMessage(`Found ${filteredOrders.length} orders${from || to ? ` (filtered from ${processedOrders.length})` : ''}`);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage(`Error: ${error.message}`);
      setOrders([]);
      setAllOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to apply date filtering to already fetched orders
  const applyDateFilter = () => {
    if (allOrders.length === 0) {
      setMessage("No orders to filter. Please fetch orders first.");
      return;
    }

    let filteredOrders = [...allOrders];

    if (from || to) {
      filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.date);
        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        // If only "from" date is provided
        if (fromDate && !toDate) {
          return orderDate >= fromDate;
        }

        // If only "to" date is provided
        if (!fromDate && toDate) {
          return orderDate <= toDate;
        }

        // If both dates are provided
        if (fromDate && toDate) {
          return orderDate >= fromDate && orderDate <= toDate;
        }

        return true;
      });
    }

    setOrders(filteredOrders);
    setMessage(`Found ${filteredOrders.length} orders${from || to ? ` (filtered from ${allOrders.length})` : ''}`);
  };

  const generateCSV = () => {
    if (orders.length === 0) {
      setMessage("No orders to generate report");
      return;
    }

    try {
      // Create CSV header
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Order ID,Order Name,Date,Customer,Email,Total,Discount,Status,Payment Method,Shipping Method,Items\n";

      // Add each order to the CSV
      orders.forEach(order => {
        // Format items as a string: "Product1 (Qty: X), Product2 (Qty: Y)"
        const itemsString = order.items.map(item => `${item.product} (Qty: ${item.quantity})`).join(", ");

        // Create a row for the order
        const row = [
          order.id,
          order.name,
          order.date,
          `"${order.customer}"`, // Wrap in quotes to handle commas in names
          order.email,
          order.total,
          order.discount,
          order.status,
          `"${order.payment}"`, // Wrap in quotes to handle commas
          `"${order.shipping}"`, // Wrap in quotes to handle commas
          `"${itemsString}"` // Wrap in quotes to handle commas
        ];

        // Add the row to the CSV content
        csvContent += row.join(",") + "\n";
      });

      // Create filename with current date
      const filename = `shopify-orders-report-${shop}-${new Date().toISOString().slice(0, 10)}.csv`;

      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Save the file
      saveAs(blob, filename);

      setMessage(`CSV report generated: ${filename}`);
    } catch (error) {
      console.error("Error generating CSV:", error);
      setMessage(`Error generating CSV: ${error.message}`);
    }
  };

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ color: "#2c3e50", textAlign: "center" }}>Shopify Order Report Generator</h1>

      <div style={{
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        padding: "25px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#2c3e50"
          }}>
            Shop Domain
          </label>
          <input
            type="text"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            placeholder="your-store.myshopify.com"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#2c3e50"
          }}>
            Date Range (Optional)
          </label>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd"
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd"
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2980b9"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3498db"}
          >
            {isLoading ? "Loading..." : "Fetch Orders"}
          </button>

          <button
            onClick={applyDateFilter}
            disabled={isLoading || allOrders.length === 0}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: allOrders.length > 0 ? "#9b59b6" : "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: allOrders.length > 0 ? "pointer" : "not-allowed",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => allOrders.length > 0 && (e.currentTarget.style.backgroundColor = "#8e44ad")}
            onMouseOut={(e) => allOrders.length > 0 && (e.currentTarget.style.backgroundColor = "#9b59b6")}
          >
            Apply Date Filter
          </button>

          <button
            onClick={generateCSV}
            disabled={isLoading || orders.length === 0}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: orders.length > 0 ? "#2ecc71" : "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: orders.length > 0 ? "pointer" : "not-allowed",
              fontWeight: "bold",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => orders.length > 0 && (e.currentTarget.style.backgroundColor = "#27ae60")}
            onMouseOut={(e) => orders.length > 0 && (e.currentTarget.style.backgroundColor = "#2ecc71")}
          >
            Generate CSV Report
          </button>
        </div>

        {message && (
          <div style={{
            padding: "12px",
            backgroundColor: message.includes("Error") ? "#fadbd8" : "#d5f5e3",
            color: message.includes("Error") ? "#c0392b" : "#27ae60",
            borderRadius: "4px",
            marginTop: "10px",
            textAlign: "center",
            fontWeight: "bold"
          }}>
            {message}
          </div>
        )}

        {orders.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h2 style={{ color: "#2c3e50", marginBottom: "15px" }}>
              {from || to ? `Filtered Orders (${orders.length})` : `All Orders (${orders.length})`}
            </h2>
            <div style={{
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Order #</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Date</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Customer</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Total</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
                    <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9" }}>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{order.name}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{order.date}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{order.customer}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>${order.total}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{order.status}</td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{order.payment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderReportGenerator;