"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import {
    FileText,
    Zap,
    Download,
    Calendar,
    CheckCircle,
    Clock
} from "lucide-react";

export default function UserInvoicesPage() {
    const { address, network } = useWallet();
    const { getSubscriptionsForUser } = useSubscriptions();
    const [downloading, setDownloading] = useState<string | null>(null);

    const mySubscriptions = getSubscriptionsForUser(address);

    // Transform subscriptions into invoices
    const invoices = mySubscriptions.map((sub, index) => ({
        id: `INV-${sub.id.slice(-10).toUpperCase()}-${index}`,
        subscriptionId: sub.id,
        merchant: sub.merchantWallet,
        planName: sub.planName,
        amount: sub.planPrice,
        status: sub.status === 'active' ? 'paid' : 'cancelled',
        date: sub.subscribedAt,
        period: sub.planPeriod
    }));

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Generate and download invoice
    const downloadInvoice = async (invoice: typeof invoices[0]) => {
        setDownloading(invoice.id);

        const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoice.id}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
        .invoice-title { font-size: 32px; color: #333; }
        .invoice-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { color: #666; }
        .value { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #8b5cf6; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        .total-row { background: #fef3c7; font-weight: bold; }
        .total-amount { color: #d97706; font-size: 20px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; }
        .status-paid { color: #22c55e; }
        .status-cancelled { color: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CasperFlow</div>
        <div class="invoice-title">RECEIPT</div>
    </div>
    
    <div class="invoice-info">
        <div class="info-row">
            <span class="label">Receipt Number:</span>
            <span class="value">${invoice.id}</span>
        </div>
        <div class="info-row">
            <span class="label">Date:</span>
            <span class="value">${formatDate(invoice.date)}</span>
        </div>
        <div class="info-row">
            <span class="label">Status:</span>
            <span class="value status-${invoice.status}">${invoice.status.toUpperCase()}</span>
        </div>
        <div class="info-row">
            <span class="label">Merchant:</span>
            <span class="value">${invoice.merchant.slice(0, 12)}...${invoice.merchant.slice(-8)}</span>
        </div>
        <div class="info-row">
            <span class="label">Your Wallet:</span>
            <span class="value">${address?.slice(0, 12)}...${address?.slice(-8)}</span>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Period</th>
                <th style="text-align: right">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${invoice.planName} Subscription</td>
                <td>${invoice.period}</td>
                <td style="text-align: right">${invoice.amount} CSPR</td>
            </tr>
            <tr class="total-row">
                <td colspan="2">Total Paid</td>
                <td style="text-align: right" class="total-amount">${invoice.amount} CSPR</td>
            </tr>
        </tbody>
    </table>
    
    <div class="footer">
        <p>Thank you for your subscription!</p>
        <p>Transaction verified on Casper ${network} network.</p>
        <p>Receipt ID: ${invoice.id}</p>
    </div>
</body>
</html>`;

        const blob = new Blob([invoiceHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CasperFlow_Receipt_${invoice.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await new Promise(r => setTimeout(r, 500));
        setDownloading(null);
    };

    // Stats
    const totalSpent = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Invoices & Receipts</h1>
                    <p className="text-gray-400 mt-1">View and download receipts for your subscriptions.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-white">{invoices.length}</div>
                        <div className="text-sm text-gray-500">Total Receipts</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-green-400">
                            {invoices.filter(i => i.status === 'paid').length}
                        </div>
                        <div className="text-sm text-gray-500">Active</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-purple-400">{totalSpent} CSPR</div>
                        <div className="text-sm text-gray-500">Total Spent</div>
                    </div>
                </div>

                {/* Invoices or Empty State */}
                {invoices.length === 0 ? (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Receipts Yet</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Your payment receipts will appear here after subscribing to plans.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Receipt</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Plan</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-purple-400" />
                                                    <span className="font-mono text-sm text-white">{invoice.id}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                                                    {invoice.planName}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(invoice.date)}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`flex items-center gap-1 text-xs ${invoice.status === 'paid'
                                                    ? 'text-green-400'
                                                    : 'text-red-400'
                                                    }`}>
                                                    {invoice.status === 'paid'
                                                        ? <CheckCircle className="w-3 h-3" />
                                                        : <Clock className="w-3 h-3" />
                                                    }
                                                    {invoice.status === 'paid' ? 'PAID' : 'CANCELLED'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-semibold text-yellow-400">
                                                -{invoice.amount} CSPR
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => downloadInvoice(invoice)}
                                                    disabled={downloading === invoice.id}
                                                    className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                                                >
                                                    {downloading === invoice.id ? (
                                                        <div className="w-4 h-4 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                    Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Mode:</span> Receipts are generated from your subscription history.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
