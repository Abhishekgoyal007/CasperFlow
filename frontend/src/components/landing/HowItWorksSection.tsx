"use client";

import { motion } from "framer-motion";
import { Store, UserPlus, Activity, Receipt, ArrowRight } from "lucide-react";

const steps = [
    {
        step: 1,
        icon: Store,
        title: "Merchant Creates Plan",
        description: "Define your subscription tiers, usage rates, and billing cycles. Deploy to Casper Testnet in minutes.",
        code: `CasperFlow.createPlan({
  name: "Pro API",
  basePrice: 10, // CSPR/month
  usagePrice: 0.001, // per request
  billingCycle: "monthly"
});`,
    },
    {
        step: 2,
        icon: UserPlus,
        title: "User Subscribes",
        description: "Users connect wallet, choose a plan, and subscribe. Option to pay with staked CSPR rewards.",
        code: `await CasperFlow.subscribe({
  planId: "pro-api",
  paymentMethod: "staked",
  autoRenew: true
});`,
    },
    {
        step: 3,
        icon: Activity,
        title: "Usage is Tracked",
        description: "Every API call, compute unit, or custom metric is recorded on-chain. Fully transparent.",
        code: `// Your backend calls this
await CasperFlow.recordUsage({
  userId: "user_123",
  units: 1, // 1 API call
  metric: "api_requests"
});`,
    },
    {
        step: 4,
        icon: Receipt,
        title: "Auto-Billing & Invoice",
        description: "At cycle end, usage is calculated, invoice generated on-chain, and payment processed automatically.",
        code: `// Automatic at cycle end
// Invoice: Base 10 + Usage 2.5
// Total: 12.5 CSPR
// ✅ Paid from staking rewards`,
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-red-500 rounded-full blur-[250px] opacity-10 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-500 rounded-full blur-[250px] opacity-10 -translate-y-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <Activity className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-400">How It Works</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        From Setup to{" "}
                        <span className="bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                            Revenue in 4 Steps
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Integrate CasperFlow into your dApp and start accepting subscription
                        payments in under an hour.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="space-y-10">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10"
                        >
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                {/* Content Side */}
                                <div className={`flex-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <div className="flex items-start gap-5">
                                        <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center">
                                            <step.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="inline-block px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold mb-3">
                                                STEP {step.step}
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{step.title}</h3>
                                            <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Code Side */}
                                <div className={`flex-1 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                                    <div className="bg-[#0d0d12] border border-white/10 rounded-xl overflow-hidden h-full">
                                        <div className="flex items-center justify-between px-4 py-3 bg-[#111118] border-b border-white/5">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                            </div>
                                            <span className="text-xs text-gray-500">TypeScript</span>
                                        </div>
                                        <pre className="p-5 text-sm overflow-x-auto">
                                            <code className="text-gray-300 font-mono whitespace-pre">{step.code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl inline-flex items-center gap-2 transition-all hover:scale-105">
                        View Full Documentation
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
