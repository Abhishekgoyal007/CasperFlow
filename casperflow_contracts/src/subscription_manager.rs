use odra::prelude::*;
use odra::casper_types::U512;

/// CasperFlow Subscription Manager Contract
/// Manages on-chain subscription billing on Casper blockchain
#[odra::module]
pub struct SubscriptionManager {
    /// Contract owner
    owner: Var<Address>,
    /// Subscription plans: plan_id -> price in motes
    plan_prices: Mapping<u32, U512>,
    /// Subscription plans: plan_id -> period in seconds
    plan_periods: Mapping<u32, u64>,
    /// Subscription plans: plan_id -> name
    plan_names: Mapping<u32, String>,
    /// Subscription plans: plan_id -> merchant address
    plan_merchants: Mapping<u32, Address>,
    /// Active subscriptions: (subscriber, plan_id) -> expiry_timestamp
    subscriptions: Mapping<(Address, u32), u64>,
    /// Subscriber count per plan
    plan_subscribers: Mapping<u32, u32>,
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

    /// Create a new subscription plan
    /// Returns the new plan ID
    pub fn create_plan(&mut self, price: U512, period_seconds: u64, name: String) -> u32 {
        let merchant = self.env().caller();
        let plan_id = self.plan_count.get_or_default() + 1;
        
        self.plan_prices.set(&plan_id, price);
        self.plan_periods.set(&plan_id, period_seconds);
        self.plan_names.set(&plan_id, name);
        self.plan_merchants.set(&plan_id, merchant);
        self.plan_subscribers.set(&plan_id, 0);
        self.plan_count.set(plan_id);
        
        plan_id
    }

    /// Subscribe to a plan - PAYABLE
    /// User must send the plan price in CSPR
    #[odra(payable)]
    pub fn subscribe(&mut self, plan_id: u32) {
        let subscriber = self.env().caller();
        let attached_value = self.env().attached_value();
        
        let price = self.plan_prices.get(&plan_id).unwrap_or_default();
        let period = self.plan_periods.get(&plan_id).unwrap_or_default();
        
        // Validate plan exists
        assert!(price > U512::zero(), "Plan does not exist");
        
        // Check payment amount
        assert!(attached_value >= price, "Insufficient payment");
        
        // Calculate expiry
        let current_time = self.env().get_block_time();
        let existing_expiry = self.subscriptions.get(&(subscriber, plan_id)).unwrap_or(0);
        let new_expiry = if existing_expiry > current_time {
            // Extend existing subscription
            existing_expiry + period
        } else {
            // New subscription
            current_time + period
        };
        
        // Save subscription
        self.subscriptions.set(&(subscriber, plan_id), new_expiry);
        
        // Update subscriber count (only for new subscriptions)
        if existing_expiry == 0 {
            let current_subs = self.plan_subscribers.get(&plan_id).unwrap_or(0);
            self.plan_subscribers.set(&plan_id, current_subs + 1);
        }
        
        // Update total revenue
        let current_revenue = self.total_revenue.get_or_default();
        self.total_revenue.set(current_revenue + price);
        
        // Transfer payment to merchant
        let merchant = self.plan_merchants.get(&plan_id).unwrap();
        self.env().transfer_tokens(&merchant, &price);
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

    /// Get plan details
    pub fn get_plan_price(&self, plan_id: u32) -> U512 {
        self.plan_prices.get(&plan_id).unwrap_or_default()
    }

    pub fn get_plan_period(&self, plan_id: u32) -> u64 {
        self.plan_periods.get(&plan_id).unwrap_or_default()
    }

    pub fn get_plan_name(&self, plan_id: u32) -> String {
        self.plan_names.get(&plan_id).unwrap_or_default()
    }

    pub fn get_plan_merchant(&self, plan_id: u32) -> Option<Address> {
        self.plan_merchants.get(&plan_id)
    }

    pub fn get_plan_subscribers(&self, plan_id: u32) -> u32 {
        self.plan_subscribers.get(&plan_id).unwrap_or(0)
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
