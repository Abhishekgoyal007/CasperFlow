"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useWallet } from "./WalletContext";

// Constants
const STAKE_STORAGE_KEY = 'casperflow_stakes_v2';
const APY_RATE = 0.08; // 8% APY (competitive rate)
const MIN_STAKE_AMOUNT = 100; // Minimum 100 CSPR

// Types
export interface StakePosition {
    wallet: string;
    stakedAmount: number;
    stakedAt: number;
    lastRewardClaimAt: number;
    autoPayEnabled: boolean;
    autoRenewEnabled: boolean;
    delegatedValidator: string | null;
    planIds: string[];
    totalRewardsClaimed: number;
    totalSubscriptionsPaid: number;
}

export interface StakeProjection {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
}

export interface StakeToPayContextType {
    // State
    stakePosition: StakePosition | null;
    isLoading: boolean;

    // Computed values
    currentRewards: number;
    projectedRewards: StakeProjection;
    canCoverSubscription: boolean;
    monthsOfCoverage: number;
    savingsVsTraditional: number;

    // Actions
    stake: (amount: number) => Promise<{ success: boolean; txHash?: string; error?: string }>;
    withdraw: (amount: number) => Promise<{ success: boolean; txHash?: string; error?: string }>;
    claimRewards: () => Promise<{ success: boolean; amount?: number; error?: string }>;
    enableAutoPay: (planIds: string[]) => void;
    disableAutoPay: () => void;
    enableAutoRenew: () => void;
    disableAutoRenew: () => void;

    // Calculations
    calculateRewards: (amount: number, days: number) => number;
    calculateSubscriptionCoverage: (monthlySubscriptionCost: number) => number;
}

const StakeToPayContext = createContext<StakeToPayContextType | undefined>(undefined);

interface StakeToPayProviderProps {
    children: ReactNode;
    monthlySubscriptionCost?: number;
}

// Helper functions
function getStakePositions(): StakePosition[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STAKE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function getStakePosition(wallet: string): StakePosition | null {
    const positions = getStakePositions();
    return positions.find(p => p.wallet === wallet) || null;
}

function saveStakePosition(position: StakePosition): void {
    const positions = getStakePositions();
    const existingIndex = positions.findIndex(p => p.wallet === position.wallet);
    if (existingIndex >= 0) {
        positions[existingIndex] = position;
    } else {
        positions.push(position);
    }
    localStorage.setItem(STAKE_STORAGE_KEY, JSON.stringify(positions));
}

// Simulated validators on Casper
const VALIDATORS = [
    { name: "CasperFlow Validator", address: "validator-casperflow", apy: 8.2 },
    { name: "Make Staking Pool", address: "validator-make", apy: 7.8 },
    { name: "Bit Cat Validator", address: "validator-bitcat", apy: 8.0 },
];

export function StakeToPayProvider({ children, monthlySubscriptionCost = 0 }: StakeToPayProviderProps) {
    const { address, isConnected, publicKey } = useWallet();
    const [stakePosition, setStakePosition] = useState<StakePosition | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load stake position on mount/address change
    useEffect(() => {
        if (address) {
            const position = getStakePosition(address);
            setStakePosition(position);
        } else {
            setStakePosition(null);
        }
    }, [address]);

    // Calculate rewards based on staking amount and duration
    const calculateRewards = useCallback((amount: number, days: number = 365): number => {
        return (amount * APY_RATE * days) / 365;
    }, []);

    // Calculate current accrued rewards
    const currentRewards = stakePosition
        ? calculateRewards(
            stakePosition.stakedAmount,
            (Date.now() - stakePosition.lastRewardClaimAt) / (24 * 60 * 60 * 1000)
        )
        : 0;

    // Projected rewards
    const projectedRewards: StakeProjection = stakePosition
        ? {
            daily: calculateRewards(stakePosition.stakedAmount, 1),
            weekly: calculateRewards(stakePosition.stakedAmount, 7),
            monthly: calculateRewards(stakePosition.stakedAmount, 30),
            yearly: calculateRewards(stakePosition.stakedAmount, 365),
        }
        : { daily: 0, weekly: 0, monthly: 0, yearly: 0 };

    // Calculate how many months the stake can cover subscriptions
    const calculateSubscriptionCoverage = useCallback((monthlyCost: number): number => {
        if (!stakePosition || monthlyCost <= 0) return Infinity;

        // Consider both principal and projected rewards
        const totalAvailable = stakePosition.stakedAmount + projectedRewards.yearly;
        return Math.floor(totalAvailable / monthlyCost);
    }, [stakePosition, projectedRewards.yearly]);

    const monthsOfCoverage = calculateSubscriptionCoverage(monthlySubscriptionCost);
    const canCoverSubscription = monthlySubscriptionCost <= 0 || projectedRewards.monthly >= monthlySubscriptionCost;

    // Calculate savings vs traditional payment (assume 2.9% + $0.30 credit card fees)
    const savingsVsTraditional = stakePosition
        ? (monthlySubscriptionCost * 12 * 0.03) + (12 * 0.30) // Yearly savings
        : 0;

    // Stake CSPR
    const stake = useCallback(async (amount: number): Promise<{ success: boolean; txHash?: string; error?: string }> => {
        if (!address || amount < MIN_STAKE_AMOUNT) {
            return { success: false, error: `Minimum stake is ${MIN_STAKE_AMOUNT} CSPR` };
        }

        setIsLoading(true);

        try {
            // Simulate blockchain transaction
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate mock transaction hash
            const txHash = `deploy-${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

            const newPosition: StakePosition = {
                wallet: address,
                stakedAmount: (stakePosition?.stakedAmount || 0) + amount,
                stakedAt: stakePosition?.stakedAt || Date.now(),
                lastRewardClaimAt: stakePosition?.lastRewardClaimAt || Date.now(),
                autoPayEnabled: stakePosition?.autoPayEnabled ?? true,
                autoRenewEnabled: stakePosition?.autoRenewEnabled ?? true,
                delegatedValidator: VALIDATORS[0].address,
                planIds: stakePosition?.planIds || [],
                totalRewardsClaimed: stakePosition?.totalRewardsClaimed || 0,
                totalSubscriptionsPaid: stakePosition?.totalSubscriptionsPaid || 0,
            };

            saveStakePosition(newPosition);
            setStakePosition(newPosition);

            return { success: true, txHash };
        } catch (error) {
            return { success: false, error: 'Failed to stake CSPR' };
        } finally {
            setIsLoading(false);
        }
    }, [address, stakePosition]);

    // Withdraw CSPR
    const withdraw = useCallback(async (amount: number): Promise<{ success: boolean; txHash?: string; error?: string }> => {
        if (!address || !stakePosition) {
            return { success: false, error: 'No stake position found' };
        }

        if (amount > stakePosition.stakedAmount) {
            return { success: false, error: 'Insufficient staked balance' };
        }

        setIsLoading(true);

        try {
            // Simulate blockchain transaction
            await new Promise(resolve => setTimeout(resolve, 2000));

            const txHash = `deploy-${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;

            const newPosition: StakePosition = {
                ...stakePosition,
                stakedAmount: stakePosition.stakedAmount - amount,
            };

            if (newPosition.stakedAmount <= 0) {
                // Remove position entirely
                const positions = getStakePositions().filter(p => p.wallet !== address);
                localStorage.setItem(STAKE_STORAGE_KEY, JSON.stringify(positions));
                setStakePosition(null);
            } else {
                saveStakePosition(newPosition);
                setStakePosition(newPosition);
            }

            return { success: true, txHash };
        } catch (error) {
            return { success: false, error: 'Failed to withdraw CSPR' };
        } finally {
            setIsLoading(false);
        }
    }, [address, stakePosition]);

    // Claim rewards
    const claimRewards = useCallback(async (): Promise<{ success: boolean; amount?: number; error?: string }> => {
        if (!address || !stakePosition || currentRewards <= 0) {
            return { success: false, error: 'No rewards to claim' };
        }

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const claimedAmount = currentRewards;

            const newPosition: StakePosition = {
                ...stakePosition,
                lastRewardClaimAt: Date.now(),
                totalRewardsClaimed: stakePosition.totalRewardsClaimed + claimedAmount,
            };

            saveStakePosition(newPosition);
            setStakePosition(newPosition);

            return { success: true, amount: claimedAmount };
        } catch (error) {
            return { success: false, error: 'Failed to claim rewards' };
        } finally {
            setIsLoading(false);
        }
    }, [address, stakePosition, currentRewards]);

    // Enable auto-pay for specific plans
    const enableAutoPay = useCallback((planIds: string[]) => {
        if (!address || !stakePosition) return;

        const newPosition: StakePosition = {
            ...stakePosition,
            autoPayEnabled: true,
            planIds,
        };

        saveStakePosition(newPosition);
        setStakePosition(newPosition);
    }, [address, stakePosition]);

    // Disable auto-pay
    const disableAutoPay = useCallback(() => {
        if (!address || !stakePosition) return;

        const newPosition: StakePosition = {
            ...stakePosition,
            autoPayEnabled: false,
        };

        saveStakePosition(newPosition);
        setStakePosition(newPosition);
    }, [address, stakePosition]);

    // Enable auto-renew
    const enableAutoRenew = useCallback(() => {
        if (!address || !stakePosition) return;

        const newPosition: StakePosition = {
            ...stakePosition,
            autoRenewEnabled: true,
        };

        saveStakePosition(newPosition);
        setStakePosition(newPosition);
    }, [address, stakePosition]);

    // Disable auto-renew
    const disableAutoRenew = useCallback(() => {
        if (!address || !stakePosition) return;

        const newPosition: StakePosition = {
            ...stakePosition,
            autoRenewEnabled: false,
        };

        saveStakePosition(newPosition);
        setStakePosition(newPosition);
    }, [address, stakePosition]);

    const value: StakeToPayContextType = {
        stakePosition,
        isLoading,
        currentRewards,
        projectedRewards,
        canCoverSubscription,
        monthsOfCoverage,
        savingsVsTraditional,
        stake,
        withdraw,
        claimRewards,
        enableAutoPay,
        disableAutoPay,
        enableAutoRenew,
        disableAutoRenew,
        calculateRewards,
        calculateSubscriptionCoverage,
    };

    return (
        <StakeToPayContext.Provider value={value}>
            {children}
        </StakeToPayContext.Provider>
    );
}

export function useStakeToPay() {
    const context = useContext(StakeToPayContext);
    if (context === undefined) {
        throw new Error("useStakeToPay must be used within a StakeToPayProvider");
    }
    return context;
}

// Hook for calculating stake requirements
export function useStakeCalculator(monthlySubscriptionCost: number) {
    const { calculateRewards } = useStakeToPay();

    // Calculate how much needs to be staked to cover monthly subscription from rewards alone
    const stakeRequiredForFullCoverage = (monthlySubscriptionCost * 12) / APY_RATE;

    // Calculate break-even point (when rewards > subscription cost)
    const monthlyRewardsFromStake = (amount: number) => calculateRewards(amount, 30);

    return {
        stakeRequiredForFullCoverage,
        monthlyRewardsFromStake,
        apyRate: APY_RATE * 100, // As percentage
        minStakeAmount: MIN_STAKE_AMOUNT,
    };
}
