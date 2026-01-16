

// // components/Sidebar.js

// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import { X, House, BarChart3, ShoppingCart, Clock, Download, MailQuestionMark, DollarSign, CreditCard, Users, FileText, Settings, Percent, Package, ChevronDown, Contact, ShoppingBag } from "lucide-react";

// export default function Sidebar({ isOpen, setIsOpen }) {
//   const pathname = usePathname();

//   const menuItems = [
//     // { label: "Home", href: "/", icon: House },
//     { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
//     { label: "Abandoned Carts", href: "/abandoned-checkouts", icon: Clock },

//     {
//       label: "Orders",
//       icon: ShoppingCart,
//       children: [
//         { label: "All Orders", href: "/order/All-order", icon: ShoppingCart },
//         { label: "Pending Orders", href: "/order/pendingorder", icon: Clock },
//       ],
//     },
//     {
//       label: "Finance",
//       icon: DollarSign,
//       children: [
//         { label: "Refunds", href: "/finance/refunds", icon: DollarSign },
//         { label: "Prepaid Orders", href: "/finance/prepaid", icon: CreditCard },
//       ],
//     },
//     { label: "Customers", href: "/customer_data", icon: Users },
//     { label: "Checkout", href: "/checkout", icon: CreditCard },
//     { label: "Contacts List", href: "/ContactsList", icon: Contact },
//     { label: "Suggested Cart List", href: "/suggested", icon: ShoppingBag },
//     { label: "Expert Assistance Requests", href: "/ask-expert", icon: MailQuestionMark },
//     { label: "Brochure Download History", href: "/brochure-download", icon: Download },
//     { label: "Shopify Admin Access Token", href: "/shop-token", icon: Users },
//   ];

//   const [openMenu, setOpenMenu] = useState(null);
//   const toggleMenu = (name) => setOpenMenu(openMenu === name ? null : name);

//   return (
//     <aside
//       className={`
//     fixed top-0 left-0 z-50 h-full w-72 bg-gray-900 text-white 
//     transform transition-transform duration-300 ease-in-out
//     ${isOpen ? "translate-x-0" : "-translate-x-full"}
//     lg:translate-x-0 lg:static lg:z-auto
//   `}
//     >
//       <div className="flex flex-col h-full overflow-hidden">

//         {/* Header */}
//         <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
//           <h1 className="text-2xl font-bold">MegaShiprocket</h1>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Menu — scroll removed, content clipped */}
//         {/* <nav className="flex-1 p-4 space-y-2 overflow-hidden">
//       {menuItems.map((item) => (
//         <div key={item.label}>
//           {item.children ? (
//             <>
//               <button
//                 onClick={() => toggleMenu(item.label)}
//                 className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition"
//               >
//                 <div className="flex items-center gap-3">
//                   <item.icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </div>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     openMenu === item.label ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {openMenu === item.label && (
//                 <div className="ml-8 mt-2 space-y-1">
//                   {item.children.map((sub) => (
//                     <Link
//                       key={sub.href}
//                       href={sub.href}
//                       onClick={() => setIsOpen(false)}
//                       className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition ${
//                         pathname === sub.href
//                           ? "bg-blue-600 text-white"
//                           : "hover:bg-gray-700 text-gray-300"
//                       }`}
//                     >
//                       <sub.icon className="w-4 h-4" />
//                       {sub.label}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </>
//           ) : (
//             <Link
//               href={item.href}
//               onClick={() => setIsOpen(false)}
//               className={`flex items-center gap-3 p-3 rounded-xl transition ${
//                 pathname === item.href
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-800 text-gray-300"
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span className="font-medium">{item.label}</span>
//             </Link>
//           )}
//         </div>
//       ))}
//     </nav> */}

//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto hide-scrollbar scroll-smooth">
//           {menuItems.map((item) => (
//             <div key={item.label}>
//               {item.children ? (
//                 <>
//                   <button
//                     onClick={() => toggleMenu(item.label)}
//                     className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition"
//                   >
//                     <div className="flex items-center gap-3">
//                       <item.icon className="w-5 h-5" />
//                       <span className="font-medium">{item.label}</span>
//                     </div>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform ${openMenu === item.label ? "rotate-180" : ""
//                         }`}
//                     />
//                   </button>

//                   {openMenu === item.label && (
//                     <div className="ml-8 mt-2 space-y-1">
//                       {item.children.map((sub) => (
//                         <Link
//                           key={sub.href}
//                           href={sub.href}
//                           onClick={() => setIsOpen(false)}
//                           className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition ${pathname === sub.href
//                               ? "bg-blue-600 text-white"
//                               : "hover:bg-gray-700 text-gray-300"
//                             }`}
//                         >
//                           <sub.icon className="w-4 h-4" />
//                           {sub.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <Link
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className={`flex items-center gap-3 p-3 rounded-xl transition ${pathname === item.href
//                       ? "bg-blue-600 text-white"
//                       : "hover:bg-gray-800 text-gray-300"
//                     }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               )}
//             </div>
//           ))}
//         </nav>

//         <style jsx>{`
//           .hide-scrollbar {
//             -ms-overflow-style: none;  
//             scrollbar-width: none;      
//           }

//           .hide-scrollbar::-webkit-scrollbar {
//             display: none;              
//           }
//         `}</style>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-400 shrink-0">
//           MegaShiprocket v1.0
//         </div>
//       </div>
//     </aside>

//   );
// }


// components/Sidebar.js

// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { usePathname } from "next/navigation";

// import { X, House, BarChart3, ShoppingCart, Clock, Download, LayoutIcon, MailQuestionMark, DollarSign, 
//   CreditCard, Users, FileText, Settings, Percent, Package, ChevronDown, Contact, ShoppingBag,
//         Truck, TrendingUp, Receipt, Tag,  Link as LinkIcon } from "lucide-react";


// export default function Sidebar({ isOpen, setIsOpen }) {
//   const pathname = usePathname();

//   const menuItems = [
//     // { label: "Home", href: "/", icon: House },
//     { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
//     { label: "Abandoned Carts", href: "/abandoned-checkouts", icon: Clock },

//     {
//       label: "Orders",
//       icon: ShoppingCart,
//       children: [
//         { label: "All Orders", href: "/order/All-order", icon: ShoppingCart },
//         { label: "Pending Orders", href: "/order/pendingorder", icon: Clock },
//       ],
//     },
//     {
//       label: "Checkout",
//       icon: ShoppingCart,
//       children: [
//         { label: "Shipping", href: "/checkout/Shipping", icon: Truck },
//         { label: "Customise UI", href: "/checkout/CustomiseUI", icon: LayoutIcon },
//         { label: "Discount", href: "/checkout/Discount", icon: Tag },
//         { label: "Payment", href: "/checkout/Payment", icon: CreditCard },
//         { label: "Tax & Other", href: "/checkout/Tax&Other", icon: Receipt },
//         { label: "Checkout Links", href: "/checkout/CheckoutLinks", icon: LinkIcon },
//         { label: "Upsell on Checkout", href: "/checkout/UpsellonCheckout", icon: TrendingUp },
//       ],
//     },

//     {
//       label: "Finance",
//       icon: DollarSign,
//       children: [
//         { label: "Refunds", href: "/finance/refunds", icon: DollarSign },
//         { label: "Prepaid Orders", href: "/finance/prepaid", icon: CreditCard },
//       ],
//     },
//     { label: "Customers", href: "/customer_data", icon: Users },
//     { label: "Contacts List", href: "/ContactsList", icon: Contact },
//     { label: "Suggested Cart List", href: "/suggested", icon: ShoppingBag },
//     { label: "Expert Assistance Requests", href: "/ask-expert", icon: MailQuestionMark },
//     { label: "Brochure Download History", href: "/brochure-download", icon: Download },
//     { label: "Shopify Admin Access Token", href: "/shop-token", icon: Users },
//   ];

//   const [openMenu, setOpenMenu] = useState(null);
//   const toggleMenu = (name) => setOpenMenu(openMenu === name ? null : name);

//   return (
//     <aside
//       className={`
//     fixed top-0 left-0 z-50 h-full w-72 bg-gray-900 text-white 
//     transform transition-transform duration-300 ease-in-out
//     ${isOpen ? "translate-x-0" : "-translate-x-full"}
//     lg:translate-x-0 lg:static lg:z-auto
//   `}
//     >
//       <div className="flex flex-col h-full overflow-hidden">

//         {/* Header */}
//         <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
//           <h1 className="text-2xl font-bold">MegaShiprocket</h1>
//           <button
//             onClick={() => setIsOpen(false)}
//             className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Menu — scroll removed, content clipped */}
//         {/* <nav className="flex-1 p-4 space-y-2 overflow-hidden">
//       {menuItems.map((item) => (
//         <div key={item.label}>
//           {item.children ? (
//             <>
//               <button
//                 onClick={() => toggleMenu(item.label)}
//                 className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition"
//               >
//                 <div className="flex items-center gap-3">
//                   <item.icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </div>
//                 <ChevronDown
//                   className={`w-4 h-4 transition-transform ${
//                     openMenu === item.label ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {openMenu === item.label && (
//                 <div className="ml-8 mt-2 space-y-1">
//                   {item.children.map((sub) => (
//                     <Link
//                       key={sub.href}
//                       href={sub.href}
//                       onClick={() => setIsOpen(false)}
//                       className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition ${
//                         pathname === sub.href
//                           ? "bg-blue-600 text-white"
//                           : "hover:bg-gray-700 text-gray-300"
//                       }`}
//                     >
//                       <sub.icon className="w-4 h-4" />
//                       {sub.label}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </>
//           ) : (
//             <Link
//               href={item.href}
//               onClick={() => setIsOpen(false)}
//               className={`flex items-center gap-3 p-3 rounded-xl transition ${
//                 pathname === item.href
//                   ? "bg-blue-600 text-white"
//                   : "hover:bg-gray-800 text-gray-300"
//               }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span className="font-medium">{item.label}</span>
//             </Link>
//           )}
//         </div>
//       ))}
//     </nav> */}

//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           {menuItems.map((item) => (
//             <div key={item.label}>
//               {item.children ? (
//                 <>
//                   <button
//                     onClick={() => toggleMenu(item.label)}
//                     className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition"
//                   >
//                     <div className="flex items-center gap-3">
//                       <item.icon className="w-5 h-5" />
//                       <span className="font-medium">{item.label}</span>
//                     </div>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform ${openMenu === item.label ? "rotate-180" : ""
//                         }`}
//                     />
//                   </button>

//                   {openMenu === item.label && (
//                     <div className="ml-8 mt-2 space-y-1">
//                       {item.children.map((sub) => (
//                         <Link
//                           key={sub.href}
//                           href={sub.href}
//                           onClick={() => setIsOpen(false)}
//                           className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition ${pathname === sub.href
//                             ? "bg-blue-600 text-white"
//                             : "hover:bg-gray-700 text-gray-300"
//                             }`}
//                         >
//                           <sub.icon className="w-4 h-4" />
//                           {sub.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <Link
//                   href={item.href}
//                   onClick={() => setIsOpen(false)}
//                   className={`flex items-center gap-3 p-3 rounded-xl transition ${pathname === item.href
//                     ? "bg-blue-600 text-white"
//                     : "hover:bg-gray-800 text-gray-300"
//                     }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-800 text-center text-xs text-gray-400 shrink-0">
//           MegaShiprocket v1.0
//         </div>
//       </div>
//     </aside>

//   );
// }


"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  BarChart3,
  ShoppingCart,
  Clock,
  Download,
  LayoutIcon,
  MailQuestionMark,
  DollarSign,
  CreditCard,
  Users,
  Contact,
  ShoppingBag,
  Truck,
  TrendingUp,
  Receipt,
  Tag,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
   Key,
   FileText,
   RotateCcw,
   ShoppingCartOff,
   UserCircle,
   Settings,
   XCircle,
   Wallet,
   BadgePercent ,
   WalletCards,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { label: "Abandoned Carts", href: "/abandoned-checkouts", icon: Clock },
    {
      label: "Orders",
      icon: ShoppingCart,
      children: [
        { label: "All Orders", href: "/order/All-order", icon: FileText  },
        { label: "Pending Orders", href: "/order/pendingorder", icon: Clock },
      ],
    },
    {
      label: "Checkout",
      icon: CreditCard,
      children: [
        { label: "Shipping", href: "/checkout/Shipping", icon: Truck },
        { label: "Customise UI", href: "/checkout/CustomiseUI", icon: LayoutIcon },
        { label: "Discount", href: "/checkout/Discount", icon: Tag },
        { label: "Payment", href: "/checkout/Payment", icon: CreditCard },
        { label: "Tax & Other", href: "/checkout/Tax&Other", icon: Receipt },
        { label: "Checkout Links", href: "/checkout/CheckoutLinks", icon: LinkIcon },
        { label: "Upsell on Checkout", href: "/checkout/UpsellonCheckout", icon: TrendingUp },
      ],
    },
    {
      label: "payment",
      icon: Wallet,
      children: [
        { label: "Payment Configs", href: "/payment/paymentconfigs", icon: Settings  },
        { label: "Payment Offers", href: "/payment/paymentoffers", icon: BadgePercent   },
      ],
    },
    {
      label: "Finance",
      icon: WalletCards,
      children: [
        { label: "Refunds", href: "/finance/refunds", icon: RotateCcw  },
        { label: "Prepaid Orders", href: "/finance/prepaid", icon: CreditCard },
      ],
    },
    { label: "Customers", href: "/customer_data", icon: UserCircle  },
    { label: "Contacts List", href: "/ContactsList", icon: Contact },
    { label: "Suggested Cart List", href: "/suggested", icon: ShoppingBag },
    { label: "Expert Assistance Requests", href: "/ask-expert", icon: MailQuestionMark },
    { label: "Brochure Download History", href: "/brochure-download", icon: Download },
    { label: "Shopify Admin Access Token", href: "/shop-token", icon: Key  },
  ];

  const [openMenu, setOpenMenu] = useState(null);
  const toggleMenu = (name) => {
    if (isCollapsed) return;
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full bg-gray-900 text-white
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
        ${isCollapsed ? "lg:w-20" : "lg:w-72"}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
          <h1
            className={`text-2xl font-bold transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            MegaShiprocket
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-gray-800 rounded-lg transition-all cursor-pointer"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Menu - NO SCROLLBAR */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`w-full flex items-center p-3 rounded-xl hover:bg-gray-800 transition-all group cursor-pointer ${
                      isCollapsed ? "justify-center" : "justify-between"
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openMenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {!isCollapsed && openMenu === item.label && (
                    <div className="ml-10 mt-2 space-y-1">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all ${
                            pathname === sub.href
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-700 text-gray-300"
                          }`}
                        >
                          <sub.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`relative flex items-center p-3 rounded-xl transition-all group ${
                    isCollapsed ? "justify-center" : "gap-3"
                  } ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}

                  {/* Tooltip on hover when collapsed */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={`p-4 border-t border-gray-800 text-center text-xs text-gray-400 shrink-0 transition-all duration-300 ${
            isCollapsed ? "opacity-0 h-0 py-0" : "opacity-100"
          }`}
        >
          MegaShiprocket v1.0
        </div>
      </div>
    </aside>
  );
}