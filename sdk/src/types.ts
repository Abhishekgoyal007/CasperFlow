/**
 * Type definitions for CasperFlow SDK
 */

/**
 * Subscription plan configuration
 */
export interface Plan {
    id: string;
    merchant: string;
    name: string;
    description?: string;
    basePrice: bigint;
    usagePrice: bigint;
    billingCycle: number; // in seconds
    isActive: boolean;
    createdAt: number;
}

/**
 * Create plan parameters
 */
export interface CreatePlanParams {
    name: string;
    description?: string;
    basePrice: bigint;
    usagePrice?: bigint;
    billingCycle?: "weekly" | "monthly" | "yearly" | number;
}

/**
 * User subscription
 */
export interface Subscription {
    id: string;
    planId: string;
    subscriber: string;
    startedAt: number;
    nextBillingAt: number;
    autoRenew: boolean;
    paymentMethod: PaymentMethod;
    isActive: boolean;
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
    Wallet = 0,
    Staked = 1,
}

/**
 * Subscribe parameters
 */
export interface SubscribeParams {
    planId: string;
    autoRenew?: boolean;
    paymentMethod?: PaymentMethod;
}

/**
 * Usage record
 */
export interface UsageRecord {
    id: string;
    subscriptionId: string;
    metric: string;
    units: bigint;
    recordedAt: number;
    recordedBy: string;
}

/**
 * Record usage parameters
 */
export interface RecordUsageParams {
    subscriptionId: string;
    metric?: string;
    units: number | bigint;
}

/**
 * Invoice
 */
export interface Invoice {
    id: string;
    subscriptionId: string;
    planId: string;
    subscriber: string;
    merchant: string;
    baseAmount: bigint;
    usageAmount: bigint;
    totalAmount: bigint;
    usageUnits: bigint;
    periodStart: number;
    periodEnd: number;
    createdAt: number;
    paidAt?: number;
    paymentMethod?: PaymentMethod;
    status: InvoiceStatus;
}

/**
 * Invoice status enum
 */
export enum InvoiceStatus {
    Pending = "pending",
    Paid = "paid",
    Failed = "failed",
    Cancelled = "cancelled",
}

/**
 * Stake configuration
 */
export interface StakeConfig {
    user: string;
    stakedAmount: bigint;
    accumulatedRewards: bigint;
    totalRewardsUsed: bigint;
    isEnabled: boolean;
    lastUpdated: number;
}

/**
 * SDK Configuration
 */
export interface CasperFlowConfig {
    /** Casper node RPC URL */
    nodeUrl: string;
    /** Network name (casper, casper-test) */
    network: "casper" | "casper-test";
    /** Contract addresses */
    contracts?: {
        subscriptionManager?: string;
        usageMeter?: string;
        billingEngine?: string;
        stakeToPay?: string;
    };
}

/**
 * Transaction result
 */
export interface TransactionResult {
    deployHash: string;
    success: boolean;
    cost?: bigint;
    errorMessage?: string;
}
