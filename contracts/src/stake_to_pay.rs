//! Stake-to-Pay Contract
//!
//! Enables users to pay subscriptions using staking rewards instead of their wallet.
//! This is a key differentiator for CasperFlow - users keep their tokens staked
//! while still accessing premium services.
//!
//! Key features:
//! - Delegate staking to approved validators
//! - Pay invoices from staking rewards
//! - Keep principal staked, only use rewards

use odra::prelude::*;
use odra::{casper_types::U256, Address, Mapping, Var};

/// User's stake-to-pay configuration
#[odra::odra_type]
pub struct StakeConfig {
    /// User address
    pub user: Address,
    /// Amount of CSPR staked
    pub staked_amount: U256,
    /// Accumulated rewards (not yet paid out)
    pub accumulated_rewards: U256,
    /// Total rewards used for payments
    pub total_rewards_used: U256,
    /// Whether stake-to-pay is enabled for this user
    pub is_enabled: bool,
    /// Last reward update timestamp
    pub last_updated: u64,
}

/// Payment made from staking rewards
#[odra::odra_type]
pub struct StakePayment {
    /// Payment ID
    pub id: U256,
    /// User who made payment
    pub user: Address,
    /// Invoice ID that was paid
    pub invoice_id: U256,
    /// Amount paid from rewards
    pub amount: U256,
    /// Timestamp
    pub paid_at: u64,
}

/// Events
pub mod events {
    use super::*;

    #[odra::event]
    pub struct StakeDeposited {
        pub user: Address,
        pub amount: U256,
        pub total_staked: U256,
    }

    #[odra::event]
    pub struct StakeWithdrawn {
        pub user: Address,
        pub amount: U256,
        pub remaining: U256,
    }

    #[odra::event]
    pub struct RewardsAccumulated {
        pub user: Address,
        pub amount: U256,
        pub total_rewards: U256,
    }

    #[odra::event]
    pub struct PaymentFromRewards {
        pub user: Address,
        pub invoice_id: U256,
        pub amount: U256,
        pub remaining_rewards: U256,
    }

    #[odra::event]
    pub struct StakeToPayEnabled {
        pub user: Address,
    }

    #[odra::event]
    pub struct StakeToPayDisabled {
        pub user: Address,
    }
}

/// Stake-to-Pay Contract
#[odra::module(events = [
    events::StakeDeposited,
    events::StakeWithdrawn,
    events::RewardsAccumulated,
    events::PaymentFromRewards,
    events::StakeToPayEnabled,
    events::StakeToPayDisabled
])]
pub struct StakeToPay {
    /// Contract owner
    owner: Var<Address>,
    /// BillingEngine contract address
    billing_engine: Var<Option<Address>>,
    /// User -> StakeConfig
    stake_configs: Mapping<Address, StakeConfig>,
    /// Payment counter
    payment_counter: Var<U256>,
    /// Payment ID -> StakePayment
    payments: Mapping<U256, StakePayment>,
    /// User -> list of payment IDs
    user_payments: Mapping<Address, Vec<U256>>,
    /// Total staked across all users
    total_staked: Var<U256>,
    /// Total rewards distributed
    total_rewards: Var<U256>,
    /// Simulated annual percentage yield (APY) in basis points (e.g., 800 = 8%)
    apy_bps: Var<u64>,
}

#[odra::module]
impl StakeToPay {
    /// Initialize the contract
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.owner.set(caller);
        self.payment_counter.set(U256::zero());
        self.total_staked.set(U256::zero());
        self.total_rewards.set(U256::zero());
        self.apy_bps.set(800); // 8% default APY
    }

    // ============ USER FUNCTIONS ============

    /// Deposit CSPR for stake-to-pay
    #[odra(payable)]
    pub fn deposit(&mut self) {
        let caller = self.env().caller();
        let amount = self.env().attached_value();
        
        assert!(amount > U256::zero(), "Must deposit some amount");

        let mut config = self.stake_configs.get(&caller).unwrap_or(StakeConfig {
            user: caller,
            staked_amount: U256::zero(),
            accumulated_rewards: U256::zero(),
            total_rewards_used: U256::zero(),
            is_enabled: true,
            last_updated: self.env().get_block_time(),
        });

        // Accumulate any pending rewards before updating
        self.accumulate_rewards(&mut config);

        config.staked_amount = config.staked_amount + amount;
        config.last_updated = self.env().get_block_time();
        self.stake_configs.set(&caller, config.clone());

        // Update total staked
        let current_total = self.total_staked.get_or_default();
        self.total_staked.set(current_total + amount);

        self.env().emit_event(events::StakeDeposited {
            user: caller,
            amount,
            total_staked: config.staked_amount,
        });
    }

    /// Withdraw staked CSPR
    pub fn withdraw(&mut self, amount: U256) {
        let caller = self.env().caller();
        
        let mut config = self.stake_configs.get(&caller).expect("No stake found");
        
        // Accumulate any pending rewards
        self.accumulate_rewards(&mut config);
        
        assert!(config.staked_amount >= amount, "Insufficient staked amount");

        config.staked_amount = config.staked_amount - amount;
        config.last_updated = self.env().get_block_time();
        self.stake_configs.set(&caller, config.clone());

        // Update total staked
        let current_total = self.total_staked.get_or_default();
        self.total_staked.set(current_total - amount);

        // Transfer back to user
        self.env().transfer_tokens(&caller, &amount);

        self.env().emit_event(events::StakeWithdrawn {
            user: caller,
            amount,
            remaining: config.staked_amount,
        });
    }

    /// Withdraw accumulated rewards
    pub fn withdraw_rewards(&mut self, amount: U256) {
        let caller = self.env().caller();
        
        let mut config = self.stake_configs.get(&caller).expect("No stake found");
        
        // Accumulate any pending rewards
        self.accumulate_rewards(&mut config);
        
        assert!(config.accumulated_rewards >= amount, "Insufficient rewards");

        config.accumulated_rewards = config.accumulated_rewards - amount;
        config.last_updated = self.env().get_block_time();
        self.stake_configs.set(&caller, config);

        self.env().transfer_tokens(&caller, &amount);
    }

    /// Enable stake-to-pay for user
    pub fn enable_stake_to_pay(&mut self) {
        let caller = self.env().caller();
        
        let mut config = self.stake_configs.get(&caller).expect("No stake found");
        config.is_enabled = true;
        self.stake_configs.set(&caller, config);

        self.env().emit_event(events::StakeToPayEnabled { user: caller });
    }

    /// Disable stake-to-pay for user
    pub fn disable_stake_to_pay(&mut self) {
        let caller = self.env().caller();
        
        let mut config = self.stake_configs.get(&caller).expect("No stake found");
        config.is_enabled = false;
        self.stake_configs.set(&caller, config);

        self.env().emit_event(events::StakeToPayDisabled { user: caller });
    }

    // ============ PAYMENT FUNCTIONS ============

    /// Pay an invoice using staking rewards
    pub fn pay_invoice_from_rewards(&mut self, invoice_id: U256, amount: U256, merchant: Address) {
        let caller = self.env().caller();
        
        let mut config = self.stake_configs.get(&caller).expect("No stake found");
        assert!(config.is_enabled, "Stake-to-pay is disabled");
        
        // Accumulate pending rewards
        self.accumulate_rewards(&mut config);
        
        assert!(
            config.accumulated_rewards >= amount,
            "Insufficient rewards for payment"
        );

        // Deduct from rewards
        config.accumulated_rewards = config.accumulated_rewards - amount;
        config.total_rewards_used = config.total_rewards_used + amount;
        config.last_updated = self.env().get_block_time();
        self.stake_configs.set(&caller, config.clone());

        // Record payment
        let payment_id = self.payment_counter.get_or_default() + 1;
        self.payment_counter.set(payment_id);

        let payment = StakePayment {
            id: payment_id,
            user: caller,
            invoice_id,
            amount,
            paid_at: self.env().get_block_time(),
        };
        self.payments.set(&payment_id, payment);

        // Add to user's payments
        let mut user_payment_list = self.user_payments.get(&caller).unwrap_or_default();
        user_payment_list.push(payment_id);
        self.user_payments.set(&caller, user_payment_list);

        // Transfer to merchant (minus protocol fee - handled by BillingEngine)
        self.env().transfer_tokens(&merchant, &amount);

        // Notify BillingEngine
        // Note: In production, this would call billing_engine.pay_invoice_from_staking()

        self.env().emit_event(events::PaymentFromRewards {
            user: caller,
            invoice_id,
            amount,
            remaining_rewards: config.accumulated_rewards,
        });
    }

    // ============ INTERNAL FUNCTIONS ============

    /// Accumulate rewards based on staked amount and time elapsed
    fn accumulate_rewards(&mut self, config: &mut StakeConfig) {
        let now = self.env().get_block_time();
        let elapsed = now - config.last_updated;
        
        if elapsed == 0 || config.staked_amount == U256::zero() {
            return;
        }

        // Calculate rewards: (staked * APY * elapsed) / (365 days * 10000)
        let apy = self.apy_bps.get_or_default();
        let seconds_per_year: u64 = 31_536_000;
        
        let rewards = (config.staked_amount * U256::from(apy) * U256::from(elapsed)) 
            / (U256::from(seconds_per_year) * U256::from(10000));
        
        if rewards > U256::zero() {
            config.accumulated_rewards = config.accumulated_rewards + rewards;
            
            // Update total rewards
            let total = self.total_rewards.get_or_default();
            self.total_rewards.set(total + rewards);

            self.env().emit_event(events::RewardsAccumulated {
                user: config.user,
                amount: rewards,
                total_rewards: config.accumulated_rewards,
            });
        }
    }

    /// Force update rewards for a user (callable by anyone to update before actions)
    pub fn update_rewards(&mut self, user: Address) {
        let mut config = self.stake_configs.get(&user).expect("No stake found");
        self.accumulate_rewards(&mut config);
        config.last_updated = self.env().get_block_time();
        self.stake_configs.set(&user, config);
    }

    // ============ VIEW FUNCTIONS ============

    /// Get stake configuration for a user
    pub fn get_stake_config(&self, user: Address) -> Option<StakeConfig> {
        self.stake_configs.get(&user)
    }

    /// Get available rewards for a user (including pending)
    pub fn get_available_rewards(&self, user: Address) -> U256 {
        let config = self.stake_configs.get(&user);
        if let Some(config) = config {
            let now = self.env().get_block_time();
            let elapsed = now - config.last_updated;
            
            // Calculate pending rewards
            let apy = self.apy_bps.get_or_default();
            let seconds_per_year: u64 = 31_536_000;
            
            let pending_rewards = (config.staked_amount * U256::from(apy) * U256::from(elapsed)) 
                / (U256::from(seconds_per_year) * U256::from(10000));
            
            config.accumulated_rewards + pending_rewards
        } else {
            U256::zero()
        }
    }

    /// Get payment details
    pub fn get_payment(&self, payment_id: U256) -> Option<StakePayment> {
        self.payments.get(&payment_id)
    }

    /// Get all payments for a user
    pub fn get_user_payments(&self, user: Address) -> Vec<U256> {
        self.user_payments.get(&user).unwrap_or_default()
    }

    /// Get total staked across all users
    pub fn get_total_staked(&self) -> U256 {
        self.total_staked.get_or_default()
    }

    /// Get current APY
    pub fn get_apy_bps(&self) -> u64 {
        self.apy_bps.get_or_default()
    }

    // ============ ADMIN FUNCTIONS ============

    /// Set BillingEngine address
    pub fn set_billing_engine(&mut self, address: Address) {
        assert!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        self.billing_engine.set(Some(address));
    }

    /// Set APY (owner only)
    pub fn set_apy_bps(&mut self, apy: u64) {
        assert!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        assert!(apy <= 2000, "APY too high"); // Max 20%
        self.apy_bps.set(apy);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::Deployer;

    #[test]
    fn test_deposit() {
        let env = odra_test::env();
        let mut contract = StakeToPayHostRef::deploy(&env, NoArgs);
        
        env.set_attached_value(U256::from(1000_000_000_000u64)); // 1000 CSPR
        contract.deposit();

        let user = env.get_account(0);
        let config = contract.get_stake_config(user).unwrap();
        
        assert_eq!(config.staked_amount, U256::from(1000_000_000_000u64));
        assert!(config.is_enabled);
    }

    #[test]
    fn test_rewards_accumulation() {
        let env = odra_test::env();
        let mut contract = StakeToPayHostRef::deploy(&env, NoArgs);
        
        // Deposit 1000 CSPR
        env.set_attached_value(U256::from(1000_000_000_000u64));
        contract.deposit();

        let user = env.get_account(0);
        
        // Fast forward 1 year
        env.advance_block_time_by(31_536_000);
        
        // Check rewards (should be ~8% of 1000 = 80 CSPR)
        let rewards = contract.get_available_rewards(user);
        assert!(rewards > U256::from(79_000_000_000u64)); // Allow some variance
        assert!(rewards < U256::from(81_000_000_000u64));
    }
}
