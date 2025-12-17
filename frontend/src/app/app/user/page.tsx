"use client";

import { DashboardLayout } from "@/components/dashboard";
import {
    CreditCard,
    BarChart3,
    Zap,
    ArrowUpRight,
    Clock,
    CheckCircle,
    AlertCircle
} from "lucide-react";

const activeSubscriptions = [
    {
        id: 1,
        name: "Pro API Access",
        merchant: "AI Vision Labs",
        price: "50 CSPR/month",
        nextBilling: "Dec 25, 2024",
        status: "active",
        usagePercent: 67,
    },
    {
        id: 2,
        name: "Cloud Storage Pro",
        merchant: "CasperDrive",
        price: "25 CSPR/month",
        nextBilling: "Jan 1, 2025",
        status: "active",
        usagePercent: 34,
    },
    {
        id: 3,
        name: "Gaming Premium",
        merchant: "CasperGames",
        price: "10 CSPR/month",
        nextBilling: "Dec 20, 2024",
        status: "expiring",
        usagePercent: 89,
    },
];

const usageHistory = [
    { date: "Today", calls: 1234, cost: "1.23 CSPR" },
    { date: "Yesterday", calls: 2156, cost: "2.16 CSPR" },
    { date: "Dec 14", calls: 1876, cost: "1.88 CSPR" },
    { date: "Dec 13", calls: 2543, cost: "2.54 CSPR" },
    { date: "Dec 12", calls: 1654, cost: "1.65 CSPR" },
];

const stats = [
    {
        title: "Active Subscriptions",
        value: "3",
        icon: CreditCard,
        color: "#8b5cf6",
    },
    {
        title: "This Month's Spend",
        value: "85 CSPR",
        icon: Zap,
        color: "#10b981",
    },
    {
        title: "API Calls Used",
        value: "45.2K",
        icon: BarChart3,
        color: "#3b82f6",
    },
];

export default function UserDashboard() {
    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage your subscriptions and track usage.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${stat.color}20` }}
                                >
                                    <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.title}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Active Subscriptions */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Active Subscriptions</h3>
                        <button className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1">
                            Browse Plans
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeSubscriptions.map((sub) => (
                            <div
                                key={sub.id}
                                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">{sub.name}</h4>
                                        <p className="text-sm text-gray-500">{sub.merchant}</p>
                                    </div>
                                    {sub.status === "active" ? (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                                            <CheckCircle className="w-3 h-3" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            Expiring
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Price</span>
                                        <span className="text-white font-medium">{sub.price}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Next billing</span>
                                        <span className="text-white flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-gray-500" />
                                            {sub.nextBilling}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Usage</span>
                                            <span className="text-white">{sub.usagePercent}%</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${sub.usagePercent > 80 ? "bg-red-500" : "bg-gradient-to-r from-purple-500 to-blue-500"
                                                    }`}
                                                style={{ width: `${sub.usagePercent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-4 py-2 px-4 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm">
                                    Manage
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usage History */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Usage</h3>
                        <button className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1">
                            View Details
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">API Calls</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usageHistory.map((row, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-white">{row.date}</td>
                                        <td className="py-4 px-4 text-white font-mono">{row.calls.toLocaleString()}</td>
                                        <td className="py-4 px-4 text-green-400">{row.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <div className="font-semibold text-white">Stake-to-Pay Enabled</div>
                                <div className="text-sm text-gray-400">Paying subscriptions from staking rewards</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-green-400">1,250 CSPR</div>
                            <div className="text-xs text-gray-500">Available rewards</div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
