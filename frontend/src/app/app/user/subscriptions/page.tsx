"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import {
    Package,
    Zap,
    Search,
    Calendar,
    XCircle,
    CheckCircle,
    Key,
    Copy,
    Eye,
    EyeOff
} from "lucide-react";
import Link from "next/link";

export default function UserSubscriptionsPage() {
    const { isConnected, address } = useWallet();
    const { getSubscriptionsForUser, cancelSubscription } = useSubscriptions();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [showKeyId, setShowKeyId] = useState<string | null>(null);

    const mySubscriptions = getSubscriptionsForUser(address);
    const activeSubscriptions = mySubscriptions.filter(s => s.status === 'active');

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const copyApiKey = (id: string, apiKey: string) => {
        navigator.clipboard.writeText(apiKey);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Subscriptions</h1>
                        <p className="text-gray-400 mt-1">Manage your active subscriptions and API keys.</p>
                    </div>
                    <Link
                        href="/app/user/browse"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl"
                    >
                        <Search className="w-5 h-5" />
                        Browse Plans
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-white">{activeSubscriptions.length}</div>
                        <div className="text-sm text-gray-500">Active Subscriptions</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-green-400">
                            {activeSubscriptions.reduce((sum, s) => sum + s.planPrice, 0)} CSPR
                        </div>
                        <div className="text-sm text-gray-500">Monthly Spend</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-purple-400">{activeSubscriptions.length}</div>
                        <div className="text-sm text-gray-500">Active API Keys</div>
                    </div>
                </div>

                {/* Subscriptions List or Empty State */}
                {mySubscriptions.length === 0 ? (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Active Subscriptions</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                You don't have any active subscriptions yet. Browse available plans to get started.
                            </p>
                            {!isConnected ? (
                                <p className="text-sm text-yellow-400">Connect your wallet to subscribe to plans</p>
                            ) : (
                                <Link
                                    href="/app/user/browse"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl"
                                >
                                    <Search className="w-5 h-5" />
                                    Find Subscriptions
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mySubscriptions.map((sub) => (
                            <div
                                key={sub.id}
                                className={`bg-[#12121a] border rounded-2xl p-6 ${sub.status === 'active'
                                        ? 'border-green-500/30'
                                        : 'border-white/10 opacity-60'
                                    }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sub.status === 'active'
                                                ? 'bg-green-500/20'
                                                : 'bg-gray-500/20'
                                            }`}>
                                            {sub.status === 'active' ? (
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                            ) : (
                                                <XCircle className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{sub.planName}</h3>
                                            <div className="text-sm text-gray-400">
                                                {sub.planPrice} CSPR / {sub.planPeriod}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {sub.status === 'active' ? 'Expires' : 'Cancelled'}
                                            </div>
                                            <div className="text-sm text-white">
                                                {formatDate(sub.expiresAt)}
                                            </div>
                                        </div>

                                        {sub.status === 'active' && (
                                            <button
                                                onClick={() => cancelSubscription(sub.id)}
                                                className="py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* API Key Section */}
                                {sub.status === 'active' && sub.apiKey && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="flex items-center gap-2 text-sm text-green-400 mb-2">
                                            <Key className="w-4 h-4" />
                                            API Key
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 font-mono text-sm text-white bg-black/30 rounded-lg px-3 py-2">
                                                {showKeyId === sub.id ? sub.apiKey : `${sub.apiKey.slice(0, 12)}${'•'.repeat(20)}`}
                                            </div>
                                            <button
                                                onClick={() => setShowKeyId(showKeyId === sub.id ? null : sub.id)}
                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                {showKeyId === sub.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => copyApiKey(sub.id, sub.apiKey)}
                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            {copiedId === sub.id && (
                                                <span className="text-xs text-green-400">Copied!</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Pro Tip:</span> Keep your API keys secure. Use them to authenticate with the merchant's service.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
