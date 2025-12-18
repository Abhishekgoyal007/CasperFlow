"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    BarChart3,
    Zap,
    TrendingUp
} from "lucide-react";

export default function MerchantUsagePage() {
    const { isConnected, balance, network } = useWallet();

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Usage & Billing</h1>
                    <p className="text-gray-400 mt-1">Track API usage and billing metrics.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-sm text-gray-400">Total API Calls</div>
                        </div>
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-xs text-gray-500 mt-1">This month</div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="text-sm text-gray-400">Usage Revenue</div>
                        </div>
                        <div className="text-2xl font-bold text-green-400">0 CSPR</div>
                        <div className="text-xs text-gray-500 mt-1">From metered billing</div>
                    </div>

                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-sm text-gray-400">Wallet Balance</div>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {isConnected ? `${balance} CSPR` : "-- CSPR"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">{network}</div>
                    </div>
                </div>

                {/* Empty State for Usage Chart */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">API Usage Over Time</h3>
                    <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500">No usage data yet</p>
                            <p className="text-sm text-gray-600 mt-1">Usage metrics will appear when subscribers make API calls</p>
                        </div>
                    </div>
                </div>

                {/* Billing History */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Billing History</h3>
                    <div className="text-center py-8">
                        <p className="text-gray-500">No billing records yet</p>
                        <p className="text-sm text-gray-600 mt-1">Billing events will appear here</p>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Mode:</span> Usage data is tracked via the UsageMeter contract (ready for deployment).
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
