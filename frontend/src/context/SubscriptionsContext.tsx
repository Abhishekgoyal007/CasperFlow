"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Generate a random API key
const generateApiKey = () => {
    const prefix = 'cf_sk_';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = prefix;
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

export interface Subscription {
    id: string;
    planId: string;
    planName: string;
    planPrice: number;
    planPeriod: string;
    merchantWallet: string;
    subscriberWallet: string;
    subscribedAt: number;
    expiresAt: number;
    status: 'active' | 'expired' | 'cancelled';
    apiKey: string;
    // NEW: Recurring payment settings
    autoRenewEnabled: boolean;
    maxSpendApproved: number; // Max CSPR approved for auto-renewal
    lastRenewalAt?: number;
    renewalCount: number;
    // NEW: Trial info
    isTrial: boolean;
    trialEndsAt?: number;
}

// NEW: Payment consent for recurring billing
export interface PaymentConsent {
    id: string;
    subscriberWallet: string;
    merchantWallet: string;
    planId: string;
    maxAmountPerPeriod: number; // Max CSPR per billing cycle
    totalMaxAmount: number; // Total max spend until revoked
    remainingAllowance: number;
    createdAt: number;
    expiresAt: number | null; // null = never expires
    status: 'active' | 'revoked' | 'exhausted';
}

interface SubscriptionsContextType {
    subscriptions: Subscription[];
    consents: PaymentConsent[];

    // Subscription actions
    subscribe: (params: SubscribeParams) => Subscription;
    cancelSubscription: (id: string) => void;
    renewSubscription: (id: string) => Subscription | null;

    // Trial actions
    startTrial: (params: TrialParams) => Subscription;
    convertTrialToSubscription: (subscriptionId: string, paymentAmount: number) => Subscription | null;

    // Consent actions
    createConsent: (params: ConsentParams) => PaymentConsent;
    revokeConsent: (consentId: string) => void;
    chargeConsent: (consentId: string, amount: number) => boolean;

    // Query functions
    getSubscriptionsForUser: (wallet: string | null) => Subscription[];
    getSubscriptionsForMerchant: (wallet: string | null) => Subscription[];
    isSubscribed: (planId: string, wallet: string | null) => boolean;
    getSubscription: (planId: string, wallet: string | null) => Subscription | undefined;
    getActiveTrials: (wallet: string | null) => Subscription[];
    getConsentsForSubscriber: (wallet: string | null) => PaymentConsent[];
    getConsentsForMerchant: (wallet: string | null) => PaymentConsent[];

    // Analytics data
    getAnalytics: (merchantWallet: string | null) => MerchantAnalytics;
}

interface SubscribeParams {
    planId: string;
    planName: string;
    planPrice: number;
    planPeriod: string;
    merchantWallet: string;
    subscriberWallet: string;
    autoRenewEnabled?: boolean;
    maxSpendApproved?: number;
}

interface TrialParams {
    planId: string;
    planName: string;
    planPrice: number;
    planPeriod: string;
    merchantWallet: string;
    subscriberWallet: string;
    trialDays: number;
}

interface ConsentParams {
    subscriberWallet: string;
    merchantWallet: string;
    planId: string;
    maxAmountPerPeriod: number;
    totalMaxAmount: number;
    validForDays: number | null; // null = indefinite
}

export interface MerchantAnalytics {
    totalRevenue: number;
    totalSubscribers: number;
    activeSubscribers: number;
    churnedSubscribers: number;
    trialUsers: number;
    conversionRate: number;
    avgRevenuePerUser: number;
    monthlyRecurringRevenue: number;
    revenueHistory: { date: string; amount: number }[];
    subscriberGrowth: { date: string; count: number }[];
    churnRate: number;
    planPerformance: { planId: string; planName: string; subscribers: number; revenue: number }[];
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [consents, setConsents] = useState<PaymentConsent[]>([]);

    // Load from localStorage with migration from v1
    useEffect(() => {
        // Try to load v2 subscriptions first
        const storedSubs = localStorage.getItem('casperflow_subscriptions_v2');
        if (storedSubs) {
            try {
                setSubscriptions(JSON.parse(storedSubs));
            } catch (e) {
                console.error('Failed to parse subscriptions');
            }
        } else {
            // Try to migrate from v1 format
            const oldSubs = localStorage.getItem('casperflow_subscriptions');
            if (oldSubs) {
                try {
                    const parsed = JSON.parse(oldSubs);
                    // Migrate old subscriptions to new format
                    const migrated = parsed.map((s: any) => ({
                        ...s,
                        autoRenewEnabled: false,
                        maxSpendApproved: 0,
                        renewalCount: 0,
                        isTrial: false,
                    }));
                    setSubscriptions(migrated);
                    // Save in new format
                    localStorage.setItem('casperflow_subscriptions_v2', JSON.stringify(migrated));
                    console.log('Migrated subscriptions from v1 to v2');
                } catch (e) {
                    console.error('Failed to migrate old subscriptions');
                }
            }
        }

        const storedConsents = localStorage.getItem('casperflow_consents');
        if (storedConsents) {
            try {
                setConsents(JSON.parse(storedConsents));
            } catch (e) {
                console.error('Failed to parse consents');
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('casperflow_subscriptions_v2', JSON.stringify(subscriptions));
    }, [subscriptions]);

    useEffect(() => {
        localStorage.setItem('casperflow_consents', JSON.stringify(consents));
    }, [consents]);

    // Calculate expiry based on period
    const calculateExpiry = (period: string, from: number = Date.now()): number => {
        let expiresAt = from;
        switch (period) {
            case 'weekly':
                expiresAt += 7 * 24 * 60 * 60 * 1000;
                break;
            case 'monthly':
                expiresAt += 30 * 24 * 60 * 60 * 1000;
                break;
            case 'yearly':
                expiresAt += 365 * 24 * 60 * 60 * 1000;
                break;
        }
        return expiresAt;
    };

    const subscribe = (params: SubscribeParams): Subscription => {
        const now = Date.now();
        const newSub: Subscription = {
            id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            planId: params.planId,
            planName: params.planName,
            planPrice: params.planPrice,
            planPeriod: params.planPeriod,
            merchantWallet: params.merchantWallet,
            subscriberWallet: params.subscriberWallet,
            subscribedAt: now,
            expiresAt: calculateExpiry(params.planPeriod),
            status: 'active',
            apiKey: generateApiKey(),
            autoRenewEnabled: params.autoRenewEnabled ?? false,
            maxSpendApproved: params.maxSpendApproved ?? 0,
            renewalCount: 0,
            isTrial: false,
        };
        setSubscriptions(prev => [...prev, newSub]);
        return newSub;
    };

    const cancelSubscription = (id: string) => {
        setSubscriptions(prev => prev.map(s =>
            s.id === id ? { ...s, status: 'cancelled' as const, autoRenewEnabled: false } : s
        ));
    };

    const renewSubscription = (id: string): Subscription | null => {
        let renewedSub: Subscription | null = null;
        setSubscriptions(prev => prev.map(s => {
            if (s.id === id && s.autoRenewEnabled && s.maxSpendApproved >= s.planPrice) {
                renewedSub = {
                    ...s,
                    expiresAt: calculateExpiry(s.planPeriod, s.expiresAt),
                    lastRenewalAt: Date.now(),
                    renewalCount: s.renewalCount + 1,
                    maxSpendApproved: s.maxSpendApproved - s.planPrice,
                };
                return renewedSub;
            }
            return s;
        }));
        return renewedSub;
    };

    const startTrial = (params: TrialParams): Subscription => {
        const now = Date.now();
        const trialEndsAt = now + (params.trialDays * 24 * 60 * 60 * 1000);

        const newSub: Subscription = {
            id: `trial_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            planId: params.planId,
            planName: params.planName,
            planPrice: params.planPrice,
            planPeriod: params.planPeriod,
            merchantWallet: params.merchantWallet,
            subscriberWallet: params.subscriberWallet,
            subscribedAt: now,
            expiresAt: trialEndsAt,
            status: 'active',
            apiKey: generateApiKey(),
            autoRenewEnabled: false,
            maxSpendApproved: 0,
            renewalCount: 0,
            isTrial: true,
            trialEndsAt,
        };
        setSubscriptions(prev => [...prev, newSub]);
        return newSub;
    };

    const convertTrialToSubscription = (subscriptionId: string, paymentAmount: number): Subscription | null => {
        let convertedSub: Subscription | null = null;
        setSubscriptions(prev => prev.map(s => {
            if (s.id === subscriptionId && s.isTrial) {
                convertedSub = {
                    ...s,
                    isTrial: false,
                    trialEndsAt: undefined,
                    expiresAt: calculateExpiry(s.planPeriod),
                    subscribedAt: Date.now(),
                };
                return convertedSub;
            }
            return s;
        }));
        return convertedSub;
    };

    const createConsent = (params: ConsentParams): PaymentConsent => {
        const now = Date.now();
        const consent: PaymentConsent = {
            id: `consent_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            subscriberWallet: params.subscriberWallet,
            merchantWallet: params.merchantWallet,
            planId: params.planId,
            maxAmountPerPeriod: params.maxAmountPerPeriod,
            totalMaxAmount: params.totalMaxAmount,
            remainingAllowance: params.totalMaxAmount,
            createdAt: now,
            expiresAt: params.validForDays ? now + (params.validForDays * 24 * 60 * 60 * 1000) : null,
            status: 'active',
        };
        setConsents(prev => [...prev, consent]);
        return consent;
    };

    const revokeConsent = (consentId: string) => {
        setConsents(prev => prev.map(c =>
            c.id === consentId ? { ...c, status: 'revoked' as const } : c
        ));
    };

    const chargeConsent = (consentId: string, amount: number): boolean => {
        let charged = false;
        setConsents(prev => prev.map(c => {
            if (c.id === consentId && c.status === 'active') {
                if (amount <= c.maxAmountPerPeriod && amount <= c.remainingAllowance) {
                    const newRemaining = c.remainingAllowance - amount;
                    charged = true;
                    return {
                        ...c,
                        remainingAllowance: newRemaining,
                        status: newRemaining <= 0 ? 'exhausted' as const : c.status,
                    };
                }
            }
            return c;
        }));
        return charged;
    };

    const getSubscriptionsForUser = (wallet: string | null) => {
        if (!wallet) return [];
        return subscriptions.filter(s => s.subscriberWallet === wallet);
    };

    const getSubscriptionsForMerchant = (wallet: string | null) => {
        if (!wallet) return [];
        return subscriptions.filter(s => s.merchantWallet === wallet);
    };

    const isSubscribed = (planId: string, wallet: string | null) => {
        if (!wallet) return false;
        return subscriptions.some(s =>
            s.planId === planId &&
            s.subscriberWallet === wallet &&
            s.status === 'active'
        );
    };

    const getSubscription = (planId: string, wallet: string | null) => {
        if (!wallet) return undefined;
        return subscriptions.find(s =>
            s.planId === planId &&
            s.subscriberWallet === wallet &&
            s.status === 'active'
        );
    };

    const getActiveTrials = (wallet: string | null) => {
        if (!wallet) return [];
        return subscriptions.filter(s =>
            s.subscriberWallet === wallet &&
            s.isTrial &&
            s.status === 'active'
        );
    };

    const getConsentsForSubscriber = (wallet: string | null) => {
        if (!wallet) return [];
        return consents.filter(c => c.subscriberWallet === wallet);
    };

    const getConsentsForMerchant = (wallet: string | null) => {
        if (!wallet) return [];
        return consents.filter(c => c.merchantWallet === wallet);
    };

    // Comprehensive analytics for merchants
    const getAnalytics = (merchantWallet: string | null): MerchantAnalytics => {
        if (!merchantWallet) {
            return {
                totalRevenue: 0,
                totalSubscribers: 0,
                activeSubscribers: 0,
                churnedSubscribers: 0,
                trialUsers: 0,
                conversionRate: 0,
                avgRevenuePerUser: 0,
                monthlyRecurringRevenue: 0,
                revenueHistory: [],
                subscriberGrowth: [],
                churnRate: 0,
                planPerformance: [],
            };
        }

        const merchantSubs = subscriptions.filter(s => s.merchantWallet === merchantWallet);
        const activeSubs = merchantSubs.filter(s => s.status === 'active' && !s.isTrial);
        const trials = merchantSubs.filter(s => s.isTrial && s.status === 'active');
        const cancelled = merchantSubs.filter(s => s.status === 'cancelled');
        const convertedTrials = merchantSubs.filter(s => !s.isTrial && s.id.startsWith('trial_'));

        const totalRevenue = merchantSubs
            .filter(s => !s.isTrial)
            .reduce((sum, s) => sum + (s.planPrice * (1 + s.renewalCount)), 0);

        const monthlySubscribers = activeSubs.filter(s => s.planPeriod === 'monthly');
        const mrr = monthlySubscribers.reduce((sum, s) => sum + s.planPrice, 0);

        // Generate last 30 days of data
        const last30Days: { date: string; amount: number }[] = [];
        const last30DaysGrowth: { date: string; count: number }[] = [];

        for (let i = 29; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];

            // Revenue for that day
            const dayRevenue = merchantSubs.filter(s => {
                const subDate = new Date(s.subscribedAt).toISOString().split('T')[0];
                return subDate === dateStr && !s.isTrial;
            }).reduce((sum, s) => sum + s.planPrice, 0);

            last30Days.push({ date: dateStr, amount: dayRevenue });

            // Subscriber count up to that day
            const subsUpToDay = merchantSubs.filter(s =>
                s.subscribedAt <= date.getTime() && s.status === 'active'
            ).length;
            last30DaysGrowth.push({ date: dateStr, count: subsUpToDay });
        }

        // Plan performance
        const planMap = new Map<string, { planName: string; subscribers: number; revenue: number }>();
        merchantSubs.forEach(s => {
            if (!s.isTrial) {
                const existing = planMap.get(s.planId) || { planName: s.planName, subscribers: 0, revenue: 0 };
                planMap.set(s.planId, {
                    ...existing,
                    subscribers: existing.subscribers + 1,
                    revenue: existing.revenue + s.planPrice * (1 + s.renewalCount),
                });
            }
        });

        return {
            totalRevenue,
            totalSubscribers: merchantSubs.length,
            activeSubscribers: activeSubs.length,
            churnedSubscribers: cancelled.length,
            trialUsers: trials.length,
            conversionRate: trials.length > 0 ? (convertedTrials.length / (trials.length + convertedTrials.length)) * 100 : 0,
            avgRevenuePerUser: activeSubs.length > 0 ? totalRevenue / activeSubs.length : 0,
            monthlyRecurringRevenue: mrr,
            revenueHistory: last30Days,
            subscriberGrowth: last30DaysGrowth,
            churnRate: merchantSubs.length > 0 ? (cancelled.length / merchantSubs.length) * 100 : 0,
            planPerformance: Array.from(planMap.entries()).map(([planId, data]) => ({
                planId,
                ...data,
            })),
        };
    };

    return (
        <SubscriptionsContext.Provider value={{
            subscriptions,
            consents,
            subscribe,
            cancelSubscription,
            renewSubscription,
            startTrial,
            convertTrialToSubscription,
            createConsent,
            revokeConsent,
            chargeConsent,
            getSubscriptionsForUser,
            getSubscriptionsForMerchant,
            isSubscribed,
            getSubscription,
            getActiveTrials,
            getConsentsForSubscriber,
            getConsentsForMerchant,
            getAnalytics,
        }}>
            {children}
        </SubscriptionsContext.Provider>
    );
}

export function useSubscriptions() {
    const context = useContext(SubscriptionsContext);
    if (context === undefined) {
        throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
    }
    return context;
}
