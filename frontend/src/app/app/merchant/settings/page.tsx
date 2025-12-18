"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    User,
    Building,
    Bell,
    Shield,
    Key,
    Wallet,
    Zap,
    ExternalLink,
    Save,
    Copy,
    Check
} from "lucide-react";

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API Keys", icon: Key },
    { id: "payouts", label: "Payouts", icon: Wallet },
];

export default function MerchantSettingsPage() {
    const { isConnected, address, balance, network, publicKey } = useWallet();
    const [activeTab, setActiveTab] = useState("payouts");
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your account and preferences.</p>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-48 shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                            ? "bg-red-500/20 text-red-400"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === "payouts" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6">Payout Settings</h2>
                                <p className="text-gray-400 text-sm mb-6">Configure how you receive your earnings.</p>

                                {/* Real Wallet Balance */}
                                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Wallet className="w-6 h-6 text-green-400" />
                                        <div>
                                            <div className="text-sm text-gray-400">Available Balance</div>
                                            <div className="text-2xl font-bold text-green-400">
                                                {isConnected ? `${balance} CSPR` : "-- CSPR"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payout Wallet */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Payout Wallet Address
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={publicKey || "Connect wallet to see address"}
                                                readOnly
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm"
                                            />
                                            <button
                                                onClick={copyAddress}
                                                disabled={!publicKey}
                                                className="px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                                            >
                                                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Payouts are sent to your connected Casper wallet
                                        </p>
                                    </div>

                                    {/* View on Explorer */}
                                    {isConnected && publicKey && (
                                        <a
                                            href={`https://${network === 'testnet' ? 'testnet.' : ''}cspr.live/account/${publicKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                                        >
                                            View wallet on explorer <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                {/* Testnet Notice */}
                                <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <p className="text-xs text-yellow-400">
                                            Testnet Mode: Payouts are simulated. In production, earnings are automatically sent to your wallet.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your name or business name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-xl">
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "api" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6">API Keys</h2>
                                <p className="text-gray-400 mb-6">Generate API keys to integrate CasperFlow with your application.</p>
                                <div className="text-center py-8 border border-dashed border-white/20 rounded-xl">
                                    <Key className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                    <p className="text-gray-500">No API keys generated yet</p>
                                    <button className="mt-4 inline-flex items-center gap-2 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white py-2 px-4 rounded-lg transition-all">
                                        Generate API Key
                                    </button>
                                </div>
                            </div>
                        )}

                        {(activeTab === "business" || activeTab === "notifications" || activeTab === "security") && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6 capitalize">{activeTab} Settings</h2>
                                <p className="text-gray-400">Settings for {activeTab} will be available soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
