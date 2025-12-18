"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import {
    BarChart3,
    Zap,
    TrendingUp,
    Activity,
    Clock,
    Key
} from "lucide-react";

// Simple bar chart component
function UsageBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-medium">{value.toLocaleString()}</span>
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

    return <span>{displayValue.toLocaleString()}{suffix}</span>;
}

export default function UserUsagePage() {
    const { address } = useWallet();
    const { getSubscriptionsForUser } = useSubscriptions();

    const mySubscriptions = getSubscriptionsForUser(address);
    const activeSubscriptions = mySubscriptions.filter(s => s.status === 'active');
    const totalSpend = mySubscriptions.reduce((sum, s) => sum + s.planPrice, 0);

    // Generate mock usage data for each subscription
    const generateMockApiUsage = () => {
        return activeSubscriptions.map(sub => ({
            ...sub,
            apiCalls: Math.floor(Math.random() * 5000) + 500,
            lastUsed: Date.now() - Math.floor(Math.random() * 86400000)
        }));
    };

    const [usageData] = useState(generateMockApiUsage());
    const totalApiCalls = usageData.reduce((sum, s) => sum + s.apiCalls, 0);
    const maxCalls = Math.max(...usageData.map(s => s.apiCalls), 1);

    // Weekly usage trend
    const weeklyTrend = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        day,
        calls: Math.floor(Math.random() * 1000) + 100
    }));
    const maxWeekly = Math.max(...weeklyTrend.map(d => d.calls));

    const formatTimeAgo = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Usage Dashboard</h1>
                    <p className="text-gray-400 mt-1">Track your API usage and subscription activity.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Activity className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedNumber value={totalApiCalls} />
                                </div>
                                <div className="text-sm text-gray-500">Total API Calls</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Key className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedNumber value={activeSubscriptions.length} />
                                </div>
                                <div className="text-sm text-gray-500">Active API Keys</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedNumber value={totalSpend} suffix=" CSPR" />
                                </div>
                                <div className="text-sm text-gray-500">Total Spend</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Clock className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">
                                    {usageData.length > 0 ? formatTimeAgo(Math.max(...usageData.map(u => u.lastUsed))) : '--'}
                                </div>
                                <div className="text-sm text-gray-500">Last API Call</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Usage Trend */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-purple-400" />
                                Weekly API Usage
                            </h3>
                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Demo Data</span>
                        </div>

                        {activeSubscriptions.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Subscribe to a plan to see usage data</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {weeklyTrend.map((day, i) => (
                                    <UsageBar
                                        key={day.day}
                                        label={day.day}
                                        value={day.calls}
                                        maxValue={maxWeekly}
                                        color={`hsl(${270 - i * 20}, 70%, 50%)`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Usage by Subscription */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Key className="w-5 h-5 text-green-400" />
                                Usage by Subscription
                            </h3>
                        </div>

                        {usageData.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No active subscriptions</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {usageData.map((sub, i) => (
                                    <UsageBar
                                        key={sub.id}
                                        label={sub.planName}
                                        value={sub.apiCalls}
                                        maxValue={maxCalls}
                                        color={`hsl(${120 + i * 40}, 60%, 45%)`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Active Subscriptions Details */}
                {usageData.length > 0 && (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Subscription Details</h3>
                        <div className="space-y-4">
                            {usageData.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <Key className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{sub.planName}</div>
                                            <div className="text-xs text-gray-500 font-mono">
                                                {sub.apiKey ? `${sub.apiKey.slice(0, 12)}...${sub.apiKey.slice(-4)}` : 'No API Key'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-purple-400">{sub.apiCalls.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">API calls</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Demo:</span> API usage data is simulated. In production, this would track real API calls using your subscription API keys.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
