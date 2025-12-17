"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import {
    User,
    Building,
    Bell,
    Shield,
    Key,
    CreditCard,
    Save,
    Copy,
    Check,
    ExternalLink
} from "lucide-react";

export default function MerchantSettingsPage() {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const apiKey = "cf_live_sk_1234567890abcdefghijklmnopqrstuvwxyz";

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "business", label: "Business", icon: Building },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "api", label: "API Keys", icon: Key },
        { id: "billing", label: "Payouts", icon: CreditCard },
    ];

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Manage your account and preferences.</p>
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
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-red-500" : ""}`} />
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
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                            AG
                                        </div>
                                        <div>
                                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all">
                                                Change Avatar
                                            </button>
                                            <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Abhishek"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                            <input
                                                type="email"
                                                defaultValue="abhishek@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Wallet Address</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value="0x1234567890abcdef1234567890abcdef12345678"
                                                readOnly
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 font-mono text-sm"
                                            />
                                            <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                                                <Copy className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "api" && (
                            <div className="space-y-6">
                                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                    <h2 className="text-xl font-semibold text-white mb-2">API Keys</h2>
                                    <p className="text-gray-400 mb-6">Use these keys to integrate CasperFlow into your application.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Live API Key</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="password"
                                                    value={apiKey}
                                                    readOnly
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 font-mono text-sm"
                                                />
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                                                >
                                                    {copied ? (
                                                        <Check className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Never share your API key publicly.</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Contract Hash (Testnet)</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value="hash-abc123def456..."
                                                    readOnly
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 font-mono text-sm"
                                                />
                                                <a
                                                    href="#"
                                                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                                                >
                                                    <ExternalLink className="w-5 h-5 text-gray-400" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                    <h2 className="text-xl font-semibold text-white mb-2">Webhook Settings</h2>
                                    <p className="text-gray-400 mb-6">Configure webhooks to receive real-time notifications.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Webhook URL</label>
                                            <input
                                                type="url"
                                                placeholder="https://your-api.com/webhooks/casperflow"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-3">Events to Subscribe</label>
                                            <div className="space-y-2">
                                                {["subscription.created", "subscription.cancelled", "invoice.paid", "usage.recorded"].map((event) => (
                                                    <label key={event} className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-500" />
                                                        <span className="text-gray-300 font-mono text-sm">{event}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                                            <Save className="w-5 h-5" />
                                            Save Webhook Settings
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
                                        { title: "New Subscription", desc: "When someone subscribes to your plan" },
                                        { title: "Subscription Cancelled", desc: "When a subscriber cancels" },
                                        { title: "Payment Received", desc: "When an invoice is paid" },
                                        { title: "Payment Failed", desc: "When a payment fails" },
                                        { title: "Usage Alerts", desc: "When usage exceeds thresholds" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                            <div>
                                                <div className="font-medium text-white">{item.title}</div>
                                                <div className="text-sm text-gray-500">{item.desc}</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "billing" && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8">
                                <h2 className="text-xl font-semibold text-white mb-2">Payout Settings</h2>
                                <p className="text-gray-400 mb-6">Configure how you receive your earnings.</p>

                                <div className="space-y-6">
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">Available Balance</div>
                                                <div className="text-2xl font-bold text-green-400">45,231 CSPR</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Payout Wallet Address</label>
                                        <input
                                            type="text"
                                            defaultValue="0x1234567890abcdef1234567890abcdef12345678"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-red-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Auto-Payout Threshold</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500">
                                            <option>100 CSPR</option>
                                            <option>500 CSPR</option>
                                            <option>1,000 CSPR</option>
                                            <option>Manual Only</option>
                                        </select>
                                    </div>

                                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                                        Request Payout
                                    </button>
                                </div>
                            </div>
                        )}

                        {(activeTab === "business" || activeTab === "security") && (
                            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 md:p-8 flex items-center justify-center min-h-[300px]">
                                <div className="text-center">
                                    <div className="text-gray-500 mb-2">Coming Soon</div>
                                    <div className="text-sm text-gray-600">This section is under development.</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
