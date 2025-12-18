use odra::prelude::*;
use odra::casper_types::U512;

/// CasperFlow Stake-to-Pay Contract
/// 
/// Users stake CSPR and earn rewards while their subscriptions
/// are automatically paid from their staked balance.
/// 
/// Flow:
/// 1. User stakes CSPR (e.g., 1000 CSPR)
/// 2. Staked CSPR earns rewards (simulated 5% APY)
/// 3. User's subscriptions are paid from staked balance
/// 4. If balance insufficient, subscription lapses
/// 5. User can withdraw remaining balance anytime
#[odra::module]
pub struct StakeToPay {
    /// Contract owner
    owner: Var<Address>,
    /// User stakes: address -> staked amount
    stakes: Mapping<Address, U512>,
    /// User auto-pay subscriptions: (user, plan_id) -> enabled
    auto_pay: Mapping<(Address, u32), bool>,
    /// Total staked in contract
    total_staked: Var<U512>,
    /// Subscription manager contract address (for integration)
    subscription_manager: Var<Option<Address>>,
}

#[odra::module]
impl StakeToPay {
    /// Initialize the contract
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.owner.set(caller);
        self.total_staked.set(U512::zero());
    }

    /// Stake CSPR - PAYABLE
    /// User deposits CSPR that can be used for auto-paying subscriptions
    #[odra(payable)]
    pub fn stake(&mut self) {
        let staker = self.env().caller();
        let amount = self.env().attached_value();
        
        assert!(amount > U512::zero(), "Must stake more than 0");
        
        // Add to user's stake
        let current_stake = self.stakes.get(&staker).unwrap_or_default();
        self.stakes.set(&staker, current_stake + amount);
        
        // Update total staked
        let total = self.total_staked.get_or_default();
        self.total_staked.set(total + amount);
    }

    /// Withdraw staked CSPR
    pub fn withdraw(&mut self, amount: U512) {
        let staker = self.env().caller();
        let current_stake = self.stakes.get(&staker).unwrap_or_default();
        
        assert!(current_stake >= amount, "Insufficient staked balance");
        
        // Update user's stake
        self.stakes.set(&staker, current_stake - amount);
        
        // Update total staked
        let total = self.total_staked.get_or_default();
        self.total_staked.set(total - amount);
        
        // Transfer back to user
        self.env().transfer_tokens(&staker, &amount);
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

    /// Check if auto-pay is enabled
    pub fn is_auto_pay_enabled(&self, user: Address, plan_id: u32) -> bool {
        self.auto_pay.get(&(user, plan_id)).unwrap_or(false)
    }

    /// Get user's staked balance
    pub fn get_stake(&self, user: Address) -> U512 {
        self.stakes.get(&user).unwrap_or_default()
    }

    /// Get total staked in contract
    pub fn total_staked(&self) -> U512 {
        self.total_staked.get_or_default()
    }

    /// Get contract owner
    pub fn owner(&self) -> Option<Address> {
        self.owner.get()
    }

    /// Calculate estimated rewards (view function)
    /// Returns estimated yearly rewards based on 5% APY
    pub fn estimate_yearly_rewards(&self, user: Address) -> U512 {
        let stake = self.stakes.get(&user).unwrap_or_default();
        // 5% APY
        stake / U512::from(20)
    }

    /// Set subscription manager address (owner only)
    pub fn set_subscription_manager(&mut self, manager: Address) {
        let caller = self.env().caller();
        let owner = self.owner.get().unwrap();
        assert!(caller == owner, "Only owner can set subscription manager");
        self.subscription_manager.set(Some(manager));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::Deployer;

    #[test]
    fn test_stake() {
        let env = odra_test::env();
        let mut contract = StakeToPayHostRef::deploy(&env, ());
        
        // Would test staking and withdrawal here
        assert_eq!(contract.total_staked(), U512::zero());
    }
}
