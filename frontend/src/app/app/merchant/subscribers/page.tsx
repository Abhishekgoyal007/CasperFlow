"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    Mail
} from "lucide-react";

const subscribers = [
    {
        id: 1,
        address: "0x1234...abcd",
        plan: "Pro API",
        status: "active",
        startDate: "Nov 15, 2024",
        nextBilling: "Dec 15, 2024",
        totalPaid: "153 CSPR",
        paymentMethod: "staked",
        usage: 12500,
        usageLimit: 50000,
    },
    {
        id: 2,
        address: "0x5678...efgh",
        plan: "Enterprise",
        status: "active",
        startDate: "Oct 1, 2024",
        nextBilling: "Jan 1, 2025",
        totalPaid: "600 CSPR",
        paymentMethod: "wallet",
        usage: 85000,
        usageLimit: null,
    },
    {
        id: 3,
        address: "0x9abc...ijkl",
        plan: "Starter",
        status: "pending",
        startDate: "Dec 14, 2024",
        nextBilling: "Jan 14, 2025",
        totalPaid: "0 CSPR",
        paymentMethod: null,
        usage: 234,
        usageLimit: 1000,
    },
    {
        id: 4,
        address: "0xdef0...mnop",
        plan: "Pro API",
        status: "active",
        startDate: "Sep 20, 2024",
        nextBilling: "Dec 20, 2024",
        totalPaid: "150 CSPR",
        paymentMethod: "staked",
        usage: 45000,
        usageLimit: 50000,
    },
    {
        id: 5,
        address: "0x1357...qrst",
        plan: "Starter",
        status: "cancelled",
        startDate: "Aug 5, 2024",
        nextBilling: "-",
        totalPaid: "40 CSPR",
        paymentMethod: "wallet",
        usage: 0,
        usageLimit: 1000,
    },
];

const stats = [
    { label: "Total Subscribers", value: "1,284", change: "+156 this month", trend: "up" },
    { label: "Active", value: "1,142", change: "+89 this month", trend: "up" },
    { label: "Churned", value: "142", change: "-12% vs last month", trend: "down" },
    { label: "Avg. Lifetime Value", value: "127 CSPR", change: "+8% vs last month", trend: "up" },
];

export default function MerchantSubscribersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredSubscribers = subscribers.filter((sub) => {
        const matchesSearch = sub.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Active
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            case "cancelled":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Cancelled
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Subscribers</h1>
                    <p className="text-gray-400 mt-1">Manage and view all your subscribers.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[#12121a] border border-white/10 rounded-xl p-5"
                        >
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                            <div className={`text-xs flex items-center gap-1 ${stat.trend === "up" ? "text-green-400" : "text-red-400"
                                }`}>
                                <TrendingUp className={`w-3 h-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                                {stat.change}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#12121a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Subscribers Table */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Subscriber</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Plan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Usage</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Next Billing</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Total Paid</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {sub.address.slice(2, 4).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="text-white font-mono text-sm">{sub.address}</span>
                                                    <div className="text-xs text-gray-500">Since {sub.startDate}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                                                {sub.plan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">{getStatusBadge(sub.status)}</td>
                                        <td className="py-4 px-6">
                                            {sub.usageLimit ? (
                                                <div className="space-y-1">
                                                    <div className="text-sm text-white">
                                                        {sub.usage.toLocaleString()} / {sub.usageLimit.toLocaleString()}
                                                    </div>
                                                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${(sub.usage / sub.usageLimit) > 0.8 ? "bg-red-500" : "bg-green-500"
                                                                }`}
                                                            style={{ width: `${Math.min((sub.usage / sub.usageLimit) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-white">{sub.usage.toLocaleString()} (unlimited)</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">{sub.nextBilling}</td>
                                        <td className="py-4 px-6 text-white font-medium">{sub.totalPaid}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
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
