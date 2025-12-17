# CasperFlow Smart Contracts

On-chain subscription and metered billing protocol for Casper blockchain.

## Contracts

- **SubscriptionManager** - Manage subscription plans and user subscriptions
- **UsageMeter** - Track and record API/compute usage metrics
- **BillingEngine** - Calculate and process billing (base + usage)
- **StakeToPay** - Pay subscriptions using staking rewards

## Tech Stack

- Rust
- Odra Framework (Casper smart contract framework)
- casper-contract SDK

## Build

```bash
cd contracts
cargo odra build
```

## Test

```bash
cargo odra test
```

## Deploy

```bash
cargo odra deploy --network testnet
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CasperFlow Protocol                      │
├─────────────────┬─────────────────┬───────────────┬─────────────┤
│  Subscription   │   Usage Meter   │   Billing     │  Stake-to   │
│    Manager      │                 │   Engine      │    Pay      │
├─────────────────┴─────────────────┴───────────────┴─────────────┤
│                     Casper Blockchain                           │
└─────────────────────────────────────────────────────────────────┘
```

## License

MIT
