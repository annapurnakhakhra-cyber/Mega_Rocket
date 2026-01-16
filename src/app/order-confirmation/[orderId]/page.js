// 'use client';

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function OrderConfirmationPage() {
//   const params = useParams();
//   const { orderId } = params;

//   // Mock data for demonstration (replace with real API fetch if needed)
//   const [order, setOrder] = useState({
//     cartItems: [
//       { id: 'p1', name: 'Premium Watch', price: 50, qty: 1 },
//       { id: 'p2', name: 'Leather Wallet', price: 25, qty: 2 },
//     ],
//     shippingInfo: {
//       fullName: 'John Doe',
//       address: '123 Main Street',
//       city: 'New York',
//       zipCode: '10001',
//       email: 'john@example.com',
//     },
//     paymentMethod: 'COD',
//     totalAmount: 100,
//   });

//   // Optional: Fetch order by ID from API
//   // useEffect(() => {
//   //   fetch(`/api/order/${orderId}`).then(res => res.json()).then(data => setOrder(data));
//   // }, [orderId]);

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <div style={styles.header}>
//           <div style={styles.icon}>🎉</div>
//           <h1 style={styles.heading}>Order Confirmed!</h1>
//         </div>
//         <p style={styles.subtext}>Thank you for your purchase, {order.shippingInfo.fullName}.</p>
//         <p style={styles.subtext}>Your order ID is <strong>{orderId}</strong></p>

//         <div style={styles.section}>
//           <h2 style={styles.sectionHeading}>Order Summary</h2>
//           <table style={styles.table}>
//             <thead>
//               <tr>
//                 <th style={styles.th}>Product</th>
//                 <th style={styles.th}>Qty</th>
//                 <th style={styles.th}>Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.cartItems.map(item => (
//                 <tr key={item.id}>
//                   <td style={styles.td}>{item.name}</td>
//                   <td style={styles.td}>{item.qty}</td>
//                   <td style={styles.td}>${(item.price * item.qty).toFixed(2)}</td>
//                 </tr>
//               ))}
//               <tr>
//                 <td colSpan="2" style={{ ...styles.td, fontWeight: 'bold' }}>Total</td>
//                 <td style={{ ...styles.td, fontWeight: 'bold' }}>${order.totalAmount}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div style={styles.section}>
//           <h2 style={styles.sectionHeading}>Shipping Information</h2>
//           <p>{order.shippingInfo.fullName}</p>
//           <p>{order.shippingInfo.address}, {order.shippingInfo.city} - {order.shippingInfo.zipCode}</p>
//           <p>{order.shippingInfo.email}</p>
//         </div>

//         <div style={styles.section}>
//           <h2 style={styles.sectionHeading}>Payment Method</h2>
//           <p>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}</p>
//         </div>

//         <div style={styles.buttonContainer}>
//           <a href="/" style={styles.button}>Continue Shopping</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// const colors = {
//   primary: '#007bff',
//   background: '#f8f9fa',
//   card: '#ffffff',
//   text: '#343a40',
//   secondary: '#6c757d',
//   shadow: 'rgba(0, 0, 0, 0.1)',
//   buttonHover: '#0056b3',
// };

// const styles = {
//   container: {
//     minHeight: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '20px',
//     backgroundColor: colors.background,
//   },
//   card: {
//     maxWidth: '700px',
//     width: '100%',
//     backgroundColor: colors.card,
//     padding: '40px',
//     borderRadius: '12px',
//     boxShadow: `0 6px 20px ${colors.shadow}`,
//   },
//   header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' },
//   icon: { fontSize: '3em', marginBottom: '10px' },
//   heading: { fontSize: '2em', color: colors.primary, marginBottom: '5px' },
//   subtext: { fontSize: '1.1em', color: colors.text, textAlign: 'center', marginBottom: '5px' },
//   section: { marginTop: '30px' },
//   sectionHeading: { fontSize: '1.3em', color: colors.text, marginBottom: '15px', borderBottom: `1px solid ${colors.shadow}`, paddingBottom: '5px' },
//   table: { width: '100%', borderCollapse: 'collapse' },
//   th: { textAlign: 'left', borderBottom: `1px solid ${colors.shadow}`, padding: '10px', color: colors.secondary },
//   td: { padding: '10px', borderBottom: `1px solid ${colors.shadow}`, color: colors.text },
//   buttonContainer: { display: 'flex', justifyContent: 'center', marginTop: '40px' },
//   button: {
//     padding: '12px 30px',
//     backgroundColor: colors.primary,
//     color: '#fff',
//     borderRadius: '8px',
//     textDecoration: 'none',
//     fontWeight: '600',
//     transition: 'background 0.2s',
//   },
// };



'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const { orderId } = params;

  // Mock data (replace with real API later)
  const [order, setOrder] = useState({
    cartItems: [
      { id: 'p1', name: 'Premium Watch', price: 50, qty: 1 },
      { id: 'p2', name: 'Leather Wallet', price: 25, qty: 2 },
    ],
    shippingInfo: {
      fullName: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      zipCode: '10001',
      email: 'john@example.com',
    },
    paymentMethod: 'COD',
    totalAmount: 100,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-12 text-center text-white">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-xl opacity-90">
            Thank you for your purchase, <strong>{order.shippingInfo.fullName}</strong>.
          </p>
          <p className="mt-4 text-lg">
            Your Order ID: <span className="font-bold text-xl">{orderId}</span>
          </p>
        </div>

        <div className="p-8 lg:p-12 space-y-10">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 font-medium text-gray-700">Product</th>
                    <th className="text-center py-4 font-medium text-gray-700">Qty</th>
                    <th className="text-right py-4 font-medium text-gray-700">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-5 text-gray-800">{item.name}</td>
                      <td className="py-5 text-center text-gray-600">{item.qty}</td>
                      <td className="py-5 text-right text-gray-800 font-medium">
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300 font-bold text-lg">
                    <td colSpan={2} className="py-5 text-right text-gray-900">
                      Total
                    </td>
                    <td className="py-5 text-right text-blue-600">${order.totalAmount}.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
            <div className="bg-gray-50 rounded-lg p-6 space-y-2">
              <p className="text-gray-800 font-medium">{order.shippingInfo.fullName}</p>
              <p className="text-gray-600">
                {order.shippingInfo.address}, {order.shippingInfo.city} - {order.shippingInfo.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingInfo.email}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Payment Method</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-lg font-medium text-gray-800">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div className="text-center pt-6">
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer transform hover:scale-105"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}