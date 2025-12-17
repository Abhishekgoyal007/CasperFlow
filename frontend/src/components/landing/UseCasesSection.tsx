"use client";

import { motion } from "framer-motion";
import {
    Brain,
    Gamepad2,
    Cloud,
    Newspaper,
    Rocket,
    ArrowUpRight
} from "lucide-react";

const useCases = [
    {
        icon: Brain,
        title: "AI API Providers",
        description: "Charge per API request, per token, or per image generated. Perfect for AI/ML services on Casper.",
        example: "$0.001 per request + $20/month base",
        color: "#8b5cf6",
    },
    {
        icon: Gamepad2,
        title: "Gaming Platforms",
        description: "Charge per match played, per tournament entry, or monthly access. Stake-to-play for loyal gamers.",
        example: "1 CSPR per match, staked players free",
        color: "#ff3e3e",
    },
    {
        icon: Cloud,
        title: "Decentralized Storage",
        description: "Bill per GB stored, per download, or bandwidth used. Transparent usage on-chain.",
        example: "0.01 CSPR/GB/month",
        color: "#06b6d4",
    },
    {
        icon: Newspaper,
        title: "Content Platforms",
        description: "Premium newsletters, paywalled articles, or creator subscriptions. Cross-chain payments accepted.",
        example: "5 CSPR/month, pay from ETH",
        color: "#10b981",
    },
];

export function UseCasesSection() {
    return (
        <section id="use-cases" className="py-24 md:py-32 lg:py-40 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50 pointer-events-none" />

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
                        <Rocket className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-400">Use Cases</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Built for{" "}
                        <span className="bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                            Every Web3 Business
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        From AI APIs to gaming platforms, CasperFlow powers the next generation
                        of on-chain business models.
                    </p>
                </motion.div>

                {/* Use Cases Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 hover:border-white/20 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start gap-6">
                                {/* Icon */}
                                <div
                                    className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{ backgroundColor: `${useCase.color}20` }}
                                >
                                    <useCase.icon
                                        className="w-8 h-8"
                                        style={{ color: useCase.color }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-white">{useCase.title}</h3>
                                        <ArrowUpRight
                                            className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                                        />
                                    </div>
                                    <p className="text-gray-400 mb-5 leading-relaxed">{useCase.description}</p>
                                    <div
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                                        style={{
                                            backgroundColor: `${useCase.color}15`,
                                            color: useCase.color
                                        }}
                                    >
                                        {useCase.example}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
