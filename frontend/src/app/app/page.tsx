"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Store, User, Zap, ArrowRight } from "lucide-react";

export default function AppPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,62,62,0.15),transparent)]" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-12"
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                        Casper<span className="text-red-500">Flow</span>
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                    Choose Your Dashboard
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 mb-12 max-w-md mx-auto"
                >
                    Select how you want to use CasperFlow today
                </motion.p>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Merchant Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/app/merchant">
                            <div className="group bg-[#12121a] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:bg-[#16161f] transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <Store className="w-8 h-8 text-purple-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Merchant</h2>
                                <p className="text-gray-400 mb-6">
                                    Create subscription plans, track subscribers, and manage your billing infrastructure.
                                </p>
                                <div className="inline-flex items-center gap-2 text-purple-400 font-medium group-hover:gap-3 transition-all">
                                    Open Merchant Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* User Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link href="/app/user">
                            <div className="group bg-[#12121a] border border-white/10 rounded-2xl p-8 hover:border-green-500/50 hover:bg-[#16161f] transition-all cursor-pointer">
                                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <User className="w-8 h-8 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">User</h2>
                                <p className="text-gray-400 mb-6">
                                    Browse plans, manage subscriptions, and track your usage across all services.
                                </p>
                                <div className="inline-flex items-center gap-2 text-green-400 font-medium group-hover:gap-3 transition-all">
                                    Open User Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12"
                >
                    <Link href="/" className="text-gray-500 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
