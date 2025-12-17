"use client";

import { motion } from "framer-motion";
import {
    CreditCard,
    BarChart3,
    Coins,
    Globe,
    Code2,
    Shield,
    Zap,
    LineChart
} from "lucide-react";

const features = [
    {
        icon: CreditCard,
        title: "Recurring Subscriptions",
        description: "Create monthly, weekly, or custom billing cycles. Auto-charge subscribers on-chain with full transparency.",
        color: "#ff3e3e",
    },
    {
        icon: BarChart3,
        title: "Usage-Based Metering",
        description: "Track API calls, storage, compute units, or any custom metric. Bill users exactly for what they use.",
        color: "#8b5cf6",
    },
    {
        icon: Coins,
        title: "Stake-to-Pay",
        description: "Users pay subscriptions from staking rewards. Keep tokens staked, never sell — still access premium services.",
        color: "#10b981",
    },
    {
        icon: Globe,
        title: "Cross-Chain Payments",
        description: "Accept payments from Ethereum, Polygon, and more. All settled on Casper for unified billing.",
        color: "#3b82f6",
    },
    {
        icon: Code2,
        title: "Developer SDK",
        description: "TypeScript/JavaScript SDK with simple APIs. Integrate billing in minutes, not weeks.",
        color: "#f59e0b",
    },
    {
        icon: Shield,
        title: "On-Chain Invoices",
        description: "Every bill, payment, and usage record stored on-chain. Full auditability and trust.",
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
                            className="group bg-[#12121a] border border-white/10 rounded-2xl p-8 hover:bg-[#1a1a24] hover:border-white/20 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                                style={{ backgroundColor: `${feature.color}20` }}
                            >
                                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold mb-4 text-white">
                                {feature.title}
                            </h3>
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
                            { icon: LineChart, value: "Unlimited", label: "Usage Metrics" },
                            { icon: CreditCard, value: "∞", label: "Subscription Plans" },
                            { icon: Globe, value: "5+", label: "Chains Supported" },
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
