"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    User,
    Bell,
    Shield,
    Wallet,
    Zap,
    ExternalLink,
    Copy,
    Check
} from "lucide-react";

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "wallet", label: "Wallet", icon: Wallet },
];

export default function UserSettingsPage() {
    const { isConnected, address, balance, network, publicKey } = useWallet();
    const [activeTab, setActiveTab] = useState("wallet");
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your account preferences.</p>
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
                                            ? "bg-purple-500/20 text-purple-400"
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
                        {activeTab === "wallet" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6">Wallet Settings</h2>

                                {/* Wallet Info */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Wallet className="w-6 h-6 text-purple-400" />
                                            <div>
                                                <div className="text-sm text-gray-400">Connected Wallet</div>
                                                <div className="text-lg font-bold text-purple-400">
                                                    {isConnected ? `${balance} CSPR` : "Not Connected"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 capitalize">{network}</div>
                                    </div>
                                </div>

                                {/* Address */}
                                {isConnected && publicKey && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Wallet Address
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={publicKey}
                                                    readOnly
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm"
                                                />
                                                <button
                                                    onClick={copyAddress}
                                                    className="px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                                                >
                                                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <a
                                            href={`https://${network === 'testnet' ? 'testnet.' : ''}cspr.live/account/${publicKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                                        >
                                            View on explorer <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}

                                {!isConnected && (
                                    <p className="text-gray-500">Connect your wallet to view settings</p>
                                )}
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
                                            placeholder="Your name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === "notifications" || activeTab === "security") && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-6 capitalize">{activeTab}</h2>
                                <p className="text-gray-400">Settings for {activeTab} coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
