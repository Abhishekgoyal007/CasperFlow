# CasperFlow v2.0 - Complete Implementation Plan

## 🎯 Goal
Build a **real, working** on-chain subscription billing protocol on Casper that:
1. Actually transfers CSPR when users subscribe
2. Stores all data on-chain
3. Provides API for developers to verify subscriptions
---

## 📊 Current State vs Target State

| Feature | Current | Target |
|---------|---------|--------|
| Wallet Connection | ✅ Works | ✅ Keep |
| Balance Display | ✅ Works | ✅ Keep |
| Plan Creation | ❌ localStorage | ✅ On-chain |
| Subscribe | ❌ localStorage | ✅ Real CSPR transfer |
| Subscription Verification | ❌ None | ✅ On-chain + API |
| API Keys | ⚠️ Local only | ✅ Verifiable |
| Invoices | ⚠️ Generated locally | ✅ Link to tx hash |
| Stake-to-Pay | ❌ Not built | ✅ Simplified version |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CASPERFLOW ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│   │   FRONTEND   │────▶│   NEXT.js    │────▶│  CASPER    │ │
│   │   (React)    │     │   API Routes │     │  TESTNET    │ │
│   └──────────────┘     └──────────────┘     └─────────────┘ │
│          │                    │                    │        │
│          ▼                    ▼                    ▼        │
│   ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│   │   CASPER     │     │  Verify API  │     │  SMART      │ │
│   │   WALLET     │     │  /api/verify │     │  CONTRACTS  │ │
│   └──────────────┘     └──────────────┘     └─────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Phases

### PHASE 1: Smart Contract Enhancement (2-3 hours)
**Files to modify:** `casperflow_contracts/src/subscription_manager.rs`

1. Update SubscriptionManager contract with:
   - `create_plan(name: String, price: U512, period: u64)`
   - `subscribe(plan_id: u64)` - payable, transfers CSPR
   - `get_subscription(user: Key, plan_id: u64) -> Option<Subscription>`
   - `verify_subscription(user: Key, plan_id: u64) -> bool`
   - `get_plan(plan_id: u64) -> Option<Plan>`

2. Compile and deploy to testnet

### PHASE 2: Frontend Smart Contract Integration (3-4 hours)
**Files to modify:** Multiple frontend files

1. Create `frontend/src/lib/casper.ts` - Casper SDK wrapper
   - Connect to contract
   - Call contract methods
   - Sign and send transactions

2. Update subscription flow:
   - When user clicks "Subscribe", call contract
   - Transfer CSPR to merchant
   - Record subscription on-chain

3. Update plan creation:
   - When merchant creates plan, store on-chain

### PHASE 3: Verification API (1-2 hours)
**Files to create:** `frontend/src/app/api/` routes

1. `GET /api/plans` - List all plans
2. `GET /api/verify` - Verify subscription by API key
3. `GET /api/subscription/[id]` - Get subscription details

### PHASE 4: Stake-to-Pay Feature (2-3 hours)
**A simplified but REAL feature:**

1. User stakes CSPR in StakeToPay contract
2. Staked amount is locked as "subscription credit"
3. Subscriptions auto-renew from staked balance
4. User earns staking rewards while paying subscriptions

### PHASE 5: Polish & Documentation (1-2 hours)

1. Update README with real contract addresses
2. Add SDK documentation
3. Create demo video script
4. Screenshots

---

## 🔧 Technical Details

### Smart Contract: SubscriptionManager v2

```rust
#[odra::module]
pub struct SubscriptionManager {
    plans: Mapping<u64, Plan>,
    subscriptions: Mapping<(Address, u64), Subscription>,
    plan_count: Var<u64>,
    owner: Var<Address>,
}

pub struct Plan {
    id: u64,
    name: String,
    price: U512,
    period: u64, // in seconds
    merchant: Address,
    active: bool,
}

pub struct Subscription {
    plan_id: u64,
    subscriber: Address,
    started_at: u64,
    expires_at: u64,
    active: bool,
}
```

### Frontend Integration

```typescript
// lib/casper.ts
import { CasperClient, DeployUtil, CLPublicKey } from 'casper-js-sdk';

export async function subscribeToPlan(planId: number, priceInCSPR: number) {
    // 1. Build deploy
    // 2. Sign with Casper Wallet
    // 3. Send to network
    // 4. Return deploy hash
}

export async function verifySubscription(wallet: string, planId: number) {
    // Call contract view method
    // Return subscription status
}
```

### API Endpoints

```
GET /api/plans
  -> Returns all plans from contract

GET /api/verify?apiKey=cf_sk_xxx
  -> Verifies API key is from active subscription
  -> Returns { valid: true, plan: "Pro API", expires: "..." }

POST /api/subscribe
  -> Body: { planId, walletAddress }
  -> Initiates subscription transaction
```

---

## 📁 Files to Create/Modify

### New Files:
- `frontend/src/lib/casper.ts` - Casper SDK integration
- `frontend/src/lib/contracts.ts` - Contract interaction helpers
- `frontend/src/app/api/plans/route.ts` - Plans API
- `frontend/src/app/api/verify/route.ts` - Verification API
- `frontend/src/app/api/subscribe/route.ts` - Subscribe API
- `casperflow_contracts/src/subscription_manager_v2.rs` - Updated contract

### Modified Files:
- `frontend/src/app/app/user/browse/page.tsx` - Real subscribe
- `frontend/src/app/app/merchant/plans/page.tsx` - Real plan creation
- `frontend/src/context/SubscriptionsContext.tsx` - Sync with chain
- `README.md` - Update with real info

---

## ✅ Success Criteria

Before submission, these MUST work:

1. [x] User can subscribe with REAL CSPR transfer
2. [x] Transaction visible on testnet.cspr.live
3. [x] API can verify subscription status
4. [x] Merchant sees real subscriber data
5. [x] At least basic Stake-to-Pay demo
6. [ ] Demo video showing complete flow
7. [x] README matches reality

---

## 🚀 Let's Start!

**Phase 1 starts now: Smart Contract Enhancement**
