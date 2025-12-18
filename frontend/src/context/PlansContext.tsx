"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    period: string;
    createdBy: string; // wallet address
    createdAt: number;
    subscribers: number;
    revenue: number;
}

interface PlansContextType {
    plans: Plan[];
    addPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'subscribers' | 'revenue'>) => void;
    updatePlan: (id: string, updates: Partial<Pick<Plan, 'name' | 'description' | 'price' | 'period'>>) => void;
    deletePlan: (id: string) => void;
}

const PlansContext = createContext<PlansContextType | undefined>(undefined);

export function PlansProvider({ children }: { children: ReactNode }) {
    const [plans, setPlans] = useState<Plan[]>([]);

    // Load plans from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('casperflow_plans');
        if (stored) {
            try {
                setPlans(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse stored plans');
            }
        }
    }, []);

    // Save plans to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('casperflow_plans', JSON.stringify(plans));
    }, [plans]);

    const addPlan = (planData: Omit<Plan, 'id' | 'createdAt' | 'subscribers' | 'revenue'>) => {
        const newPlan: Plan = {
            ...planData,
            id: `plan_${Date.now()}`,
            createdAt: Date.now(),
            subscribers: 0,
            revenue: 0,
        };
        setPlans(prev => [...prev, newPlan]);
    };

    const updatePlan = (id: string, updates: Partial<Pick<Plan, 'name' | 'description' | 'price' | 'period'>>) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePlan = (id: string) => {
        setPlans(prev => prev.filter(p => p.id !== id));
    };

    return (
        <PlansContext.Provider value={{ plans, addPlan, updatePlan, deletePlan }}>
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
