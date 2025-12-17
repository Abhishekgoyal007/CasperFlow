"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { Wallet, ChevronDown, LogOut, Copy, Check, ExternalLink, Loader2 } from "lucide-react";

export function ConnectWalletButton() {
    const { isConnected, isConnecting, address, balance, connect, disconnect, network, setNetwork } = useWallet();
    const [showDropdown, setShowDropdown] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    // Show loading when network changes
    useEffect(() => {
        if (isConnected && balance === "0") {
            setIsLoadingBalance(true);
            const timer = setTimeout(() => setIsLoadingBalance(false), 2000);
            return () => clearTimeout(timer);
        }
        setIsLoadingBalance(false);
    }, [network, balance, isConnected]);

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Format balance display
    const displayBalance = isLoadingBalance ? "..." : balance;

    if (isConnecting) {
        return (
            <button
                disabled
                className="flex items-center gap-2 bg-white/10 text-gray-400 px-4 py-2.5 rounded-xl font-medium"
            >
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Connecting...
            </button>
        );
    }

    if (isConnected) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-cyan-500/20 hover:from-green-500/30 hover:to-cyan-500/30 border border-green-500/30 text-white px-4 py-2.5 rounded-xl font-medium transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-semibold flex items-center gap-1">
                            {isLoadingBalance && <Loader2 className="w-3 h-3 animate-spin" />}
                            {displayBalance} CSPR
                        </div>
                        <div className="text-xs text-gray-400">{address}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>

                {showDropdown && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1a24] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {/* Network Selector */}
                            <div className="p-4 border-b border-white/10">
                                <div className="text-xs text-gray-500 mb-2">Network</div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setNetwork("testnet")}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${network === "testnet"
                                                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                            }`}
                                    >
                                        Testnet
                                    </button>
                                    <button
                                        onClick={() => setNetwork("mainnet")}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${network === "mainnet"
                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                            }`}
                                    >
                                        Mainnet
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-2">
                                <button
                                    onClick={handleCopy}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-white/5 rounded-lg transition-all"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                    <span className="text-sm">{copied ? "Copied!" : "Copy Address"}</span>
                                </button>

                                <a
                                    href={`https://${network === "testnet" ? "testnet." : ""}cspr.live/account/${address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-300 hover:bg-white/5 rounded-lg transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span className="text-sm">View on Explorer</span>
                                </a>

                                <button
                                    onClick={() => {
                                        disconnect();
                                        setShowDropdown(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">Disconnect</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={connect}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-500/25"
        >
            <Wallet className="w-5 h-5" />
            Connect Wallet
        </button>
    );
}
