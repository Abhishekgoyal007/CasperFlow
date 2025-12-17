#!/bin/bash

# CasperFlow Contract Deployment Script
# Prerequisites: Rust, cargo-odra, casper wallet with testnet CSPR

set -e

echo "🚀 CasperFlow Contract Deployment"
echo "=================================="

# Check if Odra is installed
if ! command -v cargo-odra &> /dev/null; then
    echo "❌ cargo-odra not found. Installing..."
    cargo install cargo-odra
fi

# Build contracts
echo ""
echo "📦 Building contracts..."
cargo odra build

# Check for wallet key
if [ ! -f "./secret_key.pem" ]; then
    echo ""
    echo "❌ secret_key.pem not found!"
    echo "Please create a Casper wallet and place the secret key at ./secret_key.pem"
    echo ""
    echo "To create a new wallet:"
    echo "  casper-client keygen ."
    echo ""
    exit 1
fi

# Deploy to testnet
echo ""
echo "🌐 Deploying to Casper Testnet..."
echo ""

# Deploy SubscriptionManager
echo "Deploying SubscriptionManager..."
SUBSCRIPTION_MANAGER_HASH=$(cargo odra deploy -n testnet -c SubscriptionManager)
echo "✅ SubscriptionManager deployed: $SUBSCRIPTION_MANAGER_HASH"

# Deploy UsageMeter
echo "Deploying UsageMeter..."
USAGE_METER_HASH=$(cargo odra deploy -n testnet -c UsageMeter)
echo "✅ UsageMeter deployed: $USAGE_METER_HASH"

# Deploy BillingEngine
echo "Deploying BillingEngine..."
BILLING_ENGINE_HASH=$(cargo odra deploy -n testnet -c BillingEngine)
echo "✅ BillingEngine deployed: $BILLING_ENGINE_HASH"

# Deploy StakeToPay
echo "Deploying StakeToPay..."
STAKE_TO_PAY_HASH=$(cargo odra deploy -n testnet -c StakeToPay)
echo "✅ StakeToPay deployed: $STAKE_TO_PAY_HASH"

echo ""
echo "=================================="
echo "🎉 All contracts deployed!"
echo ""
echo "Contract Hashes:"
echo "  SubscriptionManager: $SUBSCRIPTION_MANAGER_HASH"
echo "  UsageMeter:          $USAGE_METER_HASH"
echo "  BillingEngine:       $BILLING_ENGINE_HASH"
echo "  StakeToPay:          $STAKE_TO_PAY_HASH"
echo ""
echo "Next steps:"
echo "  1. Update SDK with contract hashes"
echo "  2. Set contract references (billing_engine, stake_to_pay)"
echo "  3. Run integration tests"
