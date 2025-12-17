/**
 * CasperFlow - Main SDK Class
 *
 * Provides a high-level interface for interacting with CasperFlow protocol.
 *
 * @example
 * ```typescript
 * import { CasperFlow } from '@casperflow/sdk';
 *
 * const casperflow = new CasperFlow({
 *   nodeUrl: 'https://rpc.testnet.casperlabs.io/rpc',
 *   network: 'casper-test'
 * });
 *
 * // Create a subscription plan
 * const planId = await casperflow.createPlan({
 *   name: 'Pro API',
 *   basePrice: 50n * 10n**9n, // 50 CSPR
 *   usagePrice: 1n * 10n**6n, // 0.001 CSPR per call
 *   billingCycle: 'monthly'
 * });
 *
 * // Subscribe to a plan
 * const subscriptionId = await casperflow.subscribe({
 *   planId,
 *   autoRenew: true,
 *   paymentMethod: PaymentMethod.Staked
 * });
 *
 * // Record usage
 * await casperflow.recordUsage({
 *   subscriptionId,
 *   units: 100
 * });
 * ```
 */

import { SubscriptionManager } from "./contracts/subscription-manager";
import { UsageMeter } from "./contracts/usage-meter";
import { BillingEngine } from "./contracts/billing-engine";
import { StakeToPay } from "./contracts/stake-to-pay";
import {
    CasperFlowConfig,
    CreatePlanParams,
    SubscribeParams,
    RecordUsageParams,
    Plan,
    Subscription,
    Invoice,
    StakeConfig,
    TransactionResult,
    PaymentMethod,
} from "./types";
import { csprToMotes, billingCycleToSeconds } from "./utils";

export class CasperFlow {
    private config: CasperFlowConfig;
    private subscriptionManager: SubscriptionManager;
    private usageMeter: UsageMeter;
    private billingEngine: BillingEngine;
    private stakeToPay: StakeToPay;

    /**
     * Create a new CasperFlow instance
     */
    constructor(config: CasperFlowConfig) {
        this.config = config;

        this.subscriptionManager = new SubscriptionManager(
            config.nodeUrl,
            config.contracts?.subscriptionManager
        );
        this.usageMeter = new UsageMeter(
            config.nodeUrl,
            config.contracts?.usageMeter
        );
        this.billingEngine = new BillingEngine(
            config.nodeUrl,
            config.contracts?.billingEngine
        );
        this.stakeToPay = new StakeToPay(
            config.nodeUrl,
            config.contracts?.stakeToPay
        );
    }

    // ============ MERCHANT FUNCTIONS ============

    /**
     * Create a new subscription plan
     *
     * @example
     * ```typescript
     * const planId = await casperflow.createPlan({
     *   name: 'Pro API',
     *   basePrice: 50n * 10n**9n,
     *   usagePrice: 1n * 10n**6n,
     *   billingCycle: 'monthly'
     * });
     * ```
     */
    async createPlan(params: CreatePlanParams): Promise<string> {
        const billingCycleSeconds = billingCycleToSeconds(
            params.billingCycle ?? "monthly"
        );

        return this.subscriptionManager.createPlan(
            params.name,
            params.basePrice,
            params.usagePrice ?? 0n,
            billingCycleSeconds
        );
    }

    /**
     * Update an existing plan
     */
    async updatePlan(
        planId: string,
        basePrice: bigint,
        usagePrice: bigint
    ): Promise<TransactionResult> {
        return this.subscriptionManager.updatePlan(planId, basePrice, usagePrice);
    }

    /**
     * Deactivate a plan (stop accepting new subscriptions)
     */
    async deactivatePlan(planId: string): Promise<TransactionResult> {
        return this.subscriptionManager.deactivatePlan(planId);
    }

    /**
     * Get plan details
     */
    async getPlan(planId: string): Promise<Plan | null> {
        return this.subscriptionManager.getPlan(planId);
    }

    /**
     * Get all plans by a merchant
     */
    async getMerchantPlans(merchantAddress: string): Promise<Plan[]> {
        return this.subscriptionManager.getMerchantPlans(merchantAddress);
    }

    // ============ USER FUNCTIONS ============

    /**
     * Subscribe to a plan
     *
     * @example
     * ```typescript
     * const subscriptionId = await casperflow.subscribe({
     *   planId: 'plan_123',
     *   autoRenew: true,
     *   paymentMethod: PaymentMethod.Staked
     * });
     * ```
     */
    async subscribe(params: SubscribeParams): Promise<string> {
        return this.subscriptionManager.subscribe(
            params.planId,
            params.autoRenew ?? true,
            params.paymentMethod ?? PaymentMethod.Wallet
        );
    }

    /**
     * Cancel a subscription
     */
    async unsubscribe(subscriptionId: string): Promise<TransactionResult> {
        return this.subscriptionManager.unsubscribe(subscriptionId);
    }

    /**
     * Get subscription details
     */
    async getSubscription(subscriptionId: string): Promise<Subscription | null> {
        return this.subscriptionManager.getSubscription(subscriptionId);
    }

    /**
     * Get all subscriptions for a user
     */
    async getUserSubscriptions(userAddress: string): Promise<Subscription[]> {
        return this.subscriptionManager.getUserSubscriptions(userAddress);
    }

    // ============ USAGE TRACKING ============

    /**
     * Record usage for a subscription
     *
     * @example
     * ```typescript
     * await casperflow.recordUsage({
     *   subscriptionId: 'sub_123',
     *   units: 100,
     *   metric: 'api_calls'
     * });
     * ```
     */
    async recordUsage(params: RecordUsageParams): Promise<string> {
        return this.usageMeter.recordUsage(
            params.subscriptionId,
            params.metric ?? "default",
            BigInt(params.units)
        );
    }

    /**
     * Get current usage for a subscription
     */
    async getCurrentUsage(subscriptionId: string): Promise<bigint> {
        return this.usageMeter.getCurrentUsage(subscriptionId);
    }

    // ============ BILLING ============

    /**
     * Get invoice details
     */
    async getInvoice(invoiceId: string): Promise<Invoice | null> {
        return this.billingEngine.getInvoice(invoiceId);
    }

    /**
     * Get all invoices for a user
     */
    async getUserInvoices(userAddress: string): Promise<Invoice[]> {
        return this.billingEngine.getUserInvoices(userAddress);
    }

    /**
     * Pay an invoice
     */
    async payInvoice(invoiceId: string): Promise<TransactionResult> {
        return this.billingEngine.payInvoice(invoiceId);
    }

    // ============ STAKE-TO-PAY ============

    /**
     * Deposit CSPR for stake-to-pay
     *
     * @example
     * ```typescript
     * await casperflow.depositForStaking(1000n * 10n**9n); // 1000 CSPR
     * ```
     */
    async depositForStaking(amount: bigint): Promise<TransactionResult> {
        return this.stakeToPay.deposit(amount);
    }

    /**
     * Withdraw staked CSPR
     */
    async withdrawStake(amount: bigint): Promise<TransactionResult> {
        return this.stakeToPay.withdraw(amount);
    }

    /**
     * Get stake configuration for a user
     */
    async getStakeConfig(userAddress: string): Promise<StakeConfig | null> {
        return this.stakeToPay.getStakeConfig(userAddress);
    }

    /**
     * Get available staking rewards for a user
     */
    async getAvailableRewards(userAddress: string): Promise<bigint> {
        return this.stakeToPay.getAvailableRewards(userAddress);
    }

    /**
     * Enable stake-to-pay
     */
    async enableStakeToPay(): Promise<TransactionResult> {
        return this.stakeToPay.enable();
    }

    /**
     * Disable stake-to-pay
     */
    async disableStakeToPay(): Promise<TransactionResult> {
        return this.stakeToPay.disable();
    }

    // ============ UTILITY ============

    /**
     * Get contract addresses
     */
    getContractAddresses() {
        return this.config.contracts;
    }

    /**
     * Get network
     */
    getNetwork() {
        return this.config.network;
    }
}
