//! Billing Engine Contract
//!
//! Calculates and processes billing for subscriptions.
//! 
//! Key features:
//! - Calculate total bill (base price + usage * usage_price)
//! - Generate on-chain invoices
//! - Process payments from wallet or staking rewards
//! - Handle subscription renewals

use odra::prelude::*;
use odra::{casper_types::U256, Address, Mapping, Var};

/// Invoice status
#[odra::odra_type]
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum InvoiceStatus {
    Pending,
    Paid,
    Failed,
    Cancelled,
}

/// On-chain invoice record
#[odra::odra_type]
pub struct Invoice {
    /// Unique invoice ID
    pub id: U256,
    /// Subscription this invoice is for
    pub subscription_id: U256,
    /// Plan ID
    pub plan_id: U256,
    /// Subscriber address
    pub subscriber: Address,
    /// Merchant address
    pub merchant: Address,
    /// Base amount
    pub base_amount: U256,
    /// Usage amount
    pub usage_amount: U256,
    /// Total amount (base + usage)
    pub total_amount: U256,
    /// Units of usage
    pub usage_units: U256,
    /// Billing period start
    pub period_start: u64,
    /// Billing period end
    pub period_end: u64,
    /// Invoice created timestamp
    pub created_at: u64,
    /// Invoice paid timestamp (0 if not paid)
    pub paid_at: u64,
    /// Payment method used (0 = wallet, 1 = staked)
    pub payment_method: u8,
    /// Status
    pub status: InvoiceStatus,
    /// Transaction hash of payment (if paid)
    pub payment_tx: String,
}

/// Events
pub mod events {
    use super::*;

    #[odra::event]
    pub struct InvoiceCreated {
        pub invoice_id: U256,
        pub subscription_id: U256,
        pub total_amount: U256,
    }

    #[odra::event]
    pub struct InvoicePaid {
        pub invoice_id: U256,
        pub amount: U256,
        pub payment_method: u8,
    }

    #[odra::event]
    pub struct InvoiceFailed {
        pub invoice_id: U256,
        pub reason: String,
    }

    #[odra::event]
    pub struct PaymentProcessed {
        pub from: Address,
        pub to: Address,
        pub amount: U256,
    }
}

/// Billing Engine Contract
#[odra::module(events = [
    events::InvoiceCreated,
    events::InvoicePaid,
    events::InvoiceFailed,
    events::PaymentProcessed
])]
pub struct BillingEngine {
    /// Contract owner
    owner: Var<Address>,
    /// SubscriptionManager contract
    subscription_manager: Var<Option<Address>>,
    /// UsageMeter contract
    usage_meter: Var<Option<Address>>,
    /// StakeToPay contract
    stake_to_pay: Var<Option<Address>>,
    /// Invoice counter
    invoice_counter: Var<U256>,
    /// Invoice ID -> Invoice
    invoices: Mapping<U256, Invoice>,
    /// Subscription ID -> list of invoice IDs
    subscription_invoices: Mapping<U256, Vec<U256>>,
    /// User -> list of invoice IDs
    user_invoices: Mapping<Address, Vec<U256>>,
    /// Merchant -> list of invoice IDs
    merchant_invoices: Mapping<Address, Vec<U256>>,
    /// Merchant -> total revenue
    merchant_revenue: Mapping<Address, U256>,
    /// Protocol fee percentage (in basis points, e.g., 100 = 1%)
    protocol_fee_bps: Var<u64>,
    /// Protocol fee recipient
    fee_recipient: Var<Address>,
}

#[odra::module]
impl BillingEngine {
    /// Initialize the contract
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.owner.set(caller);
        self.fee_recipient.set(caller);
        self.invoice_counter.set(U256::zero());
        self.protocol_fee_bps.set(100); // 1% default fee
    }

    // ============ BILLING FUNCTIONS ============

    /// Create an invoice for a subscription's billing period
    pub fn create_invoice(
        &mut self,
        subscription_id: U256,
        plan_id: U256,
        subscriber: Address,
        merchant: Address,
        base_amount: U256,
        usage_price: U256,
        usage_units: U256,
        period_start: u64,
        period_end: u64,
    ) -> U256 {
        let invoice_id = self.invoice_counter.get_or_default() + 1;
        self.invoice_counter.set(invoice_id);

        let usage_amount = usage_price * usage_units;
        let total_amount = base_amount + usage_amount;
        let now = self.env().get_block_time();

        let invoice = Invoice {
            id: invoice_id,
            subscription_id,
            plan_id,
            subscriber,
            merchant,
            base_amount,
            usage_amount,
            total_amount,
            usage_units,
            period_start,
            period_end,
            created_at: now,
            paid_at: 0,
            payment_method: 0,
            status: InvoiceStatus::Pending,
            payment_tx: String::new(),
        };

        self.invoices.set(&invoice_id, invoice);

        // Update indexes
        self.add_to_subscription_invoices(subscription_id, invoice_id);
        self.add_to_user_invoices(subscriber, invoice_id);
        self.add_to_merchant_invoices(merchant, invoice_id);

        self.env().emit_event(events::InvoiceCreated {
            invoice_id,
            subscription_id,
            total_amount,
        });

        invoice_id
    }

    /// Pay an invoice from wallet
    #[odra(payable)]
    pub fn pay_invoice(&mut self, invoice_id: U256) {
        let caller = self.env().caller();
        let attached = self.env().attached_value();
        
        let mut invoice = self.invoices.get(&invoice_id).expect("Invoice not found");
        
        assert!(invoice.status == InvoiceStatus::Pending, "Invoice not pending");
        assert!(invoice.subscriber == caller, "Only subscriber can pay");
        assert!(attached >= invoice.total_amount, "Insufficient payment");

        // Calculate protocol fee
        let fee_bps = self.protocol_fee_bps.get_or_default();
        let protocol_fee = (invoice.total_amount * U256::from(fee_bps)) / U256::from(10000);
        let merchant_amount = invoice.total_amount - protocol_fee;

        // Transfer to merchant
        self.env().transfer_tokens(&invoice.merchant, &merchant_amount);
        
        // Transfer protocol fee
        let fee_recipient = self.fee_recipient.get_or_default();
        if protocol_fee > U256::zero() {
            self.env().transfer_tokens(&fee_recipient, &protocol_fee);
        }

        // Update invoice
        invoice.status = InvoiceStatus::Paid;
        invoice.paid_at = self.env().get_block_time();
        invoice.payment_method = 0;
        self.invoices.set(&invoice_id, invoice.clone());

        // Update merchant revenue
        let current_revenue = self.merchant_revenue.get(&invoice.merchant).unwrap_or(U256::zero());
        self.merchant_revenue.set(&invoice.merchant, current_revenue + merchant_amount);

        self.env().emit_event(events::InvoicePaid {
            invoice_id,
            amount: invoice.total_amount,
            payment_method: 0,
        });

        self.env().emit_event(events::PaymentProcessed {
            from: caller,
            to: invoice.merchant,
            amount: merchant_amount,
        });
    }

    /// Pay invoice from staking rewards (called by StakeToPay contract)
    pub fn pay_invoice_from_staking(
        &mut self,
        invoice_id: U256,
        payer: Address,
    ) {
        let caller = self.env().caller();
        let stake_to_pay = self.stake_to_pay.get_or_default();
        
        assert!(
            stake_to_pay.is_some() && caller == stake_to_pay.unwrap(),
            "Only StakeToPay contract"
        );

        let mut invoice = self.invoices.get(&invoice_id).expect("Invoice not found");
        
        assert!(invoice.status == InvoiceStatus::Pending, "Invoice not pending");
        assert!(invoice.subscriber == payer, "Payer mismatch");

        // Mark as paid (StakeToPay contract handles the actual transfer)
        invoice.status = InvoiceStatus::Paid;
        invoice.paid_at = self.env().get_block_time();
        invoice.payment_method = 1; // Staked
        self.invoices.set(&invoice_id, invoice.clone());

        // Update merchant revenue
        let fee_bps = self.protocol_fee_bps.get_or_default();
        let protocol_fee = (invoice.total_amount * U256::from(fee_bps)) / U256::from(10000);
        let merchant_amount = invoice.total_amount - protocol_fee;
        
        let current_revenue = self.merchant_revenue.get(&invoice.merchant).unwrap_or(U256::zero());
        self.merchant_revenue.set(&invoice.merchant, current_revenue + merchant_amount);

        self.env().emit_event(events::InvoicePaid {
            invoice_id,
            amount: invoice.total_amount,
            payment_method: 1,
        });
    }

    /// Mark invoice as failed
    pub fn fail_invoice(&mut self, invoice_id: U256, reason: String) {
        let caller = self.env().caller();
        assert!(
            caller == self.owner.get_or_default(),
            "Only owner can fail invoices"
        );

        let mut invoice = self.invoices.get(&invoice_id).expect("Invoice not found");
        invoice.status = InvoiceStatus::Failed;
        self.invoices.set(&invoice_id, invoice);

        self.env().emit_event(events::InvoiceFailed {
            invoice_id,
            reason,
        });
    }

    // ============ HELPER FUNCTIONS ============

    fn add_to_subscription_invoices(&mut self, subscription_id: U256, invoice_id: U256) {
        let mut list = self.subscription_invoices.get(&subscription_id).unwrap_or_default();
        list.push(invoice_id);
        self.subscription_invoices.set(&subscription_id, list);
    }

    fn add_to_user_invoices(&mut self, user: Address, invoice_id: U256) {
        let mut list = self.user_invoices.get(&user).unwrap_or_default();
        list.push(invoice_id);
        self.user_invoices.set(&user, list);
    }

    fn add_to_merchant_invoices(&mut self, merchant: Address, invoice_id: U256) {
        let mut list = self.merchant_invoices.get(&merchant).unwrap_or_default();
        list.push(invoice_id);
        self.merchant_invoices.set(&merchant, list);
    }

    // ============ VIEW FUNCTIONS ============

    /// Get invoice details
    pub fn get_invoice(&self, invoice_id: U256) -> Option<Invoice> {
        self.invoices.get(&invoice_id)
    }

    /// Get all invoices for a subscription
    pub fn get_subscription_invoices(&self, subscription_id: U256) -> Vec<U256> {
        self.subscription_invoices.get(&subscription_id).unwrap_or_default()
    }

    /// Get all invoices for a user
    pub fn get_user_invoices(&self, user: Address) -> Vec<U256> {
        self.user_invoices.get(&user).unwrap_or_default()
    }

    /// Get all invoices for a merchant
    pub fn get_merchant_invoices(&self, merchant: Address) -> Vec<U256> {
        self.merchant_invoices.get(&merchant).unwrap_or_default()
    }

    /// Get merchant's total revenue
    pub fn get_merchant_revenue(&self, merchant: Address) -> U256 {
        self.merchant_revenue.get(&merchant).unwrap_or(U256::zero())
    }

    /// Get total number of invoices
    pub fn total_invoices(&self) -> U256 {
        self.invoice_counter.get_or_default()
    }

    /// Get protocol fee in basis points
    pub fn get_protocol_fee_bps(&self) -> u64 {
        self.protocol_fee_bps.get_or_default()
    }

    // ============ ADMIN FUNCTIONS ============

    /// Set contract references
    pub fn set_subscription_manager(&mut self, address: Address) {
        assert!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        self.subscription_manager.set(Some(address));
    }

    pub fn set_usage_meter(&mut self, address: Address) {
        assert!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        self.usage_meter.set(Some(address));
    }

    pub fn set_stake_to_pay(&mut self, address: Address) {
        assert!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        self.stake_to_pay.set(Some(address));
    }

    /// Set protocol fee (owner only)
    pub fn set_protocol_fee_bps(&mut self, fee_bps: u64) {
        assert!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        assert!(fee_bps <= 1000, "Fee too high"); // Max 10%
        self.protocol_fee_bps.set(fee_bps);
    }

    /// Set fee recipient
    pub fn set_fee_recipient(&mut self, recipient: Address) {
        assert!(self.env().caller() == self.owner.get_or_default(), "Only owner");
        self.fee_recipient.set(recipient);
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::Deployer;

    #[test]
    fn test_create_invoice() {
        let env = odra_test::env();
        let mut contract = BillingEngineHostRef::deploy(&env, NoArgs);
        
        let subscriber = env.get_account(1);
        let merchant = env.get_account(2);

        let invoice_id = contract.create_invoice(
            U256::from(1),           // subscription_id
            U256::from(1),           // plan_id
            subscriber,              // subscriber
            merchant,                // merchant
            U256::from(50_000_000_000u64), // base_amount (50 CSPR)
            U256::from(1_000_000u64),      // usage_price (0.001 CSPR)
            U256::from(1000),              // usage_units
            0,                             // period_start
            2592000,                       // period_end
        );

        assert_eq!(invoice_id, U256::from(1));
        
        let invoice = contract.get_invoice(invoice_id).unwrap();
        // Total = 50 CSPR + (0.001 * 1000) = 50 + 1 = 51 CSPR
        assert_eq!(invoice.total_amount, U256::from(51_000_000_000u64));
        assert_eq!(invoice.status, InvoiceStatus::Pending);
    }
}
