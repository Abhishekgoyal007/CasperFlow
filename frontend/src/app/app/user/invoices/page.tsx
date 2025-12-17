"use client";

import { DashboardLayout } from "@/components/dashboard";
import {
    FileText,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    ExternalLink
} from "lucide-react";

const invoices = [
    {
        id: "INV-001",
        merchant: "AI Vision Labs",
        plan: "Pro API",
        amount: "51.5 CSPR",
        date: "Dec 15, 2024",
        status: "paid",
        paymentMethod: "staked",
        txHash: "0x1234...abcd",
    },
    {
        id: "INV-002",
        merchant: "CasperDrive",
        plan: "Cloud Storage Pro",
        amount: "25 CSPR",
        date: "Dec 10, 2024",
        status: "paid",
        paymentMethod: "wallet",
        txHash: "0x5678...efgh",
    },
    {
        id: "INV-003",
        merchant: "CasperGames",
        plan: "Gaming Premium",
        amount: "10 CSPR",
        date: "Dec 5, 2024",
        status: "pending",
        paymentMethod: null,
        txHash: null,
    },
    {
        id: "INV-004",
        merchant: "AI Vision Labs",
        plan: "Pro API",
        amount: "48.2 CSPR",
        date: "Nov 15, 2024",
        status: "paid",
        paymentMethod: "staked",
        txHash: "0x9abc...ijkl",
    },
];

export default function UserInvoicesPage() {
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

    const getPaymentMethodBadge = (method: string | null) => {
        if (!method) return null;
        return method === "staked" ? (
            <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-xs">Stake-to-Pay</span>
        ) : (
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs">Wallet</span>
        );
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">My Invoices</h1>
                    <p className="text-gray-400 mt-1">View your billing history and download invoices.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-sm text-gray-500 mb-2">Total Paid</div>
                        <div className="text-2xl font-bold text-white">134.7 CSPR</div>
                        <div className="text-xs text-gray-500 mt-1">This month</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-sm text-gray-500 mb-2">Pending</div>
                        <div className="text-2xl font-bold text-yellow-400">10 CSPR</div>
                        <div className="text-xs text-gray-500 mt-1">1 invoice</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-sm text-gray-500 mb-2">Saved with Stake-to-Pay</div>
                        <div className="text-2xl font-bold text-green-400">99.7 CSPR</div>
                        <div className="text-xs text-gray-500 mt-1">Paid from staking rewards</div>
                    </div>
                </div>

                {/* Invoices List */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-lg font-semibold text-white">Invoice History</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Invoice</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Merchant / Plan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <span className="text-white font-mono text-sm">{invoice.id}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-white font-medium">{invoice.merchant}</div>
                                            <div className="text-sm text-gray-500">{invoice.plan}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-white font-medium">{invoice.amount}</div>
                                            {getPaymentMethodBadge(invoice.paymentMethod)}
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">{invoice.date}</td>
                                        <td className="py-4 px-6">{getStatusBadge(invoice.status)}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {invoice.status === "pending" ? (
                                                    <button className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-all">
                                                        Pay Now
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        {invoice.txHash && (
                                                            <a href="#" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </>
                                                )}
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
