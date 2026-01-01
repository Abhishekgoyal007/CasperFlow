import { NextRequest, NextResponse } from 'next/server';

// Demo plans data (in production, this would come from blockchain or database)
const demoPlans = [
    {
        id: 'plan_demo_starter',
        name: 'Starter API',
        description: 'Perfect for small projects and testing. Includes basic API access with rate limiting.',
        price: 10,
        period: 'monthly',
        trialEnabled: true,
        trialDays: 7,
        features: ['1,000 API calls/month', 'Basic support', 'Rate limiting: 10 req/min'],
        tier: 'starter',
    },
    {
        id: 'plan_demo_pro',
        name: 'Pro API',
        description: 'For growing businesses. Higher limits, priority support, and advanced features.',
        price: 50,
        period: 'monthly',
        trialEnabled: true,
        trialDays: 14,
        features: ['50,000 API calls/month', 'Priority support', 'Rate limiting: 100 req/min', 'Webhooks'],
        tier: 'pro',
    },
    {
        id: 'plan_demo_enterprise',
        name: 'Enterprise',
        description: 'Unlimited access for large-scale applications with dedicated support.',
        price: 200,
        period: 'monthly',
        trialEnabled: false,
        trialDays: 0,
        features: ['Unlimited API calls', 'Dedicated support', 'No rate limiting', 'Webhooks', 'Custom integrations', 'SLA guarantee'],
        tier: 'enterprise',
    },
];

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ planId: string }> }
) {
    try {
        const { planId } = await params;

        // Find the plan
        const plan = demoPlans.find(p => p.id === planId);

        if (!plan) {
            return NextResponse.json(
                { error: 'Plan not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            period: plan.period,
            trialEnabled: plan.trialEnabled,
            trialDays: plan.trialDays,
            features: plan.features,
            tier: plan.tier,
            network: 'testnet',
        });
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
