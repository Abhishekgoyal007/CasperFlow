"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { useSubscriptions } from "@/context/SubscriptionsContext";
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
    Shield
} from "lucide-react";
import Link from "next/link";

// Simulated stake storage (in production, this would be on-chain)
const STAKE_STORAGE_KEY = 'casperflow_stakes';

interface StakeData {
    wallet: string;
    stakedAmount: number;
    stakedAt: number;
    autoPayEnabled: boolean;
    planIds: string[];
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
    const { isConnected, address, balance } = useWallet();
    const { getSubscriptionsForUser } = useSubscriptions();
    const [stakeAmount, setStakeAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [isStaking, setIsStaking] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [stakeData, setStakeData] = useState<StakeData | null>(null);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);

    const mySubscriptions = getSubscriptionsForUser(address);
    const activeSubscriptions = mySubscriptions.filter(s => s.status === 'active');
    const monthlySubscriptionCost = activeSubscriptions.reduce((sum, s) => sum + s.planPrice, 0);

    // Load stake data
    useEffect(() => {
        if (address) {
            setStakeData(getStakeData(address));
        }
    }, [address]);

    // Calculate estimated rewards (5% APY)
    const calculateRewards = (amount: number, days: number = 365) => {
        return (amount * 0.05 * days) / 365;
    };

    const stakedAmount = stakeData?.stakedAmount || 0;
    const estimatedYearlyRewards = calculateRewards(stakedAmount);
    const daysStaked = stakeData ? Math.floor((Date.now() - stakeData.stakedAt) / (24 * 60 * 60 * 1000)) : 0;
    const earnedRewards = calculateRewards(stakedAmount, daysStaked);

    // How many months can the stake cover?
    const monthsCovered = monthlySubscriptionCost > 0
        ? Math.floor(stakedAmount / monthlySubscriptionCost)
        : Infinity;

    const handleStake = async () => {
        if (!address || !stakeAmount) return;
        const amount = parseFloat(stakeAmount);
        if (isNaN(amount) || amount <= 0) return;

        setIsStaking(true);

        // Simulate transaction
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newData: StakeData = {
            wallet: address,
            stakedAmount: (stakeData?.stakedAmount || 0) + amount,
            stakedAt: stakeData?.stakedAt || Date.now(),
            autoPayEnabled: true,
            planIds: activeSubscriptions.map(s => s.planId)
        };

        saveStakeData(newData);
        setStakeData(newData);
        setStakeAmount("");
        setShowSuccess(`Successfully staked ${amount} CSPR!`);
        setTimeout(() => setShowSuccess(null), 3000);
        setIsStaking(false);
    };

    const handleWithdraw = async () => {
        if (!address || !withdrawAmount || !stakeData) return;
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0 || amount > stakeData.stakedAmount) return;

        setIsWithdrawing(true);

        // Simulate transaction
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newData: StakeData = {
            ...stakeData,
            stakedAmount: stakeData.stakedAmount - amount
        };

        saveStakeData(newData);
        setStakeData(newData);
        setWithdrawAmount("");
        setShowSuccess(`Successfully withdrew ${amount} CSPR!`);
        setTimeout(() => setShowSuccess(null), 3000);
        setIsWithdrawing(false);
    };

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Coins className="w-8 h-8 text-yellow-400" />
                        Stake-to-Pay
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Stake CSPR and automatically pay subscriptions from your staking rewards.
                    </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400">{showSuccess}</span>
                        </div>
                    </div>
                )}

                {/* How it Works Banner */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        How Stake-to-Pay Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">1. Stake CSPR</div>
                                <div className="text-xs text-gray-500">Lock your tokens</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">2. Earn 5% APY</div>
                                <div className="text-xs text-gray-500">Staking rewards</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">3. Auto-Pay</div>
                                <div className="text-xs text-gray-500">Subscriptions paid</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Unlock className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">4. Withdraw</div>
                                <div className="text-xs text-gray-500">Anytime you want</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#12121a] border border-yellow-500/30 rounded-2xl p-6 hover-lift">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                <Coins className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stakedAmount.toFixed(2)} CSPR</div>
                                <div className="text-sm text-gray-500">Total Staked</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-green-500/30 rounded-2xl p-6 hover-lift">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-400">+{earnedRewards.toFixed(4)} CSPR</div>
                                <div className="text-sm text-gray-500">Earned Rewards</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-purple-500/30 rounded-2xl p-6 hover-lift">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Calculator className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-purple-400">{estimatedYearlyRewards.toFixed(2)} CSPR</div>
                                <div className="text-sm text-gray-500">Est. Yearly Rewards</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#12121a] border border-blue-500/30 rounded-2xl p-6 hover-lift">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-400">
                                    {monthsCovered === Infinity ? '∞' : monthsCovered}
                                </div>
                                <div className="text-sm text-gray-500">Months Covered</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Stake Card */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-yellow-400" />
                            Stake CSPR
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Amount to Stake</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={stakeAmount}
                                        onChange={(e) => setStakeAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">CSPR</div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>Available: {balance} CSPR</span>
                                    <button
                                        onClick={() => setStakeAmount(balance)}
                                        className="text-yellow-400 hover:text-yellow-300"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 rounded-lg p-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Estimated APY</span>
                                    <span className="text-yellow-400 font-semibold">5%</span>
                                </div>
                                {stakeAmount && parseFloat(stakeAmount) > 0 && (
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="text-gray-400">Yearly Rewards</span>
                                        <span className="text-green-400">
                                            +{(parseFloat(stakeAmount) * 0.05).toFixed(2)} CSPR
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleStake}
                                disabled={!isConnected || isStaking || !stakeAmount}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        </div>
                    </div>

                    {/* Withdraw Card */}
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Unlock className="w-5 h-5 text-blue-400" />
                            Withdraw
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Amount to Withdraw</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        max={stakedAmount}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-20 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">CSPR</div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>Staked: {stakedAmount.toFixed(2)} CSPR</span>
                                    <button
                                        onClick={() => setWithdrawAmount(stakedAmount.toString())}
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 rounded-lg p-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Available to Withdraw</span>
                                    <span className="text-blue-400 font-semibold">{stakedAmount.toFixed(2)} CSPR</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-400">Earned Rewards Included</span>
                                    <span className="text-green-400">+{earnedRewards.toFixed(4)} CSPR</span>
                                </div>
                            </div>

                            <button
                                onClick={handleWithdraw}
                                disabled={!isConnected || isWithdrawing || !withdrawAmount || stakedAmount === 0}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        </div>
                    </div>
                </div>

                {/* Active Subscriptions Covered */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Auto-Pay Subscriptions</h3>

                    {activeSubscriptions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No active subscriptions to auto-pay</p>
                            <Link
                                href="/app/user/browse"
                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                            >
                                Browse Plans <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeSubscriptions.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{sub.planName}</div>
                                            <div className="text-sm text-gray-500">{sub.planPrice} CSPR/{sub.planPeriod}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-green-400">Auto-Pay Enabled</div>
                                        <div className="text-xs text-gray-500">
                                            Next: {new Date(sub.expiresAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <span className="text-gray-400">Total Monthly Cost</span>
                                <span className="text-xl font-bold text-white">{monthlySubscriptionCost} CSPR</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Demo:</span> Stake operations are simulated. In production, your CSPR would be staked on the Casper network earning real rewards.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
