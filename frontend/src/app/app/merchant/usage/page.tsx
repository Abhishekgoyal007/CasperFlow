"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { usePlans } from "@/context/PlansContext";
import {
    BarChart3,
    Zap,
    TrendingUp,
    Users,
    DollarSign,
    Activity,
    Calendar
} from "lucide-react";

// Simple bar chart component
function UsageBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-medium">{value}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

// Animated counter
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const steps = 60;
        const stepValue = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += stepValue;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue}{suffix}</span>;
}

export default function MerchantUsagePage() {
    const { address } = useWallet();
    const { subscriptions } = useSubscriptions();
    const { plans } = usePlans();

    // Get my plans and subscriptions
    const myPlans = plans.filter(p => p.createdBy === address);
    const myPlanIds = myPlans.map(p => p.id);
    const mySubscribers = subscriptions.filter(s => myPlanIds.includes(s.planId));
    const activeSubscribers = mySubscribers.filter(s => s.status === 'active');

    // Calculate stats
    const totalRevenue = mySubscribers.reduce((sum, s) => sum + s.planPrice, 0);
    const activeApiKeys = activeSubscribers.length;

    // Generate mock usage data for visualization (in production, this would come from real API tracking)
    const generateMockUsage = () => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            day,
            requests: Math.floor(Math.random() * 1000) + 100,
            revenue: Math.floor(Math.random() * 50) + 10
        }));
    };

    const [weeklyData] = useState(generateMockUsage());
    const maxRequests = Math.max(...weeklyData.map(d => d.requests));

    // Plan usage breakdown
    const planUsage = myPlans.map(plan => {
        const subs = mySubscribers.filter(s => s.planId === plan.id);
        return {
            name: plan.name,
            subscribers: subs.length,
            revenue: subs.reduce((sum, s) => sum + s.planPrice, 0)
        };
    });
    const maxPlanSubs = Math.max(...planUsage.map(p => p.subscribers), 1);

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Usage & Billing</h1>
                    <p className="text-gray-400 mt-1">Track API usage and revenue analytics.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <DollarSign className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedNumber value={totalRevenue} suffix=" CSPR" />
                                </div>
                                <div className="text-sm text-gray-500">Total Revenue</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedNumber value={activeSubscribers.length} />
                                </div>
                                <div className="text-sm text-gray-500">Active Subscribers</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Activity className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedNumber value={activeApiKeys} />
                                </div>
                                <div className="text-sm text-gray-500">Active API Keys</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedNumber value={myPlans.length} />
                                </div>
                                <div className="text-sm text-gray-500">Active Plans</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly API Requests */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                                API Requests This Week
                            </h3>
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Demo Data</span>
                        </div>
                        <div className="space-y-4">
                            {weeklyData.map((day, i) => (
                                <UsageBar
                                    key={day.day}
                                    label={day.day}
                                    value={day.requests}
                                    maxValue={maxRequests}
                                    color={`hsl(${270 - i * 20}, 70%, 50%)`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Revenue by Plan */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-400" />
                                Subscribers by Plan
                            </h3>
                        </div>

                        {planUsage.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Create plans to see usage breakdown</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {planUsage.map((plan, i) => (
                                    <UsageBar
                                        key={plan.name}
                                        label={plan.name}
                                        value={plan.subscribers}
                                        maxValue={maxPlanSubs}
                                        color={`hsl(${120 + i * 30}, 60%, 45%)`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Billing Summary */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            Billing Summary
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">This Month</div>
                            <div className="text-2xl font-bold text-green-400">{totalRevenue} CSPR</div>
                            <div className="text-xs text-gray-500 mt-1">From {mySubscribers.length} transactions</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Active MRR</div>
                            <div className="text-2xl font-bold text-purple-400">
                                {activeSubscribers.reduce((sum, s) => sum + s.planPrice, 0)} CSPR
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Monthly recurring revenue</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                            <div className="text-sm text-gray-400 mb-1">Avg. Revenue/User</div>
                            <div className="text-2xl font-bold text-blue-400">
                                {activeSubscribers.length > 0
                                    ? Math.round(totalRevenue / activeSubscribers.length)
                                    : 0} CSPR
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ARPU</div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Demo:</span> API request data is simulated. In production, this would track real API calls using your generated API keys.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
