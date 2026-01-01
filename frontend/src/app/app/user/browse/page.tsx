"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { usePlans } from "@/context/PlansContext";
import { useSubscriptions, Subscription } from "@/context/SubscriptionsContext";
import { useNotifications } from "@/context/NotificationsContext";
import { subscribeWithTransfer, isCasperWalletAvailable, getDeployExplorerUrl, CASPER_CONFIG } from "@/lib/casper";
import {
    Package,
    Zap,
    Search,
    Check,
    Users,
    CheckCircle,
    Key,
    Copy,
    X,
    ExternalLink,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UserBrowsePage() {
    const { isConnected, address, publicKey, network } = useWallet();
    const { plans, incrementSubscribers } = usePlans();
    const { subscribe, isSubscribed, getSubscription } = useSubscriptions();
    const { addNotification } = useNotifications();
    const [subscribingTo, setSubscribingTo] = useState<string | null>(null);
    const [newSubscription, setNewSubscription] = useState<Subscription | null>(null);
    const [copied, setCopied] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [txError, setTxError] = useState<string | null>(null);
    const [useOnChain, setUseOnChain] = useState(true); // Toggle for on-chain vs demo mode

    const handleSubscribe = async (plan: typeof plans[0]) => {
        if (!isConnected || !address) return;
        if (isSubscribed(plan.id, address)) return;

        setSubscribingTo(plan.id);
        setTxError(null);
        setTxHash(null);

        try {
            let txResult: { deployHash: string; explorerUrl: string } | null = null;
            let usedOnChain = false;

            // Try real on-chain subscription if enabled and wallet available
            if (useOnChain && publicKey && isCasperWalletAvailable()) {
                // Check if merchant has a full public key we can transfer to
                const merchantPubKey = plan.merchantPublicKey;

                // Only do on-chain if we have a valid merchant public key (66 chars for ed25519)
                if (merchantPubKey && merchantPubKey.length >= 64) {
                    try {
                        console.log('Initiating on-chain transfer:', {
                            from: publicKey.slice(0, 16) + '...',
                            to: merchantPubKey.slice(0, 16) + '...',
                            amount: plan.price
                        });

                        txResult = await subscribeWithTransfer(
                            publicKey,
                            merchantPubKey,
                            plan.price,
                            network as 'testnet' | 'mainnet'
                        );
                        setTxHash(txResult.deployHash);
                        usedOnChain = true;
                    } catch (walletErr: any) {
                        console.error('Wallet error:', walletErr);
                        // If user cancelled, throw to stop the process
                        if (walletErr.message?.includes('cancelled')) {
                            throw walletErr;
                        }
                        // Otherwise fall back to demo mode
                        setTxError(`On-chain failed: ${walletErr.message}. Using demo mode.`);
                    }
                } else {
                    // No valid merchant key - this plan was created before we saved full keys
                    console.log('Plan missing merchantPublicKey, using demo mode. Plan created by:', plan.createdBy);
                    setTxError('This plan was created before on-chain support. Using demo mode.');
                }
            }

            // If not on-chain, simulate
            if (!usedOnChain) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Subscribe the user and get the new subscription with API key
            const sub = subscribe({
                planId: plan.id,
                planName: plan.name,
                planPrice: plan.price,
                planPeriod: plan.period,
                merchantWallet: plan.createdBy,
                subscriberWallet: address,
                autoRenewEnabled: false,
                maxSpendApproved: 0
            });

            // Register API key with verification endpoint
            try {
                await fetch('/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        apiKey: sub.apiKey,
                        planName: plan.name,
                        expiresAt: sub.expiresAt,
                        subscriberWallet: address
                    })
                });
            } catch (e) {
                console.log('API registration skipped');
            }

            // Increment plan stats
            incrementSubscribers(plan.id, plan.price);

            // Notify the merchant
            addNotification({
                type: 'subscription',
                title: 'New Subscriber! 🎉',
                message: `${address.slice(0, 8)}...${address.slice(-4)} subscribed to "${plan.name}" for ${plan.price} CSPR${txHash ? ` (Tx: ${txHash.slice(0, 8)}...)` : ''}`,
                forWallet: plan.createdBy
            });

            // Notify the user
            addNotification({
                type: 'subscription',
                title: 'Subscription Active!',
                message: `You subscribed to "${plan.name}". ${txHash ? `View tx on explorer.` : `API Key: ${sub.apiKey.slice(0, 12)}...`}`,
                forWallet: address
            });

            setNewSubscription(sub);
        } catch (error: any) {
            console.error('Subscription error:', error);
            setTxError(error.message || 'Transaction failed');
        } finally {
            setSubscribingTo(null);
        }
    };

    const copyApiKey = () => {
        if (newSubscription) {
            navigator.clipboard.writeText(newSubscription.apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Browse Plans</h1>
                        <p className="text-gray-400 mt-1">Discover subscription plans from merchants.</p>
                    </div>

                    {/* On-Chain Toggle */}
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useOnChain}
                                onChange={(e) => setUseOnChain(e.target.checked)}
                                className="w-4 h-4 accent-purple-500"
                            />
                            <span className="text-sm text-gray-400">On-Chain Transactions</span>
                        </label>
                        <span className={`text-xs px-2 py-1 rounded ${useOnChain ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {useOnChain ? 'Real CSPR' : 'Demo Mode'}
                        </span>
                    </div>
                </div>

                {/* On-Chain Mode Banner */}
                {useOnChain && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <div className="text-sm text-gray-400">
                                <span className="text-green-400 font-semibold">On-Chain Mode:</span> Subscriptions will trigger real CSPR transfers on Casper {network}. Make sure you have enough balance!
                            </div>
                        </div>
                    </div>
                )}

                {/* Transaction Error */}
                {txError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-red-400">Transaction Failed</div>
                                <div className="text-xs text-gray-400">{txError}</div>
                            </div>
                            <button onClick={() => setTxError(null)} className="text-gray-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search for plans..."
                        className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                </div>

                {/* Plans Grid or Empty State */}
                {plans.length === 0 ? (
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                        <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Plans Available Yet</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Merchants haven't created any plans yet. Try the merchant dashboard to create a test plan.
                            </p>
                            <Link
                                href="/app/merchant/plans"
                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                            >
                                Switch to Merchant View →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => {
                            const alreadySubscribed = isSubscribed(plan.id, address);
                            const isLoading = subscribingTo === plan.id;
                            const existingSub = getSubscription(plan.id, address);

                            return (
                                <div
                                    key={plan.id}
                                    className={`bg-[#12121a] border rounded-2xl p-6 transition-all hover-lift ${alreadySubscribed
                                        ? 'border-green-500/50'
                                        : 'border-white/10 hover:border-purple-500/50'
                                        }`}
                                >
                                    <div className="mb-4">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                            {alreadySubscribed && (
                                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Subscribed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{plan.description || "No description"}</p>
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                                        <span className="text-gray-500">CSPR/{plan.period}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                        <Users className="w-4 h-4" />
                                        {plan.subscribers} subscribers
                                    </div>

                                    {alreadySubscribed && existingSub ? (
                                        <div className="space-y-3">
                                            <div className="bg-green-500/10 rounded-xl p-3">
                                                <div className="flex items-center gap-2 text-xs text-green-400 mb-1">
                                                    <Key className="w-3 h-3" />
                                                    Your API Key
                                                </div>
                                                <div className="font-mono text-xs text-white bg-black/30 rounded px-2 py-1 truncate">
                                                    {existingSub.apiKey}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(existingSub.apiKey);
                                                    setCopied(true);
                                                    setTimeout(() => setCopied(false), 2000);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                                {copied ? 'Copied!' : 'Copy API Key'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSubscribe(plan)}
                                            disabled={!isConnected || isLoading}
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    {useOnChain ? 'Confirm in Wallet...' : 'Processing...'}
                                                </>
                                            ) : !isConnected ? (
                                                "Connect Wallet"
                                            ) : (
                                                <>
                                                    <Check className="w-5 h-5" />
                                                    Subscribe for {plan.price} CSPR
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-blue-400">Developer Tip:</span> Verify subscriptions via API:
                            <code className="bg-black/30 px-2 py-0.5 rounded ml-1 text-xs">
                                GET /api/verify?apiKey=cf_sk_xxx
                            </code>
                        </div>
                    </div>
                </div>

                {/* API Key Success Modal */}
                {newSubscription && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setNewSubscription(null)} />
                        <div className="relative bg-[#12121a] border border-green-500/30 rounded-2xl p-8 max-w-md w-full animate-fade-in">
                            <button
                                onClick={() => setNewSubscription(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Subscription Active!</h2>
                                <p className="text-gray-400 mt-2">
                                    You've subscribed to <span className="text-white font-semibold">{newSubscription.planName}</span>
                                </p>
                            </div>

                            {/* Transaction Hash */}
                            {txHash && (
                                <div className="bg-purple-500/10 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                                        <ExternalLink className="w-3 h-3" />
                                        Transaction Hash
                                    </div>
                                    <a
                                        href={getDeployExplorerUrl(txHash, network as 'testnet' | 'mainnet')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-xs text-white hover:text-purple-400 break-all"
                                    >
                                        {txHash}
                                    </a>
                                </div>
                            )}

                            <div className="bg-black/30 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-green-400 mb-2">
                                    <Key className="w-4 h-4" />
                                    Your API Key
                                </div>
                                <div className="font-mono text-sm text-white bg-black/50 rounded-lg p-3 break-all">
                                    {newSubscription.apiKey}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    ⚠️ Save this key! Use it to access the merchant's API.
                                </p>
                            </div>

                            <button
                                onClick={copyApiKey}
                                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold transition-all"
                            >
                                <Copy className="w-5 h-5" />
                                {copied ? 'Copied to Clipboard!' : 'Copy API Key'}
                            </button>

                            <div className="flex gap-4 mt-4">
                                {txHash && (
                                    <a
                                        href={getDeployExplorerUrl(txHash, network as 'testnet' | 'mainnet')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 block text-center text-sm text-purple-400 hover:text-purple-300 py-2 bg-purple-500/10 rounded-lg"
                                    >
                                        View on Explorer →
                                    </a>
                                )}
                                <Link
                                    href="/app/user/subscriptions"
                                    className="flex-1 block text-center text-sm text-gray-400 hover:text-white py-2"
                                >
                                    My Subscriptions →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
