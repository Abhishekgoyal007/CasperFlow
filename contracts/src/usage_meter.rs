//! Usage Meter Contract
//!
//! Tracks and records usage metrics for usage-based billing.
//! 
//! Key features:
//! - Record API calls, compute units, storage, or custom metrics
//! - Aggregates usage per billing cycle
//! - Integrates with BillingEngine for cost calculation

use odra::prelude::*;
use odra::{casper_types::U256, Address, Mapping, Var};

/// Usage record for a specific metric
#[odra::odra_type]
pub struct UsageRecord {
    /// Subscription this usage belongs to
    pub subscription_id: U256,
    /// Type of metric (e.g., "api_calls", "storage_gb", "compute_units")
    pub metric: String,
    /// Number of units used
    pub units: U256,
    /// Timestamp of the record
    pub recorded_at: u64,
    /// Who recorded this (merchant's backend)
    pub recorded_by: Address,
}

/// Aggregated usage for a billing period
#[odra::odra_type]
pub struct BillingPeriodUsage {
    /// Subscription ID
    pub subscription_id: U256,
    /// Start of billing period
    pub period_start: u64,
    /// End of billing period
    pub period_end: u64,
    /// Total units used in this period
    pub total_units: U256,
    /// Whether this period has been billed
    pub is_billed: bool,
}

/// Events
pub mod events {
    use super::*;

    #[odra::event]
    pub struct UsageRecorded {
        pub subscription_id: U256,
        pub metric: String,
        pub units: U256,
        pub timestamp: u64,
    }

    #[odra::event]
    pub struct PeriodClosed {
        pub subscription_id: U256,
        pub period_start: u64,
        pub period_end: u64,
        pub total_units: U256,
    }
}

/// Usage Meter Contract
#[odra::module(events = [events::UsageRecorded, events::PeriodClosed])]
pub struct UsageMeter {
    /// Contract owner
    owner: Var<Address>,
    /// SubscriptionManager contract address
    subscription_manager: Var<Option<Address>>,
    /// Counter for usage record IDs
    record_counter: Var<U256>,
    /// Record ID -> UsageRecord
    records: Mapping<U256, UsageRecord>,
    /// Subscription ID -> list of record IDs
    subscription_records: Mapping<U256, Vec<U256>>,
    /// (Subscription ID, Period Start) -> BillingPeriodUsage
    period_usage: Mapping<(U256, u64), BillingPeriodUsage>,
    /// Subscription ID -> Current period start
    current_period_start: Mapping<U256, u64>,
    /// Authorized backends that can record usage (Plan ID -> list of authorized addresses)
    authorized_recorders: Mapping<U256, Vec<Address>>,
}

#[odra::module]
impl UsageMeter {
    /// Initialize the contract
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.owner.set(caller);
        self.record_counter.set(U256::zero());
    }

    // ============ MERCHANT FUNCTIONS ============

    /// Authorize a backend address to record usage for a plan
    pub fn authorize_recorder(&mut self, plan_id: U256, recorder: Address) {
        // TODO: Verify caller is the merchant who owns the plan
        let mut authorized = self.authorized_recorders.get(&plan_id).unwrap_or_default();
        if !authorized.contains(&recorder) {
            authorized.push(recorder);
            self.authorized_recorders.set(&plan_id, authorized);
        }
    }

    /// Remove authorization for a recorder
    pub fn revoke_recorder(&mut self, plan_id: U256, recorder: Address) {
        let mut authorized = self.authorized_recorders.get(&plan_id).unwrap_or_default();
        authorized.retain(|a| *a != recorder);
        self.authorized_recorders.set(&plan_id, authorized);
    }

    // ============ USAGE RECORDING ============

    /// Record usage for a subscription (called by authorized backend)
    pub fn record_usage(
        &mut self,
        subscription_id: U256,
        plan_id: U256,
        metric: String,
        units: U256,
    ) -> U256 {
        let caller = self.env().caller();
        
        // Verify caller is authorized to record usage for this plan
        let authorized = self.authorized_recorders.get(&plan_id).unwrap_or_default();
        assert!(
            authorized.contains(&caller) || caller == self.owner.get_or_default(),
            "Not authorized to record usage"
        );

        let now = self.env().get_block_time();
        let record_id = self.record_counter.get_or_default() + 1;
        self.record_counter.set(record_id);

        let record = UsageRecord {
            subscription_id,
            metric: metric.clone(),
            units,
            recorded_at: now,
            recorded_by: caller,
        };

        self.records.set(&record_id, record);

        // Add to subscription's records
        let mut sub_records = self.subscription_records.get(&subscription_id).unwrap_or_default();
        sub_records.push(record_id);
        self.subscription_records.set(&subscription_id, sub_records);

        // Update current period usage
        self.update_period_usage(subscription_id, units, now);

        self.env().emit_event(events::UsageRecorded {
            subscription_id,
            metric,
            units,
            timestamp: now,
        });

        record_id
    }

    /// Batch record multiple usage entries
    pub fn batch_record_usage(
        &mut self,
        subscription_ids: Vec<U256>,
        plan_id: U256,
        metric: String,
        units_list: Vec<U256>,
    ) {
        assert!(
            subscription_ids.len() == units_list.len(),
            "Arrays must have same length"
        );

        for i in 0..subscription_ids.len() {
            self.record_usage(
                subscription_ids[i],
                plan_id,
                metric.clone(),
                units_list[i],
            );
        }
    }

    // ============ INTERNAL FUNCTIONS ============

    /// Update the current billing period usage
    fn update_period_usage(&mut self, subscription_id: U256, units: U256, now: u64) {
        let period_start = self.current_period_start.get(&subscription_id).unwrap_or(now);
        
        // If no period exists yet, start one
        if self.current_period_start.get(&subscription_id).is_none() {
            self.current_period_start.set(&subscription_id, now);
        }

        let key = (subscription_id, period_start);
        let mut period = self.period_usage.get(&key).unwrap_or(BillingPeriodUsage {
            subscription_id,
            period_start,
            period_end: 0,
            total_units: U256::zero(),
            is_billed: false,
        });

        period.total_units = period.total_units + units;
        self.period_usage.set(&key, period);
    }

    // ============ BILLING INTEGRATION ============

    /// Close the current billing period and return total usage (called by BillingEngine)
    pub fn close_period(&mut self, subscription_id: U256, period_end: u64) -> U256 {
        let period_start = self.current_period_start.get(&subscription_id).unwrap_or(0);
        let key = (subscription_id, period_start);
        
        let mut period = self.period_usage.get(&key).unwrap_or(BillingPeriodUsage {
            subscription_id,
            period_start,
            period_end: 0,
            total_units: U256::zero(),
            is_billed: false,
        });

        period.period_end = period_end;
        period.is_billed = true;
        let total_units = period.total_units;
        self.period_usage.set(&key, period);

        // Start new period
        self.current_period_start.set(&subscription_id, period_end);

        self.env().emit_event(events::PeriodClosed {
            subscription_id,
            period_start,
            period_end,
            total_units,
        });

        total_units
    }

    /// Get current period usage without closing it
    pub fn get_current_usage(&self, subscription_id: U256) -> U256 {
        let period_start = self.current_period_start.get(&subscription_id).unwrap_or(0);
        let key = (subscription_id, period_start);
        
        self.period_usage
            .get(&key)
            .map(|p| p.total_units)
            .unwrap_or(U256::zero())
    }

    // ============ VIEW FUNCTIONS ============

    /// Get a specific usage record
    pub fn get_record(&self, record_id: U256) -> Option<UsageRecord> {
        self.records.get(&record_id)
    }

    /// Get all record IDs for a subscription
    pub fn get_subscription_records(&self, subscription_id: U256) -> Vec<U256> {
        self.subscription_records.get(&subscription_id).unwrap_or_default()
    }

    /// Get period usage details
    pub fn get_period_usage(&self, subscription_id: U256, period_start: u64) -> Option<BillingPeriodUsage> {
        self.period_usage.get(&(subscription_id, period_start))
    }

    /// Check if an address is authorized to record
    pub fn is_authorized(&self, plan_id: U256, address: Address) -> bool {
        let authorized = self.authorized_recorders.get(&plan_id).unwrap_or_default();
        authorized.contains(&address)
    }

    /// Get total number of records
    pub fn total_records(&self) -> U256 {
        self.record_counter.get_or_default()
    }

    // ============ ADMIN FUNCTIONS ============

    /// Set the SubscriptionManager contract address
    pub fn set_subscription_manager(&mut self, address: Address) {
        let caller = self.env().caller();
        assert!(caller == self.owner.get_or_default(), "Only owner");
        self.subscription_manager.set(Some(address));
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::Deployer;

    #[test]
    fn test_record_usage() {
        let env = odra_test::env();
        let mut contract = UsageMeterHostRef::deploy(&env, NoArgs);
        
        // Record usage (as owner, which is auto-authorized)
        let record_id = contract.record_usage(
            U256::from(1), // subscription_id
            U256::from(1), // plan_id
            "api_calls".to_string(),
            U256::from(100),
        );

        assert_eq!(record_id, U256::from(1));
        
        let current_usage = contract.get_current_usage(U256::from(1));
        assert_eq!(current_usage, U256::from(100));
    }

    #[test]
    fn test_accumulate_usage() {
        let env = odra_test::env();
        let mut contract = UsageMeterHostRef::deploy(&env, NoArgs);
        
        // Record multiple usage entries
        contract.record_usage(U256::from(1), U256::from(1), "api_calls".to_string(), U256::from(100));
        contract.record_usage(U256::from(1), U256::from(1), "api_calls".to_string(), U256::from(50));
        contract.record_usage(U256::from(1), U256::from(1), "api_calls".to_string(), U256::from(75));

        let total = contract.get_current_usage(U256::from(1));
        assert_eq!(total, U256::from(225));
    }
}
