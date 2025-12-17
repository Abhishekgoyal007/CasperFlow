# CasperFlow Smart Contracts

On-chain subscription and metered billing protocol for Casper blockchain.

## 📋 Prerequisites

Before building and deploying the contracts, you need:

### 1. Install Rust
```powershell
# Windows (PowerShell)
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
./rustup-init.exe

# Or visit: https://rustup.rs
```

After installation, restart your terminal and verify:
```bash
rustc --version
cargo --version
```

### 2. Install Odra Framework
```bash
cargo install cargo-odra
```

### 3. Install WebAssembly target
```bash
rustup target add wasm32-unknown-unknown
```

### 4. Get Testnet CSPR
1. Create a wallet: https://cspr.live
2. Get testnet CSPR from faucet: https://testnet.cspr.live/tools/faucet

## 🏗 Contracts

| Contract | Description |
|----------|-------------|
| `SubscriptionManager` | Manage subscription plans and user subscriptions |
| `UsageMeter` | Track and record API/compute usage metrics |
| `BillingEngine` | Calculate and process billing (base + usage) |
| `StakeToPay` | Pay subscriptions using staking rewards |

## 🛠 Build

```bash
cd contracts
cargo odra build
```

This creates WASM files in `target/wasm32-unknown-unknown/release/`

## 🧪 Test

```bash
cargo odra test
```

Run specific test:
```bash
cargo odra test -- test_create_plan
```

## 🚀 Deploy to Testnet

### 1. Export your wallet key
Export your secret key from Casper Wallet and save as `secret_key.pem`

### 2. Deploy contracts
```bash
# Using Odra CLI
cargo odra deploy -n testnet -c SubscriptionManager
cargo odra deploy -n testnet -c UsageMeter
cargo odra deploy -n testnet -c BillingEngine
cargo odra deploy -n testnet -c StakeToPay
```

### 3. Configure contract references
After deployment, call these entry points to link contracts:

```bash
# Set BillingEngine in SubscriptionManager
casper-client put-deploy \
  --node-address http://136.243.187.84:7777/rpc \
  --chain-name casper-test \
  --secret-key ./secret_key.pem \
  --payment-amount 1000000000 \
  --session-hash hash-<SUBSCRIPTION_MANAGER_HASH> \
  --session-entry-point "set_billing_engine" \
  --session-arg "address:key='hash-<BILLING_ENGINE_HASH>'"
```

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CasperFlow Protocol                       │
├─────────────────┬─────────────────┬───────────────┬─────────────┤
│  Subscription   │   Usage Meter   │   Billing     │  Stake-to   │
│    Manager      │                 │   Engine      │    Pay      │
├─────────────────┴─────────────────┴───────────────┴─────────────┤
│                     Casper Blockchain                            │
└─────────────────────────────────────────────────────────────────┘
```

## 📝 Contract APIs

### SubscriptionManager

#### Merchant Functions
```rust
// Create a new subscription plan
create_plan(name: String, base_price: U256, usage_price: U256, billing_cycle: u64) -> U256

// Update plan pricing
update_plan(plan_id: U256, base_price: U256, usage_price: U256)

// Deactivate a plan
deactivate_plan(plan_id: U256)
```

#### User Functions
```rust
// Subscribe to a plan (payable)
subscribe(plan_id: U256, auto_renew: bool, payment_method: u8) -> U256

// Cancel subscription
unsubscribe(subscription_id: U256)

// Toggle auto-renew
set_auto_renew(subscription_id: U256, auto_renew: bool)
```

### UsageMeter

```rust
// Record usage (called by authorized backend)
record_usage(subscription_id: U256, plan_id: U256, metric: String, units: U256) -> U256

// Batch record usage
batch_record_usage(subscription_ids: Vec<U256>, plan_id: U256, metric: String, units_list: Vec<U256>)

// Get current period usage
get_current_usage(subscription_id: U256) -> U256
```

### BillingEngine

```rust
// Create invoice
create_invoice(subscription_id: U256, plan_id: U256, ...) -> U256

// Pay invoice (payable)
pay_invoice(invoice_id: U256)

// Get invoice details
get_invoice(invoice_id: U256) -> Invoice
```

### StakeToPay

```rust
// Deposit for staking (payable)
deposit()

// Withdraw staked amount
withdraw(amount: U256)

// Pay invoice from rewards
pay_invoice_from_rewards(invoice_id: U256, amount: U256, merchant: Address)

// Get available rewards
get_available_rewards(user: Address) -> U256
```

## 🔐 Security Considerations

- Only plan merchants can update/deactivate their plans
- Only subscribers can cancel their subscriptions
- Usage recording requires authorization
- Protocol fees capped at 10%
- StakeToPay APY capped at 20%

## 📄 License

MIT
