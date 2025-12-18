"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    TrendingUp,
    TrendingDown,
    Users,
    CreditCard,
    BarChart3,
    Zap,
    ArrowUpRight,
    Plus,
    Wallet
} from "lucide-react";
import Link from "next/link";

const stats = [
    {
        title: "Total Revenue",
        value: "45,231 CSPR",
        change: "+12.5%",
        trend: "up",
        icon: CreditCard,
        color: "#10b981",
    },
    {
        title: "Active Subscribers",
        value: "1,284",
        change: "+156",
        trend: "up",
        icon: Users,
        color: "#8b5cf6",
    },
    {
        title: "API Calls (This Month)",
        value: "2.4M",
        change: "+23.1%",
        trend: "up",
        icon: BarChart3,
        color: "#3b82f6",
    },
    {
        title: "Avg. Revenue Per User",
        value: "35.2 CSPR",
        change: "-2.3%",
        trend: "down",
        icon: Zap,
        color: "#f59e0b",
    },
];

const recentSubscribers = [
    { id: 1, address: "0x1234...abcd", plan: "Pro API", date: "2 hours ago", amount: "50 CSPR" },
    { id: 2, address: "0x5678...efgh", plan: "Enterprise", date: "5 hours ago", amount: "200 CSPR" },
    { id: 3, address: "0x9abc...ijkl", plan: "Starter", date: "1 day ago", amount: "10 CSPR" },
    { id: 4, address: "0xdef0...mnop", plan: "Pro API", date: "2 days ago", amount: "50 CSPR" },
    { id: 5, address: "0x1357...qrst", plan: "Pro API", date: "3 days ago", amount: "50 CSPR" },
];

const plans = [
    { name: "Starter", subscribers: 342, revenue: "3,420 CSPR", color: "#10b981" },
    { name: "Pro API", subscribers: 756, revenue: "37,800 CSPR", color: "#8b5cf6" },
    { name: "Enterprise", subscribers: 186, revenue: "37,200 CSPR", color: "#f59e0b" },
];

export default function MerchantDashboard() {
    const { isConnected, address, balance, network } = useWallet();

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Wallet Status Banner */}
                {isConnected && (
                    <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Connected Merchant Wallet</div>
                                    <div className="font-mono text-white">{address}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-green-400">{balance} CSPR</div>
                                <div className="text-xs text-gray-500 capitalize">{network}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Merchant Dashboard</h1>
                        <p className="text-gray-400 mt-1">Welcome back! Here's your business overview.</p>
                    </div>
                    <Link
                        href="/app/merchant/plans"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Create Plan
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"
                                    }`}>
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.title}</div>
                        </div>
                    ))}
                </div>

                {/* Charts & Tables Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-white/20">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                            </select>
                        </div>

                        {/* Simple bar chart */}
                        <div className="h-64 flex items-end justify-between gap-2">
                            {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-lg bg-gradient-to-t from-red-500 to-purple-500 transition-all hover:opacity-80"
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-xs text-gray-500">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Plans Distribution */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Plans Distribution</h3>
                        <div className="space-y-4">
                            {plans.map((plan, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white font-medium">{plan.name}</span>
                                        <span className="text-gray-400">{plan.subscribers} subscribers</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${(plan.subscribers / 1284) * 100}%`,
                                                backgroundColor: plan.color
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">{plan.revenue}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Subscribers */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Subscribers</h3>
                        <button className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1">
                            View All
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Address</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Plan</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSubscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="text-white font-mono text-sm">{subscriber.address}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                                                {subscriber.plan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-white">{subscriber.amount}</td>
                                        <td className="py-4 px-4 text-gray-500 text-sm">{subscriber.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
