"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import {
    CreditCard,
    Check,
    Zap,
    Star,
    Search,
    Filter,
    ArrowRight
} from "lucide-react";

const availablePlans = [
    {
        id: "1",
        merchant: "AI Vision Labs",
        name: "Starter",
        description: "Perfect for trying out our AI APIs",
        basePrice: 10,
        usagePrice: 0,
        billingCycle: "monthly",
        features: ["1,000 API calls/month", "Basic support", "1 project"],
        popular: false,
        category: "AI",
    },
    {
        id: "2",
        merchant: "AI Vision Labs",
        name: "Pro API",
        description: "For growing applications with higher demands",
        basePrice: 50,
        usagePrice: 0.001,
        billingCycle: "monthly",
        features: ["50,000 API calls/month", "Priority support", "10 projects", "Analytics"],
        popular: true,
        category: "AI",
    },
    {
        id: "3",
        merchant: "CasperDrive",
        name: "Cloud Storage Pro",
        description: "Decentralized storage for your files",
        basePrice: 25,
        usagePrice: 0.01,
        billingCycle: "monthly",
        features: ["100 GB storage", "Unlimited bandwidth", "File versioning", "AES encryption"],
        popular: false,
        category: "Storage",
    },
    {
        id: "4",
        merchant: "CasperGames",
        name: "Gaming Premium",
        description: "Access to premium gaming features",
        basePrice: 10,
        usagePrice: 0,
        billingCycle: "monthly",
        features: ["Ad-free gaming", "Exclusive skins", "Early access", "Tournament entry"],
        popular: false,
        category: "Gaming",
    },
    {
        id: "5",
        merchant: "DataStream Pro",
        name: "Analytics Enterprise",
        description: "Real-time blockchain analytics",
        basePrice: 200,
        usagePrice: 0.0001,
        billingCycle: "monthly",
        features: ["Unlimited queries", "Real-time data", "Custom dashboards", "API access", "24/7 support"],
        popular: false,
        category: "Analytics",
    },
];

const categories = ["All", "AI", "Storage", "Gaming", "Analytics"];

export default function UserSubscriptionsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<typeof availablePlans[0] | null>(null);

    const filteredPlans = availablePlans.filter((plan) => {
        const matchesSearch =
            plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.merchant.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || plan.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSubscribe = (plan: typeof availablePlans[0]) => {
        setSelectedPlan(plan);
        setShowSubscribeModal(true);
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Browse Plans</h1>
                    <p className="text-gray-400 mt-1">Discover and subscribe to services on CasperFlow.</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search plans or merchants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                        ? "bg-green-500 text-white"
                                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-[#12121a] border rounded-2xl overflow-hidden transition-all hover:border-white/20 ${plan.popular ? "border-green-500/50" : "border-white/10"
                                }`}
                        >
                            {plan.popular && (
                                <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Most Popular
                                </div>
                            )}

                            <div className="p-6">
                                <div className="text-sm text-gray-500 mb-1">{plan.merchant}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-3xl font-bold text-white">{plan.basePrice}</span>
                                    <span className="text-gray-500">CSPR/{plan.billingCycle}</span>
                                </div>

                                {plan.usagePrice > 0 && (
                                    <div className="text-sm text-gray-500 mb-4">
                                        + {plan.usagePrice} CSPR per unit
                                    </div>
                                )}

                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${plan.popular
                                            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                            : "bg-white/10 hover:bg-white/20 text-white"
                                        }`}
                                >
                                    Subscribe
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlans.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-2">No plans found</div>
                        <div className="text-sm text-gray-600">Try adjusting your search or filters</div>
                    </div>
                )}

                {/* Subscribe Modal */}
                {showSubscribeModal && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={() => setShowSubscribeModal(false)}
                        />
                        <div className="relative bg-[#12121a] border border-white/10 rounded-2xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-white mb-2">Confirm Subscription</h2>
                            <p className="text-gray-400 mb-6">You're about to subscribe to:</p>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                                <div className="text-sm text-gray-500">{selectedPlan.merchant}</div>
                                <div className="text-xl font-bold text-white">{selectedPlan.name}</div>
                                <div className="text-2xl font-bold text-green-400 mt-2">
                                    {selectedPlan.basePrice} CSPR<span className="text-sm text-gray-500">/{selectedPlan.billingCycle}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Payment Method</span>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-green-500" />
                                        <span className="text-white">Stake-to-Pay</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Auto-Renew</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowSubscribeModal(false)}
                                    className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        alert("Subscription created! (Demo)");
                                        setShowSubscribeModal(false);
                                    }}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
