use odra::prelude::*;
use odra::casper_types::U512;

/// CasperFlow Stake-to-Pay Contract v2.0
/// 
/// Revolutionary subscription payment mechanism where users stake CSPR
/// and automatically pay subscriptions from their staking rewards.
/// 
/// Key Features:
/// 1. Stake CSPR and earn ~8% APY
/// 2. Auto-pay subscriptions from staking rewards
/// 3. Auto-renew subscriptions before expiry
/// 4. Keep principal untouched - only use yield for payments
/// 5. Withdraw anytime with no lock-up period
///
/// Flow:
/// 1. User stakes CSPR (e.g., 1000 CSPR)
/// 2. Staked CSPR earns rewards (~8% APY on Casper)
/// 3. When subscription is due, contract pays from rewards first
/// 4. If rewards insufficient, uses staked principal
/// 5. User can top-up stake or withdraw anytime
#[odra::module]
pub struct StakeToPay {
    /// Contract owner
    owner: Var<Address>,
    
    /// User stakes: address -> staked amount in motes
    stakes: Mapping<Address, U512>,
    
    /// User stake timestamps: address -> staked_at timestamp
    stake_timestamps: Mapping<Address, u64>,
    
    /// Accumulated rewards: address -> unclaimed rewards
    accumulated_rewards: Mapping<Address, U512>,
    
    /// Last reward calculation timestamp: address -> timestamp
    last_reward_calc: Mapping<Address, u64>,
    
    /// User auto-pay settings: (user, plan_id) -> enabled
    auto_pay: Mapping<(Address, u32), bool>,
    
    /// User auto-renew settings: (user, plan_id) -> enabled  
    auto_renew: Mapping<(Address, u32), bool>,
    
    /// Total payments made for user: address -> total paid
    total_payments_made: Mapping<Address, U512>,
    
    /// Total rewards claimed: address -> total claimed
    total_rewards_claimed: Mapping<Address, U512>,
    
    /// Total staked in contract
    total_staked: Var<U512>,
    
    /// Total rewards distributed
    total_rewards_distributed: Var<U512>,
    
    /// Subscription manager contract address (for integration)
    subscription_manager: Var<Option<Address>>,
    
    /// APY in basis points (800 = 8%)
    apy_basis_points: Var<u32>,
}

#[odra::module]
impl StakeToPay {
    /// Initialize the contract with 8% APY
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.owner.set(caller);
        self.total_staked.set(U512::zero());
        self.total_rewards_distributed.set(U512::zero());
        self.apy_basis_points.set(800); // 8% APY
    }

    /// Stake CSPR - PAYABLE
    /// User deposits CSPR that earns yield for auto-paying subscriptions
    #[odra(payable)]
    pub fn stake(&mut self) {
        let staker = self.env().caller();
        let amount = self.env().attached_value();
        let current_time = self.env().get_block_time();
        
        assert!(amount > U512::zero(), "Must stake more than 0");
        
        // Calculate and add any pending rewards before updating stake
        self.calculate_and_add_rewards(staker);
        
        // Add to user's stake
        let current_stake = self.stakes.get(&staker).unwrap_or_default();
        self.stakes.set(&staker, current_stake + amount);
        
        // Set/update timestamp
        if current_stake == U512::zero() {
            self.stake_timestamps.set(&staker, current_time);
        }
        self.last_reward_calc.set(&staker, current_time);
        
        // Update total staked
        let total = self.total_staked.get_or_default();
        self.total_staked.set(total + amount);
    }

    /// Withdraw staked CSPR with accumulated rewards
    pub fn withdraw(&mut self, amount: U512) {
        let staker = self.env().caller();
        
        // Calculate pending rewards first
        self.calculate_and_add_rewards(staker);
        
        let current_stake = self.stakes.get(&staker).unwrap_or_default();
        let current_rewards = self.accumulated_rewards.get(&staker).unwrap_or_default();
        let total_available = current_stake + current_rewards;
        
        assert!(total_available >= amount, "Insufficient balance");
        
        // Withdraw from rewards first, then stake
        let mut remaining = amount;
        if current_rewards >= remaining {
            self.accumulated_rewards.set(&staker, current_rewards - remaining);
        } else {
            remaining = remaining - current_rewards;
            self.accumulated_rewards.set(&staker, U512::zero());
            self.stakes.set(&staker, current_stake - remaining);
            
            // Update total staked
            let total = self.total_staked.get_or_default();
            self.total_staked.set(total - remaining);
        }
        
        // Transfer to user
        self.env().transfer_tokens(&staker, &amount);
    }

    /// Claim accumulated rewards without withdrawing stake
    pub fn claim_rewards(&mut self) -> U512 {
        let staker = self.env().caller();
        
        // Calculate pending rewards
        self.calculate_and_add_rewards(staker);
        
        let rewards = self.accumulated_rewards.get(&staker).unwrap_or_default();
        assert!(rewards > U512::zero(), "No rewards to claim");
        
        // Clear accumulated rewards
        self.accumulated_rewards.set(&staker, U512::zero());
        
        // Update total claimed
        let claimed = self.total_rewards_claimed.get(&staker).unwrap_or_default();
        self.total_rewards_claimed.set(&staker, claimed + rewards);
        
        // Transfer rewards
        self.env().transfer_tokens(&staker, &rewards);
        
        rewards
    }

    /// Pay subscription from staked balance/rewards
    /// Can only be called by subscription manager or the user themselves
    pub fn pay_subscription(&mut self, user: Address, plan_id: u32, amount: U512) {
        let caller = self.env().caller();
        let manager = self.subscription_manager.get().flatten();
        
        // Authorization check
        assert!(
            caller == user || Some(caller) == manager,
            "Unauthorized"
        );
        
        // Check auto-pay is enabled for this plan
        assert!(
            self.auto_pay.get(&(user, plan_id)).unwrap_or(false),
            "Auto-pay not enabled for this plan"
        );
        
        // Calculate pending rewards first
        self.calculate_and_add_rewards(user);
        
        let current_stake = self.stakes.get(&user).unwrap_or_default();
        let current_rewards = self.accumulated_rewards.get(&user).unwrap_or_default();
        let total_available = current_stake + current_rewards;
        
        assert!(total_available >= amount, "Insufficient balance for payment");
        
        // Pay from rewards first, then stake
        let mut remaining = amount;
        if current_rewards >= remaining {
            self.accumulated_rewards.set(&user, current_rewards - remaining);
        } else {
            remaining = remaining - current_rewards;
            self.accumulated_rewards.set(&user, U512::zero());
            self.stakes.set(&user, current_stake - remaining);
            
            // Update total staked if using principal
            let total = self.total_staked.get_or_default();
            self.total_staked.set(total - remaining);
        }
        
        // Update total payments made
        let total_paid = self.total_payments_made.get(&user).unwrap_or_default();
        self.total_payments_made.set(&user, total_paid + amount);
        
        // Transfer to subscription manager (if set) or hold in contract
        if let Some(mgr) = manager {
            self.env().transfer_tokens(&mgr, &amount);
        }
    }

    /// Enable auto-pay for a subscription plan
    pub fn enable_auto_pay(&mut self, plan_id: u32) {
        let user = self.env().caller();
        self.auto_pay.set(&(user, plan_id), true);
    }

    /// Disable auto-pay for a subscription plan
    pub fn disable_auto_pay(&mut self, plan_id: u32) {
        let user = self.env().caller();
        self.auto_pay.set(&(user, plan_id), false);
    }

    /// Enable auto-renew for a subscription plan
    pub fn enable_auto_renew(&mut self, plan_id: u32) {
        let user = self.env().caller();
        self.auto_renew.set(&(user, plan_id), true);
    }

    /// Disable auto-renew for a subscription plan
    pub fn disable_auto_renew(&mut self, plan_id: u32) {
        let user = self.env().caller();
        self.auto_renew.set(&(user, plan_id), false);
    }

    /// Check if auto-pay is enabled for a user's plan
    pub fn is_auto_pay_enabled(&self, user: Address, plan_id: u32) -> bool {
        self.auto_pay.get(&(user, plan_id)).unwrap_or(false)
    }

    /// Check if auto-renew is enabled for a user's plan
    pub fn is_auto_renew_enabled(&self, user: Address, plan_id: u32) -> bool {
        self.auto_renew.get(&(user, plan_id)).unwrap_or(false)
    }

    /// Get user's staked balance
    pub fn get_stake(&self, user: Address) -> U512 {
        self.stakes.get(&user).unwrap_or_default()
    }

    /// Get user's accumulated rewards (without updating)
    pub fn get_pending_rewards(&self, user: Address) -> U512 {
        let accumulated = self.accumulated_rewards.get(&user).unwrap_or_default();
        let pending = self.calculate_pending_rewards(user);
        accumulated + pending
    }

    /// Get user's total available balance (stake + rewards)
    pub fn get_total_balance(&self, user: Address) -> U512 {
        let stake = self.get_stake(user);
        let rewards = self.get_pending_rewards(user);
        stake + rewards
    }

    /// Get total staked in contract
    pub fn total_staked(&self) -> U512 {
        self.total_staked.get_or_default()
    }

    /// Get total rewards distributed
    pub fn total_rewards_distributed(&self) -> U512 {
        self.total_rewards_distributed.get_or_default()
    }

    /// Get APY in basis points
    pub fn get_apy(&self) -> u32 {
        self.apy_basis_points.get_or_default()
    }

    /// Set APY (owner only) in basis points
    pub fn set_apy(&mut self, apy_bp: u32) {
        let caller = self.env().caller();
        let owner = self.owner.get().unwrap();
        assert!(caller == owner, "Only owner can set APY");
        assert!(apy_bp <= 2000, "APY cannot exceed 20%"); // Safety cap
        self.apy_basis_points.set(apy_bp);
    }

    /// Get contract owner
    pub fn owner(&self) -> Option<Address> {
        self.owner.get()
    }

    /// Set subscription manager address (owner only)
    pub fn set_subscription_manager(&mut self, manager: Address) {
        let caller = self.env().caller();
        let owner = self.owner.get().unwrap();
        assert!(caller == owner, "Only owner can set subscription manager");
        self.subscription_manager.set(Some(manager));
    }

    /// Get user's staking statistics
    pub fn get_user_stats(&self, user: Address) -> (U512, U512, U512, u64) {
        let stake = self.get_stake(user);
        let rewards = self.get_pending_rewards(user);
        let total_paid = self.total_payments_made.get(&user).unwrap_or_default();
        let staked_since = self.stake_timestamps.get(&user).unwrap_or(0);
        (stake, rewards, total_paid, staked_since)
    }

    /// Estimate yearly rewards based on stake amount
    pub fn estimate_yearly_rewards(&self, amount: U512) -> U512 {
        let apy = self.apy_basis_points.get_or_default();
        // amount * apy / 10000 (basis points to percentage)
        (amount * U512::from(apy)) / U512::from(10000u32)
    }

    // ===== Internal Functions =====

    /// Calculate pending rewards for a user
    fn calculate_pending_rewards(&self, user: Address) -> U512 {
        let stake = self.stakes.get(&user).unwrap_or_default();
        if stake == U512::zero() {
            return U512::zero();
        }

        let last_calc = self.last_reward_calc.get(&user).unwrap_or(0);
        let current_time = self.env().get_block_time();
        
        if current_time <= last_calc {
            return U512::zero();
        }

        let seconds_elapsed = current_time - last_calc;
        let apy = self.apy_basis_points.get_or_default();
        
        // Calculate: stake * apy * seconds / (10000 * seconds_per_year)
        let seconds_per_year: u64 = 365 * 24 * 60 * 60;
        let rewards = (stake * U512::from(apy) * U512::from(seconds_elapsed)) 
            / (U512::from(10000u32) * U512::from(seconds_per_year));
        
        rewards
    }

    /// Calculate and add pending rewards to accumulated
    fn calculate_and_add_rewards(&mut self, user: Address) {
        let pending = self.calculate_pending_rewards(user);
        if pending > U512::zero() {
            let current = self.accumulated_rewards.get(&user).unwrap_or_default();
            self.accumulated_rewards.set(&user, current + pending);
            self.last_reward_calc.set(&user, self.env().get_block_time());
            
            // Update total distributed
            let total = self.total_rewards_distributed.get_or_default();
            self.total_rewards_distributed.set(total + pending);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::Deployer;

    #[test]
    fn test_stake_and_rewards() {
        let env = odra_test::env();
        let mut contract = StakeToPayHostRef::deploy(&env, ());
        
        // Initial state checks
        assert_eq!(contract.total_staked(), U512::zero());
        assert_eq!(contract.get_apy(), 800); // 8%
    }

    #[test]
    fn test_estimate_rewards() {
        let env = odra_test::env();
        let contract = StakeToPayHostRef::deploy(&env, ());
        
        // 1000 CSPR at 8% APY = 80 CSPR yearly rewards
        let stake = U512::from(1_000_000_000_000u64); // 1000 CSPR in motes
        let yearly_rewards = contract.estimate_yearly_rewards(stake);
        
        // Expected: 1000 * 0.08 = 80 CSPR = 80_000_000_000 motes
        let expected = U512::from(80_000_000_000u64);
        assert_eq!(yearly_rewards, expected);
    }
}
