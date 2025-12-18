"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { usePlans, Plan } from "@/context/PlansContext";
import {
    Plus,
    Package,
    Zap,
    ExternalLink,
    Trash2,
    Users,
    Edit2,
    X
} from "lucide-react";

// Contract deployed on testnet
const SUBSCRIPTION_MANAGER_HASH = "55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143";

export default function MerchantPlansPage() {
    const { isConnected, address } = useWallet();
    const { plans, addPlan, updatePlan, deletePlan } = usePlans();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        period: "monthly"
    });

    const resetForm = () => {
        setFormData({ name: "", description: "", price: "", period: "monthly" });
    };

    const handleCreatePlan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !address) return;

        addPlan({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            period: formData.period,
            createdBy: address
        });

        resetForm();
        setShowCreateModal(false);
    };

    const handleEditPlan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan || !formData.name || !formData.price) return;

        updatePlan(editingPlan.id, {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            period: formData.period
        });

        resetForm();
        setEditingPlan(null);
    };

    const openEditModal = (plan: Plan) => {
        setFormData({
            name: plan.name,
            description: plan.description,
            price: plan.price.toString(),
            period: plan.period
        });
        setEditingPlan(plan);
    };

    // Filter plans created by current wallet
    const myPlans = plans.filter(p => p.createdBy === address);

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Testnet Banner */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div>
                            <span className="text-sm text-yellow-400">Testnet Mode</span>
                            <span className="text-gray-400 text-sm ml-2">•</span>
                            <a
                                href={`https://testnet.cspr.live/deploy/${SUBSCRIPTION_MANAGER_HASH}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-400 hover:text-white ml-2"
                            >
                                View Contract <ExternalLink className="w-3 h-3 inline" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
                        <p className="text-gray-400 mt-1">Create and manage your subscription tiers.</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowCreateModal(true); }}
                        disabled={!isConnected}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <Plus className="w-5 h-5" />
                        Create Plan
                    </button>
                </div>

                {/* Plans Grid or Empty State */}
                {myPlans.length === 0 ? (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Plans Created Yet</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Create your first subscription plan to start accepting recurring payments.
                            </p>
                            {!isConnected ? (
                                <p className="text-sm text-yellow-400">Connect your wallet to create plans</p>
                            ) : (
                                <button
                                    onClick={() => { resetForm(); setShowCreateModal(true); }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Your First Plan
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myPlans.map((plan) => (
                            <div
                                key={plan.id}
                                className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{plan.description || "No description"}</p>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-500">CSPR/{plan.period}</span>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Users className="w-4 h-4" />
                                                Subscribers
                                            </div>
                                            <div className="text-lg font-bold text-white">{plan.subscribers}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Revenue</div>
                                            <div className="text-lg font-bold text-green-400">{plan.revenue} CSPR</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(plan)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletePlan(plan.id)}
                                            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Plan Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                        <div className="relative bg-[#12121a] border border-white/10 rounded-2xl p-8 max-w-lg w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Create New Plan</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePlan} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Pro API"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe what this plan offers..."
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Price (CSPR) *</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="50"
                                            min="0"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Billing Period</label>
                                        <select
                                            value={formData.period}
                                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white font-medium">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold">
                                        Create Plan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Plan Modal */}
                {editingPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingPlan(null)} />
                        <div className="relative bg-[#12121a] border border-white/10 rounded-2xl p-8 max-w-lg w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Edit Plan</h2>
                                <button onClick={() => setEditingPlan(null)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditPlan} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Plan Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Price (CSPR) *</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            min="0"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Billing Period</label>
                                        <select
                                            value={formData.period}
                                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setEditingPlan(null)} className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white font-medium">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold">
                                        Save Changes
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
