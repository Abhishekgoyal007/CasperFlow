import { NextRequest, NextResponse } from 'next/server';

/**
 * CasperFlow Plans API
 * 
 * Endpoint: GET /api/plans
 * 
 * Returns all available subscription plans
 */

export async function GET(request: NextRequest) {
    try {
        // In production, this would query the blockchain
        // For demo, we return sample plans

        const plans = [
            {
                id: 1,
                name: 'Pro API',
                description: '10,000 API calls per month with priority support',
                price: 50,
                period: 'monthly',
                periodSeconds: 2592000,
                features: ['10,000 API calls', 'Priority support', 'Analytics dashboard'],
                contractHash: '55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143'
            },
            {
                id: 2,
                name: 'Enterprise',
                description: 'Unlimited API calls with dedicated support',
                price: 200,
                period: 'monthly',
                periodSeconds: 2592000,
                features: ['Unlimited API calls', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
                contractHash: '55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143'
            }
        ];

        return NextResponse.json({
            success: true,
            network: 'testnet',
            contractHash: '55fb73955a3e736cd516af0956057a2c55f986d1b3a421b403294a2c288d2143',
            plans,
            totalPlans: plans.length
        });

    } catch (error) {
        console.error('Plans API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plans' },
            { status: 500 }
        );
    }
}
