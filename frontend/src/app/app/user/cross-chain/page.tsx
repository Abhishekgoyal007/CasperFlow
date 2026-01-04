"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { motion } from "framer-motion";
import {
    Globe,
    Zap,
    ArrowRight,
    CheckCircle,
    Shield,
    Coins,
    Link2,
    Sparkles,
    TrendingUp,
    Clock
} from "lucide-react";

// Supported chains with SVG logos
const supportedChains = [
    {
        name: "Ethereum",
        symbol: "ETH",
        color: "#627EEA",
        status: "active",
        logo: (
            <svg viewBox="0 0 32 32" className="w-8 h-8">
                <path fill="#627EEA" d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0z" />
                <path fill="#fff" fillOpacity="0.6" d="M16.498 4v8.87l7.497 3.35z" />
                <path fill="#fff" d="M16.498 4L9 16.22l7.498-3.35z" />
                <path fill="#fff" fillOpacity="0.6" d="M16.498 21.968v6.027L24 17.616z" />
                <path fill="#fff" d="M16.498 27.995v-6.028L9 17.616z" />
                <path fill="#fff" fillOpacity="0.2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
                <path fill="#fff" fillOpacity="0.6" d="M9 16.22l7.498 4.353v-7.701z" />
            </svg>
        )
    },
    {
        name: "Polygon",
        symbol: "MATIC",
        color: "#8247E5",
        status: "active",
        logo: (
            <svg viewBox="0 0 32 32" className="w-8 h-8">
                <circle fill="#8247E5" cx="16" cy="16" r="16" />
                <path fill="#fff" d="M21.092 12.693c-.369-.215-.848-.215-1.254 0l-2.879 1.654-1.955 1.078-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.61-.627-1.042V12.19c0-.431.221-.826.627-1.042l2.25-1.258c.37-.216.85-.216 1.256 0l2.25 1.258c.37.216.628.611.628 1.042v1.654l1.955-1.115v-1.69c0-.432-.221-.827-.627-1.043l-4.169-2.371c-.369-.216-.848-.216-1.254 0l-4.244 2.407C6.221 10.248 6 10.643 6 11.074v4.742c0 .432.221.827.627 1.043l4.244 2.371c.369.216.848.216 1.254 0l2.879-1.618 1.955-1.114 2.879-1.617c.369-.216.848-.216 1.254 0l2.251 1.258c.369.215.627.61.627 1.042v2.552c0 .431-.221.826-.627 1.042l-2.214 1.294c-.369.216-.848.216-1.254 0l-2.251-1.258c-.37-.216-.628-.611-.628-1.042v-1.618l-1.955 1.115v1.654c0 .432.221.827.627 1.043l4.244 2.371c.369.216.848.216 1.254 0l4.244-2.371c.369-.216.627-.611.627-1.043v-4.779c0-.432-.221-.827-.627-1.042l-4.28-2.408z" />
            </svg>
        )
    },
    {
        name: "BNB Chain",
        symbol: "BNB",
        color: "#F3BA2F",
        status: "active",
        logo: (
            <svg viewBox="0 0 32 32" className="w-8 h-8">
                <circle fill="#F3BA2F" cx="16" cy="16" r="16" />
                <path fill="#fff" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002L16 13.706 14.294 15.4l-.002.002-.196.196-.868.868h.002L13.706 16l.292-.294L16 13.706l2.294 2.294-.002-.002z" />
            </svg>
        )
    },
    {
        name: "Avalanche",
        symbol: "AVAX",
        color: "#E84142",
        status: "active",
        logo: (
            <svg viewBox="0 0 32 32" className="w-8 h-8">
                <circle fill="#E84142" cx="16" cy="16" r="16" />
                <path fill="#fff" d="M11.518 22.5H8.49c-.636 0-.952-.774-.5-1.22l7.51-7.78 7.51 7.78c.452.446.136 1.22-.5 1.22h-3.028c-.414 0-.81-.165-1.104-.46l-2.878-2.98-2.878 2.98c-.293.295-.69.46-1.104.46z" />
                <path fill="#fff" d="M16 9.5l-4.482 4.64L16 18.78l4.482-4.64L16 9.5z" />
            </svg>
        )
    },
    {
        name: "Solana",
        symbol: "SOL",
        color: "#14F195",
        status: "active",
        logo: (
            <svg viewBox="0 0 32 32" className="w-8 h-8">
                <circle fill="#000" cx="16" cy="16" r="16" />
                <defs>
                    <linearGradient id="solGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00FFA3" />
                        <stop offset="100%" stopColor="#DC1FFF" />
                    </linearGradient>
                </defs>
                <path fill="url(#solGrad)" d="M9.925 20.787a.61.61 0 01.432-.179h13.208c.273 0 .41.33.216.523l-2.213 2.213a.61.61 0 01-.432.179H7.928a.305.305 0 01-.216-.523l2.213-2.213zm0-12.11a.628.628 0 01.432-.177h13.208c.273 0 .41.33.216.523l-2.213 2.213a.61.61 0 01-.432.179H7.928a.305.305 0 01-.216-.523L9.925 8.68zm12.15 6.135a.61.61 0 00-.432-.179H8.435a.305.305 0 00-.216.523l2.213 2.213a.61.61 0 00.432.179h13.208c.273 0 .41-.33.216-.523l-2.213-2.213z" />
            </svg>
        )
    },
    {
        name: "Arbitrum",
        symbol: "ARB",
        color: "#28A0F0",
        status: "active",
        logo: (
            <svg viewBox="0 0 32 32" className="w-8 h-8">
                <circle fill="#28A0F0" cx="16" cy="16" r="16" />
                <path fill="#fff" d="M16 6l7.794 13.5L16 26l-7.794-6.5L16 6z" />
                <path fill="#28A0F0" d="M16 11l4.33 7.5L16 23l-4.33-4.5L16 11z" />
            </svg>
        )
    }
];

export default function CrossChainPage() {
    const { isConnected } = useWallet();
    const [selectedChain, setSelectedChain] = useState<string | null>("ETH");
    const [demoStep, setDemoStep] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);
    const [amount, setAmount] = useState("0.05");

    const runDemo = async () => {
        if (!selectedChain) return;
        setIsSimulating(true);
        setDemoStep(1);

        // Simulate the bridge flow
        await new Promise(r => setTimeout(r, 1500));
        setDemoStep(2);
        await new Promise(r => setTimeout(r, 1500));
        setDemoStep(3);
        await new Promise(r => setTimeout(r, 1500));
        setDemoStep(4);
        await new Promise(r => setTimeout(r, 1000));
        setIsSimulating(false);
    };

    const resetDemo = () => {
        setDemoStep(0);
        setIsSimulating(false);
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">Interactive Demo</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Globe className="w-10 h-10 text-blue-400" />
                        Cross-Chain Payments
                    </h1>
                    <p className="text-lg text-gray-400">
                        Accept subscription payments from multiple blockchains. All settlements unified on Casper.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        🎮 Try the interactive demo below to see how cross-chain payments will work
                    </p>
                </div>

                {/* Supported Chains */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            Select Source Chain
                        </h3>
                        <span className="text-sm text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                            {supportedChains.length} chains available
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {supportedChains.map((chain, index) => (
                            <motion.div
                                key={chain.symbol}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => !isSimulating && setSelectedChain(chain.symbol)}
                                className={`
                                    bg-white/5 border rounded-xl p-4 cursor-pointer transition-all text-center
                                    ${selectedChain === chain.symbol
                                        ? 'border-purple-500/50 bg-purple-500/10 ring-2 ring-purple-500/30'
                                        : 'border-white/10 hover:border-white/20'
                                    }
                                    ${isSimulating ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <div className="flex justify-center mb-3">
                                    {chain.logo}
                                </div>
                                <div className="font-medium text-white text-sm">{chain.name}</div>
                                <div className="text-xs text-gray-500">{chain.symbol}</div>
                                {selectedChain === chain.symbol && (
                                    <div className="mt-2">
                                        <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded-full">
                                            Selected
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Demo Simulation */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        Try Cross-Chain Payment Demo
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Amount to Pay</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={isSimulating}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-semibold focus:outline-none focus:border-purple-500 disabled:opacity-50"
                                        placeholder="0.05"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        {selectedChain || 'ETH'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Bridge Fee (0.1%)</span>
                                    <span className="text-white">{(parseFloat(amount || '0') * 0.001).toFixed(6)} {selectedChain}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Estimated CSPR</span>
                                    <span className="text-green-400 font-medium">~{(parseFloat(amount || '0') * 3200).toFixed(2)} CSPR</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Settlement Time</span>
                                    <span className="text-white">~30 seconds</span>
                                </div>
                            </div>

                            <button
                                onClick={demoStep > 0 ? resetDemo : runDemo}
                                disabled={!selectedChain}
                                className={`
                                    w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2
                                    ${demoStep === 4
                                        ? 'bg-green-500 text-white'
                                        : demoStep > 0
                                            ? 'bg-gray-700 text-gray-300'
                                            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                                    }
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {demoStep === 4 ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Payment Complete! (Click to Reset)
                                    </>
                                ) : isSimulating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Simulate Cross-Chain Payment
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Flow Visualization */}
                        <div className="bg-black/20 rounded-xl p-6">
                            <div className="text-sm text-gray-400 mb-4">Payment Flow</div>
                            <div className="space-y-4">
                                {[
                                    { step: 1, label: "Send Payment", desc: `${amount} ${selectedChain} sent from wallet`, icon: Coins },
                                    { step: 2, label: "Bridge Activated", desc: "Cross-chain bridge initiated", icon: Link2 },
                                    { step: 3, label: "Swap Complete", desc: `Converted to ~${(parseFloat(amount || '0') * 3200).toFixed(0)} CSPR`, icon: Shield },
                                    { step: 4, label: "Subscription Active!", desc: "Payment received by merchant", icon: CheckCircle },
                                ].map((item) => (
                                    <div key={item.step} className={`
                                        flex items-center gap-4 p-3 rounded-lg transition-all
                                        ${demoStep >= item.step ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5 border border-white/10'}
                                    `}>
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center
                                            ${demoStep >= item.step ? 'bg-green-500' : 'bg-white/10'}
                                        `}>
                                            {demoStep >= item.step ? (
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            ) : demoStep === item.step - 1 && isSimulating ? (
                                                <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <item.icon className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <div className={`font-medium ${demoStep >= item.step ? 'text-green-400' : 'text-white'}`}>
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-gray-500">{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-400" />
                        How Cross-Chain Payments Work
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <Coins className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">1. User Pays</div>
                            <div className="text-xs text-gray-500">In ETH, MATIC, SOL, or any supported token</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Link2 className="w-8 h-8 text-purple-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">2. Bridge Activated</div>
                            <div className="text-xs text-gray-500">Cross-chain bridge swaps to CSPR</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">3. Settlement</div>
                            <div className="text-xs text-gray-500">Payment settled on Casper blockchain</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div className="text-sm font-medium text-white mb-1">4. Subscription Active</div>
                            <div className="text-xs text-gray-500">User gets access, merchant gets CSPR</div>
                        </motion.div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6 text-center"
                    >
                        <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <Globe className="w-7 h-7 text-green-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">Expand Your Reach</h4>
                        <p className="text-sm text-gray-500">
                            Accept payments from users on any chain. No need for them to bridge tokens manually.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6 text-center"
                    >
                        <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-7 h-7 text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">Unified Settlement</h4>
                        <p className="text-sm text-gray-500">
                            All payments settle on Casper. One dashboard, one currency, one source of truth.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6 text-center"
                    >
                        <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-7 h-7 text-purple-400" />
                        </div>
                        <h4 className="font-semibold text-white mb-2">Lower Fees</h4>
                        <p className="text-sm text-gray-500">
                            Casper's low gas fees mean more of each payment goes to you, not to network fees.
                        </p>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">6</div>
                            <div className="text-sm text-gray-500">Chains Designed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">&lt;30s</div>
                            <div className="text-sm text-gray-500">Target Settlement</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">0.1%</div>
                            <div className="text-sm text-gray-500">Planned Fee</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-1">✓</div>
                            <div className="text-sm text-gray-500">UX Complete</div>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div className="text-sm text-gray-400">
                            <span className="text-purple-400 font-medium">Demo Mode:</span> This interactive demo shows how cross-chain payments will work. The UI/UX is complete — bridge integration will connect ETH, MATIC, SOL and other chains to Casper for unified settlements.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
