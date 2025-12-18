# CasperFlow JavaScript SDK

The easiest way to integrate CasperFlow subscriptions into your application.

## Installation

```bash
npm install casperflow-sdk
# or
yarn add casperflow-sdk
```

## Quick Start

```javascript
import { CasperFlow } from 'casperflow-sdk';

// Initialize with your API key
const casperflow = new CasperFlow({
    network: 'testnet', // or 'mainnet'
});

// Verify a subscription
const result = await casperflow.verifySubscription('cf_sk_xxx');
console.log(result);
// { valid: true, planName: 'Pro API', expiresAt: '2024-02-15' }
```

## API Reference

### Verify Subscription

Check if an API key is associated with an active subscription.

```javascript
// Using the SDK
const result = await casperflow.verifySubscription(apiKey);

// Or using fetch directly
const response = await fetch(
    'https://casperflow.vercel.app/api/verify?apiKey=cf_sk_xxx'
);
const data = await response.json();
```

**Response:**
```json
{
    "valid": true,
    "planName": "Pro API",
    "expiresAt": 1708012800000,
    "expiresAtHuman": "2024-02-15T00:00:00.000Z",
    "network": "testnet"
}
```

### List Plans

Get all available subscription plans.

```javascript
const plans = await casperflow.getPlans();
```

**Response:**
```json
{
    "success": true,
    "network": "testnet",
    "plans": [
        {
            "id": 1,
            "name": "Pro API",
            "price": 50,
            "period": "monthly"
        }
    ]
}
```

## Middleware Example (Express.js)

```javascript
const express = require('express');
const app = express();

// Middleware to verify CasperFlow subscription
async function requireSubscription(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
    }
    
    try {
        const response = await fetch(
            `https://casperflow.vercel.app/api/verify?apiKey=${apiKey}`
        );
        const data = await response.json();
        
        if (!data.valid) {
            return res.status(403).json({ 
                error: 'Invalid or expired subscription',
                details: data
            });
        }
        
        // Attach subscription info to request
        req.subscription = data;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Verification failed' });
    }
}

// Protected route
app.get('/api/protected', requireSubscription, (req, res) => {
    res.json({ 
        message: 'Access granted!',
        plan: req.subscription.planName
    });
});
```

## React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useSubscription(apiKey) {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!apiKey) {
            setLoading(false);
            return;
        }
        
        fetch(`https://casperflow.vercel.app/api/verify?apiKey=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                setSubscription(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [apiKey]);
    
    return { subscription, loading, error };
}

// Usage
function ProtectedContent() {
    const { subscription, loading, error } = useSubscription('cf_sk_xxx');
    
    if (loading) return <div>Checking subscription...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!subscription?.valid) return <div>Please subscribe to access</div>;
    
    return <div>Welcome, {subscription.planName} subscriber!</div>;
}
```

## Contract Integration

For direct blockchain integration:

```javascript
import { CasperClient, DeployUtil, CLPublicKey } from 'casper-js-sdk';

const SUBSCRIPTION_MANAGER = '55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143';
const RPC_URL = 'https://rpc.testnet.casperlabs.io/rpc';

// Query subscription directly from contract
async function checkSubscriptionOnChain(subscriberPubKey, planId) {
    const client = new CasperClient(RPC_URL);
    
    // Query the contract state
    const stateRootHash = await client.nodeClient.getStateRootHash();
    
    // This would query the contract's subscription mapping
    // Implementation depends on contract structure
    
    return { subscribed: true, expiresAt: '...' };
}
```

## Webhook Events (Coming Soon)

Subscribe to real-time events:

```javascript
casperflow.on('subscription.created', (event) => {
    console.log('New subscriber:', event.subscriber);
});

casperflow.on('subscription.cancelled', (event) => {
    console.log('Subscription cancelled:', event.subscriber);
});

casperflow.on('subscription.renewed', (event) => {
    console.log('Subscription renewed:', event.subscriber);
});
```

## Support

- Documentation: https://docs.casperflow.io
- Discord: https://discord.gg/casperflow
- Email: support@casperflow.io

## License

MIT
