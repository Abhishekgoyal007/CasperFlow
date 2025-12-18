"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Zap,
    LayoutDashboard,
    CreditCard,
    Users,
    BarChart3,
    FileText,
    Settings,
    Bell,
    Menu,
    X,
    Check,
    Trash2,
    Coins,
    Package
} from "lucide-react";
import { ConnectWalletButton } from "@/components/wallet";
import { useNotifications } from "@/context/NotificationsContext";
import { useWallet } from "@/context/WalletContext";

const merchantNavItems = [
    { name: "Overview", href: "/app/merchant", icon: LayoutDashboard },
    { name: "Plans", href: "/app/merchant/plans", icon: CreditCard },
    { name: "Subscribers", href: "/app/merchant/subscribers", icon: Users },
    { name: "Usage & Billing", href: "/app/merchant/usage", icon: BarChart3 },
    { name: "Invoices", href: "/app/merchant/invoices", icon: FileText },
    { name: "Settings", href: "/app/merchant/settings", icon: Settings },
];

const userNavItems = [
    { name: "Overview", href: "/app/user", icon: LayoutDashboard },
    { name: "Browse Plans", href: "/app/user/browse", icon: Package },
    { name: "My Subscriptions", href: "/app/user/subscriptions", icon: CreditCard },
    { name: "Stake-to-Pay", href: "/app/user/stake", icon: Coins },
    { name: "Usage", href: "/app/user/usage", icon: BarChart3 },
    { name: "Invoices", href: "/app/user/invoices", icon: FileText },
    { name: "Settings", href: "/app/user/settings", icon: Settings },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
    type: "merchant" | "user";
}

export function DashboardLayout({ children, type }: DashboardLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const navItems = type === "merchant" ? merchantNavItems : userNavItems;

    const { address } = useWallet();
    const { getNotificationsForWallet, markAsRead, markAllAsRead, clearAll } = useNotifications();

    const myNotifications = getNotificationsForWallet(address);
    const unreadCount = myNotifications.filter(n => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-72 bg-[#0d0d14] border-r border-white/10
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Casper<span className="text-red-500">Flow</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Role Badge */}
                <div className="px-6 py-4">
                    <div className={`
                        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                        ${type === "merchant"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-green-500/20 text-green-400"
                        }
                    `}>
                        {type === "merchant" ? "Merchant Dashboard" : "User Dashboard"}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                            ${isActive
                                                ? "bg-white/10 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }
                                        `}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActive ? "text-red-500" : ""}`} />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Switch Role */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <Link
                        href={type === "merchant" ? "/app/user" : "/app/merchant"}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                    >
                        Switch to {type === "merchant" ? "User" : "Merchant"} View
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Top bar */}
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notifOpen && (
                                <div className="absolute right-0 top-12 w-80 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                                        <h3 className="font-semibold text-white">Notifications</h3>
                                        {myNotifications.length > 0 && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-gray-400 hover:text-white"
                                                >
                                                    Mark all read
                                                </button>
                                                <button
                                                    onClick={clearAll}
                                                    className="text-xs text-red-400 hover:text-red-300"
                                                >
                                                    Clear all
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto">
                                        {myNotifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500">
                                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No notifications</p>
                                            </div>
                                        ) : (
                                            myNotifications.slice(0, 10).map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => markAsRead(notif.id)}
                                                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.read ? 'bg-purple-500/5' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${notif.read ? 'bg-gray-600' : 'bg-purple-500'
                                                            }`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm text-white">{notif.title}</div>
                                                            <div className="text-xs text-gray-400 mt-1 truncate">{notif.message}</div>
                                                            <div className="text-[10px] text-gray-600 mt-1">{formatTime(notif.timestamp)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wallet Connection */}
                        <div className="pl-4 border-l border-white/10">
                            <ConnectWalletButton />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
