// src/app/layout.js (UPDATED)
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

export const metadata = {
  title: "Shiprocket Admin",
  description: "Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* ✅ Suppress warning for extension tampering */}
      <body 
        suppressHydrationWarning 
        className="min-h-screen bg-gray-50 text-gray-900"
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
