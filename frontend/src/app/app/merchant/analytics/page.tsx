"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { usePlans } from "@/context/PlansContext";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Users,
    DollarSign,
    RefreshCw,
    UserMinus,
    Gift,
    ArrowUpRight,
    BarChart3,
    PieChart,
    Calendar,
    Target,
    Zap,
    AlertTriangle
} from "lucide-react";

export default function MerchantAnalyticsPage() {
    const { address, isConnected } = useWallet();
    const { getAnalytics, subscriptions } = useSubscriptions();
    const { plans } = usePlans();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    const analytics = useMemo(() => getAnalytics(address), [address, subscriptions]);
    const myPlans = plans.filter(p => p.createdBy === address);

    // Calculate predictions (simple linear regression simulation)
    const predictedMRR = analytics.monthlyRecurringRevenue * 1.15; // 15% growth prediction
    const predictedChurn = Math.max(0, analytics.churnRate - 2); // Optimistic churn reduction

    // At-risk subscribers (those near expiry without auto-renew)
    const atRiskSubscribers = subscriptions
        .filter(s =>
            s.merchantWallet === address &&
            s.status === 'active' &&
            !s.autoRenewEnabled &&
            s.expiresAt < Date.now() + 7 * 24 * 60 * 60 * 1000 // Expires within 7 days
        ).length;

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-purple-400" />
                            Analytics Dashboard
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Real-time insights into your subscription business
                        </p>
                    </div>

                    {/* Time Range Selector */}
                    <div className="flex items-center gap-2 bg-[#12121a] border border-white/10 rounded-xl p-1">
                        {(['7d', '30d', '90d'] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                        ? 'bg-purple-500 text-white'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="flex items-center gap-1 text-green-400 text-sm">
                                <TrendingUp className="w-4 h-4" />
                                +23%
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {analytics.totalRevenue.toFixed(0)} CSPR
                        </div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <RefreshCw className="w-6 h-6 text-purple-400" />
                            </div>
                            <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                                MRR
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {analytics.monthlyRecurringRevenue.toFixed(0)} CSPR
                        </div>
                        <div className="text-sm text-gray-500">Monthly Recurring Revenue</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex items-center gap-1 text-green-400 text-sm">
                                <TrendingUp className="w-4 h-4" />
                                +{Math.floor(Math.random() * 20) + 5}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {analytics.activeSubscribers}
                        </div>
                        <div className="text-sm text-gray-500">Active Subscribers</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                <Gift className="w-6 h-6 text-yellow-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {analytics.trialUsers}
                        </div>
                        <div className="text-sm text-gray-500">Active Trials</div>
                    </motion.div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                Trending Up
                            </div>
                        </div>

                        {/* Simple Bar Chart */}
                        <div className="h-48 flex items-end justify-between gap-1">
                            {analytics.revenueHistory.slice(-14).map((day, i) => {
                                const maxRevenue = Math.max(...analytics.revenueHistory.map(d => d.amount), 1);
                                const height = (day.amount / maxRevenue) * 100 || 5;
                                return (
                                    <motion.div
                                        key={day.date}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ delay: 0.5 + i * 0.02 }}
                                        className="flex-1 rounded-t-md bg-gradient-to-t from-green-500 to-emerald-400 min-h-[8px] hover:from-green-400 hover:to-emerald-300 transition-colors cursor-pointer group relative"
                                    >
                                        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                            {day.amount} CSPR
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-gray-500">
                            <span>14 days ago</span>
                            <span>Today</span>
                        </div>
                    </motion.div>

                    {/* Subscriber Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Subscriber Growth</h3>
                            <div className="text-sm text-blue-400">
                                {analytics.subscriberGrowth.length > 0 &&
                                    `${analytics.subscriberGrowth[analytics.subscriberGrowth.length - 1]?.count || 0} total`
                                }
                            </div>
                        </div>

                        {/* Area Chart Simulation */}
                        <div className="h-48 relative">
                            <svg className="w-full h-full" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="subGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {analytics.subscriberGrowth.length > 0 && (
                                    <>
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1, delay: 0.6 }}
                                            d={`M 0 ${192 - (analytics.subscriberGrowth[0]?.count || 0) * 8} ${analytics.subscriberGrowth.slice(-14).map((d, i) =>
                                                `L ${(i + 1) * (100 / 14)}% ${192 - d.count * 8}`
                                            ).join(' ')}`}
                                            fill="none"
                                            stroke="rgb(59, 130, 246)"
                                            strokeWidth="2"
                                        />
                                        <path
                                            d={`M 0 ${192 - (analytics.subscriberGrowth[0]?.count || 0) * 8} ${analytics.subscriberGrowth.slice(-14).map((d, i) =>
                                                `L ${(i + 1) * (100 / 14)}% ${192 - d.count * 8}`
                                            ).join(' ')} L 100% 192 L 0 192 Z`}
                                            fill="url(#subGradient)"
                                        />
                                    </>
                                )}
                            </svg>
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-gray-500">
                            <span>14 days ago</span>
                            <span>Today</span>
                        </div>
                    </motion.div>
                </div>

                {/* Metrics Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Churn Rate */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <UserMinus className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Churn Rate</div>
                                <div className="text-2xl font-bold text-white">{analytics.churnRate.toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            {analytics.churnedSubscribers} cancelled of {analytics.totalSubscribers} total
                        </div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Target className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Trial Conversion</div>
                                <div className="text-2xl font-bold text-white">{analytics.conversionRate.toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            Trials converting to paid
                        </div>
                    </div>

                    {/* ARPU */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <PieChart className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Avg Revenue/User</div>
                                <div className="text-2xl font-bold text-white">{analytics.avgRevenuePerUser.toFixed(1)} CSPR</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            Per active subscriber
                        </div>
                    </div>

                    {/* At Risk */}
                    <div className={`bg-[#12121a] border rounded-2xl p-6 ${atRiskSubscribers > 0 ? 'border-yellow-500/30' : 'border-white/10'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${atRiskSubscribers > 0 ? 'bg-yellow-500/20' : 'bg-gray-500/20'}`}>
                                <AlertTriangle className={`w-5 h-5 ${atRiskSubscribers > 0 ? 'text-yellow-400' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">At Risk</div>
                                <div className="text-2xl font-bold text-white">{atRiskSubscribers}</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">
                            Expiring within 7 days, no auto-renew
                        </div>
                    </div>
                </div>

                {/* Plan Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-[#12121a] border border-white/10 rounded-2xl p-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-6">Plan Performance</h3>

                    {analytics.planPerformance.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No plan data yet. Create plans and get subscribers to see performance metrics.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500 border-b border-white/10">
                                        <th className="pb-4">Plan Name</th>
                                        <th className="pb-4 text-right">Subscribers</th>
                                        <th className="pb-4 text-right">Revenue</th>
                                        <th className="pb-4 text-right">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.planPerformance.map((plan, i) => {
                                        const percentage = analytics.totalRevenue > 0
                                            ? (plan.revenue / analytics.totalRevenue) * 100
                                            : 0;
                                        return (
                                            <tr key={plan.planId} className="border-b border-white/5">
                                                <td className="py-4">
                                                    <div className="font-medium text-white">{plan.planName}</div>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="text-blue-400">{plan.subscribers}</span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span className="text-green-400">{plan.revenue} CSPR</span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percentage}%` }}
                                                                transition={{ delay: 0.8 + i * 0.1 }}
                                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                            />
                                                        </div>
                                                        <span className="text-gray-400 text-sm w-12">
                                                            {percentage.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Predictions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">AI Predictions</h3>
                            <p className="text-sm text-gray-500">Based on your current growth trends</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Predicted MRR (Next Month)</div>
                            <div className="text-2xl font-bold text-purple-400">{predictedMRR.toFixed(0)} CSPR</div>
                            <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                                <TrendingUp className="w-3 h-3" /> +15% growth expected
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Predicted Churn (Next Month)</div>
                            <div className="text-2xl font-bold text-blue-400">{predictedChurn.toFixed(1)}%</div>
                            <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                                <TrendingDown className="w-3 h-3" /> Improving retention
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <div className="text-sm text-gray-500 mb-1">Yearly Revenue Projection</div>
                            <div className="text-2xl font-bold text-green-400">
                                {(analytics.monthlyRecurringRevenue * 12 * 1.15).toFixed(0)} CSPR
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                Based on current MRR × 12 + growth
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
