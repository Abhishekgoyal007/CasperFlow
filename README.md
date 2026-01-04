# CasperFlow

<div align="center">

![CasperFlow](https://img.shields.io/badge/CasperFlow-On--Chain%20Subscriptions-red?style=for-the-badge)
![Casper](https://img.shields.io/badge/Casper-Blockchain-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Testnet-green?style=for-the-badge)

**The first protocol enabling usage-based billing, Stake-to-Pay™, automated recurring payments, and subscription management on the Casper blockchain.**

[Live Demo](https://casperflow.vercel.app) · [Documentation](./docs/SDK.md) · [Contracts](./casperflow_contracts)

</div>

## 💎 Stake-to-Pay™ — The Killer Feature

> **Revolutionary:** Stake your CSPR, earn 8% APY, and automatically pay subscriptions from your staking rewards — without touching your principal!

|   Traditional Payments        |        Stake-to-Pay™         |
|-------------------------------|------------------------------|
| ❌ Sell crypto to pay        | ✅ Keep 100% of your tokens  |
| ❌ Lose potential gains      | ✅ Earn 8% APY while paying  |
| ❌ Tax events on each sale   | ✅ No selling = no tax events|
| ❌ Manual payment each month | ✅ Auto-pay from rewards     |
| ❌ Principal decreases       | ✅ Principal untouched       |

**Example:** Stake 1,000 CSPR → Earn ~80 CSPR/year in rewards → Auto-pay up to 6.67 CSPR/month in subscriptions!

---

## 🔄 Automated Recurring Payments

Users approve a **consent** with:
- Maximum amount per billing cycle
- Total spending limit
- Auto-renew before expiry

Merchants can charge automatically — no user action needed each month!

```javascript
// Example: User approves consent
await casperflow.createConsent({
    planId: 'plan_123',
    maxPerPeriod: 50,     // Max 50 CSPR per month
    totalMax: 600,        // Total 600 CSPR over lifetime
    validForDays: 365     // Valid for 1 year
});
```

---

## 📊 Merchant Analytics Dashboard

Real-time insights for merchants:
- 📈 Revenue trends & MRR
- 👥 Subscriber growth charts
- 📉 Churn rate & predictions
- 🎯 Trial conversion rates
- 📊 Plan performance breakdown
- 🔮 AI-powered predictions

---

## 🎁 Free Trials

Merchants can offer time-locked trials:
- No payment required to start
- Full access during trial period
- Automatic reminder before expiry
- One-click upgrade to paid

---

## � Embeddable Widget

Drop a subscribe button on ANY website:

```html
<!-- Simple HTML Embed -->
<script src="https://casperflow.vercel.app/widget.js"></script>
<casperflow-button 
    plan-id="plan_123" 
    theme="dark"
    text="Subscribe with CSPR">
</casperflow-button>
```

```javascript
// JavaScript API
CasperFlow.init({
    planId: 'plan_123',
    container: '#subscribe-button',
    theme: 'dark',
    onReady: (button) => console.log('Widget ready!')
});
```

```jsx
// React Component
import { CasperFlowButton } from 'casperflow-widget';

<CasperFlowButton 
    planId="plan_123"
    theme="dark"
    onSubscribe={(sub) => console.log('Subscribed!', sub)}
/>
```

---

## 📜 Deployed Contracts

| Contract | Network | Hash/Address | Status |
|----------|---------|-------------|--------|
| SubscriptionManager | Testnet | `55fb7395...` | ✅ Verified |
| StakeToPay Vault | Testnet | `0203b862...` | ✅ Integrated |

View on explorer: [testnet.cspr.live](https://testnet.cspr.live/deploy/55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143)

---

## ✨ Complete Feature List

### 🌟 Stake-to-Pay™
- ✅ Stake CSPR and earn 8% APY
- ✅ Auto-pay subscriptions from rewards
- ✅ Keep principal untouched
- ✅ No lock-up period
- ✅ Coverage calculator
- ✅ **Real on-chain CSPR transfers via Casper Wallet**
- ✅ **View transactions on testnet.cspr.live**

### 🔄 Recurring Payments
- ✅ Consent-based authorization
- ✅ Spending limits
- ✅ Auto-renewal
- ✅ Revoke anytime

### 📊 Analytics Dashboard
- ✅ Real-time revenue charts
- ✅ Subscriber growth trends
- ✅ Churn rate tracking
- ✅ Plan performance
- ✅ AI predictions

### 🎁 Free Trials
- ✅ Configurable trial periods
- ✅ No payment required
- ✅ One-click upgrade
- ✅ Trial management

### 🔌 Embeddable Widget
- ✅ HTML/JS/React support
- ✅ Theme customization
- ✅ Modal subscription flow
- ✅ Widget builder UI

### For Merchants
- ✅ Create subscription plans
- ✅ Track subscribers & revenue
- ✅ Download invoices
- ✅ Real-time analytics
- ✅ Widget builder

### For Users
- ✅ Browse & subscribe to plans
- ✅ Pay with CSPR
- ✅ Stake-to-Pay
- ✅ Manage consents
- ✅ Start free trials

### For Developers
- ✅ REST API
- ✅ JavaScript SDK
- ✅ Embeddable widgets
- ✅ Webhook events (coming)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Casper Wallet](https://chrome.google.com/webstore/detail/casper-wallet) browser extension
- Test CSPR from [faucet](https://testnet.cspr.live/tools/faucet)

### Installation

```bash
git clone https://github.com/Abhishekgoyal007/CasperFlow.git
cd CasperFlow/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## � Project Structure

```
CasperFlow/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/                    # API endpoints
│   │   │   ├── app/
│   │   │   │   ├── merchant/
│   │   │   │   │   ├── analytics/      # 📊 Analytics Dashboard
│   │   │   │   │   ├── widget/         # 🔌 Widget Builder
│   │   │   │   │   └── ...
│   │   │   │   └── user/
│   │   │   │       ├── stake/          # 💎 Stake-to-Pay
│   │   │   │       ├── consents/       # 🔄 Payment Consents
│   │   │   │       ├── trials/         # 🎁 Free Trials
│   │   │   │       └── ...
│   │   │   └── page.tsx
│   │   ├── components/
│   │   └── context/
│   │       ├── StakeToPayContext.tsx   # Staking state
│   │       ├── SubscriptionsContext.tsx # Enhanced with trials/consents
│   │       └── PlansContext.tsx        # Plan management with trials
│   └── public/
│       └── widget.js                   # 🔌 Embeddable widget
├── casperflow_contracts/
│   ├── src/
│   │   ├── stake_to_pay.rs             # 💎 Stake-to-Pay contract
│   │   └── subscription_manager.rs     # Core subscription logic
│   └── Cargo.toml
└── docs/
    └── SDK.md
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Casper Network (Testnet) |
| Smart Contracts | Rust + Odra Framework |
| Frontend | Next.js 14, React 19, TypeScript |
| Styling | TailwindCSS 4 |
| Wallet | Casper Wallet Extension |
| SDK | casper-js-sdk |
| Animations | Framer Motion |
| Charts | Custom SVG + Motion |

---

## 🔮 Roadmap

### Completed ✅
- [x] Core subscription management
- [x] Wallet integration
- [x] API verification endpoint
- [x] **Stake-to-Pay v1** 💎
- [x] **Automated Recurring Payments** 🔄
- [x] **Merchant Analytics Dashboard** 📊
- [x] **Free Trials** 🎁
- [x] **Embeddable Widget** 🔌

### Coming Soon 🚀
- [ ] Cross-chain settlements (ETH, Polygon)
- [ ] Webhooks for real-time events
- [ ] NPM SDK package
- [ ] Mobile wallet support
- [ ] Mainnet deployment

---

## 🏆 Built For

**Casper Hackathon 2026 - Qualification Round**

### Why We'll Win

1. **💎 Stake-to-Pay™** - First-of-its-kind, solves real problem
2. **🔄 Recurring Payments** - What real subscriptions need
3. **📊 Analytics Dashboard** - Professional merchant tools
4. **🎁 Free Trials** - Conversion optimization built-in
5. **🔌 Embeddable Widget** - Universal integration
6. **🚀 Complete Solution** - Not a demo, a product

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

<div align="center">

**Built with ❤️ on Casper**

### 💎 *"Stake Your CSPR. Pay With Rewards. Keep Your Tokens."*

[Website](https://casperflow.vercel.app) · [Twitter](https://twitter.com/casperflow) · [Discord](https://discord.gg/casperflow)

</div>
