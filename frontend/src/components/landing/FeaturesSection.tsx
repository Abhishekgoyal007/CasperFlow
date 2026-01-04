"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    CreditCard,
    BarChart3,
    Coins,
    Globe,
    Code2,
    Shield,
    Zap,
    LineChart,
    TrendingUp,
    RefreshCw,
    Lock,
    Sparkles,
    ArrowRight,
    CheckCircle
} from "lucide-react";

const features = [
    {
        icon: CreditCard,
        title: "Recurring Subscriptions",
        description: "Create monthly, weekly, or custom billing cycles. Subscribe with CSPR on-chain with full transparency.",
        color: "#ff3e3e",
    },
    {
        icon: BarChart3,
        title: "Usage-Based Metering",
        description: "Track API calls and monitor usage patterns. Visual analytics dashboard for subscribers and merchants.",
        color: "#8b5cf6",
    },
    {
        icon: Coins,
        title: "Stake-to-Pay",
        description: "Stake CSPR and auto-pay subscriptions from 8% APY staking rewards. Keep tokens staked, never sell.",
        color: "#f59e0b",
        highlight: true,
    },
    {
        icon: Globe,
        title: "Cross-Chain Payments",
        description: "Accept payments from Ethereum, Polygon, and more. All settled on Casper for unified billing.",
        color: "#3b82f6",
    },
    {
        icon: Code2,
        title: "Developer API",
        description: "REST API for subscription verification. Integrate billing in minutes with simple API calls.",
        color: "#10b981",
    },
    {
        icon: Shield,
        title: "Downloadable Invoices",
        description: "Generate and download invoices for every transaction. Full billing history and audit trail.",
        color: "#06b6d4",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 md:py-32 lg:py-40 relative">
            {/* Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500 rounded-full blur-[200px] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <Zap className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-gray-400">Core Features</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Everything You Need for{" "}
                        <span className="bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                            Web3 Billing
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        CasperFlow provides a complete infrastructure for subscription management,
                        usage tracking, and payment processing on the Casper blockchain.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`group bg-[#12121a] border rounded-2xl p-8 hover:bg-[#1a1a24] transition-all duration-300 ${feature.highlight
                                ? 'border-yellow-500/30 hover:border-yellow-500/50 ring-1 ring-yellow-500/20'
                                : 'border-white/10 hover:border-white/20'
                                }`}
                        >
                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative"
                                style={{ backgroundColor: `${feature.color}20` }}
                            >
                                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                                {feature.highlight && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-2.5 h-2.5 text-black" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {feature.title}
                                </h3>

                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover line */}
                            <div
                                className="mt-6 h-1 rounded-full w-0 group-hover:w-full transition-all duration-500"
                                style={{ backgroundColor: feature.color }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Stake-to-Pay Feature Highlight */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-purple-500/10 border border-yellow-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]" />

                    <div className="relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-6">
                                    <Coins className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm font-medium text-yellow-400">Revolutionary Feature</span>
                                </div>

                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Stake-to-Pay: <span className="text-yellow-400">Pay Without Selling</span>
                                </h3>

                                <p className="text-lg text-gray-400 mb-8">
                                    The first subscription payment system where you never touch your principal.
                                    Stake your CSPR, earn 8% APY, and let your staking rewards pay for subscriptions automatically.
                                </p>

                                <div className="space-y-4 mb-8">
                                    {[
                                        { icon: Lock, text: "Stake CSPR, keep full ownership" },
                                        { icon: TrendingUp, text: "Earn 8% APY on staked tokens" },
                                        { icon: RefreshCw, text: "Auto-pay subscriptions from rewards" },
                                        { icon: CheckCircle, text: "No lock-up, withdraw anytime" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                                <item.icon className="w-4 h-4 text-yellow-400" />
                                            </div>
                                            <span className="text-gray-300">{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/app/user/stake"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
                                >
                                    Try Stake-to-Pay
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>

                            {/* Right Visual - Calculator Preview */}
                            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <div className="text-sm text-gray-500 mb-6">Stake-to-Pay Calculator</div>

                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <div className="text-xs text-gray-500 mb-1">If you stake</div>
                                        <div className="text-3xl font-bold text-white">1,000 CSPR</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                            <div className="text-xs text-gray-500 mb-1">Monthly Rewards</div>
                                            <div className="text-xl font-bold text-green-400">+6.67 CSPR</div>
                                        </div>
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                            <div className="text-xs text-gray-500 mb-1">Yearly Rewards</div>
                                            <div className="text-xl font-bold text-purple-400">+80 CSPR</div>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Can Cover Subscriptions</div>
                                                <div className="text-lg font-semibold text-yellow-400">Up to 6.67 CSPR/month</div>
                                            </div>
                                            <div className="text-3xl">🎉</div>
                                        </div>
                                    </div>

                                    <div className="text-center text-xs text-gray-600">
                                        Based on 8% APY • Your principal stays untouched
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-10"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: LineChart, value: "Real-time", label: "Usage Tracking" },
                            { icon: CreditCard, value: "∞", label: "Subscription Plans" },
                            { icon: TrendingUp, value: "8%", label: "Staking APY" },
                            { icon: Code2, value: "< 10", label: "Lines to Integrate" },
                        ].map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                                    <stat.icon className="w-7 h-7 text-red-500" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
