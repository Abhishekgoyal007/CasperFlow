/**
 * CasperFlow - Casper Blockchain Integration
 * 
 * This module handles all interactions with the Casper blockchain,
 * including subscription management and payment processing.
 */

import {
    CasperClient,
    DeployUtil,
    CLPublicKey,
    RuntimeArgs,
    CLValueBuilder,
    CLU512,
    Contracts
} from 'casper-js-sdk';

// Network Configuration
export const CASPER_CONFIG = {
    testnet: {
        nodeUrl: 'https://rpc.testnet.casperlabs.io/rpc',
        chainName: 'casper-test',
        explorerUrl: 'https://testnet.cspr.live'
    },
    mainnet: {
        nodeUrl: 'https://rpc.mainnet.casperlabs.io/rpc',
        chainName: 'casper',
        explorerUrl: 'https://cspr.live'
    }
};

// Deployed Contract Hash (SubscriptionManager)
export const SUBSCRIPTION_MANAGER_HASH = '55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143';

// CSPR conversion (1 CSPR = 1,000,000,000 motes)
export const CSPR_TO_MOTES = 1_000_000_000;

/**
 * Get Casper Client instance
 */
export function getCasperClient(network: 'testnet' | 'mainnet' = 'testnet'): CasperClient {
    return new CasperClient(CASPER_CONFIG[network].nodeUrl);
}

/**
 * Convert CSPR to motes
 */
export function csprToMotes(cspr: number): bigint {
    return BigInt(Math.floor(cspr * CSPR_TO_MOTES));
}

/**
 * Convert motes to CSPR
 */
export function motesToCspr(motes: bigint): number {
    return Number(motes) / CSPR_TO_MOTES;
}

/**
 * Build a deploy for subscribing to a plan
 */
export function buildSubscribeDeploy(
    publicKey: string,
    planId: number,
    paymentAmount: number, // in CSPR
    network: 'testnet' | 'mainnet' = 'testnet'
): DeployUtil.Deploy {
    const senderKey = CLPublicKey.fromHex(publicKey);
    const paymentMotes = csprToMotes(paymentAmount);

    // Build the contract call deploy
    const contractHashBytes = Uint8Array.from(
        Buffer.from(SUBSCRIPTION_MANAGER_HASH, 'hex')
    );

    const args = RuntimeArgs.fromMap({
        plan_id: CLValueBuilder.u32(planId),
    });

    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
            senderKey,
            CASPER_CONFIG[network].chainName,
            1, // gas price
            1800000 // 30 min TTL
        ),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            contractHashBytes,
            'subscribe',
            args
        ),
        DeployUtil.standardPayment(5_000_000_000) // 5 CSPR gas
    );

    // Attach the payment amount
    (deploy as any).payment_amount = paymentMotes;

    return deploy;
}

/**
 * Build a deploy for creating a plan
 */
export function buildCreatePlanDeploy(
    publicKey: string,
    price: number, // in CSPR
    periodSeconds: number,
    name: string,
    network: 'testnet' | 'mainnet' = 'testnet'
): DeployUtil.Deploy {
    const senderKey = CLPublicKey.fromHex(publicKey);
    const priceMotes = csprToMotes(price);

    const contractHashBytes = Uint8Array.from(
        Buffer.from(SUBSCRIPTION_MANAGER_HASH, 'hex')
    );

    const args = RuntimeArgs.fromMap({
        price: CLValueBuilder.u512(priceMotes.toString()),
        period_seconds: CLValueBuilder.u64(periodSeconds),
        name: CLValueBuilder.string(name),
    });

    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
            senderKey,
            CASPER_CONFIG[network].chainName,
            1,
            1800000
        ),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            contractHashBytes,
            'create_plan',
            args
        ),
        DeployUtil.standardPayment(5_000_000_000)
    );

    return deploy;
}

/**
 * Sign deploy using Casper Wallet extension
 */
export async function signDeployWithWallet(
    deploy: DeployUtil.Deploy,
    publicKey: string
): Promise<DeployUtil.Deploy> {
    // Check if Casper Wallet is available
    if (typeof window === 'undefined' || !(window as any).CasperWalletProvider) {
        throw new Error('Casper Wallet extension not found');
    }

    const provider = (window as any).CasperWalletProvider();

    // Convert deploy to JSON for signing
    const deployJson = DeployUtil.deployToJson(deploy);

    // Request signature from wallet
    const signResult = await provider.sign(
        JSON.stringify(deployJson),
        publicKey
    );

    if (signResult.cancelled) {
        throw new Error('User cancelled the transaction');
    }

    // Parse signed deploy
    const signedDeploy = DeployUtil.setSignature(
        deploy,
        signResult.signature,
        CLPublicKey.fromHex(publicKey)
    );

    return signedDeploy;
}

/**
 * Send a signed deploy to the network
 */
export async function sendDeploy(
    deploy: DeployUtil.Deploy,
    network: 'testnet' | 'mainnet' = 'testnet'
): Promise<string> {
    const client = getCasperClient(network);
    const deployHash = await client.putDeploy(deploy);
    return deployHash;
}

/**
 * Wait for deploy to be processed
 */
export async function waitForDeploy(
    deployHash: string,
    network: 'testnet' | 'mainnet' = 'testnet',
    timeoutMs: number = 120000
): Promise<any> {
    const client = getCasperClient(network);
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
        try {
            const result = await client.getDeploy(deployHash);
            if (result && result.length > 1) {
                const executionResult = result[1];
                if (executionResult.execution_results && executionResult.execution_results.length > 0) {
                    return executionResult;
                }
            }
        } catch (e) {
            // Deploy not yet processed, continue waiting
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    throw new Error('Deploy confirmation timeout');
}

/**
 * Get deploy status from explorer
 */
export function getDeployExplorerUrl(
    deployHash: string,
    network: 'testnet' | 'mainnet' = 'testnet'
): string {
    return `${CASPER_CONFIG[network].explorerUrl}/deploy/${deployHash}`;
}

/**
 * Subscribe to a plan - Full flow
 */
export async function subscribeToPlan(
    publicKey: string,
    planId: number,
    priceInCSPR: number,
    network: 'testnet' | 'mainnet' = 'testnet'
): Promise<{ deployHash: string; explorerUrl: string }> {
    // 1. Build the deploy
    const deploy = buildSubscribeDeploy(publicKey, planId, priceInCSPR, network);

    // 2. Sign with wallet
    const signedDeploy = await signDeployWithWallet(deploy, publicKey);

    // 3. Send to network
    const deployHash = await sendDeploy(signedDeploy, network);

    // 4. Return hash and explorer URL
    return {
        deployHash,
        explorerUrl: getDeployExplorerUrl(deployHash, network)
    };
}

/**
 * Create a plan - Full flow
 */
export async function createPlanOnChain(
    publicKey: string,
    name: string,
    priceInCSPR: number,
    periodSeconds: number,
    network: 'testnet' | 'mainnet' = 'testnet'
): Promise<{ deployHash: string; explorerUrl: string }> {
    // 1. Build the deploy
    const deploy = buildCreatePlanDeploy(publicKey, priceInCSPR, periodSeconds, name, network);

    // 2. Sign with wallet
    const signedDeploy = await signDeployWithWallet(deploy, publicKey);

    // 3. Send to network
    const deployHash = await sendDeploy(signedDeploy, network);

    return {
        deployHash,
        explorerUrl: getDeployExplorerUrl(deployHash, network)
    };
}

/**
 * Check if Casper Wallet is available
 */
export function isCasperWalletAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window as any).CasperWalletProvider;
}

/**
 * Simple CSPR Transfer - Most reliable method for subscriptions
 * This creates a native CSPR transfer to the merchant's wallet
 */
export async function transferCSPR(
    senderPublicKey: string,
    recipientPublicKey: string,
    amountInCSPR: number,
    network: 'testnet' | 'mainnet' = 'testnet'
): Promise<{ deployHash: string; explorerUrl: string }> {
    if (!isCasperWalletAvailable()) {
        throw new Error('Casper Wallet not available');
    }

    const sender = CLPublicKey.fromHex(senderPublicKey);
    const recipient = CLPublicKey.fromHex(recipientPublicKey);
    const amountMotes = csprToMotes(amountInCSPR);

    // Build a simple transfer deploy
    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
            sender,
            CASPER_CONFIG[network].chainName,
            1,
            1800000
        ),
        DeployUtil.ExecutableDeployItem.newTransfer(
            amountMotes,
            recipient,
            null, // no correlation id needed
            1 // transfer id
        ),
        DeployUtil.standardPayment(100_000_000) // 0.1 CSPR gas for transfer
    );

    // Sign with wallet
    const provider = (window as any).CasperWalletProvider();
    const deployJson = DeployUtil.deployToJson(deploy);

    const signResult = await provider.sign(
        JSON.stringify(deployJson),
        senderPublicKey
    );

    if (signResult.cancelled) {
        throw new Error('Transaction cancelled by user');
    }

    // Reconstruct signed deploy
    const signedDeploy = DeployUtil.setSignature(
        deploy,
        signResult.signature,
        sender
    );

    // Send to network
    const client = getCasperClient(network);
    const deployHash = await client.putDeploy(signedDeploy);

    return {
        deployHash,
        explorerUrl: getDeployExplorerUrl(deployHash, network)
    };
}

/**
 * Subscribe with native CSPR transfer
 * Simpler and more reliable than contract calls
 */
export async function subscribeWithTransfer(
    subscriberPublicKey: string,
    merchantPublicKey: string,
    priceInCSPR: number,
    network: 'testnet' | 'mainnet' = 'testnet'
): Promise<{ deployHash: string; explorerUrl: string }> {
    return transferCSPR(subscriberPublicKey, merchantPublicKey, priceInCSPR, network);
}

