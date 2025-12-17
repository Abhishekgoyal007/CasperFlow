"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import {
    User,
    Bell,
    Shield,
    Wallet,
    Save,
    Copy,
    Check,
    Zap,
    TrendingUp
} from "lucide-react";

export default function UserSettingsPage() {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const walletAddress = "0x1234567890abcdef1234567890abcdef12345678";

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "wallet", label: "Wallet", icon: Wallet },
        { id: "staking", label: "Stake-to-Pay", icon: Zap },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your account preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                            ? "bg-white/10 text-white"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-green-500" : ""}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === "profile" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                <h2 className="text-xl font-semibold text-white mb-6">Profile Settings</h2>

                                <div className="space-y-6">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                                            AG
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
                                                Change Avatar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Abhishek"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                            <input
                                                type="email"
                                                defaultValue="abhishek@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                                            />
                                        </div>
                                    </div>

                                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "wallet" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                <h2 className="text-xl font-semibold text-white mb-6">Connected Wallet</h2>

                                <div className="space-y-6">
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center">
                                                    <Wallet className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">Casper Wallet</div>
                                                    <div className="text-sm text-gray-500 font-mono">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                            >
                                                {copied ? (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <div className="text-sm text-gray-500 mb-1">Balance</div>
                                            <div className="text-xl font-bold text-white">2,450 CSPR</div>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                            <div className="text-sm text-gray-500 mb-1">Staked</div>
                                            <div className="text-xl font-bold text-green-400">1,000 CSPR</div>
                                        </div>
                                    </div>

                                    <button className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all">
                                        Disconnect Wallet
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "staking" && (
                            <div className="space-y-6">
                                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-white">Stake-to-Pay</h2>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>

                                    <p className="text-gray-400 mb-6">
                                        Pay your subscriptions using staking rewards. Keep your tokens staked while still accessing premium services.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-gradient-to-br from-green-500/10 to-cyan-500/10 border border-green-500/20 rounded-xl">
                                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                                <Zap className="w-4 h-4 text-green-500" />
                                                Staked Amount
                                            </div>
                                            <div className="text-2xl font-bold text-white">1,000 CSPR</div>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                                                <TrendingUp className="w-4 h-4 text-purple-500" />
                                                Available Rewards
                                            </div>
                                            <div className="text-2xl font-bold text-white">6.67 CSPR</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400">Current APY</span>
                                            <span className="text-green-400 font-semibold">8.0%</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400">Monthly Rewards (Est.)</span>
                                            <span className="text-white">~6.67 CSPR</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Total Paid from Rewards</span>
                                            <span className="text-white">99.7 CSPR</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all">
                                            Deposit More
                                        </button>
                                        <button className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all">
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>

                                <div className="space-y-6">
                                    {[
                                        { title: "Payment Due", desc: "Reminder before subscription renewal" },
                                        { title: "Payment Processed", desc: "When a payment is successful" },
                                        { title: "Low Rewards Balance", desc: "When staking rewards are running low" },
                                        { title: "Usage Alerts", desc: "When approaching usage limits" },
                                        { title: "New Features", desc: "Updates about CasperFlow features" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                            <div>
                                                <div className="font-medium text-white">{item.title}</div>
                                                <div className="text-sm text-gray-500">{item.desc}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                <h2 className="text-xl font-semibold text-white mb-6">Security Settings</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                                        <div>
                                            <div className="font-medium text-white">Transaction Confirmations</div>
                                            <div className="text-sm text-gray-500">Require confirmation for all transactions</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-b border-white/5">
                                        <div>
                                            <div className="font-medium text-white">Spending Limit</div>
                                            <div className="text-sm text-gray-500">Maximum auto-payment amount</div>
                                        </div>
                                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                                            <option>100 CSPR</option>
                                            <option>500 CSPR</option>
                                            <option>1,000 CSPR</option>
                                            <option>Unlimited</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <div className="font-medium text-white">Active Sessions</div>
                                            <div className="text-sm text-gray-500">Manage your active login sessions</div>
                                        </div>
                                        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                                            Revoke All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
