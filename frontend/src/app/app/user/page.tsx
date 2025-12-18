"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import {
    CreditCard,
    Zap,
    ArrowUpRight,
    Wallet,
    Search,
    ExternalLink,
    Package,
    Key,
    Calendar,
    CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function UserDashboard() {
    const { isConnected, address, balance, network, publicKey } = useWallet();
    const { getSubscriptionsForUser } = useSubscriptions();

    // Get real subscriptions
    const mySubscriptions = getSubscriptionsForUser(address);
    const activeSubscriptions = mySubscriptions.filter(s => s.status === 'active');
    const monthlySpend = activeSubscriptions.reduce((sum, s) => sum + s.planPrice, 0);

    const stats = [
        {
            title: "Active Subscriptions",
            value: activeSubscriptions.length.toString(),
            icon: CreditCard,
            color: "#8b5cf6",
        },
        {
            title: "This Month's Spend",
            value: `${monthlySpend} CSPR`,
            icon: Zap,
            color: "#10b981",
        },
        {
            title: "Wallet Balance",
            value: isConnected ? `${balance} CSPR` : "-- CSPR",
            icon: Wallet,
            color: "#3b82f6",
        },
    ];

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Testnet Banner */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                            <span className="text-sm text-yellow-400">Testnet Mode</span>
                            <span className="text-gray-400 text-sm mx-2">•</span>
                            <a
                                href="https://testnet.cspr.live/tools/faucet"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-white"
                            >
                                Get test CSPR <ExternalLink className="w-3 h-3 inline" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Wallet Status Banner */}
                {isConnected && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400">Connected Wallet</div>
                                    <div className="font-mono text-white">{address}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold text-purple-400">{balance} CSPR</div>
                                <a
                                    href={`https://${network === 'testnet' ? 'testnet.' : ''}cspr.live/account/${publicKey}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-gray-500 hover:text-gray-300 capitalize flex items-center gap-1 justify-end"
                                >
                                    {network} <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                        <p className="text-gray-400 mt-1">Manage your subscriptions and track usage.</p>
                    </div>
                    <Link
                        href="/app/user/browse"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105"
                    >
                        <Search className="w-5 h-5" />
                        Browse Plans
                    </Link>
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
                        <Link
                            href="/app/user/subscriptions"
                            className="text-sm text-purple-500 hover:text-purple-400 flex items-center gap-1"
                        >
                            View All
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {activeSubscriptions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-purple-500" />
                            </div>
                            <h4 className="text-lg font-medium text-white mb-2">No Active Subscriptions</h4>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Browse available plans and subscribe to services using CSPR.
                            </p>
                            <Link
                                href="/app/user/browse"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                            >
                                <Search className="w-5 h-5" />
                                Find Subscriptions
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeSubscriptions.slice(0, 3).map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{sub.planName}</div>
                                            <div className="text-sm text-gray-400">{sub.planPrice} CSPR/{sub.planPeriod}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            Expires {formatDate(sub.expiresAt)}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-green-400 mt-1">
                                            <Key className="w-3 h-3" />
                                            API Key Active
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activeSubscriptions.length > 3 && (
                                <Link
                                    href="/app/user/subscriptions"
                                    className="block text-center py-2 text-sm text-purple-400 hover:text-purple-300"
                                >
                                    View all {activeSubscriptions.length} subscriptions →
                                </Link>
                            )}
                        </div>
                    )}
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
                                <div className="font-semibold text-white">
                                    {isConnected ? "Wallet Connected" : "Connect Wallet"}
                                </div>
                                <div className="text-sm text-gray-400">
                                    {isConnected
                                        ? "Pay subscriptions directly with CSPR"
                                        : "Connect your Casper Wallet to pay"}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                                {isConnected ? `${balance} CSPR` : "-- CSPR"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {isConnected ? "Available" : "Not connected"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                        {isConnected && publicKey && (
                            <a
                                href={`https://${network === 'testnet' ? 'testnet.' : ''}cspr.live/account/${publicKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                            >
                                View on Explorer
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>

                    {mySubscriptions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-500">No subscription transactions yet</div>
                            <div className="text-sm text-gray-600 mt-1">
                                Your payment history will appear here
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {mySubscriptions.slice(0, 5).map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${sub.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'
                                            }`}>
                                            <CreditCard className={`w-4 h-4 ${sub.status === 'active' ? 'text-green-400' : 'text-gray-400'
                                                }`} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">
                                                Subscribed to {sub.planName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(sub.subscribedAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-red-400">
                                        -{sub.planPrice} CSPR
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
