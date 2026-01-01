"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Wallet,
    Clock,
    DollarSign,
    Settings,
    Trash2,
    Info,
    Lock,
    Unlock,
    Zap
} from "lucide-react";

export default function PaymentConsentsPage() {
    const { address, isConnected } = useWallet();
    const {
        consents,
        subscriptions,
        revokeConsent,
        createConsent
    } = useSubscriptions();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [revoking, setRevoking] = useState<string | null>(null);

    const myConsents = consents.filter(c => c.subscriberWallet === address);
    const activeConsents = myConsents.filter(c => c.status === 'active');
    const revokedConsents = myConsents.filter(c => c.status !== 'active');

    // Calculate total exposure
    const totalExposure = activeConsents.reduce((sum, c) => sum + c.remainingAllowance, 0);

    const handleRevoke = async (consentId: string) => {
        setRevoking(consentId);
        await new Promise(r => setTimeout(r, 1000)); // Simulate transaction
        revokeConsent(consentId);
        setRevoking(null);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-blue-400" />
                            Payment Consents
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Manage recurring payment authorizations for auto-renewals
                        </p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Info className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                What are Payment Consents?
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Payment consents allow merchants to automatically charge your wallet for subscription renewals.
                                You set a maximum spend limit, and merchants can only charge up to that amount.
                                You can revoke consent anytime to stop automatic payments.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-sm text-gray-500">Active Consents</span>
                        </div>
                        <div className="text-3xl font-bold text-white">{activeConsents.length}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-yellow-400" />
                            </div>
                            <span className="text-sm text-gray-500">Total Exposure</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-400">{totalExposure} CSPR</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#12121a] border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-sm text-gray-500">Auto-Renewing</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {subscriptions.filter(s => s.subscriberWallet === address && s.autoRenewEnabled).length}
                        </div>
                    </motion.div>
                </div>

                {/* Active Consents */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-green-400" />
                        Active Payment Consents
                    </h3>

                    {activeConsents.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-gray-500" />
                            </div>
                            <h4 className="text-xl font-semibold text-white mb-2">No Active Consents</h4>
                            <p className="text-gray-400 max-w-md mx-auto">
                                You haven't authorized any recurring payments yet.
                                When you subscribe with auto-renew enabled, a consent will be created.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeConsents.map((consent) => {
                                const subscription = subscriptions.find(s => s.planId === consent.planId);
                                return (
                                    <motion.div
                                        key={consent.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">
                                                        {subscription?.planName || 'Subscription Plan'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Merchant: {consent.merchantWallet.slice(0, 8)}...{consent.merchantWallet.slice(-4)}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        Created: {formatDate(consent.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:items-end gap-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500">Max per period</div>
                                                        <div className="font-semibold text-white">
                                                            {consent.maxAmountPerPeriod} CSPR
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500">Remaining</div>
                                                        <div className="font-semibold text-yellow-400">
                                                            {consent.remainingAllowance} CSPR
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleRevoke(consent.id)}
                                                    disabled={revoking === consent.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                                >
                                                    {revoking === consent.id ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                                            Revoking...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4" />
                                                            Revoke
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Allowance used</span>
                                                <span>
                                                    {((consent.totalMaxAmount - consent.remainingAllowance) / consent.totalMaxAmount * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${((consent.totalMaxAmount - consent.remainingAllowance) / consent.totalMaxAmount * 100)}%`
                                                    }}
                                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Revoked/Exhausted Consents */}
                {revokedConsents.length > 0 && (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Unlock className="w-5 h-5 text-gray-400" />
                            Past Consents
                        </h3>

                        <div className="space-y-3">
                            {revokedConsents.map((consent) => {
                                const subscription = subscriptions.find(s => s.planId === consent.planId);
                                return (
                                    <div
                                        key={consent.id}
                                        className="bg-white/5 rounded-xl p-4 opacity-60"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${consent.status === 'revoked' ? 'bg-red-500/20' : 'bg-gray-500/20'
                                                    }`}>
                                                    <XCircle className={`w-4 h-4 ${consent.status === 'revoked' ? 'text-red-400' : 'text-gray-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-400">
                                                        {subscription?.planName || 'Subscription Plan'}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        {consent.status === 'revoked' ? 'Revoked' : 'Exhausted'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {consent.totalMaxAmount - consent.remainingAllowance} CSPR used
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Security Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400 font-medium">Security Note:</span> Payment consents
                            allow merchants to charge your wallet up to the approved limit. Always review the
                            merchant and amount before approving. You can revoke consent at any time to stop
                            automatic payments.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
