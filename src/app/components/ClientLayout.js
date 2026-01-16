"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Pages without layout
  const hideLayout =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth/forgot");

  // Sidebar + Mobile logic
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (hideLayout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <Topbar
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
    
      </div>
    </div>
  );
}
