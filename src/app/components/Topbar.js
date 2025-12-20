'use client';
import { Menu } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';

const Topbar = ({ toggleSidebar, sidebarOpen, isMobile }) => {
    const [email, setemail] = useState("");
    const [shop, setshop] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setemail(decoded.data.email);
                setshop(decoded.data.shop);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    function handleLogout() {
        sessionStorage.removeItem('token');
        window.location.href = '/auth/login';
    }

    return (
        <div className={`h-16 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border-b border-gray-200 px-4 flex items-center justify-between transition-all duration-300 ease-in-out`}>

            {/* LEFT SECTION — Title (visible on mobile too now that menu moved) */}
            <div className="none items-center">
                <h1 className="text-xl font-bold text-gray-800 tracking-tight sm:block">
                    MegaShiprocket
                </h1>
            </div>

            {/* RIGHT SECTION — Hamburger + Avatar */}
            <div className="flex items-center space-x-4">

                {/* Hamburger Menu (now on the right, only on mobile) */}
                <div className="flex sm:hidden">
                    <button
                        className="p-2 hover:bg-white/60 rounded-lg transition-all duration-200 cursor-pointer shadow-sm"
                        onClick={toggleSidebar}
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {/* Mobile Avatar */}
                <div className="flex sm:hidden items-center">
                    <div className="relative">
                        <div
                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span className="text-white text-xs font-semibold">
                               {email?.charAt?.(0)?.toUpperCase?.() || "?"}

                            </span>
                        </div>

                        {menuOpen && (
                            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-56 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{shop}</p>
                                    <p className="text-xs text-gray-500 truncate">{email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Avatar */}
                <div className="hidden sm:flex items-center space-x-3 relative group">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg">
                        <span className="text-white text-sm font-semibold">
                           {email?.charAt?.(0)?.toUpperCase?.() || "?"}

                        </span>
                    </div>

                    {/* Desktop dropdown */}
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">{shop}</p>
                            <p className="text-xs text-gray-500">{email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;