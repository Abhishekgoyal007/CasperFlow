"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import {
    FileText,
    Download,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    Filter,
    Search
} from "lucide-react";

const invoices = [
    {
        id: "INV-001",
        subscriber: "0x1234...abcd",
        plan: "Pro API",
        amount: "51.5 CSPR",
        baseAmount: "50 CSPR",
        usageAmount: "1.5 CSPR",
        usageUnits: 1500,
        date: "Dec 15, 2024",
        status: "paid",
        paymentMethod: "staked",
    },
    {
        id: "INV-002",
        subscriber: "0x5678...efgh",
        plan: "Enterprise",
        amount: "203.2 CSPR",
        baseAmount: "200 CSPR",
        usageAmount: "3.2 CSPR",
        usageUnits: 3200,
        date: "Dec 15, 2024",
        status: "paid",
        paymentMethod: "wallet",
    },
    {
        id: "INV-003",
        subscriber: "0x9abc...ijkl",
        plan: "Starter",
        amount: "10 CSPR",
        baseAmount: "10 CSPR",
        usageAmount: "0 CSPR",
        usageUnits: 0,
        date: "Dec 14, 2024",
        status: "pending",
        paymentMethod: null,
    },
    {
        id: "INV-004",
        subscriber: "0xdef0...mnop",
        plan: "Pro API",
        amount: "52.8 CSPR",
        baseAmount: "50 CSPR",
        usageAmount: "2.8 CSPR",
        usageUnits: 2800,
        date: "Dec 10, 2024",
        status: "paid",
        paymentMethod: "staked",
    },
    {
        id: "INV-005",
        subscriber: "0x1357...qrst",
        plan: "Starter",
        amount: "10 CSPR",
        baseAmount: "10 CSPR",
        usageAmount: "0 CSPR",
        usageUnits: 0,
        date: "Dec 5, 2024",
        status: "failed",
        paymentMethod: null,
    },
];

const stats = [
    { label: "Total Invoices", value: "1,847", color: "#8b5cf6" },
    { label: "Paid", value: "1,695", color: "#10b981" },
    { label: "Pending", value: "142", color: "#f59e0b" },
    { label: "Failed", value: "10", color: "#ef4444" },
];

export default function MerchantInvoicesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredInvoices = invoices.filter((invoice) => {
        const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.subscriber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Paid
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Failed
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
                    <h1 className="text-3xl font-bold text-white">Invoices</h1>
                    <p className="text-gray-400 mt-1">View and manage all your billing invoices.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[#12121a] border border-white/10 rounded-xl p-5"
                        >
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
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
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Invoice ID</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Subscriber</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Plan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="text-white font-mono text-sm">{invoice.id}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-400 font-mono text-sm">{invoice.subscriber}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                                                {invoice.plan}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-white font-medium">{invoice.amount}</div>
                                            {invoice.usageUnits > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    {invoice.baseAmount} + {invoice.usageAmount} ({invoice.usageUnits} units)
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">{invoice.date}</td>
                                        <td className="py-4 px-6">{getStatusBadge(invoice.status)}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                    <Download className="w-4 h-4" />
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
