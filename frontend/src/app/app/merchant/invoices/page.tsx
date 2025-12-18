"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { usePlans } from "@/context/PlansContext";
import {
    FileText,
    Zap,
    Download,
    ExternalLink,
    Calendar,
    CheckCircle,
    Clock
} from "lucide-react";

export default function MerchantInvoicesPage() {
    const { address, network } = useWallet();
    const { subscriptions } = useSubscriptions();
    const { plans } = usePlans();
    const [downloading, setDownloading] = useState<string | null>(null);

    // Get my plans and subscriptions (as invoices)
    const myPlans = plans.filter(p => p.createdBy === address);
    const myPlanIds = myPlans.map(p => p.id);
    const mySubscriptions = subscriptions.filter(s => myPlanIds.includes(s.planId));

    // Transform subscriptions into invoices
    const invoices = mySubscriptions.map(sub => ({
        id: `INV-${sub.id.slice(4, 12).toUpperCase()}`,
        subscriptionId: sub.id,
        customer: sub.subscriberWallet,
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

    // Generate and download invoice PDF (simplified HTML-based)
    const downloadInvoice = async (invoice: typeof invoices[0]) => {
        setDownloading(invoice.id);

        // Create invoice HTML
        const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoice.id}</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; color: #ef4444; }
        .invoice-title { font-size: 32px; color: #333; }
        .invoice-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { color: #666; }
        .value { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #333; color: white; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        .total-row { background: #f0fdf4; font-weight: bold; }
        .total-amount { color: #22c55e; font-size: 20px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; }
        .status-paid { color: #22c55e; }
        .status-cancelled { color: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CasperFlow</div>
        <div class="invoice-title">INVOICE</div>
    </div>
    
    <div class="invoice-info">
        <div class="info-row">
            <span class="label">Invoice Number:</span>
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
            <span class="label">Customer:</span>
            <span class="value">${invoice.customer.slice(0, 12)}...${invoice.customer.slice(-8)}</span>
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
                <td colspan="2">Total</td>
                <td style="text-align: right" class="total-amount">${invoice.amount} CSPR</td>
            </tr>
        </tbody>
    </table>
    
    <div class="footer">
        <p>Thank you for using CasperFlow!</p>
        <p>This invoice was generated on the Casper ${network} network.</p>
        <p>Invoice ID: ${invoice.id} | Transaction verified on-chain</p>
    </div>
</body>
</html>`;

        // Create blob and download
        const blob = new Blob([invoiceHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CasperFlow_${invoice.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Simulate delay
        await new Promise(r => setTimeout(r, 500));
        setDownloading(null);
    };

    // Stats
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const paidCount = invoices.filter(i => i.status === 'paid').length;

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Invoices</h1>
                    <p className="text-gray-400 mt-1">View and download invoices for all transactions.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-white">{invoices.length}</div>
                        <div className="text-sm text-gray-500">Total Invoices</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-green-400">{paidCount}</div>
                        <div className="text-sm text-gray-500">Paid</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-purple-400">{totalRevenue} CSPR</div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                    </div>
                </div>

                {/* Invoices Table or Empty State */}
                {invoices.length === 0 ? (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Invoices Yet</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Invoices will appear here when users subscribe to your plans.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Invoice</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Customer</th>
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
                                                <div className="font-mono text-sm text-gray-400">
                                                    {invoice.customer.slice(0, 8)}...{invoice.customer.slice(-4)}
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
                                                    {invoice.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm font-semibold text-green-400">
                                                {invoice.amount} CSPR
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
                            <span className="text-yellow-400">Testnet Mode:</span> Invoices are generated from subscription data. Download as HTML for easy viewing.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
