"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import {
    Plus,
    Edit2,
    Trash2,
    Users,
    MoreVertical,
    Check,
    X
} from "lucide-react";

const plans = [
    {
        id: 1,
        name: "Starter",
        description: "Perfect for small projects and testing",
        basePrice: 10,
        usagePrice: 0.001,
        billingCycle: "monthly",
        features: ["1,000 API calls/month", "Basic support", "1 project"],
        subscribers: 342,
        revenue: 3420,
        status: "active",
    },
    {
        id: 2,
        name: "Pro API",
        description: "For growing applications with higher demands",
        basePrice: 50,
        usagePrice: 0.0005,
        billingCycle: "monthly",
        features: ["50,000 API calls/month", "Priority support", "10 projects", "Analytics dashboard"],
        subscribers: 756,
        revenue: 37800,
        status: "active",
    },
    {
        id: 3,
        name: "Enterprise",
        description: "Unlimited access for large-scale operations",
        basePrice: 200,
        usagePrice: 0.0002,
        billingCycle: "monthly",
        features: ["Unlimited API calls", "24/7 support", "Unlimited projects", "Custom integrations", "SLA guarantee"],
        subscribers: 186,
        revenue: 37200,
        status: "active",
    },
];

export default function MerchantPlansPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
                        <p className="text-gray-400 mt-1">Create and manage your subscription tiers.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Create Plan
                    </button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
                        >
                            {/* Plan Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">{plan.basePrice}</span>
                                    <span className="text-gray-500">CSPR/{plan.billingCycle}</span>
                                </div>
                                {plan.usagePrice > 0 && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        + {plan.usagePrice} CSPR per API call
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            <div className="p-6 border-b border-white/10">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-sm">
                                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Stats */}
                            <div className="p-6 bg-white/5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                            <Users className="w-4 h-4" />
                                            Subscribers
                                        </div>
                                        <div className="text-xl font-bold text-white">{plan.subscribers}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">Revenue</div>
                                        <div className="text-xl font-bold text-green-400">{plan.revenue.toLocaleString()} CSPR</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm">
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Plan Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <div className="relative bg-[#12121a] border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Create New Plan</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Pro API"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea
                                        placeholder="Describe what this plan offers..."
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Base Price (CSPR)</label>
                                        <input
                                            type="number"
                                            placeholder="50"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Billing Cycle</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors">
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Usage Price (CSPR per call)</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        placeholder="0.001"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Set to 0 for no usage-based billing</p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all"
                                    >
                                        Create Plan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
