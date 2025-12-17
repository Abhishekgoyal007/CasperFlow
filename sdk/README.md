# CasperFlow SDK

TypeScript/JavaScript SDK for interacting with CasperFlow protocol on Casper blockchain.

## Installation

```bash
npm install @casperflow/sdk
# or
yarn add @casperflow/sdk
```

## Quick Start

```typescript
import { CasperFlow, PaymentMethod } from '@casperflow/sdk';

// Initialize SDK
const casperflow = new CasperFlow({
  nodeUrl: 'https://rpc.testnet.casperlabs.io/rpc',
  network: 'casper-test',
  contracts: {
    subscriptionManager: 'hash-abc123...',
    usageMeter: 'hash-def456...',
    billingEngine: 'hash-ghi789...',
    stakeToPay: 'hash-jkl012...'
  }
});

// === MERCHANT: Create a subscription plan ===
const planId = await casperflow.createPlan({
  name: 'Pro API',
  basePrice: 50n * 10n**9n,  // 50 CSPR per month
  usagePrice: 1n * 10n**6n,  // 0.001 CSPR per API call
  billingCycle: 'monthly'
});

// === USER: Subscribe to a plan ===
const subscriptionId = await casperflow.subscribe({
  planId,
  autoRenew: true,
  paymentMethod: PaymentMethod.Staked  // Pay with staking rewards!
});

// === MERCHANT: Record usage ===
await casperflow.recordUsage({
  subscriptionId,
  units: 1000,  // 1000 API calls
  metric: 'api_calls'
});

// === USER: Check current usage ===
const usage = await casperflow.getCurrentUsage(subscriptionId);
console.log(`Current usage: ${usage} units`);

// === USER: Deposit for stake-to-pay ===
await casperflow.depositForStaking(1000n * 10n**9n);  // 1000 CSPR

// === USER: Check available rewards ===
const rewards = await casperflow.getAvailableRewards(userAddress);
console.log(`Available rewards: ${rewards} motes`);
```

## Features

### Subscription Management
- Create and manage subscription plans
- Support for base price + usage-based pricing
- Automatic renewal with various billing cycles

### Usage Metering
- Track API calls, storage, compute units, or custom metrics
- Batch usage recording for efficiency
- Real-time usage queries

### Billing & Invoicing
- Automated invoice generation
- On-chain invoice records
- Protocol fee support

### Stake-to-Pay 💰
- Pay subscriptions using staking rewards
- Keep tokens staked, still access premium services
- ~8% APY on staked CSPR

## API Reference

### CasperFlow Class

#### Constructor
```typescript
new CasperFlow(config: CasperFlowConfig)
```

#### Merchant Methods
- `createPlan(params: CreatePlanParams)` - Create a new plan
- `updatePlan(planId, basePrice, usagePrice)` - Update plan pricing
- `deactivatePlan(planId)` - Stop accepting new subscriptions
- `getPlan(planId)` - Get plan details
- `getMerchantPlans(merchantAddress)` - List all plans

#### User Methods
- `subscribe(params: SubscribeParams)` - Subscribe to a plan
- `unsubscribe(subscriptionId)` - Cancel subscription
- `getSubscription(subscriptionId)` - Get subscription details
- `getUserSubscriptions(userAddress)` - List all subscriptions

#### Usage Methods
- `recordUsage(params: RecordUsageParams)` - Record usage
- `getCurrentUsage(subscriptionId)` - Get current period usage

#### Billing Methods
- `getInvoice(invoiceId)` - Get invoice details
- `getUserInvoices(userAddress)` - List all invoices
- `payInvoice(invoiceId)` - Pay an invoice

#### Stake-to-Pay Methods
- `depositForStaking(amount)` - Deposit CSPR
- `withdrawStake(amount)` - Withdraw staked CSPR
- `getStakeConfig(userAddress)` - Get stake configuration
- `getAvailableRewards(userAddress)` - Check available rewards
- `enableStakeToPay()` - Enable stake-to-pay
- `disableStakeToPay()` - Disable stake-to-pay

## Utility Functions

```typescript
import { 
  csprToMotes, 
  motesToCspr, 
  formatCspr,
  shortenAddress 
} from '@casperflow/sdk';

csprToMotes(50);           // 50_000_000_000n
motesToCspr(50_000_000_000n); // 50
formatCspr(50_000_000_000n);  // "50.00 CSPR"
shortenAddress('0x1234567890abcdef'); // "0x1234...cdef"
```

## License

MIT
