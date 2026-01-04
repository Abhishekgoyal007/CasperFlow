"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Book,
    Code2,
    Zap,
    CheckCircle,
    Copy,
    ArrowRight,
    Globe,
    Bot,
    Cpu,
    Layout,
    MessageSquare,
    Send,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    Key,
    Shield,
    Clock
} from "lucide-react";

// Code snippets for different languages
const codeExamples = {
    javascript: `// Install: npm install node-fetch

const API_KEY = 'cf_sk_your_api_key_here';

async function verifySubscription(userApiKey) {
    const response = await fetch(
        \`https://casperflow.vercel.app/api/verify?apiKey=\${userApiKey}\`
    );
    const result = await response.json();
    
    if (result.valid) {
        console.log('✅ Valid subscription!');
        console.log('Plan:', result.planName);
        console.log('Expires:', result.expiresAtHuman);
        return true;
    } else {
        console.log('❌ Invalid or expired subscription');
        return false;
    }
}

// Usage in your API endpoint
app.get('/api/my-service', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    if (await verifySubscription(apiKey)) {
        // Grant access to your service
        res.json({ data: 'Your premium content here' });
    } else {
        res.status(401).json({ error: 'Subscription required' });
    }
});`,

    python: `# Install: pip install requests

import requests

def verify_subscription(user_api_key: str) -> dict:
    """Verify a user's subscription with CasperFlow"""
    response = requests.get(
        f"https://casperflow.vercel.app/api/verify?apiKey={user_api_key}"
    )
    return response.json()

# Usage in FastAPI
from fastapi import FastAPI, Header, HTTPException

app = FastAPI()

@app.get("/api/my-service")
async def my_service(x_api_key: str = Header(...)):
    result = verify_subscription(x_api_key)
    
    if result.get("valid"):
        return {"data": "Your premium content here"}
    else:
        raise HTTPException(status_code=401, detail="Subscription required")

# Usage in Flask
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/my-service")
def my_service():
    api_key = request.headers.get("X-API-Key")
    result = verify_subscription(api_key)
    
    if result.get("valid"):
        return jsonify({"data": "Your premium content here"})
    else:
        return jsonify({"error": "Subscription required"}), 401`,

    curl: `# Verify an API key
curl -X GET "https://casperflow.vercel.app/api/verify?apiKey=cf_sk_your_key_here"

# Response (valid subscription):
{
    "valid": true,
    "planName": "Pro API",
    "expiresAt": 1735689600000,
    "expiresAtHuman": "2025-01-01T00:00:00.000Z",
    "network": "testnet"
}

# Response (invalid/expired):
{
    "valid": false,
    "error": "API key not found or expired"
}`,

    aiAgent: `// AI Agent Integration (LangChain / AutoGPT style)

import { verifyApiKey } from './casperflow';

class PremiumAIAgent {
    private apiKey: string;
    
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }
    
    async run(task: string) {
        // Verify subscription before running
        const verification = await verifyApiKey(this.apiKey);
        
        if (!verification.valid) {
            throw new Error('Premium subscription required');
        }
        
        // Your AI agent logic here
        console.log(\`Running task: \${task}\`);
        console.log(\`Subscription: \${verification.planName}\`);
        
        // Execute AI tasks...
        return await this.executeTask(task);
    }
    
    private async executeTask(task: string) {
        // Your AI logic
        return { result: 'Task completed!' };
    }
}

// Usage
const agent = new PremiumAIAgent('cf_sk_user_key_here');
await agent.run('Generate a marketing report');`
};

// Integration types
const integrationTypes = [
    {
        id: "api",
        name: "REST API / Backend",
        icon: Code2,
        description: "Integrate subscription verification into your API endpoints",
        languages: ["Node.js", "Python", "Go", "Ruby"]
    },
    {
        id: "website",
        name: "Website / SaaS",
        icon: Layout,
        description: "Add subscription paywalls to your web application",
        languages: ["React", "Next.js", "Vue", "Angular"]
    },
    {
        id: "ai-agent",
        name: "AI Agent",
        icon: Bot,
        description: "Gate AI agent features behind subscriptions",
        languages: ["LangChain", "AutoGPT", "CrewAI"]
    },
    {
        id: "ai-api",
        name: "AI/ML API",
        icon: Cpu,
        description: "Monetize your AI models with subscriptions",
        languages: ["OpenAI-style", "HuggingFace", "Custom"]
    }
];

export default function DocsPage() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [selectedLang, setSelectedLang] = useState<'javascript' | 'python' | 'curl' | 'aiAgent'>('javascript');
    const [expandedSection, setExpandedSection] = useState<string | null>('quickstart');
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        company: '',
        integrationType: '',
        message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Contact form submitted:', contactForm);
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 5000);
        setContactForm({ name: '', email: '', company: '', integrationType: '', message: '' });
    };

    const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
        <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
                onClick={() => setExpandedSection(expandedSection === id ? null : id)}
                className="w-full flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-colors"
            >
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {expandedSection === id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
            </button>
            {expandedSection === id && (
                <div className="p-6 border-t border-white/10">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <main className="min-h-screen bg-[#0a0a0f]">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">CasperFlow</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                                Home
                            </Link>
                            <Link
                                href="/app"
                                className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                                Launch App
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                        <Book className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-400">Developer Documentation</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Integrate CasperFlow
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Add Web3 subscription billing to your service in minutes.
                        One API call to verify payments.
                    </p>
                </div>

                {/* How It Works */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: 1, icon: Layout, title: "Create Plan", desc: "Set up your subscription plan on CasperFlow dashboard" },
                            { step: 2, icon: Key, title: "User Subscribes", desc: "User pays with CSPR, receives unique API key" },
                            { step: 3, icon: Shield, title: "Verify Key", desc: "Your service calls our API to verify the key" },
                            { step: 4, icon: CheckCircle, title: "Grant Access", desc: "If valid, give user access to your service" }
                        ].map((item) => (
                            <div key={item.step} className="relative">
                                <div className="bg-[#12121a] border border-white/10 rounded-xl p-6 text-center h-full">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        {item.step}
                                    </div>
                                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                                {item.step < 4 && (
                                    <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-gray-600 -translate-y-1/2 z-10" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integration Types */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-8">Choose Your Integration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {integrationTypes.map((type) => (
                            <div key={type.id} className="bg-[#12121a] border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                                    <type.icon className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-2">{type.name}</h3>
                                <p className="text-sm text-gray-500 mb-3">{type.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {type.languages.map((lang) => (
                                        <span key={lang} className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Documentation Sections */}
                <div className="space-y-4 mb-16">
                    <Section id="quickstart" title="🚀 Quick Start (5 Minutes)">
                        <div className="space-y-6">
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <p className="text-green-400 text-sm">
                                    <strong>TL;DR:</strong> Just make one API call to verify a user's subscription. That's it!
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">Step 1: Create a Plan</h4>
                                <p className="text-gray-400 text-sm mb-2">
                                    Go to the <Link href="/app/merchant/plans" className="text-purple-400 hover:underline">Merchant Dashboard</Link> and create a subscription plan.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">Step 2: Users Subscribe</h4>
                                <p className="text-gray-400 text-sm mb-2">
                                    Users pay with CSPR and receive a unique API key like: <code className="bg-white/10 px-2 py-1 rounded text-sm">cf_sk_abc123xyz...</code>
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">Step 3: Verify in Your Backend</h4>
                                <p className="text-gray-400 text-sm mb-4">
                                    When a user sends a request to your service, verify their key:
                                </p>

                                {/* Language Tabs */}
                                <div className="flex gap-2 mb-4">
                                    {(['javascript', 'python', 'curl', 'aiAgent'] as const).map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setSelectedLang(lang)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedLang === lang
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            {lang === 'aiAgent' ? 'AI Agent' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                                        </button>
                                    ))}
                                </div>

                                {/* Code Block */}
                                <div className="relative">
                                    <pre className="bg-black/50 border border-white/10 rounded-lg p-4 overflow-x-auto">
                                        <code className="text-sm text-gray-300">
                                            {codeExamples[selectedLang]}
                                        </code>
                                    </pre>
                                    <button
                                        onClick={() => copyCode(codeExamples[selectedLang], selectedLang)}
                                        className="absolute top-3 right-3 p-2 bg-white/10 rounded hover:bg-white/20 transition-colors"
                                    >
                                        {copiedCode === selectedLang ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section id="api-reference" title="📚 API Reference">
                        <div className="space-y-6">
                            <div className="bg-[#0d0d14] border border-white/10 rounded-lg overflow-hidden">
                                <div className="bg-green-500/10 px-4 py-2 border-b border-white/10">
                                    <span className="text-green-400 font-mono text-sm">GET</span>
                                    <span className="text-white font-mono text-sm ml-2">/api/verify</span>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-400 text-sm mb-4">Verify if an API key has an active subscription.</p>

                                    <h5 className="text-white font-medium mb-2">Query Parameters</h5>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-2 text-gray-400">Parameter</th>
                                                <th className="text-left py-2 text-gray-400">Type</th>
                                                <th className="text-left py-2 text-gray-400">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-2 text-purple-400 font-mono">apiKey</td>
                                                <td className="py-2 text-gray-400">string</td>
                                                <td className="py-2 text-gray-400">The user's API key (required)</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h5 className="text-white font-medium mt-4 mb-2">Response</h5>
                                    <pre className="bg-black/50 rounded-lg p-4 text-sm">
                                        <code className="text-gray-300">{`{
  "valid": true,
  "planName": "Pro API",
  "expiresAt": 1735689600000,
  "expiresAtHuman": "2025-01-01T00:00:00.000Z",
  "network": "testnet"
}`}</code>
                                    </pre>
                                </div>
                            </div>

                            <div className="bg-[#0d0d14] border border-white/10 rounded-lg overflow-hidden">
                                <div className="bg-blue-500/10 px-4 py-2 border-b border-white/10">
                                    <span className="text-blue-400 font-mono text-sm">GET</span>
                                    <span className="text-white font-mono text-sm ml-2">/api/plans</span>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-400 text-sm">Get list of available subscription plans.</p>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section id="best-practices" title="✅ Best Practices">
                        <div className="space-y-4">
                            {[
                                { title: "Cache verification results", desc: "Don't call /api/verify on every request. Cache for a few minutes.", icon: Clock },
                                { title: "Handle errors gracefully", desc: "If our API is down, decide whether to allow or deny access.", icon: Shield },
                                { title: "Use HTTPS", desc: "Always use HTTPS when sending API keys.", icon: Key },
                                { title: "Don't expose keys client-side", desc: "Only verify keys in your backend, never in frontend JavaScript.", icon: Code2 }
                            ].map((practice, i) => (
                                <div key={i} className="flex items-start gap-4 bg-white/5 rounded-lg p-4">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                        <practice.icon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{practice.title}</h4>
                                        <p className="text-sm text-gray-500">{practice.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                {/* Contact Form */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Need Custom Integration?</h2>
                            <p className="text-gray-400">
                                Don't see your use case? We'll help you integrate CasperFlow into your service.
                            </p>
                        </div>

                        {formSubmitted ? (
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">Request Submitted!</h3>
                                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Your Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                            placeholder="john@company.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Company/Project Name</label>
                                    <input
                                        type="text"
                                        value={contactForm.company}
                                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Integration Type *</label>
                                    <select
                                        required
                                        value={contactForm.integrationType}
                                        onChange={(e) => setContactForm({ ...contactForm, integrationType: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="" className="bg-[#12121a]">Select type...</option>
                                        <option value="api" className="bg-[#12121a]">REST API / Backend</option>
                                        <option value="website" className="bg-[#12121a]">Website / SaaS</option>
                                        <option value="ai-agent" className="bg-[#12121a]">AI Agent</option>
                                        <option value="ai-api" className="bg-[#12121a]">AI/ML API</option>
                                        <option value="mobile" className="bg-[#12121a]">Mobile App</option>
                                        <option value="discord-bot" className="bg-[#12121a]">Discord/Telegram Bot</option>
                                        <option value="other" className="bg-[#12121a]">Other (describe below)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Tell us about your project *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                                        placeholder="Describe your project and how you want to integrate CasperFlow..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Submit Request
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/10 mt-16 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    <p>CasperFlow © 2026. Built on Casper Network.</p>
                </div>
            </footer>
        </main>
    );
}
