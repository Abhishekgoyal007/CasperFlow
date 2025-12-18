"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { usePlans } from "@/context/PlansContext";
import {
    Package,
    Zap,
    Search,
    Check,
    Users
} from "lucide-react";
import Link from "next/link";

export default function UserBrowsePage() {
    const { isConnected } = useWallet();
    const { plans } = usePlans();

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Browse Plans</h1>
                    <p className="text-gray-400 mt-1">Discover subscription plans from merchants.</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search for plans..."
                        className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                </div>

                {/* Plans Grid or Empty State */}
                {plans.length === 0 ? (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Plans Available Yet</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Merchants haven't created any plans yet. Try the merchant dashboard to create a test plan.
                            </p>
                            <Link
                                href="/app/merchant/plans"
                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                            >
                                Switch to Merchant View →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
                            >
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{plan.description || "No description"}</p>
                                </div>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-500">CSPR/{plan.period}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                    <Users className="w-4 h-4" />
                                    {plan.subscribers} subscribers
                                </div>

                                <button
                                    disabled={!isConnected}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Check className="w-5 h-5" />
                                    {isConnected ? "Subscribe" : "Connect Wallet"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Demo:</span> Plans are shared between merchant and user views. In production, subscriptions are managed on-chain.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
