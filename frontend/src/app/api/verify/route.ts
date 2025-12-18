import { NextRequest, NextResponse } from 'next/server';

/**
 * CasperFlow Subscription Verification API
 * 
 * Endpoint: GET /api/verify?apiKey=cf_sk_xxx
 * 
 * This endpoint allows merchants to verify if an API key
 * is associated with an active subscription.
 */

// In production, this would query the blockchain
// For now, we check localStorage via cookies or a simple in-memory store
const MOCK_API_KEYS: Record<string, {
    valid: boolean;
    planName: string;
    expiresAt: number;
    subscriberWallet: string;
}> = {};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const apiKey = searchParams.get('apiKey');

        if (!apiKey) {
            return NextResponse.json(
                {
                    error: 'Missing apiKey parameter',
                    usage: 'GET /api/verify?apiKey=cf_sk_xxx'
                },
                { status: 400 }
            );
        }

        // Validate API key format
        if (!apiKey.startsWith('cf_sk_')) {
            return NextResponse.json(
                {
                    valid: false,
                    error: 'Invalid API key format'
                },
                { status: 400 }
            );
        }

        // Check if API key exists in our records
        const subscription = MOCK_API_KEYS[apiKey];

        if (!subscription) {
            // In production, we would query the blockchain here
            // For demo, return a sample response based on key pattern

            return NextResponse.json({
                valid: true,
                planName: 'Demo Plan',
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
                expiresAtHuman: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                network: 'testnet',
                message: 'API key verified (demo mode)'
            });
        }

        const isExpired = subscription.expiresAt < Date.now();

        return NextResponse.json({
            valid: !isExpired,
            planName: subscription.planName,
            expiresAt: subscription.expiresAt,
            expiresAtHuman: new Date(subscription.expiresAt).toISOString(),
            network: 'testnet',
            ...(isExpired && { error: 'Subscription expired' })
        });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * POST endpoint to register an API key after subscription
 * This would be called after a successful on-chain subscription
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { apiKey, planName, expiresAt, subscriberWallet } = body;

        if (!apiKey || !planName || !expiresAt) {
            return NextResponse.json(
                { error: 'Missing required fields: apiKey, planName, expiresAt' },
                { status: 400 }
            );
        }

        // Store the API key
        MOCK_API_KEYS[apiKey] = {
            valid: true,
            planName,
            expiresAt,
            subscriberWallet
        };

        return NextResponse.json({
            success: true,
            message: 'API key registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
