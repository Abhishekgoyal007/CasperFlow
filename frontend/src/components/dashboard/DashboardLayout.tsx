"use client";

import { useState } from "react";
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
    ChevronDown,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { ConnectWalletButton } from "@/components/wallet";

const merchantNavItems = [
    { name: "Overview", href: "/app/merchant", icon: LayoutDashboard },
    { name: "Plans", href: "/app/merchant/plans", icon: CreditCard },
    { name: "Subscribers", href: "/app/merchant/subscribers", icon: Users },
    { name: "Usage & Billing", href: "/app/merchant/billing", icon: BarChart3 },
    { name: "Invoices", href: "/app/merchant/invoices", icon: FileText },
    { name: "Settings", href: "/app/merchant/settings", icon: Settings },
];

const userNavItems = [
    { name: "Overview", href: "/app/user", icon: LayoutDashboard },
    { name: "Subscriptions", href: "/app/user/subscriptions", icon: CreditCard },
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
    const navItems = type === "merchant" ? merchantNavItems : userNavItems;

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
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

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
