import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const publicKey = searchParams.get("publicKey");
    const network = searchParams.get("network") || "testnet";

    if (!publicKey) {
        return NextResponse.json({ error: "Missing publicKey" }, { status: 400 });
    }

    // Select API based on network
    const apiUrl = network === "mainnet"
        ? `https://api.cspr.live/accounts/${publicKey}`
        : `https://api.testnet.cspr.live/accounts/${publicKey}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                "Accept": "application/json",
            },
            next: { revalidate: 30 },
        });

        if (!response.ok) {
            // Account doesn't exist on this network
            return NextResponse.json({
                data: { balance: "0" }
            });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch balance:", error);
        return NextResponse.json({
            data: { balance: "0" }
        });
    }
}
