"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { usePlans } from "@/context/PlansContext";
import {
    Users,
    Zap,
    Search
} from "lucide-react";

export default function MerchantSubscribersPage() {
    const { isConnected, address } = useWallet();
    const { subscriptions } = useSubscriptions();
    const { plans } = usePlans();

    // Get plans owned by this merchant
    const myPlans = plans.filter(p => p.createdBy === address);
    const myPlanIds = myPlans.map(p => p.id);

    // Get subscriptions to my plans
    const mySubscribers = subscriptions.filter(s => myPlanIds.includes(s.planId));
    const activeSubscribers = mySubscribers.filter(s => s.status === 'active');

    // Calculate stats
    const totalRevenue = mySubscribers.reduce((sum, s) => sum + s.planPrice, 0);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

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

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-white">{mySubscribers.length}</div>
                        <div className="text-sm text-gray-500">Total Subscribers</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-green-400">{activeSubscribers.length}</div>
                        <div className="text-sm text-gray-500">Active</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-red-400">
                            {mySubscribers.filter(s => s.status === 'cancelled').length}
                        </div>
                        <div className="text-sm text-gray-500">Churned</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-purple-400">{totalRevenue} CSPR</div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                    </div>
                </div>

                {/* Subscribers List or Empty State */}
                {mySubscribers.length === 0 ? (
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
                ) : (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                        {/* Search */}
                        <div className="p-4 border-b border-white/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by address..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Subscriber</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Plan</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Subscribed</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mySubscribers.map((sub) => (
                                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {sub.subscriberWallet.slice(2, 4).toUpperCase()}
                                                </div>
                                                <div className="font-mono text-sm text-white">
                                                    {sub.subscriberWallet.slice(0, 8)}...{sub.subscriberWallet.slice(-4)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full">
                                                {sub.planName}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'active'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {sub.status === 'active' ? '● Active' : '● Cancelled'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-400">
                                            {formatDate(sub.subscribedAt)}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-semibold text-green-400">
                                            {sub.planPrice} CSPR
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Info about testnet */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Mode:</span> Subscriber data is synced in real-time when users subscribe to your plans.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
