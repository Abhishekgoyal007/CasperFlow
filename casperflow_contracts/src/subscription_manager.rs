use odra::prelude::*;
use odra::casper_types::U512;

/// CasperFlow Subscription Manager Contract
/// Manages on-chain subscription billing on Casper blockchain
#[odra::module]
pub struct SubscriptionManager {
    /// Contract owner
    owner: Var<Address>,
    /// Subscription plans: plan_id -> (price_in_motes, period_in_seconds)
    plan_prices: Mapping<u32, U512>,
    plan_periods: Mapping<u32, u64>,
    plan_names: Mapping<u32, String>,
    /// Active subscriptions: (subscriber, plan_id) -> expiry_timestamp
    subscriptions: Mapping<(Address, u32), u64>,
    /// Total plans count
    plan_count: Var<u32>,
    /// Total revenue collected
    total_revenue: Var<U512>,
}

#[odra::module]
impl SubscriptionManager {
    /// Initialize the contract
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.owner.set(caller);
        self.plan_count.set(0);
        self.total_revenue.set(U512::zero());
    }

    /// Create a new subscription plan (merchant only)
    pub fn create_plan(&mut self, price: U512, period_seconds: u64, name: String) -> u32 {
        let plan_id = self.plan_count.get_or_default() + 1;
        self.plan_prices.set(&plan_id, price);
        self.plan_periods.set(&plan_id, period_seconds);
        self.plan_names.set(&plan_id, name);
        self.plan_count.set(plan_id);
        plan_id
    }

    /// Subscribe to a plan
    pub fn subscribe(&mut self, plan_id: u32) {
        let subscriber = self.env().caller();
        let attached_value = self.env().attached_value();
        
        let price = self.plan_prices.get(&plan_id).unwrap_or_default();
        let period = self.plan_periods.get(&plan_id).unwrap_or_default();
        
        // Check payment amount
        assert!(attached_value >= price, "Insufficient payment");
        
        // Calculate expiry
        let current_time = self.env().get_block_time();
        let existing_expiry = self.subscriptions.get(&(subscriber, plan_id)).unwrap_or(0);
        let new_expiry = if existing_expiry > current_time {
            existing_expiry + period
        } else {
            current_time + period
        };
        
        // Save subscription
        self.subscriptions.set(&(subscriber, plan_id), new_expiry);
        
        // Update revenue
        let current_revenue = self.total_revenue.get_or_default();
        self.total_revenue.set(current_revenue + price);
    }

    /// Check if a subscription is active
    pub fn is_subscribed(&self, subscriber: Address, plan_id: u32) -> bool {
        let expiry = self.subscriptions.get(&(subscriber, plan_id)).unwrap_or(0);
        let current_time = self.env().get_block_time();
        expiry > current_time
    }

    /// Get subscription expiry timestamp
    pub fn get_expiry(&self, subscriber: Address, plan_id: u32) -> u64 {
        self.subscriptions.get(&(subscriber, plan_id)).unwrap_or(0)
    }

    /// Get plan price
    pub fn get_plan_price(&self, plan_id: u32) -> U512 {
        self.plan_prices.get(&plan_id).unwrap_or_default()
    }

    /// Get plan period
    pub fn get_plan_period(&self, plan_id: u32) -> u64 {
        self.plan_periods.get(&plan_id).unwrap_or_default()
    }

    /// Get total number of plans
    pub fn plan_count(&self) -> u32 {
        self.plan_count.get_or_default()
    }

    /// Get total revenue
    pub fn total_revenue(&self) -> U512 {
        self.total_revenue.get_or_default()
    }

    /// Get contract owner
    pub fn owner(&self) -> Option<Address> {
        self.owner.get()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::Deployer;

    #[test]
    fn test_create_plan() {
        let env = odra_test::env();
        let mut contract = SubscriptionManagerHostRef::deploy(&env, ());
        
        let plan_id = contract.create_plan(
            U512::from(100_000_000_000u64), // 100 CSPR
            2592000, // 30 days
            "Pro Plan".to_string()
        );
        
        assert_eq!(plan_id, 1);
        assert_eq!(contract.plan_count(), 1);
    }
}
