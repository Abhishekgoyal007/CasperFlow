"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    BarChart3,
    Zap
} from "lucide-react";

export default function UserUsagePage() {
    const { isConnected, balance, network } = useWallet();

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Usage</h1>
                    <p className="text-gray-400 mt-1">Track your API usage across subscriptions.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-500">API Calls Today</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-500">API Calls This Month</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-green-400">0 CSPR</div>
                        <div className="text-sm text-gray-500">Usage Charges</div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Usage History</h3>
                    <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500">No usage data yet</p>
                            <p className="text-sm text-gray-600 mt-1">Subscribe to a plan to start tracking usage</p>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Mode:</span> Usage is tracked via the UsageMeter contract.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
