"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    period: string;
    createdBy: string; // wallet display address
    merchantPublicKey?: string; // full public key for transfers
    createdAt: number;
    subscribers: number;
    revenue: number;
    // NEW: Trial settings
    trialEnabled: boolean;
    trialDays: number;
    // NEW: Recurring payment settings
    autoRenewDefault: boolean;
    maxRenewals: number; // 0 = unlimited
    // NEW: Features list
    features: string[];
    // NEW: Plan tier
    tier: 'free' | 'starter' | 'pro' | 'enterprise';
    // NEW: Usage limits
    apiCallsPerMonth: number;
    // NEW: Status
    isActive: boolean;
}

interface PlansContextType {
    plans: Plan[];
    addPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'subscribers' | 'revenue' | 'isActive'>) => string;
    updatePlan: (id: string, updates: Partial<Plan>) => void;
    deletePlan: (id: string) => void;
    togglePlanStatus: (id: string) => void;
    incrementSubscribers: (id: string, amount: number) => void;
    getPlanById: (id: string) => Plan | undefined;
    getPlansForMerchant: (wallet: string | null) => Plan[];
    getActivePlans: () => Plan[];
    getPlansWithTrials: () => Plan[];
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

// Default demo plans with trials
const defaultPlans: Plan[] = [
    {
        id: 'plan_demo_starter',
        name: 'Starter API',
        description: 'Perfect for small projects and testing. Includes basic API access with rate limiting.',
        price: 10,
        period: 'monthly',
        createdBy: '01demo...123456',
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
        subscribers: 12,
        revenue: 120,
        trialEnabled: true,
        trialDays: 7,
        autoRenewDefault: true,
        maxRenewals: 0,
        features: ['1,000 API calls/month', 'Basic support', 'Rate limiting: 10 req/min'],
        tier: 'starter',
        apiCallsPerMonth: 1000,
        isActive: true,
    },
    {
        id: 'plan_demo_pro',
        name: 'Pro API',
        description: 'For growing businesses. Higher limits, priority support, and advanced features.',
        price: 50,
        period: 'monthly',
        createdBy: '01demo...123456',
        createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
        subscribers: 8,
        revenue: 400,
        trialEnabled: true,
        trialDays: 14,
        autoRenewDefault: true,
        maxRenewals: 0,
        features: ['50,000 API calls/month', 'Priority support', 'Rate limiting: 100 req/min', 'Webhooks'],
        tier: 'pro',
        apiCallsPerMonth: 50000,
        isActive: true,
    },
    {
        id: 'plan_demo_enterprise',
        name: 'Enterprise',
        description: 'Unlimited access for large-scale applications with dedicated support.',
        price: 200,
        period: 'monthly',
        createdBy: '01demo...123456',
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        subscribers: 3,
        revenue: 600,
        trialEnabled: false,
        trialDays: 0,
        autoRenewDefault: true,
        maxRenewals: 0,
        features: ['Unlimited API calls', 'Dedicated support', 'No rate limiting', 'Webhooks', 'Custom integrations', 'SLA guarantee'],
        tier: 'enterprise',
        apiCallsPerMonth: -1, // Unlimited
        isActive: true,
    },
];

export function PlansProvider({ children }: { children: ReactNode }) {
    const [plans, setPlans] = useState<Plan[]>([]);

    // Load plans from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('casperflow_plans_v2');
        if (stored) {
            try {
                const parsedPlans = JSON.parse(stored);
                // Merge with defaults if needed
                setPlans(parsedPlans.length > 0 ? parsedPlans : defaultPlans);
            } catch (e) {
                console.error('Failed to parse stored plans');
                setPlans(defaultPlans);
            }
        } else {
            setPlans(defaultPlans);
        }
    }, []);

    // Save plans to localStorage whenever they change
    useEffect(() => {
        if (plans.length > 0) {
            localStorage.setItem('casperflow_plans_v2', JSON.stringify(plans));
        }
    }, [plans]);

    const addPlan = (planData: Omit<Plan, 'id' | 'createdAt' | 'subscribers' | 'revenue' | 'isActive'>): string => {
        const id = `plan_${Date.now()}`;
        const newPlan: Plan = {
            ...planData,
            id,
            createdAt: Date.now(),
            subscribers: 0,
            revenue: 0,
            isActive: true,
        };
        setPlans(prev => [...prev, newPlan]);
        return id;
    };

    const updatePlan = (id: string, updates: Partial<Plan>) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePlan = (id: string) => {
        setPlans(prev => prev.filter(p => p.id !== id));
    };

    const togglePlanStatus = (id: string) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    };

    const incrementSubscribers = (id: string, amount: number) => {
        setPlans(prev => prev.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    subscribers: p.subscribers + 1,
                    revenue: p.revenue + amount
                };
            }
            return p;
        }));
    };

    const getPlanById = (id: string) => {
        return plans.find(p => p.id === id);
    };

    const getPlansForMerchant = (wallet: string | null) => {
        if (!wallet) return [];
        return plans.filter(p => p.createdBy === wallet);
    };

    const getActivePlans = () => {
        return plans.filter(p => p.isActive);
    };

    const getPlansWithTrials = () => {
        return plans.filter(p => p.isActive && p.trialEnabled && p.trialDays > 0);
    };

    return (
        <PlansContext.Provider value={{
            plans,
            addPlan,
            updatePlan,
            deletePlan,
            togglePlanStatus,
            incrementSubscribers,
            getPlanById,
            getPlansForMerchant,
            getActivePlans,
            getPlansWithTrials,
        }}>
            {children}
        </PlansContext.Provider>
    );
}

export function usePlans() {
    const context = useContext(PlansContext);
    if (context === undefined) {
        throw new Error("usePlans must be used within a PlansProvider");
    }
    return context;
}
