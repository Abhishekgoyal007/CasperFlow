"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, TrendingUp, Shield, Globe } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,62,62,0.15),transparent)]" />

            {/* Animated gradient orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-500 blur-[150px] opacity-30 pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500 blur-[150px] opacity-20 pointer-events-none"
            />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 md:pt-40 pb-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight"
                    >
                        On-Chain{" "}
                        <span className="bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                            Subscriptions
                        </span>
                        <br />
                        & Metered Billing
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
                    >
                        The first protocol enabling usage-based billing, stake-powered payments,
                        and cross-chain settlement on the Casper blockchain.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                    >
                        <button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
                            Start Building
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="w-full sm:w-auto bg-transparent border border-white/10 hover:bg-white/5 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all">
                            <Play className="w-5 h-5" />
                            Watch Demo
                        </button>
                    </motion.div>
                </div>

                {/* Hero Visual - Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="max-w-5xl mx-auto relative"
                >
                    {/* Main Dashboard Preview */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-2 shadow-2xl shadow-purple-500/10">
                        <div className="bg-[#0a0a0f] rounded-xl overflow-hidden">
                            {/* Browser Chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-[#111118] border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 md:p-8">
                                {/* Stats Cards Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
                                    <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
                                        <div className="text-sm text-gray-500 mb-2">Monthly Revenue</div>
                                        <div className="text-2xl font-bold text-white mb-2">12,450 CSPR</div>
                                        <div className="flex items-center gap-2 text-sm text-green-500">
                                            <TrendingUp className="w-4 h-4" />
                                            +23.5% from last month
                                        </div>
                                    </div>

                                    <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
                                        <div className="text-sm text-gray-500 mb-2">Active Subscribers</div>
                                        <div className="text-2xl font-bold text-white mb-2">1,284</div>
                                        <div className="flex items-center gap-2 text-sm text-green-500">
                                            <TrendingUp className="w-4 h-4" />
                                            +156 this week
                                        </div>
                                    </div>

                                    <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
                                        <div className="text-sm text-gray-500 mb-2">API Calls (Metered)</div>
                                        <div className="text-2xl font-bold text-white mb-2">2.4M</div>
                                        <div className="flex items-center gap-2 text-sm text-purple-500">
                                            <Zap className="w-4 h-4" />
                                            Live usage tracking
                                        </div>
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="bg-[#16161f] border border-white/10 rounded-xl p-5">
                                    <div className="text-sm text-gray-500 mb-4">Revenue & Usage Overview</div>
                                    <div className="h-40 flex items-end justify-between gap-2">
                                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((height, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
                                                className="flex-1 rounded-t-md bg-gradient-to-t from-red-500 to-purple-500"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="absolute left-4 -bottom-6 bg-[#16161f] border border-white/10 backdrop-blur-xl rounded-xl p-4 hidden lg:block shadow-xl z-20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Stake-to-Pay</div>
                                <div className="text-xs text-gray-500">Pay with staking rewards</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                        className="absolute right-4 -bottom-6 bg-[#16161f] border border-white/10 backdrop-blur-xl rounded-xl p-4 hidden lg:block shadow-xl z-20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">Cross-Chain</div>
                                <div className="text-xs text-gray-500">ETH → Casper settlement</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
