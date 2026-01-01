"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface WalletContextType {
    // Connection state
    isConnected: boolean;
    isConnecting: boolean;
    isDemo: boolean; // True if using demo mode, not real wallet
    address: string | null;
    publicKey: string | null;
    balance: string;

    // Actions
    connect: () => Promise<void>;
    disconnect: () => void;

    // Network
    network: "mainnet" | "testnet";
    setNetwork: (network: "mainnet" | "testnet") => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
    children: ReactNode;
}

// Type for Casper Wallet Provider
interface CasperWalletProviderType {
    requestConnection: () => Promise<boolean>;
    isConnected: () => Promise<boolean>;
    getActivePublicKey: () => Promise<string>;
    disconnectFromSite: () => Promise<void>;
    signMessage: (message: string, signingPublicKeyHex: string) => Promise<string>;
}

// Type for legacy Casper Signer
interface LegacySignerType {
    requestConnection: () => Promise<void>;
    isConnected: () => Promise<boolean>;
    getActivePublicKey: () => Promise<string>;
    disconnectFromSite: () => Promise<void>;
}

// Check if window has CasperWalletProvider
function getCasperWalletProvider(): CasperWalletProviderType | null {
    if (typeof window === "undefined") return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider = (window as any).CasperWalletProvider;
    if (provider) {
        return provider() as CasperWalletProviderType;
    }
    return null;
}

// Check if window has legacy casperLabsHelper
function getLegacySigner(): LegacySignerType | null {
    if (typeof window === "undefined") return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const helper = (window as any).casperlabsHelper;
    if (helper) {
        return helper as LegacySignerType;
    }
    return null;
}

export function WalletProvider({ children }: WalletProviderProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [balance, setBalance] = useState("0");
    const [network, setNetwork] = useState<"mainnet" | "testnet">("testnet");

    // Check which wallet is available
    const getWalletProvider = useCallback((): { type: string; provider: CasperWalletProviderType | LegacySignerType } | null => {
        // Check for new Casper Wallet
        const casperWallet = getCasperWalletProvider();
        if (casperWallet) {
            console.log("Found CasperWalletProvider");
            return { type: "casper-wallet", provider: casperWallet };
        }

        // Check for Casper Signer (legacy)
        const legacySigner = getLegacySigner();
        if (legacySigner) {
            console.log("Found casperlabsHelper (Casper Signer)");
            return { type: "casper-signer", provider: legacySigner };
        }

        return null;
    }, []);

    // Fetch real balance using our API route (avoids CORS)
    const fetchBalance = useCallback(async (pubKey: string, net: "mainnet" | "testnet" = "testnet") => {
        try {
            // Call our Next.js API route which proxies to CSPR.live
            const response = await fetch(`/api/balance?publicKey=${pubKey}&network=${net}`);

            if (response.ok) {
                const data = await response.json();
                console.log(`Balance data (${net}):`, data);

                if (data.data?.balance) {
                    // Balance is in motes (1 CSPR = 1,000,000,000 motes)
                    const balanceInCspr = parseFloat(data.data.balance) / 1_000_000_000;
                    setBalance(balanceInCspr.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }));
                    return;
                }
            }

            // Account might not exist on this network
            setBalance("0");
        } catch (error) {
            console.error("Failed to fetch balance:", error);
            setBalance("0");
        }
    }, []);

    // Connect to wallet
    const connect = useCallback(async () => {
        setIsConnecting(true);

        try {
            const walletInfo = getWalletProvider();

            if (!walletInfo) {
                console.log("No Casper wallet found, using demo mode");

                // Demo mode fallback
                await new Promise((resolve) => setTimeout(resolve, 800));

                const mockPublicKey = "01" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
                const mockAddress = mockPublicKey.slice(0, 8) + "..." + mockPublicKey.slice(-6);

                setAddress(mockAddress);
                setPublicKey(mockPublicKey);
                setBalance("2,450");
                setIsConnected(true);
                setIsDemo(true);

                localStorage.setItem("casperflow_connected", "demo");
                localStorage.setItem("casperflow_address", mockAddress);
                localStorage.setItem("casperflow_publicKey", mockPublicKey);

                return;
            }

            const { type, provider } = walletInfo;
            console.log(`Connecting to ${type}...`);

            if (type === "casper-wallet") {
                // New Casper Wallet
                const casperProvider = provider as CasperWalletProviderType;
                try {
                    const connected = await casperProvider.requestConnection();
                    console.log("Connection result:", connected);

                    if (connected) {
                        const activeKey = await casperProvider.getActivePublicKey();
                        console.log("Active public key:", activeKey);

                        if (activeKey) {
                            const shortAddress = activeKey.slice(0, 8) + "..." + activeKey.slice(-6);
                            setAddress(shortAddress);
                            setPublicKey(activeKey);
                            setIsConnected(true);

                            // Fetch real balance
                            fetchBalance(activeKey, network);

                            localStorage.setItem("casperflow_connected", "casper-wallet");
                            localStorage.setItem("casperflow_publicKey", activeKey);
                        }
                    }
                } catch (walletError) {
                    console.error("Casper Wallet error:", walletError);
                    throw walletError;
                }
            } else if (type === "casper-signer") {
                // Legacy Casper Signer
                const legacyProvider = provider as LegacySignerType;
                await legacyProvider.requestConnection();
                const isConn = await legacyProvider.isConnected();

                if (isConn) {
                    const activeKey = await legacyProvider.getActivePublicKey();

                    if (activeKey) {
                        const shortAddress = activeKey.slice(0, 8) + "..." + activeKey.slice(-6);
                        setAddress(shortAddress);
                        setPublicKey(activeKey);
                        setBalance("0"); // Real balance
                        setIsConnected(true);

                        localStorage.setItem("casperflow_connected", "casper-signer");
                        localStorage.setItem("casperflow_publicKey", activeKey);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to connect wallet:", error);

            // Fallback to demo mode on error
            const mockPublicKey = "01demo" + Array(58).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
            const mockAddress = mockPublicKey.slice(0, 8) + "..." + mockPublicKey.slice(-6);

            setAddress(mockAddress);
            setPublicKey(mockPublicKey);
            setBalance("2,450");
            setIsConnected(true);
            setIsDemo(true);

            localStorage.setItem("casperflow_connected", "demo");
            localStorage.setItem("casperflow_address", mockAddress);
        } finally {
            setIsConnecting(false);
        }
    }, [getWalletProvider, fetchBalance, network]);

    // Disconnect wallet
    const disconnect = useCallback(async () => {
        setIsConnected(false);
        setAddress(null);
        setPublicKey(null);
        setBalance("0");

        localStorage.removeItem("casperflow_connected");
        localStorage.removeItem("casperflow_address");
        localStorage.removeItem("casperflow_publicKey");

        // Disconnect from real wallet if available
        const walletInfo = getWalletProvider();
        if (walletInfo) {
            try {
                await walletInfo.provider.disconnectFromSite();
            } catch (error) {
                console.error("Failed to disconnect:", error);
            }
        }
    }, [getWalletProvider]);

    // Restore connection on mount
    useEffect(() => {
        const wasConnected = localStorage.getItem("casperflow_connected");
        const savedAddress = localStorage.getItem("casperflow_address");
        const savedPublicKey = localStorage.getItem("casperflow_publicKey");

        if (wasConnected && (savedAddress || savedPublicKey)) {
            const displayAddress = savedAddress || (savedPublicKey ? savedPublicKey.slice(0, 8) + "..." + savedPublicKey.slice(-6) : null);
            if (displayAddress) {
                setIsConnected(true);
                setAddress(displayAddress);
                setPublicKey(savedPublicKey);
                setIsDemo(wasConnected === "demo");

                // Fetch real balance if we have public key
                if (savedPublicKey && wasConnected !== "demo") {
                    fetchBalance(savedPublicKey, network);
                } else {
                    setBalance("2,450"); // Demo mode mock balance
                }
            }
        }
    }, [fetchBalance, network]);

    // Refetch balance when network changes
    useEffect(() => {
        const wasConnected = localStorage.getItem("casperflow_connected");
        if (isConnected && publicKey && wasConnected !== "demo") {
            fetchBalance(publicKey, network);
        }
    }, [network, isConnected, publicKey, fetchBalance]);

    const value: WalletContextType = {
        isConnected,
        isConnecting,
        isDemo,
        address,
        publicKey,
        balance,
        connect,
        disconnect,
        network,
        setNetwork,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
