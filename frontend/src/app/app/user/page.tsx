"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    CreditCard,
    BarChart3,
    Zap,
    ArrowUpRight,
    Clock,
    CheckCircle,
    Wallet,
    Search,
    ExternalLink,
    Package
} from "lucide-react";
import Link from "next/link";

// Contract deployed on testnet
const SUBSCRIPTION_MANAGER_HASH = "55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143";

export default function UserDashboard() {
    const { isConnected, address, balance, network, publicKey } = useWallet();

    // Real stats - zeros for fresh deployment
    const stats = [
        {
            title: "Active Subscriptions",
            value: "0",
            icon: CreditCard,
            color: "#8b5cf6",
        },
        {
            title: "This Month's Spend",
            value: "0 CSPR",
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

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Testnet Banner */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-yellow-400">Testnet Mode</div>
                            <div className="text-xs text-gray-400">
                                Connected to Casper Testnet • Get test CSPR from{" "}
                                <a
                                    href="https://testnet.cspr.live/tools/faucet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-yellow-400 hover:underline"
                                >
                                    faucet
                                </a>
                            </div>
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

                {/* Active Subscriptions - Empty State */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Active Subscriptions</h3>
                        <Link
                            href="/app/user/browse"
                            className="text-sm text-purple-500 hover:text-purple-400 flex items-center gap-1"
                        >
                            Browse Plans
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

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

                {/* Recent Transactions - Empty State */}
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

                    <div className="text-center py-8">
                        <div className="text-gray-500">No subscription transactions yet</div>
                        <div className="text-sm text-gray-600 mt-1">
                            Your payment history will appear here
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
