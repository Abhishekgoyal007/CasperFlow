# CasperFlow

<div align="center">

![CasperFlow](https://img.shields.io/badge/CasperFlow-On--Chain%20Subscriptions-red?style=for-the-badge)
![Casper](https://img.shields.io/badge/Casper-Blockchain-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Testnet-green?style=for-the-badge)

**The first protocol enabling usage-based billing and subscription management on the Casper blockchain.**

[Live Demo](https://casperflow.vercel.app) · [Documentation](./docs/SDK.md) · [Contracts](./casperflow_contracts)

</div>

---

## 🎯 Problem

Traditional subscription billing has fundamental issues:
- **High fees**: Credit card processors charge 2.9% + $0.30 per transaction
- **No transparency**: Hidden charges and unclear billing cycles
- **Geographic restrictions**: Bank-dependent, excludes global customers
- **No ownership**: Companies can cancel your subscription anytime

## 💡 Solution

CasperFlow brings subscription billing on-chain:
- **Near-zero fees**: Pay only gas costs (~0.01%)
- **100% transparent**: All transactions verifiable on blockchain
- **Borderless**: Anyone with a wallet can subscribe
- **User ownership**: Subscriptions are yours, stored on-chain

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CASPERFLOW ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│   │   FRONTEND   │────▶│   NEXT.js    │────▶│   CASPER    │ │
│   │   (React)    │     │   API Routes │     │   TESTNET   │ │
│   └──────────────┘     └──────────────┘     └─────────────┘ │
│          │                    │                    │        │
│          ▼                    ▼                    ▼        │
│   ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│   │   Casper     │     │  /api/verify │     │   Smart     │ │
│   │   Wallet     │     │  /api/plans  │     │  Contracts  │ │
│   └──────────────┘     └──────────────┘     └─────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📜 Deployed Contracts

| Contract | Network | Deploy Hash | Status |
|----------|---------|-------------|--------|
| Flipper (Test) | Testnet | `629ac8f710fd969e8b4ddcb2fc4d7d14f91792aef98643c0d932fbe2e49152b8` | ✅ Verified |
| SubscriptionManager | Testnet | `55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143` | ✅ Verified |

View on explorer: [testnet.cspr.live](https://testnet.cspr.live/deploy/55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143)

---

## ✨ Features

### For Merchants
- ✅ Create subscription plans with custom pricing
- ✅ Track subscribers and revenue
- ✅ Download invoices
- ✅ Usage analytics dashboard
- ✅ Real-time notifications

### For Users
- ✅ Browse and subscribe to plans
- ✅ Pay with CSPR (real on-chain transactions)
- ✅ Receive API keys for service access
- ✅ Manage subscriptions
- ✅ View usage and invoices

### For Developers
- ✅ REST API for subscription verification
- ✅ JavaScript SDK documentation
- ✅ Webhook events (coming soon)
- ✅ On-chain data verification

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- [Casper Wallet](https://chrome.google.com/webstore/detail/casper-wallet) browser extension
- Test CSPR from [faucet](https://testnet.cspr.live/tools/faucet)

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhishekgoyal007/CasperFlow.git
cd CasperFlow

# Install frontend dependencies
cd frontend
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Integration

### Verify Subscription

```bash
# Check if an API key is valid
curl "https://casperflow.vercel.app/api/verify?apiKey=cf_sk_xxx"
```

**Response:**
```json
{
    "valid": true,
    "planName": "Pro API",
    "expiresAt": 1708012800000,
    "network": "testnet"
}
```

### List Plans

```bash
curl "https://casperflow.vercel.app/api/plans"
```

### Example Integration (Express.js)

```javascript
async function requireSubscription(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    const response = await fetch(
        `https://casperflow.vercel.app/api/verify?apiKey=${apiKey}`
    );
    const data = await response.json();
    
    if (!data.valid) {
        return res.status(403).json({ error: 'Invalid subscription' });
    }
    
    next();
}

app.get('/api/protected', requireSubscription, handler);
```

See full documentation: [docs/SDK.md](./docs/SDK.md)

---

## 📁 Project Structure

```
CasperFlow/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   │   ├── api/         # API routes (verify, plans)
│   │   │   ├── app/         # Dashboard pages
│   │   │   └── page.tsx     # Landing page
│   │   ├── components/      # React components
│   │   ├── context/         # React contexts (Wallet, Plans, etc.)
│   │   └── lib/             # Utilities (casper.ts)
│   └── package.json
├── casperflow_contracts/    # Rust smart contracts (Odra)
│   ├── src/
│   │   ├── flipper.rs       # Test contract
│   │   └── subscription_manager.rs  # Main subscription contract
│   ├── Cargo.toml
│   └── Odra.toml
├── docs/                    # Documentation
│   └── SDK.md              # Developer SDK guide
└── README.md
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

---

## 📊 Demo Flow

1. **Connect Wallet** - Link your Casper Wallet (testnet)
2. **Create Plan** (Merchant) - Set name, price, billing period
3. **Browse Plans** (User) - View available subscriptions
4. **Subscribe** - Pay with CSPR, get API key
5. **Verify** - Use API to check subscription status
6. **Manage** - View usage, invoices, cancel anytime

---

## 🔮 Roadmap

- [x] Core subscription management
- [x] Wallet integration
- [x] API verification endpoint
- [x] Usage tracking
- [x] Invoice generation
- [ ] Stake-to-Pay (pay subscriptions from staking yield)
- [ ] Webhooks for real-time events
- [ ] Cross-chain settlements
- [ ] Full SDK package (npm)

---

## 🏆 Built For

**Casper Hackathon 2024**

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

---

<div align="center">

**Built with ❤️ on Casper**

[Website](https://casperflow.vercel.app) · [Twitter](https://twitter.com/casperflow) · [Discord](https://discord.gg/casperflow)

</div>
