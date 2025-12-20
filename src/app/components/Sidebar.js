

// components/Sidebar.js

"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { X, House, BarChart3, ShoppingCart, Clock, Download, MailQuestionMark, DollarSign, CreditCard, Users, FileText, Settings, Percent, Package, ChevronDown, Contact, ShoppingBag  } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const menuItems = [
    // { label: "Home", href: "/", icon: House },
    { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { label: "Abandoned Carts", href: "/abandoned-checkouts", icon: Clock },
    
    {
      label: "Orders",
      icon: ShoppingCart,
      children: [
        { label: "All Orders", href: "/order/All-order", icon: ShoppingCart },
        { label: "Pending Orders", href: "/order/pendingorder", icon: Clock },
      ],
    },
    {
      label: "Finance",
      icon: DollarSign,
      children: [
        { label: "Refunds", href: "/finance/refunds", icon: DollarSign },
        { label: "Prepaid Orders", href: "/finance/prepaid", icon: CreditCard },
      ],
    },
    { label: "Customers", href: "/customer_data", icon: Users }, 
    { label: "Checkout", href: "/checkout", icon: CreditCard }, 
    { label: "Contacts List", href: "/ContactsList", icon: Contact },
    { label: "Suggested Cart List", href: "/suggested", icon: ShoppingBag },
    { label: "Expert Assistance Requests", href: "/ask-expert", icon: MailQuestionMark },
    { label: "Brochure Download History", href: "/brochure-download", icon: Download  },
    { label: "Shopify Admin Access Token", href: "/shop-token", icon: Users },
    // { label: "Reports", href: "/report", icon: FileText },
    // {
    //   label: "Settings",
    //   icon: Settings,
    //   children: [
    //     { label: "General", href: "/settings/general", icon: Settings },
    //     { label: "Discounts", href: "/settings/discount", icon: Percent },
    //     { label: "Inventory", href: "/settings/inventory", icon: Package },
    //   ],
    // },
  ];

  const [openMenu, setOpenMenu] = useState(null);
  const toggleMenu = (name) => setOpenMenu(openMenu === name ? null : name);

  return (
<aside
  className={`
    fixed top-0 left-0 z-50 h-full w-72 bg-gray-900 text-white 
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:static lg:z-auto
  `}
>
  <div className="flex flex-col h-full overflow-hidden">

    {/* Header */}
    <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
      <h1 className="text-2xl font-bold">MegaShiprocket</h1>
      <button
        onClick={() => setIsOpen(false)}
        className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Menu — scroll removed, content clipped */}
    <nav className="flex-1 p-4 space-y-2 overflow-hidden">
      {menuItems.map((item) => (
        <div key={item.label}>
          {item.children ? (
            <>
              <button
                onClick={() => toggleMenu(item.label)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openMenu === item.label ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openMenu === item.label && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition ${
                        pathname === sub.href
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <sub.icon className="w-4 h-4" />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>

    {/* Footer */}
    <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-400 shrink-0">
      MegaShiprocket v1.0
    </div>
  </div>
</aside>

  );
}