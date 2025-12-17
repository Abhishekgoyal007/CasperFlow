//! Subscription Manager Contract
//!
//! Manages subscription plans and user subscriptions for CasperFlow protocol.
//! 
//! Key features:
//! - Merchants can create/update/delete subscription plans
//! - Users can subscribe/unsubscribe to plans
//! - Supports base price + usage-based pricing
//! - Integrates with StakeToPay for staking reward payments

use odra::prelude::*;
use odra::{casper_types::U256, Address, Mapping, Var};

/// Subscription plan created by a merchant
#[odra::odra_type]
pub struct Plan {
    /// Unique identifier for the plan
    pub id: U256,
    /// Merchant who owns this plan
    pub merchant: Address,
    /// Human-readable name
    pub name: String,
    /// Base price per billing cycle (in motes)
    pub base_price: U256,
    /// Price per usage unit (in motes, 0 for fixed-price plans)
    pub usage_price: U256,
    /// Billing cycle duration in seconds (e.g., 2592000 for 30 days)
    pub billing_cycle: u64,
    /// Whether the plan is active
    pub is_active: bool,
    /// Timestamp of creation
    pub created_at: u64,
}

/// User subscription to a plan
#[odra::odra_type]
pub struct Subscription {
    /// The plan this subscription is for
    pub plan_id: U256,
    /// The subscriber's address
    pub subscriber: Address,
    /// Start timestamp
    pub started_at: u64,
    /// Next billing timestamp
    pub next_billing_at: u64,
    /// Whether auto-renew is enabled
    pub auto_renew: bool,
    /// Payment method: 0 = wallet, 1 = staked
    pub payment_method: u8,
    /// Whether subscription is active
    pub is_active: bool,
}

/// Events emitted by the contract
pub mod events {
    use super::*;
    
    #[odra::event]
    pub struct PlanCreated {
        pub plan_id: U256,
        pub merchant: Address,
        pub name: String,
        pub base_price: U256,
    }

    #[odra::event]
    pub struct PlanUpdated {
        pub plan_id: U256,
        pub base_price: U256,
        pub usage_price: U256,
    }

    #[odra::event]
    pub struct PlanDeactivated {
        pub plan_id: U256,
    }

    #[odra::event]
    pub struct Subscribed {
        pub subscription_id: U256,
        pub plan_id: U256,
        pub subscriber: Address,
    }

    #[odra::event]
    pub struct Unsubscribed {
        pub subscription_id: U256,
        pub subscriber: Address,
    }

    #[odra::event]
    pub struct SubscriptionRenewed {
        pub subscription_id: U256,
        pub next_billing_at: u64,
    }
}

/// Subscription Manager Contract
#[odra::module(events = [
    events::PlanCreated,
    events::PlanUpdated,
    events::PlanDeactivated,
    events::Subscribed,
    events::Unsubscribed,
    events::SubscriptionRenewed
])]
pub struct SubscriptionManager {
    /// Contract owner/admin
    owner: Var<Address>,
    /// Counter for plan IDs
    plan_counter: Var<U256>,
    /// Counter for subscription IDs
    subscription_counter: Var<U256>,
    /// Plan ID -> Plan data
    plans: Mapping<U256, Plan>,
    /// Subscription ID -> Subscription data
    subscriptions: Mapping<U256, Subscription>,
    /// (User, Plan) -> Subscription ID (to prevent duplicate subscriptions)
    user_plan_subscription: Mapping<(Address, U256), U256>,
    /// Merchant -> list of plan IDs
    merchant_plans: Mapping<Address, Vec<U256>>,
    /// User -> list of subscription IDs
    user_subscriptions: Mapping<Address, Vec<U256>>,
    /// Address of the BillingEngine contract for billing integration
    billing_engine: Var<Option<Address>>,
    /// Address of the StakeToPay contract for staking payments
    stake_to_pay: Var<Option<Address>>,
}

#[odra::module]
impl SubscriptionManager {
    /// Initialize the contract
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.owner.set(caller);
        self.plan_counter.set(U256::zero());
        self.subscription_counter.set(U256::zero());
    }

    // ============ MERCHANT FUNCTIONS ============

    /// Create a new subscription plan
    pub fn create_plan(
        &mut self,
        name: String,
        base_price: U256,
        usage_price: U256,
        billing_cycle: u64,
    ) -> U256 {
        let merchant = self.env().caller();
        let plan_id = self.plan_counter.get_or_default() + 1;
        self.plan_counter.set(plan_id);

        let plan = Plan {
            id: plan_id,
            merchant,
            name: name.clone(),
            base_price,
            usage_price,
            billing_cycle,
            is_active: true,
            created_at: self.env().get_block_time(),
        };

        self.plans.set(&plan_id, plan);

        // Add to merchant's plans list
        let mut merchant_plan_list = self.merchant_plans.get(&merchant).unwrap_or_default();
        merchant_plan_list.push(plan_id);
        self.merchant_plans.set(&merchant, merchant_plan_list);

        self.env().emit_event(events::PlanCreated {
            plan_id,
            merchant,
            name,
            base_price,
        });

        plan_id
    }

    /// Update an existing plan (only by merchant owner)
    pub fn update_plan(
        &mut self,
        plan_id: U256,
        base_price: U256,
        usage_price: U256,
    ) {
        let caller = self.env().caller();
        let mut plan = self.plans.get(&plan_id).expect("Plan not found");
        
        assert!(plan.merchant == caller, "Only merchant can update plan");

        plan.base_price = base_price;
        plan.usage_price = usage_price;
        self.plans.set(&plan_id, plan);

        self.env().emit_event(events::PlanUpdated {
            plan_id,
            base_price,
            usage_price,
        });
    }

    /// Deactivate a plan (stop accepting new subscriptions)
    pub fn deactivate_plan(&mut self, plan_id: U256) {
        let caller = self.env().caller();
        let mut plan = self.plans.get(&plan_id).expect("Plan not found");
        
        assert!(plan.merchant == caller, "Only merchant can deactivate plan");

        plan.is_active = false;
        self.plans.set(&plan_id, plan);

        self.env().emit_event(events::PlanDeactivated { plan_id });
    }

    // ============ USER FUNCTIONS ============

    /// Subscribe to a plan
    #[odra(payable)]
    pub fn subscribe(
        &mut self,
        plan_id: U256,
        auto_renew: bool,
        payment_method: u8, // 0 = wallet, 1 = staked
    ) -> U256 {
        let subscriber = self.env().caller();
        let plan = self.plans.get(&plan_id).expect("Plan not found");
        
        assert!(plan.is_active, "Plan is not active");
        
        // Check if user already has active subscription to this plan
        if let Some(existing_sub_id) = self.user_plan_subscription.get(&(subscriber, plan_id)) {
            let existing_sub = self.subscriptions.get(&existing_sub_id);
            if let Some(sub) = existing_sub {
                assert!(!sub.is_active, "Already subscribed to this plan");
            }
        }

        // For wallet payment, check that enough payment was sent
        if payment_method == 0 {
            let attached = self.env().attached_value();
            assert!(attached >= plan.base_price, "Insufficient payment");
        }

        let subscription_id = self.subscription_counter.get_or_default() + 1;
        self.subscription_counter.set(subscription_id);

        let now = self.env().get_block_time();
        let subscription = Subscription {
            plan_id,
            subscriber,
            started_at: now,
            next_billing_at: now + plan.billing_cycle,
            auto_renew,
            payment_method,
            is_active: true,
        };

        self.subscriptions.set(&subscription_id, subscription);
        self.user_plan_subscription.set(&(subscriber, plan_id), subscription_id);

        // Add to user's subscriptions list
        let mut user_sub_list = self.user_subscriptions.get(&subscriber).unwrap_or_default();
        user_sub_list.push(subscription_id);
        self.user_subscriptions.set(&subscriber, user_sub_list);

        self.env().emit_event(events::Subscribed {
            subscription_id,
            plan_id,
            subscriber,
        });

        subscription_id
    }

    /// Cancel a subscription
    pub fn unsubscribe(&mut self, subscription_id: U256) {
        let caller = self.env().caller();
        let mut subscription = self.subscriptions.get(&subscription_id).expect("Subscription not found");
        
        assert!(subscription.subscriber == caller, "Only subscriber can unsubscribe");
        assert!(subscription.is_active, "Subscription already inactive");

        subscription.is_active = false;
        subscription.auto_renew = false;
        self.subscriptions.set(&subscription_id, subscription);

        self.env().emit_event(events::Unsubscribed {
            subscription_id,
            subscriber: caller,
        });
    }

    /// Toggle auto-renew for a subscription
    pub fn set_auto_renew(&mut self, subscription_id: U256, auto_renew: bool) {
        let caller = self.env().caller();
        let mut subscription = self.subscriptions.get(&subscription_id).expect("Subscription not found");
        
        assert!(subscription.subscriber == caller, "Only subscriber can modify");

        subscription.auto_renew = auto_renew;
        self.subscriptions.set(&subscription_id, subscription);
    }

    // ============ VIEW FUNCTIONS ============

    /// Get plan details
    pub fn get_plan(&self, plan_id: U256) -> Option<Plan> {
        self.plans.get(&plan_id)
    }

    /// Get subscription details
    pub fn get_subscription(&self, subscription_id: U256) -> Option<Subscription> {
        self.subscriptions.get(&subscription_id)
    }

    /// Get all plans by a merchant
    pub fn get_merchant_plans(&self, merchant: Address) -> Vec<U256> {
        self.merchant_plans.get(&merchant).unwrap_or_default()
    }

    /// Get all subscriptions for a user
    pub fn get_user_subscriptions(&self, user: Address) -> Vec<U256> {
        self.user_subscriptions.get(&user).unwrap_or_default()
    }

    /// Get total number of plans
    pub fn total_plans(&self) -> U256 {
        self.plan_counter.get_or_default()
    }

    /// Get total number of subscriptions
    pub fn total_subscriptions(&self) -> U256 {
        self.subscription_counter.get_or_default()
    }

    // ============ ADMIN FUNCTIONS ============

    /// Set the BillingEngine contract address
    pub fn set_billing_engine(&mut self, address: Address) {
        let caller = self.env().caller();
        assert!(caller == self.owner.get_or_default(), "Only owner");
        self.billing_engine.set(Some(address));
    }

    /// Set the StakeToPay contract address
    pub fn set_stake_to_pay(&mut self, address: Address) {
        let caller = self.env().caller();
        assert!(caller == self.owner.get_or_default(), "Only owner");
        self.stake_to_pay.set(Some(address));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::Deployer;

    #[test]
    fn test_create_plan() {
        let env = odra_test::env();
        let mut contract = SubscriptionManagerHostRef::deploy(&env, NoArgs);
        
        let plan_id = contract.create_plan(
            "Pro API".to_string(),
            U256::from(50_000_000_000u64), // 50 CSPR
            U256::from(1_000_000u64),       // 0.001 CSPR per call
            2592000,                         // 30 days
        );

        assert_eq!(plan_id, U256::from(1));

        let plan = contract.get_plan(plan_id).unwrap();
        assert_eq!(plan.name, "Pro API");
        assert!(plan.is_active);
    }

    #[test]
    fn test_subscribe() {
        let env = odra_test::env();
        let mut contract = SubscriptionManagerHostRef::deploy(&env, NoArgs);
        
        // Create a plan
        let plan_id = contract.create_plan(
            "Starter".to_string(),
            U256::from(10_000_000_000u64), // 10 CSPR
            U256::zero(),
            2592000,
        );

        // Subscribe (with payment)
        env.set_attached_value(U256::from(10_000_000_000u64));
        let sub_id = contract.subscribe(plan_id, true, 0);

        assert_eq!(sub_id, U256::from(1));
        
        let subscription = contract.get_subscription(sub_id).unwrap();
        assert!(subscription.is_active);
        assert!(subscription.auto_renew);
    }
}
