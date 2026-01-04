"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { transferCSPR, isCasperWalletAvailable, getDeployExplorerUrl } from "@/lib/casper";
import { motion, AnimatePresence } from "framer-motion";
import {
    Coins,
    Zap,
    TrendingUp,
    Lock,
    Unlock,
    ArrowRight,
    CheckCircle,
    Calculator,
    RefreshCw,
    Shield,
    Sparkles,
    Gift,
    Clock,
    ArrowUpRight,
    AlertCircle,
    Wallet,
    Target,
    PiggyBank,
    BadgePercent,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

// Simulated stake storage (in production, this would be on-chain)
const STAKE_STORAGE_KEY = 'casperflow_stakes_v2';
const APY_RATE = 0.08; // 8% APY
const MIN_STAKE = 100; // Minimum 100 CSPR

// StakeToPay Vault Address (Testnet) - Receives staked CSPR
const STAKE_VAULT_PUBLIC_KEY = '0203b8620122e83f06e1f6b0ed37aa27c9fc2a51b5a3b179b829d73cd8a7e885c7b7';

interface StakeData {
    wallet: string;
    stakedAmount: number;
    stakedAt: number;
    lastRewardClaim: number;
    autoPayEnabled: boolean;
    autoRenewEnabled: boolean;
    planIds: string[];
    totalRewardsClaimed: number;
    totalSubscriptionsPaid: number;
}

function getStakeData(wallet: string): StakeData | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STAKE_STORAGE_KEY);
    if (!stored) return null;
    const stakes: StakeData[] = JSON.parse(stored);
    return stakes.find(s => s.wallet === wallet) || null;
}

function saveStakeData(data: StakeData) {
    const stored = localStorage.getItem(STAKE_STORAGE_KEY);
    let stakes: StakeData[] = stored ? JSON.parse(stored) : [];
    const existingIndex = stakes.findIndex(s => s.wallet === data.wallet);
    if (existingIndex >= 0) {
        stakes[existingIndex] = data;
    } else {
        stakes.push(data);
    }
    localStorage.setItem(STAKE_STORAGE_KEY, JSON.stringify(stakes));
}

export default function StakeToPayPage() {
    const { isConnected, address, balance, publicKey, network } = useWallet();
    const { getSubscriptionsForUser } = useSubscriptions();
    const [stakeAmount, setStakeAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [isStaking, setIsStaking] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [stakeData, setStakeData] = useState<StakeData | null>(null);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'stake' | 'withdraw' | 'calculator'>('stake');
    const [useOnChain, setUseOnChain] = useState(true);
    const [lastTxHash, setLastTxHash] = useState<string | null>(null);
    const [lastTxUrl, setLastTxUrl] = useState<string | null>(null);

    const mySubscriptions = getSubscriptionsForUser(address);
    const activeSubscriptions = mySubscriptions.filter(s => s.status === 'active');
    const monthlySubscriptionCost = activeSubscriptions.reduce((sum, s) => sum + s.planPrice, 0);
    const yearlySubscriptionCost = monthlySubscriptionCost * 12;

    // Load stake data
    useEffect(() => {
        if (address) {
            setStakeData(getStakeData(address));
        }
    }, [address]);

    // Calculate rewards
    const calculateRewards = (amount: number, days: number = 365) => {
        return (amount * APY_RATE * days) / 365;
    };

    // Computed values
    const stakedAmount = stakeData?.stakedAmount || 0;
    const daysStaked = stakeData ? Math.floor((Date.now() - stakeData.stakedAt) / (24 * 60 * 60 * 1000)) : 0;
    const daysSinceLastClaim = stakeData ? Math.floor((Date.now() - stakeData.lastRewardClaim) / (24 * 60 * 60 * 1000)) : 0;

    // Rewards calculations
    const pendingRewards = calculateRewards(stakedAmount, daysSinceLastClaim);
    const totalEarnedRewards = calculateRewards(stakedAmount, daysStaked);
    const projectedDailyRewards = calculateRewards(stakedAmount, 1);
    const projectedMonthlyRewards = calculateRewards(stakedAmount, 30);
    const projectedYearlyRewards = calculateRewards(stakedAmount, 365);

    // Coverage calculations
    const monthsCovered = monthlySubscriptionCost > 0
        ? Math.floor(stakedAmount / monthlySubscriptionCost)
        : Infinity;

    // Can rewards alone cover subscriptions?
    const canPayFromRewardsOnly = projectedMonthlyRewards >= monthlySubscriptionCost;

    // How much needs to be staked to pay only from rewards
    const stakeNeededForFullCoverage = yearlySubscriptionCost / APY_RATE;

    // Savings calculation (vs 2.9% + $0.30 per transaction)
    const traditionalFees = yearlySubscriptionCost * 0.029 + (12 * 0.30);
    const yearlySavings = traditionalFees;

    const handleStake = async () => {
        if (!address || !stakeAmount) return;
        const amount = parseFloat(stakeAmount);
        if (isNaN(amount) || amount < MIN_STAKE) {
            setShowSuccess(`Minimum stake is ${MIN_STAKE} CSPR`);
            setTimeout(() => setShowSuccess(null), 3000);
            return;
        }

        setIsStaking(true);
        setLastTxHash(null);
        setLastTxUrl(null);

        let txHash: string | undefined;
        let txUrl: string | undefined;
        let usedOnChain = false;

        try {
            // Try real on-chain transfer if enabled and wallet available
            if (useOnChain && publicKey && isCasperWalletAvailable()) {
                try {
                    console.log('Initiating on-chain stake transfer:', {
                        from: publicKey.slice(0, 16) + '...',
                        to: STAKE_VAULT_PUBLIC_KEY.slice(0, 16) + '...',
                        amount: amount
                    });

                    const result = await transferCSPR(
                        publicKey,
                        STAKE_VAULT_PUBLIC_KEY,
                        amount,
                        network as 'testnet' | 'mainnet'
                    );
                    txHash = result.deployHash;
                    txUrl = result.explorerUrl;
                    usedOnChain = true;
                    console.log('✅ Stake transaction submitted:', txHash);
                } catch (walletErr: unknown) {
                    const errMessage = walletErr instanceof Error ? walletErr.message : 'Unknown error';
                    console.log('Wallet operation failed:', errMessage);
                    if (errMessage.includes('cancelled') || errMessage.includes('rejected')) {
                        setShowSuccess('Transaction cancelled by user');
                        setTimeout(() => setShowSuccess(null), 3000);
                        setIsStaking(false);
                        return;
                    }
                    // Continue with demo mode
                }
            }

            // If not on-chain, simulate
            if (!usedOnChain) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                txHash = `demo-stake-${Date.now().toString(16)}`;
            }

            const now = Date.now();
            const newData: StakeData = {
                wallet: address,
                stakedAmount: (stakeData?.stakedAmount || 0) + amount,
                stakedAt: stakeData?.stakedAt || now,
                lastRewardClaim: stakeData?.lastRewardClaim || now,
                autoPayEnabled: true,
                autoRenewEnabled: true,
                planIds: activeSubscriptions.map(s => s.planId),
                totalRewardsClaimed: stakeData?.totalRewardsClaimed || 0,
                totalSubscriptionsPaid: stakeData?.totalSubscriptionsPaid || 0
            };

            saveStakeData(newData);
            setStakeData(newData);
            setStakeAmount("");
            setLastTxHash(txHash || null);
            setLastTxUrl(txUrl || null);

            if (usedOnChain) {
                setShowSuccess(`✅ Staked ${amount} CSPR on-chain! View on explorer.`);
            } else {
                setShowSuccess(`✅ Successfully staked ${amount} CSPR! Now earning 8% APY.`);
            }
            setTimeout(() => setShowSuccess(null), 5000);
        } catch (error) {
            console.error('Stake error:', error);
            setShowSuccess('Failed to stake. Please try again.');
            setTimeout(() => setShowSuccess(null), 3000);
        } finally {
            setIsStaking(false);
        }
    };

    const handleWithdraw = async () => {
        if (!address || !withdrawAmount || !stakeData) return;
        const amount = parseFloat(withdrawAmount);
        const maxWithdrawable = stakeData.stakedAmount + pendingRewards;

        if (isNaN(amount) || amount <= 0 || amount > maxWithdrawable) {
            setShowSuccess(`Invalid amount. Max: ${maxWithdrawable.toFixed(2)} CSPR`);
            setTimeout(() => setShowSuccess(null), 3000);
            return;
        }

        setIsWithdrawing(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Withdraw from rewards first, then principal
        let newStake = stakeData.stakedAmount;
        let remainingToWithdraw = amount;

        if (pendingRewards >= remainingToWithdraw) {
            // Just withdraw from rewards
        } else {
            remainingToWithdraw -= pendingRewards;
            newStake -= remainingToWithdraw;
        }

        const newData: StakeData = {
            ...stakeData,
            stakedAmount: Math.max(0, newStake),
            lastRewardClaim: Date.now()
        };

        saveStakeData(newData);
        setStakeData(newData);
        setWithdrawAmount("");
        setShowSuccess(`✅ Successfully withdrew ${amount} CSPR!`);
        setTimeout(() => setShowSuccess(null), 4000);
        setIsWithdrawing(false);
    };

    const handleClaimRewards = async () => {
        if (!address || !stakeData || pendingRewards <= 0) return;

        setIsClaiming(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const newData: StakeData = {
            ...stakeData,
            lastRewardClaim: Date.now(),
            totalRewardsClaimed: stakeData.totalRewardsClaimed + pendingRewards
        };

        saveStakeData(newData);
        setStakeData(newData);
        setShowSuccess(`✅ Claimed ${pendingRewards.toFixed(4)} CSPR in rewards!`);
        setTimeout(() => setShowSuccess(null), 4000);
        setIsClaiming(false);
    };

    // Calculator state
    const [calcStakeAmount, setCalcStakeAmount] = useState<string>("1000");
    const calcAmount = parseFloat(calcStakeAmount) || 0;
    const calcYearlyRewards = calculateRewards(calcAmount, 365);
    const calcMonthlyRewards = calculateRewards(calcAmount, 30);
    const calcCoverageMonths = monthlySubscriptionCost > 0 ? calcYearlyRewards / monthlySubscriptionCost : Infinity;

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header with Gradient */}
                <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-purple-500/20 rounded-3xl p-8 border border-yellow-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                    <Coins className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Stake-to-Pay</h1>
                                    <p className="text-yellow-200/70">
                                        Earn 8% APY • Auto-pay subscriptions • Keep your principal
                                    </p>
                                </div>
                            </div>
                            {/* On-Chain Toggle */}
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer bg-white/5 rounded-xl px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={useOnChain}
                                        onChange={(e) => setUseOnChain(e.target.checked)}
                                        className="w-4 h-4 accent-yellow-500"
                                    />
                                    <span className="text-sm text-gray-300">On-Chain</span>
                                </label>
                                <span className={`text-xs px-2 py-1 rounded ${useOnChain ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {useOnChain ? 'Real CSPR' : 'Demo'}
                                </span>
                            </div>
                        </div>

                        {/* Value Proposition */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <div>
                                    <div className="text-sm text-white font-medium">Earn While You Sleep</div>
                                    <div className="text-xs text-gray-400">8% APY on staked CSPR</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <RefreshCw className="w-5 h-5 text-green-400" />
                                <div>
                                    <div className="text-sm text-white font-medium">Auto-Pay Subscriptions</div>
                                    <div className="text-xs text-gray-400">Never miss a payment</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <Shield className="w-5 h-5 text-blue-400" />
                                <div>
                                    <div className="text-sm text-white font-medium">No Lock-up Period</div>
                                    <div className="text-xs text-gray-400">Withdraw anytime</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span className="text-green-300">{showSuccess}</span>
                                </div>
                                {lastTxUrl && (
                                    <a
                                        href={lastTxUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 font-medium"
                                    >
                                        View on Explorer <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            {lastTxHash && (
                                <div className="mt-2 text-xs text-gray-400 font-mono truncate">
                                    Tx: {lastTxHash}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats Grid - Premium Design */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                <Coins className="w-5 h-5 text-yellow-400" />
                            </div>
                            <span className="text-xs text-yellow-400/80 font-medium px-2 py-1 bg-yellow-400/10 rounded-full">
                                Staked
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stakedAmount.toFixed(2)} CSPR</div>
                        <div className="text-sm text-gray-500">≈ ${(stakedAmount * 0.03).toFixed(2)} USD</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Gift className="w-5 h-5 text-green-400" />
                            </div>
                            <button
                                onClick={handleClaimRewards}
                                disabled={pendingRewards <= 0 || isClaiming}
                                className="text-xs text-green-400 hover:text-green-300 font-medium px-2 py-1 bg-green-400/10 rounded-full disabled:opacity-50 transition-colors"
                            >
                                {isClaiming ? "..." : "Claim"}
                            </button>
                        </div>
                        <div className="text-2xl font-bold text-green-400">+{pendingRewards.toFixed(4)} CSPR</div>
                        <div className="text-sm text-gray-500">Pending Rewards</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-xs text-purple-400/80 font-medium px-2 py-1 bg-purple-400/10 rounded-full">
                                8% APY
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400">{projectedYearlyRewards.toFixed(2)} CSPR</div>
                        <div className="text-sm text-gray-500">Est. Yearly Rewards</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-blue-400" />
                            </div>
                            {canPayFromRewardsOnly && (
                                <span className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Covered
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                            {monthsCovered === Infinity ? '∞' : `${monthsCovered} mo`}
                        </div>
                        <div className="text-sm text-gray-500">Subscription Coverage</div>
                    </motion.div>
                </div>

                {/* Reward Status Banner */}
                {stakedAmount > 0 && (
                    <div className={`rounded-2xl p-5 border ${canPayFromRewardsOnly
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                        : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                        }`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {canPayFromRewardsOnly ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-green-400">
                                                🎉 Rewards Cover Your Subscriptions!
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                Your monthly rewards ({projectedMonthlyRewards.toFixed(2)} CSPR) exceed your subscription costs ({monthlySubscriptionCost} CSPR)
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                            <Target className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-semibold text-yellow-400">
                                                Stake More to Pay Only from Rewards
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                Stake {stakeNeededForFullCoverage.toFixed(0)} CSPR to fully cover subscriptions from rewards alone
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {yearlySavings > 0 && (
                                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
                                    <PiggyBank className="w-5 h-5 text-green-400" />
                                    <div>
                                        <div className="text-xs text-gray-500">Annual Savings vs Credit Card</div>
                                        <div className="text-lg font-bold text-green-400">${yearlySavings.toFixed(2)}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Actions - Tabbed Interface */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('stake')}
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'stake' ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" />
                                Stake
                            </div>
                            {activeTab === 'stake' && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('withdraw')}
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'withdraw' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Unlock className="w-4 h-4" />
                                Withdraw
                            </div>
                            {activeTab === 'withdraw' && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('calculator')}
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-colors relative ${activeTab === 'calculator' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Calculator className="w-4 h-4" />
                                Calculator
                            </div>
                            {activeTab === 'calculator' && (
                                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'stake' && (
                                <motion.div
                                    key="stake"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Amount to Stake</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={stakeAmount}
                                                onChange={(e) => setStakeAmount(e.target.value)}
                                                placeholder={`Min ${MIN_STAKE} CSPR`}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-24 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <button
                                                    onClick={() => setStakeAmount(balance.replace(/,/g, ''))}
                                                    className="text-xs text-yellow-400 hover:text-yellow-300 font-medium"
                                                >
                                                    MAX
                                                </button>
                                                <span className="text-gray-500">CSPR</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                                            <span>Available: {balance} CSPR</span>
                                            <span>Min: {MIN_STAKE} CSPR</span>
                                        </div>
                                    </div>

                                    {stakeAmount && parseFloat(stakeAmount) >= MIN_STAKE && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 space-y-2"
                                        >
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">APY</span>
                                                <span className="text-yellow-400 font-semibold flex items-center gap-1">
                                                    <BadgePercent className="w-4 h-4" /> 8%
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Monthly Rewards</span>
                                                <span className="text-green-400">
                                                    +{calculateRewards(parseFloat(stakeAmount), 30).toFixed(2)} CSPR
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Yearly Rewards</span>
                                                <span className="text-green-400">
                                                    +{calculateRewards(parseFloat(stakeAmount), 365).toFixed(2)} CSPR
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleStake}
                                        disabled={!isConnected || isStaking || !stakeAmount || parseFloat(stakeAmount) < MIN_STAKE}
                                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                                    >
                                        {isStaking ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Staking...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                Stake CSPR
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'withdraw' && (
                                <motion.div
                                    key="withdraw"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Amount to Withdraw</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                placeholder="0.00"
                                                max={stakedAmount + pendingRewards}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-24 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                <button
                                                    onClick={() => setWithdrawAmount((stakedAmount + pendingRewards).toString())}
                                                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                                                >
                                                    MAX
                                                </button>
                                                <span className="text-gray-500">CSPR</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 rounded-xl p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Staked Principal</span>
                                            <span className="text-white font-medium">{stakedAmount.toFixed(2)} CSPR</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Pending Rewards</span>
                                            <span className="text-green-400">+{pendingRewards.toFixed(4)} CSPR</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                                            <span className="text-gray-400">Total Available</span>
                                            <span className="text-blue-400 font-semibold">
                                                {(stakedAmount + pendingRewards).toFixed(4)} CSPR
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleWithdraw}
                                        disabled={!isConnected || isWithdrawing || !withdrawAmount || stakedAmount === 0}
                                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        {isWithdrawing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Withdrawing...
                                            </>
                                        ) : (
                                            <>
                                                <Unlock className="w-5 h-5" />
                                                Withdraw
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'calculator' && (
                                <motion.div
                                    key="calculator"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-2">Simulate Stake Amount</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={calcStakeAmount}
                                                onChange={(e) => setCalcStakeAmount(e.target.value)}
                                                placeholder="1000"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-20 text-white text-lg placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">CSPR</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-purple-500/10 rounded-xl p-4">
                                            <div className="text-xs text-gray-500 mb-1">Monthly Rewards</div>
                                            <div className="text-xl font-bold text-purple-400">
                                                +{calcMonthlyRewards.toFixed(2)} CSPR
                                            </div>
                                        </div>
                                        <div className="bg-purple-500/10 rounded-xl p-4">
                                            <div className="text-xs text-gray-500 mb-1">Yearly Rewards</div>
                                            <div className="text-xl font-bold text-purple-400">
                                                +{calcYearlyRewards.toFixed(2)} CSPR
                                            </div>
                                        </div>
                                    </div>

                                    {monthlySubscriptionCost > 0 && (
                                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-sm text-gray-400">Subscription Coverage</div>
                                                    <div className="text-lg font-semibold text-white">
                                                        {calcMonthlyRewards >= monthlySubscriptionCost ? (
                                                            <span className="text-green-400">✓ Fully covered by rewards!</span>
                                                        ) : (
                                                            <span>{(calcCoverageMonths * 12).toFixed(1)} months/year from rewards</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">Your monthly cost</div>
                                                    <div className="text-lg font-bold text-white">{monthlySubscriptionCost} CSPR</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center text-sm text-gray-500">
                                        <Calculator className="w-4 h-4 inline mr-1" />
                                        Based on 8% APY • Actual returns may vary
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Active Subscriptions with Auto-Pay */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-green-400" />
                            Auto-Pay Subscriptions
                        </h3>
                        {stakedAmount > 0 && (
                            <span className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Auto-Pay Active
                            </span>
                        )}
                    </div>

                    {activeSubscriptions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-2xl bg-gray-500/20 flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 mb-4">No active subscriptions to auto-pay</p>
                            <Link
                                href="/app/user/browse"
                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Browse Plans <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeSubscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/[0.07] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{sub.planName}</div>
                                            <div className="text-sm text-gray-500">{sub.planPrice} CSPR / {sub.planPeriod}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                                Auto-Renew
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Next: {new Date(sub.expiresAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                                <div>
                                    <span className="text-gray-400">Total Monthly Cost</span>
                                    <div className="text-xs text-gray-600">
                                        {canPayFromRewardsOnly ? 'Covered by staking rewards ✓' : 'Paid from stake + rewards'}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-white">{monthlySubscriptionCost} CSPR</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* How It Works - Visual */}
                <div className="bg-gradient-to-br from-gray-900 to-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">How Stake-to-Pay Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-3">
                                    <Lock className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div className="font-medium text-white mb-1">1. Stake CSPR</div>
                                <div className="text-xs text-gray-500">Deposit your CSPR tokens</div>
                            </div>
                            <div className="hidden md:block absolute top-7 left-full w-full h-0.5 bg-gradient-to-r from-yellow-500/30 to-green-500/30" />
                        </div>
                        <div className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-3">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="font-medium text-white mb-1">2. Earn 8% APY</div>
                                <div className="text-xs text-gray-500">Rewards accrue daily</div>
                            </div>
                            <div className="hidden md:block absolute top-7 left-full w-full h-0.5 bg-gradient-to-r from-green-500/30 to-purple-500/30" />
                        </div>
                        <div className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-3">
                                    <RefreshCw className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="font-medium text-white mb-1">3. Auto-Pay</div>
                                <div className="text-xs text-gray-500">Subscriptions paid from rewards</div>
                            </div>
                            <div className="hidden md:block absolute top-7 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30" />
                        </div>
                        <div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-3">
                                    <Unlock className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="font-medium text-white mb-1">4. Withdraw</div>
                                <div className="text-xs text-gray-500">Anytime, no lock-up</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Banner - Economics Explained */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        How Staking Rewards Work
                    </h4>
                    <div className="space-y-3 text-sm text-gray-400">
                        <p>
                            <span className="text-white font-medium">Where do rewards come from?</span> Staking rewards on Casper come from
                            <span className="text-blue-400"> network inflation</span>, not from CasperFlow or anyone's pocket.
                            The Casper blockchain mints new CSPR to reward validators and delegators for securing the network.
                        </p>
                        <p>
                            <span className="text-white font-medium">How it works:</span> When you stake CSPR through CasperFlow,
                            your tokens are delegated to trusted Casper validators. These validators process transactions and secure the network,
                            earning rewards that are distributed to delegators (you!).
                        </p>
                        <p className="border-t border-white/10 pt-3 mt-3">
                            <span className="text-yellow-400 font-medium">⚡ Testnet Demo:</span> Stake operations are currently simulated.
                            In production, your CSPR is actually staked with network validators earning real staking rewards (~8% APY).
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
