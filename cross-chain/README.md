# Cross-Chain Payment Module

Enables CasperFlow to accept payments from Ethereum and other EVM chains, 
with settlement on Casper blockchain.

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Ethereum      │         │    Relayer      │         │     Casper      │
│   User Wallet   │────────▶│    Service      │────────▶│   BillingEngine │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │                           │
        │ 1. Pay in ETH/USDC        │ 2. Verify & Bridge        │ 3. Mark Paid
        │                           │                           │
        ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  PaymentBridge  │         │   Oracle/AMM    │         │  On-chain       │
│  Contract (Sol) │         │   Price Feed    │         │  Invoice        │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## Components

### 1. PaymentBridge (Solidity)
Ethereum smart contract that:
- Accepts ETH, USDC, USDT payments
- Emits events for relayer
- Locks funds until confirmation

### 2. Relayer Service (TypeScript)
Off-chain service that:
- Monitors Ethereum for payment events
- Verifies payment amounts with oracle prices
- Calls Casper BillingEngine to mark invoice paid
- Handles retries and error recovery

### 3. Casper Integration
BillingEngine contract modifications for:
- Cross-chain payment verification
- Relayer authorization
- Multi-currency invoice support

## Supported Chains

- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Base

## Supported Tokens

- ETH
- USDC
- USDT
- DAI

## Security

- Multi-sig relayer authorization
- Price oracle verification (Chainlink)
- Payment timeout and refunds
- Replay attack prevention
