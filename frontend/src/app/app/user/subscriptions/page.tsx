"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    Package,
    Zap,
    Search
} from "lucide-react";
import Link from "next/link";

export default function UserSubscriptionsPage() {
    const { isConnected } = useWallet();

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Subscriptions</h1>
                        <p className="text-gray-400 mt-1">Manage your active subscriptions.</p>
                    </div>
                    <Link
                        href="/app/user/browse"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl"
                    >
                        <Search className="w-5 h-5" />
                        Browse Plans
                    </Link>
                </div>

                {/* Empty State */}
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

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Mode:</span> Subscriptions are managed via the SubscriptionManager contract on Casper testnet.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
