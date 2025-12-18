"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    Users,
    Zap,
    ExternalLink,
    Search
} from "lucide-react";

export default function MerchantSubscribersPage() {
    const { isConnected, network } = useWallet();

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Subscribers</h1>
                        <p className="text-gray-400 mt-1">Manage and view all your subscribers.</p>
                    </div>
                </div>

                {/* Stats - All zeros for fresh deployment */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    {[
                        { label: "Total Subscribers", value: "0", color: "white" },
                        { label: "Active", value: "0", color: "green" },
                        { label: "Churned", value: "0", color: "red" },
                        { label: "Avg. Lifetime Value", value: "0 CSPR", color: "purple" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                            <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Subscribers Yet</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Once users subscribe to your plans, they will appear here. Create a plan first to start getting subscribers.
                        </p>
                        <a
                            href="/app/merchant/plans"
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Go to Plans →
                        </a>
                    </div>
                </div>

                {/* Info about testnet */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Mode:</span> Subscriber data will be fetched from the SubscriptionManager contract once users subscribe on-chain.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
