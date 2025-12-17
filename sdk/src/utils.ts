/**
 * Utility functions for CasperFlow SDK
 */

/**
 * Convert CSPR to motes (1 CSPR = 1,000,000,000 motes)
 */
export function csprToMotes(cspr: number): bigint {
    return BigInt(Math.floor(cspr * 1_000_000_000));
}

/**
 * Convert motes to CSPR
 */
export function motesToCspr(motes: bigint): number {
    return Number(motes) / 1_000_000_000;
}

/**
 * Format CSPR amount for display
 */
export function formatCspr(motes: bigint, decimals: number = 2): string {
    const cspr = motesToCspr(motes);
    return `${cspr.toFixed(decimals)} CSPR`;
}

/**
 * Convert billing cycle string to seconds
 */
export function billingCycleToSeconds(
    cycle: "weekly" | "monthly" | "yearly" | number
): number {
    if (typeof cycle === "number") return cycle;

    const SECONDS = {
        weekly: 7 * 24 * 60 * 60, // 604,800
        monthly: 30 * 24 * 60 * 60, // 2,592,000
        yearly: 365 * 24 * 60 * 60, // 31,536,000
    };

    return SECONDS[cycle];
}

/**
 * Get remaining time until next billing in human-readable format
 */
export function getTimeUntilBilling(nextBillingAt: number): string {
    const now = Math.floor(Date.now() / 1000);
    const remaining = nextBillingAt - now;

    if (remaining <= 0) return "Due now";

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "< 1h";
}

/**
 * Validate Casper public key format
 */
export function isValidCasperKey(key: string): boolean {
    // Casper public keys are 66 characters (01/02 prefix + 64 hex chars)
    const ed25519Pattern = /^01[0-9a-fA-F]{64}$/;
    const secp256k1Pattern = /^02[0-9a-fA-F]{66}$/;

    return ed25519Pattern.test(key) || secp256k1Pattern.test(key);
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: string, chars: number = 4): string {
    if (address.length <= chars * 2 + 3) return address;
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Calculate estimated bill
 */
export function calculateBill(
    basePrice: bigint,
    usagePrice: bigint,
    usageUnits: bigint
): bigint {
    return basePrice + usagePrice * usageUnits;
}

/**
 * Calculate APY earnings
 */
export function calculateStakingRewards(
    stakedAmount: bigint,
    apyBps: number,
    durationSeconds: number
): bigint {
    const secondsPerYear = 31_536_000n;
    return (
        (stakedAmount * BigInt(apyBps) * BigInt(durationSeconds)) /
        (secondsPerYear * 10000n)
    );
}

/**
 * Parse contract event data
 */
export function parseEvent<T>(eventData: unknown): T {
    // Implementation depends on casper-js-sdk event format
    return eventData as T;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await sleep(baseDelay * Math.pow(2, i));
            }
        }
    }

    throw lastError;
}
