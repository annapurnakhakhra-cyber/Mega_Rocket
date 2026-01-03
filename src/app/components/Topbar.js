'use client';
import { Menu, LogOut, User } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';

const Topbar = ({ toggleSidebar, sidebarOpen, isMobile }) => {
    const [email, setemail] = useState("");
    const [shop, setshop] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            setIsLoggedIn(true);
            try {
                const decoded = jwtDecode(token);
                setemail(decoded.email || "");

                const user = JSON.parse(userData);
                setshop(user.shopName || user.shop || "MegaShiprocket");
            } catch (error) {
                console.error("Error decoding token:", error);
                // Clear invalid data
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
            setemail("");
            setshop("");
        }
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.mobile-menu')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setemail("");
        setshop("");
        setMenuOpen(false);
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
                {isLoggedIn && (
                    <div className="flex sm:hidden items-center mobile-menu">
                        <div className="relative">
                            <button
                                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                onClick={() => setMenuOpen(!menuOpen)}
                                title="Account Menu"
                            >
                                <User className="w-5 h-5 text-white" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-56 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{shop}</p>
                                        <p className="text-xs text-gray-500 truncate">{email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Mobile Logout Button (always visible when logged in) */}
                {isLoggedIn && (
                    <div className="flex sm:hidden">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}

                {/* Desktop Avatar & Logout */}
                {isLoggedIn && (
                    <div className="hidden sm:flex items-center space-x-3">
                        {/* User Info */}
                        <div className="flex items-center space-x-2 text-right">
                            <div>
                                <p className="text-sm font-semibold text-gray-800 truncate max-w-32">{shop}</p>
                                <p className="text-xs text-gray-500 truncate max-w-32">{email}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topbar;