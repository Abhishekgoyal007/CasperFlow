"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    Globe,
    Zap,
    ArrowRight,
    CheckCircle,
    Clock,
    Shield,
    Coins,
    Link2,
    Bell,
    Mail
} from "lucide-react";

// Supported chains (coming soon)
const upcomingChains = [
    {
        name: "Ethereum",
        symbol: "ETH",
        logo: "🔷",
        color: "#627EEA",
        status: "planned",
        expectedDate: "Q2 2025"
    },
    {
        name: "Polygon",
        symbol: "MATIC",
        logo: "🟣",
        color: "#8247E5",
        status: "planned",
        expectedDate: "Q2 2025"
    },
    {
        name: "BNB Chain",
        symbol: "BNB",
        logo: "🟡",
        color: "#F3BA2F",
        status: "researching",
        expectedDate: "Q3 2025"
    },
    {
        name: "Avalanche",
        symbol: "AVAX",
        logo: "🔺",
        color: "#E84142",
        status: "researching",
        expectedDate: "Q3 2025"
    },
    {
        name: "Solana",
        symbol: "SOL",
        logo: "🟢",
        color: "#14F195",
        status: "considering",
        expectedDate: "Q4 2025"
    },
    {
        name: "Arbitrum",
        symbol: "ARB",
        logo: "🔵",
        color: "#28A0F0",
        status: "considering",
        expectedDate: "Q4 2025"
    }
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    planned: { bg: "bg-green-500/20", text: "text-green-400", label: "Planned" },
    researching: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Researching" },
    considering: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Considering" }
};

export default function CrossChainPage() {
    const { isConnected } = useWallet();
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // In production, this would send to a backend
            console.log("Subscribed:", email);
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 3000);
            setEmail("");
        }
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Coming Soon</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Globe className="w-10 h-10 text-blue-400" />
                        Cross-Chain Payments
                    </h1>
                    <p className="text-lg text-gray-400">
                        Accept subscription payments from multiple blockchains. All settlements unified on Casper.
                    </p>
                </div>

                {/* How It Will Work */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        How Cross-Chain Payments Will Work
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <Coins className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">1. User Pays</div>
                            <div className="text-xs text-gray-500">In ETH, MATIC, or any supported token</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Link2 className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">2. Bridge Activated</div>
                            <div className="text-xs text-gray-500">Cross-chain bridge swaps to CSPR</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">3. Settlement</div>
                            <div className="text-xs text-gray-500">Payment settled on Casper blockchain</div>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">4. Subscription Active</div>
                            <div className="text-xs text-gray-500">User gets access, merchant gets CSPR</div>
                        </div>
                    </div>
                </div>

                {/* Supported Chains */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Planned Chain Support</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingChains.map((chain) => {
                            const status = statusColors[chain.status];
                            return (
                                <div
                                    key={chain.symbol}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                                            style={{ backgroundColor: chain.color + '20' }}
                                        >
                                            {chain.logo}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{chain.name}</div>
                                            <div className="text-xs text-gray-500">{chain.symbol}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
                                            {status.label}
                                        </span>
                                        <span className="text-xs text-gray-500">{chain.expectedDate}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <Globe className="w-7 h-7 text-green-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">Expand Your Reach</h4>
                        <p className="text-sm text-gray-500">
                            Accept payments from users on any chain. No need for them to bridge tokens manually.
                        </p>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-7 h-7 text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">Unified Settlement</h4>
                        <p className="text-sm text-gray-500">
                            All payments settle on Casper. One dashboard, one currency, one source of truth.
                        </p>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 text-center">
                        <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                            <Coins className="w-7 h-7 text-purple-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">Lower Fees</h4>
                        <p className="text-sm text-gray-500">
                            Casper's low gas fees mean more of each payment goes to you, not to network fees.
                        </p>
                    </div>
                </div>

                {/* Get Notified */}
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Get Notified When It's Ready</h3>
                        <p className="text-gray-400 mb-6">
                            Be the first to know when cross-chain payments launch. We'll send you a notification.
                        </p>

                        {subscribed ? (
                            <div className="flex items-center justify-center gap-2 text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                <span>You're on the list! We'll keep you updated.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2"
                                >
                                    Notify Me
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-blue-400">Development Status:</span> Cross-chain payments are currently in the research and planning phase. We're evaluating bridge protocols and security considerations to ensure the safest possible implementation.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
