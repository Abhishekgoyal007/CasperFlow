# CasperFlow 🌊

> **On-Chain Subscriptions & Metered Billing for Casper Blockchain**

CasperFlow is the first protocol enabling usage-based billing, stake-powered payments, and cross-chain settlement on the Casper blockchain.

![CasperFlow Banner](./docs/banner.png)

## ✨ Features

### 📦 Recurring Subscriptions
Create monthly, weekly, or custom billing cycles. Auto-charge subscribers on-chain with full transparency.

### 📊 Usage-Based Metering
Track API calls, storage, compute units, or any custom metric. Bill users exactly for what they use.

### 💰 Stake-to-Pay
Revolutionary feature: Users pay subscriptions from staking rewards. Keep tokens staked, never sell — still access premium services.

### 🌐 Cross-Chain Payments
Accept payments from Ethereum, Polygon, and more. All settled on Casper for unified billing.

### 🧾 On-Chain Invoices
Every bill, payment, and usage record stored on-chain. Full auditability and trust.

### 🛠 Developer SDK
TypeScript/JavaScript SDK with simple APIs. Integrate billing in minutes, not weeks.

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CasperFlow Protocol                       │
├─────────────────┬─────────────────┬───────────────┬─────────────┤
│  Subscription   │   Usage Meter   │   Billing     │  Stake-to   │
│    Manager      │                 │   Engine      │    Pay      │
├─────────────────┴─────────────────┴───────────────┴─────────────┤
│                     Casper Blockchain                            │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Cross-chain Bridge
                              │
┌─────────────────────────────┴───────────────────────────────────┐
│           Ethereum / Polygon / Arbitrum / Optimism               │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
CasperFlow/
├── frontend/           # Next.js 14 dashboard application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   └── components/
│   └── package.json
│
├── contracts/          # Rust/Odra smart contracts
│   ├── src/
│   │   ├── subscription_manager.rs
│   │   ├── usage_meter.rs
│   │   ├── billing_engine.rs
│   │   └── stake_to_pay.rs
│   └── Cargo.toml
│
├── sdk/                # TypeScript SDK
│   ├── src/
│   └── package.json
│
└── cross-chain/        # Cross-chain payment module
    ├── contracts/      # Solidity contracts
    └── relayer/        # Bridge relayer service
```

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Contracts

```bash
cd contracts
cargo odra build
cargo odra test
```

### SDK

```bash
cd sdk
npm install
npm run build
```

## 💻 SDK Usage

```typescript
import { CasperFlow, PaymentMethod } from '@casperflow/sdk';

const casperflow = new CasperFlow({
  nodeUrl: 'https://rpc.testnet.casperlabs.io/rpc',
  network: 'casper-test'
});

// Merchant: Create a plan
const planId = await casperflow.createPlan({
  name: 'Pro API',
  basePrice: 50n * 10n**9n,  // 50 CSPR
  usagePrice: 1n * 10n**6n,  // 0.001 CSPR per call
  billingCycle: 'monthly'
});

// User: Subscribe with stake-to-pay
const subscriptionId = await casperflow.subscribe({
  planId,
  autoRenew: true,
  paymentMethod: PaymentMethod.Staked
});

// Merchant: Record usage
await casperflow.recordUsage({
  subscriptionId,
  units: 1000,
  metric: 'api_calls'
});
```

## 📄 Smart Contracts

### SubscriptionManager
Manages subscription plans and user subscriptions.

```rust
// Create a plan
CasperFlow.createPlan({
  name: "Pro API",
  basePrice: 50_000_000_000, // 50 CSPR
  usagePrice: 1_000_000,     // 0.001 CSPR per call
  billingCycle: 2592000      // 30 days
});

// Subscribe
CasperFlow.subscribe({
  planId: 1,
  autoRenew: true,
  paymentMethod: 1  // 0=wallet, 1=staked
});
```

### UsageMeter
Tracks API calls, storage, and custom metrics.

```rust
// Record usage
CasperFlow.recordUsage({
  subscriptionId: 1,
  metric: "api_calls",
  units: 100
});
```

### BillingEngine
Calculates bills and processes payments.

```rust
// Invoice structure
{
  baseAmount: 50 CSPR,
  usageAmount: 1.5 CSPR,  // 1500 calls × 0.001
  totalAmount: 51.5 CSPR
}
```

### StakeToPay
Pay subscriptions from staking rewards (~8% APY).

```rust
// Deposit for staking
CasperFlow.deposit(1000_000_000_000); // 1000 CSPR

// Pay invoice from rewards
CasperFlow.payInvoiceFromRewards(invoiceId);
```

## 🌉 Cross-Chain Payments

Accept payments from Ethereum:

```solidity
// User pays in ETH
PaymentBridge.payWithEth(casperInvoiceId, expectedCsprAmount);

// Or with USDC
PaymentBridge.payWithUsdc(casperInvoiceId, usdcAmount, expectedCsprAmount);
```

## 🎯 Use Cases

- **AI API Providers** - Charge per request, per token, or per image
- **Gaming Platforms** - Pay-per-match or monthly subscriptions
- **Decentralized Storage** - Bill per GB stored or downloaded
- **Content Platforms** - Premium newsletters and creator subscriptions

## 🛣 Roadmap

- [x] Landing page & dashboard UI
- [x] Smart contract architecture
- [x] TypeScript SDK
- [x] Cross-chain bridge design
- [ ] Deploy to Casper Testnet
- [ ] Integration testing
- [ ] Demo video
- [ ] Mainnet launch

## 📚 Documentation

- [SDK Reference](./sdk/README.md)
- [Contract Documentation](./contracts/README.md)
- [Cross-Chain Guide](./cross-chain/README.md)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📜 License

MIT License - see [LICENSE](./LICENSE)

---

**Built with ❤️ for Casper Blockchain**
