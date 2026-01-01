"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { usePlans } from "@/context/PlansContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gift,
    Clock,
    Zap,
    CheckCircle,
    ArrowRight,
    Star,
    Shield,
    CreditCard,
    AlertCircle,
    Sparkles
} from "lucide-react";

export default function FreeTrialsPage() {
    const { address, isConnected } = useWallet();
    const { plans, getPlansWithTrials } = usePlans();
    const { startTrial, getActiveTrials, isSubscribed } = useSubscriptions();
    const [startingTrial, setStartingTrial] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const trialPlans = getPlansWithTrials();
    const myTrials = getActiveTrials(address);

    const handleStartTrial = async (plan: typeof plans[0]) => {
        if (!address) return;

        setStartingTrial(plan.id);

        // Simulate transaction
        await new Promise(r => setTimeout(r, 1500));

        startTrial({
            planId: plan.id,
            planName: plan.name,
            planPrice: plan.price,
            planPeriod: plan.period,
            merchantWallet: plan.createdBy,
            subscriberWallet: address,
            trialDays: plan.trialDays
        });

        setSuccessMessage(`🎉 Started ${plan.trialDays}-day free trial for ${plan.name}!`);
        setTimeout(() => setSuccessMessage(null), 4000);
        setStartingTrial(null);
    };

    const getDaysRemaining = (expiresAt: number) => {
        const remaining = expiresAt - Date.now();
        return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-cyan-500/20 rounded-3xl p-8 border border-green-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                                <Gift className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Free Trials</h1>
                                <p className="text-green-200/70">
                                    Try before you buy • No credit card required • Cancel anytime
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <Clock className="w-5 h-5 text-green-400" />
                                <div>
                                    <div className="text-sm text-white font-medium">7-14 Day Trials</div>
                                    <div className="text-xs text-gray-400">Full access during trial</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <div>
                                    <div className="text-sm text-white font-medium">No Payment Required</div>
                                    <div className="text-xs text-gray-400">Start instantly</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <div className="text-sm text-white font-medium">Upgrade Anytime</div>
                                    <div className="text-xs text-gray-400">Convert to paid when ready</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-300">{successMessage}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* My Active Trials */}
                {myTrials.length > 0 && (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            Your Active Trials
                        </h2>

                        <div className="space-y-3">
                            {myTrials.map((trial) => {
                                const daysLeft = getDaysRemaining(trial.expiresAt);
                                const isExpiring = daysLeft <= 2;

                                return (
                                    <div
                                        key={trial.id}
                                        className={`flex items-center justify-between p-4 rounded-xl border ${isExpiring
                                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                                : 'bg-white/5 border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isExpiring ? 'bg-yellow-500/20' : 'bg-green-500/20'
                                                }`}>
                                                {isExpiring ? (
                                                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                                                ) : (
                                                    <Gift className="w-6 h-6 text-green-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{trial.planName}</div>
                                                <div className="text-sm text-gray-500">
                                                    {daysLeft} days remaining
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right mr-2">
                                                <div className="text-xs text-gray-500">After trial</div>
                                                <div className="font-semibold text-white">
                                                    {trial.planPrice} CSPR/{trial.planPeriod}
                                                </div>
                                            </div>
                                            <button
                                                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-2 px-4 rounded-xl transition-all"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Upgrade
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Available Trial Plans */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-6">
                        Available Trial Plans ({trialPlans.length})
                    </h2>

                    {trialPlans.length === 0 ? (
                        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                                <Gift className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Free Trials Available</h3>
                            <p className="text-gray-400">
                                Check back later for new trial offers from merchants.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trialPlans.map((plan, index) => {
                                const alreadySubscribed = isSubscribed(plan.id, address);
                                const alreadyTrialing = myTrials.some(t => t.planId === plan.id);
                                const isStarting = startingTrial === plan.id;

                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all"
                                    >
                                        {/* Trial Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                                                <Gift className="w-3 h-3" />
                                                {plan.trialDays}-Day Free Trial
                                            </span>
                                            <span className="text-xs text-gray-500 capitalize">
                                                {plan.tier}
                                            </span>
                                        </div>

                                        {/* Plan Info */}
                                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {plan.description}
                                        </p>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold text-white">{plan.price}</span>
                                            <span className="text-gray-500 ml-1">CSPR/{plan.period}</span>
                                            <div className="text-sm text-green-400 mt-1">
                                                First {plan.trialDays} days FREE
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-2 mb-6">
                                            {plan.features.slice(0, 4).map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <button
                                            onClick={() => handleStartTrial(plan)}
                                            disabled={!isConnected || alreadySubscribed || alreadyTrialing || isStarting}
                                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${alreadySubscribed || alreadyTrialing
                                                    ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white hover:scale-[1.02]'
                                                }`}
                                        >
                                            {isStarting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Starting Trial...
                                                </>
                                            ) : alreadyTrialing ? (
                                                <>
                                                    <Clock className="w-5 h-5" />
                                                    Already Trialing
                                                </>
                                            ) : alreadySubscribed ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Already Subscribed
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="w-5 h-5" />
                                                    Start Free Trial
                                                    <ArrowRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* How It Works */}
                <div className="bg-gradient-to-br from-gray-900 to-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">How Free Trials Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                                <Gift className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="font-medium text-white mb-1">1. Start Trial</div>
                            <div className="text-xs text-gray-500">No payment needed</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="font-medium text-white mb-1">2. Full Access</div>
                            <div className="text-xs text-gray-500">All features unlocked</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div className="font-medium text-white mb-1">3. Trial Period</div>
                            <div className="text-xs text-gray-500">7-14 days to explore</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                                <CreditCard className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="font-medium text-white mb-1">4. Upgrade</div>
                            <div className="text-xs text-gray-500">Pay with CSPR to continue</div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
