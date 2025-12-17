//! CasperFlow Smart Contracts
//!
//! On-chain subscription and metered billing protocol for Casper blockchain.
//!
//! ## Contracts
//!
//! - [`SubscriptionManager`] - Manage subscription plans and user subscriptions
//! - [`UsageMeter`] - Track and record API/compute usage metrics  
//! - [`BillingEngine`] - Calculate and process billing (base + usage)
//! - [`StakeToPay`] - Pay subscriptions using staking rewards
//!
//! ## Architecture
//!
//! ```text
//! ┌─────────────────────────────────────────────────────────────────┐
//! │                        CasperFlow Protocol                       │
//! ├─────────────────┬─────────────────┬───────────────┬─────────────┤
//! │  Subscription   │   Usage Meter   │   Billing     │  Stake-to   │
//! │    Manager      │                 │   Engine      │    Pay      │
//! ├─────────────────┴─────────────────┴───────────────┴─────────────┤
//! │                     Casper Blockchain                            │
//! └─────────────────────────────────────────────────────────────────┘
//! ```
//!
//! ## Flow
//!
//! 1. Merchant creates a plan via `SubscriptionManager::create_plan`
//! 2. User subscribes via `SubscriptionManager::subscribe`
//! 3. Merchant's backend records usage via `UsageMeter::record_usage`
//! 4. At billing cycle end, `BillingEngine::create_invoice` generates invoice
//! 5. User pays via wallet or `StakeToPay::pay_invoice_from_rewards`

#![no_std]

extern crate alloc;

pub mod subscription_manager;
pub mod usage_meter;
pub mod billing_engine;
pub mod stake_to_pay;

pub use subscription_manager::SubscriptionManager;
pub use usage_meter::UsageMeter;
pub use billing_engine::BillingEngine;
pub use stake_to_pay::StakeToPay;
