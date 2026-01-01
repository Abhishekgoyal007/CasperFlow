"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard";
import { useWallet } from "@/context/WalletContext";
import { usePlans } from "@/context/PlansContext";
import { motion } from "framer-motion";
import {
    Code,
    Copy,
    CheckCircle,
    ExternalLink,
    Zap,
    Settings,
    Palette,
    Eye,
    Globe
} from "lucide-react";

export default function WidgetBuilderPage() {
    const { address } = useWallet();
    const { plans } = usePlans();
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");
    const [theme, setTheme] = useState<"dark" | "light" | "outline">("dark");
    const [buttonText, setButtonText] = useState("Subscribe with CSPR");
    const [copied, setCopied] = useState<string | null>(null);

    const myPlans = plans.filter(p => p.createdBy === address && p.isActive);
    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    // Generate embed codes
    const htmlEmbed = `<!-- CasperFlow Widget -->
<script src="https://casperflow.vercel.app/widget.js"></script>
<casperflow-button 
    plan-id="${selectedPlanId || 'YOUR_PLAN_ID'}"
    theme="${theme}"
    text="${buttonText}">
</casperflow-button>`;

    const jsEmbed = `<script src="https://casperflow.vercel.app/widget.js"></script>
<script>
    CasperFlow.init({
        planId: '${selectedPlanId || 'YOUR_PLAN_ID'}',
        container: '#subscribe-button',
        theme: '${theme}',
        text: '${buttonText}',
        onReady: function(button) {
            console.log('CasperFlow widget ready!');
        }
    });
</script>
<div id="subscribe-button"></div>`;

    const reactEmbed = `// Install: npm install casperflow-widget
import { CasperFlowButton } from 'casperflow-widget';

function MyComponent() {
    return (
        <CasperFlowButton 
            planId="${selectedPlanId || 'YOUR_PLAN_ID'}"
            theme="${theme}"
            text="${buttonText}"
            onSubscribe={(subscription) => {
                console.log('New subscription:', subscription);
            }}
        />
    );
}`;

    return (
        <DashboardLayout type="merchant">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Code className="w-8 h-8 text-blue-400" />
                        Widget Builder
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Create embeddable subscription buttons for your website
                    </p>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Globe className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Accept Subscriptions Anywhere
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Embed a CasperFlow subscribe button on your website, blog, or app.
                                Users can subscribe directly without leaving your site.
                                Works with any website - WordPress, Shopify, custom sites, and more!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Configuration Panel */}
                    <div className="space-y-6">
                        {/* Select Plan */}
                        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-purple-400" />
                                Configure Widget
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Select Plan</label>
                                    <select
                                        value={selectedPlanId}
                                        onChange={(e) => setSelectedPlanId(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="">Choose a plan...</option>
                                        {myPlans.map(plan => (
                                            <option key={plan.id} value={plan.id}>
                                                {plan.name} - {plan.price} CSPR/{plan.period}
                                            </option>
                                        ))}
                                    </select>
                                    {myPlans.length === 0 && (
                                        <p className="text-xs text-yellow-400 mt-2">
                                            You haven't created any plans yet. Create a plan first!
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Button Text</label>
                                    <input
                                        type="text"
                                        value={buttonText}
                                        onChange={(e) => setButtonText(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">
                                        <Palette className="w-4 h-4 inline mr-1" />
                                        Theme
                                    </label>
                                    <div className="flex gap-2">
                                        {(['dark', 'light', 'outline'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTheme(t)}
                                                className={`flex-1 py-2 px-4 rounded-lg capitalize transition-all ${theme === t
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-green-400" />
                                Live Preview
                            </h3>

                            <div className="bg-white/5 rounded-xl p-8 flex items-center justify-center min-h-[120px]">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${theme === 'dark'
                                            ? 'bg-gradient-to-r from-red-500 to-purple-500 text-white shadow-lg shadow-red-500/20'
                                            : theme === 'light'
                                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/20'
                                                : 'bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                                        }`}
                                >
                                    <Zap className="w-5 h-5" />
                                    {buttonText}
                                </motion.button>
                            </div>

                            {selectedPlan && (
                                <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                    <div className="text-sm text-gray-500">Selected Plan:</div>
                                    <div className="font-semibold text-white">{selectedPlan.name}</div>
                                    <div className="text-green-400">{selectedPlan.price} CSPR/{selectedPlan.period}</div>
                                    {selectedPlan.trialEnabled && (
                                        <div className="text-yellow-400 text-sm mt-1">
                                            🎉 {selectedPlan.trialDays}-day free trial available
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Code Snippets */}
                    <div className="space-y-6">
                        {/* HTML Embed */}
                        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">HTML Embed</h3>
                                <button
                                    onClick={() => copyToClipboard(htmlEmbed, 'html')}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied === 'html' ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-sm">
                                <code className="text-green-400">{htmlEmbed}</code>
                            </pre>
                        </div>

                        {/* JavaScript Embed */}
                        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">JavaScript API</h3>
                                <button
                                    onClick={() => copyToClipboard(jsEmbed, 'js')}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied === 'js' ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-sm">
                                <code className="text-blue-400">{jsEmbed}</code>
                            </pre>
                        </div>

                        {/* React Component */}
                        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">React Component</h3>
                                <button
                                    onClick={() => copyToClipboard(reactEmbed, 'react')}
                                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    {copied === 'react' ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-sm">
                                <code className="text-purple-400">{reactEmbed}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Documentation Link */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Need Help?</h3>
                            <p className="text-gray-400 text-sm">
                                Check out our integration guide for detailed instructions
                            </p>
                        </div>
                        <a
                            href="/docs"
                            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                        >
                            View Documentation
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
