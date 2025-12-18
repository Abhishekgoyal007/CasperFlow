"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

interface SubscriptionsContextType {
    subscriptions: Subscription[];
    subscribe: (planId: string, planName: string, planPrice: number, planPeriod: string, merchantWallet: string, subscriberWallet: string) => void;
    cancelSubscription: (id: string) => void;
    getSubscriptionsForUser: (wallet: string | null) => Subscription[];
    isSubscribed: (planId: string, wallet: string | null) => boolean;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('casperflow_subscriptions');
        if (stored) {
            try {
                setSubscriptions(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse subscriptions');
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('casperflow_subscriptions', JSON.stringify(subscriptions));
    }, [subscriptions]);

    const subscribe = (
        planId: string,
        planName: string,
        planPrice: number,
        planPeriod: string,
        merchantWallet: string,
        subscriberWallet: string
    ) => {
        // Calculate expiry based on period
        const now = Date.now();
        let expiresAt = now;
        switch (planPeriod) {
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

        const newSub: Subscription = {
            id: `sub_${Date.now()}`,
            planId,
            planName,
            planPrice,
            planPeriod,
            merchantWallet,
            subscriberWallet,
            subscribedAt: now,
            expiresAt,
            status: 'active',
        };
        setSubscriptions(prev => [...prev, newSub]);
    };

    const cancelSubscription = (id: string) => {
        setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' as const } : s));
    };

    const getSubscriptionsForUser = (wallet: string | null) => {
        if (!wallet) return [];
        return subscriptions.filter(s => s.subscriberWallet === wallet);
    };

    const isSubscribed = (planId: string, wallet: string | null) => {
        if (!wallet) return false;
        return subscriptions.some(s =>
            s.planId === planId &&
            s.subscriberWallet === wallet &&
            s.status === 'active'
        );
    };

    return (
        <SubscriptionsContext.Provider value={{
            subscriptions,
            subscribe,
            cancelSubscription,
            getSubscriptionsForUser,
            isSubscribed
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
