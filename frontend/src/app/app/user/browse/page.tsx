"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { usePlans } from "@/context/PlansContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { useNotifications } from "@/context/NotificationsContext";
import {
    Package,
    Zap,
    Search,
    Check,
    Users,
    CheckCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UserBrowsePage() {
    const { isConnected, address } = useWallet();
    const { plans, incrementSubscribers } = usePlans();
    const { subscribe, isSubscribed } = useSubscriptions();
    const { addNotification } = useNotifications();
    const [subscribingTo, setSubscribingTo] = useState<string | null>(null);

    const handleSubscribe = async (plan: typeof plans[0]) => {
        if (!isConnected || !address) return;
        if (isSubscribed(plan.id, address)) return;

        setSubscribingTo(plan.id);

        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Subscribe the user
        subscribe(
            plan.id,
            plan.name,
            plan.price,
            plan.period,
            plan.createdBy,
            address
        );

        // Increment plan stats
        incrementSubscribers(plan.id, plan.price);

        // Notify the merchant
        addNotification({
            type: 'subscription',
            title: 'New Subscriber! 🎉',
            message: `${address.slice(0, 8)}...${address.slice(-4)} subscribed to "${plan.name}" for ${plan.price} CSPR`,
            forWallet: plan.createdBy
        });

        // Notify the user
        addNotification({
            type: 'subscription',
            title: 'Subscription Active!',
            message: `You subscribed to "${plan.name}" for ${plan.price} CSPR/${plan.period}`,
            forWallet: address
        });

        setSubscribingTo(null);
    };

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
                        {plans.map((plan) => {
                            const alreadySubscribed = isSubscribed(plan.id, address);
                            const isLoading = subscribingTo === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`bg-[#12121a] border rounded-2xl p-6 transition-all ${alreadySubscribed
                                            ? 'border-green-500/50'
                                            : 'border-white/10 hover:border-purple-500/50'
                                        }`}
                                >
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                            {alreadySubscribed && (
                                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Subscribed
                                                </span>
                                            )}
                                        </div>
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

                                    {alreadySubscribed ? (
                                        <button
                                            disabled
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-500/20 text-green-400 font-semibold cursor-default"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Active Subscription
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleSubscribe(plan)}
                                            disabled={!isConnected || isLoading}
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : !isConnected ? (
                                                "Connect Wallet"
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Subscribe for {plan.price} CSPR
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Demo:</span> Subscriptions are stored locally. In production, payments would go on-chain.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
