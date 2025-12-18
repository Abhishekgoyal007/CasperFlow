"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    TrendingUp,
    Users,
    CreditCard,
    BarChart3,
    Zap,
    ArrowUpRight,
    Plus,
    Wallet,
    Package,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

// Contract deployed on testnet
const SUBSCRIPTION_MANAGER_HASH = "55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143";

export default function MerchantDashboard() {
    const { isConnected, address, balance, network, publicKey } = useWallet();

    // Real stats would come from contract - showing zeros for fresh deployment
    const stats = [
        {
            title: "Total Revenue",
            value: "0 CSPR",
            subtitle: "From subscriptions",
            icon: CreditCard,
            color: "#10b981",
        },
        {
            title: "Active Subscribers",
            value: "0",
            subtitle: "Across all plans",
            icon: Users,
            color: "#8b5cf6",
        },
        {
            title: "API Calls",
            value: "0",
            subtitle: "This month",
            icon: BarChart3,
            color: "#3b82f6",
        },
        {
            title: "Wallet Balance",
            value: isConnected ? `${balance} CSPR` : "-- CSPR",
            subtitle: isConnected ? "Available for gas" : "Connect wallet",
            icon: Wallet,
            color: "#f59e0b",
        },
    ];

    return (
        <DashboardLayout type="merchant">
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
                                Contract deployed at{" "}
                                <a
                                    href={`https://testnet.cspr.live/deploy/${SUBSCRIPTION_MANAGER_HASH}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-yellow-400 hover:underline"
                                >
                                    {SUBSCRIPTION_MANAGER_HASH.slice(0, 8)}...
                                </a>
                            </div>
                        </div>
                        <a
                            href={`https://testnet.cspr.live/deploy/${SUBSCRIPTION_MANAGER_HASH}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-400 hover:text-yellow-300"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

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
                        <h1 className="text-3xl font-bold text-white">Merchant Dashboard</h1>
                        <p className="text-gray-400 mt-1">Manage your subscription plans and track revenue.</p>
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
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.title}</div>
                            <div className="text-xs text-gray-600 mt-1">{stat.subtitle}</div>
                        </div>
                    ))}
                </div>

                {/* Empty State for Plans */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Plans Created Yet</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Create your first subscription plan to start accepting recurring payments from customers.
                        </p>
                        <Link
                            href="/app/merchant/plans"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Plan
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                        <span className="text-sm text-gray-500">From testnet</span>
                    </div>

                    <div className="text-center py-8">
                        <div className="text-gray-500">No activity yet</div>
                        <div className="text-sm text-gray-600 mt-1">
                            Subscriber activity will appear here
                        </div>
                    </div>
                </div>

                {/* Contract Info */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Deployed Contracts</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div>
                                <div className="font-medium text-white">SubscriptionManager</div>
                                <div className="text-xs text-gray-500 font-mono">
                                    {SUBSCRIPTION_MANAGER_HASH.slice(0, 16)}...{SUBSCRIPTION_MANAGER_HASH.slice(-8)}
                                </div>
                            </div>
                            <a
                                href={`https://testnet.cspr.live/deploy/${SUBSCRIPTION_MANAGER_HASH}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                            >
                                View <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
