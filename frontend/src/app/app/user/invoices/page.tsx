"use client";

import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import {
    FileText,
    Zap,
    ExternalLink
} from "lucide-react";

export default function UserInvoicesPage() {
    const { isConnected, network, publicKey } = useWallet();

    return (
        <DashboardLayout type="user">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white">Invoices</h1>
                    <p className="text-gray-400 mt-1">View your payment history and invoices.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-white">0</div>
                        <div className="text-sm text-gray-500">Total Payments</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-green-400">0 CSPR</div>
                        <div className="text-sm text-gray-500">Total Spent</div>
                    </div>
                    <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                        <div className="text-2xl font-bold text-yellow-400">0</div>
                        <div className="text-sm text-gray-500">Pending</div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="bg-[#12121a] border border-white/10 rounded-2xl p-8">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Invoices Yet</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            Your payment history will appear here after you subscribe to plans.
                        </p>
                        {isConnected && publicKey && (
                            <a
                                href={`https://${network === 'testnet' ? 'testnet.' : ''}cspr.live/account/${publicKey}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                            >
                                View Transactions <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div className="text-sm text-gray-400">
                            <span className="text-yellow-400">Testnet Mode:</span> All payments are recorded on-chain for full transparency.
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
