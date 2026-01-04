"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Twitter, Github, MessageCircle, FileText } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 rounded-full blur-[200px] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-400">Live on Casper Testnet</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
                        Ready to Build the Future of{" "}
                        <span className="bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                            Web3 Billing?
                        </span>
                    </h2>

                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join us in revolutionizing how dApps monetize on Casper.
                        Get started with CasperFlow today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-500/25">
                            Launch Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="w-full sm:w-auto bg-transparent border border-white/10 hover:bg-white/5 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all">
                            <Github className="w-5 h-5" />
                            View on GitHub
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export function Footer() {
    const footerLinks = {
        Product: [
            { name: "Features", href: "#features" },
            { name: "How It Works", href: "#how-it-works" },
            { name: "Use Cases", href: "#use-cases" },
            { name: "Pricing", href: "#pricing" },
        ],
        Developers: [
            { name: "Documentation", href: "/docs" },
            { name: "SDK Reference", href: "/docs/sdk" },
            { name: "Smart Contracts", href: "/docs/contracts" },
            { name: "Examples", href: "/docs/examples" },
        ],
        Resources: [
            { name: "Blog", href: "/blog" },
            { name: "Casper Network", href: "https://casper.network" },
            { name: "Hackathon Guide", href: "#" },
            { name: "Support", href: "#" },
        ],
    };

    return (
        <footer className="border-t border-white/10 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <img src="/logo.png" alt="CasperFlow" className="w-10 h-10 rounded-xl" />
                            <span className="text-xl font-bold text-white">
                                Casper<span className="bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">Flow</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                            The first on-chain subscription and usage-based billing protocol
                            for the Casper blockchain ecosystem.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Twitter className="w-5 h-5 text-gray-400" />
                            </a>
                            <a href="#" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5 text-gray-400" />
                            </a>
                            <a href="#" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <MessageCircle className="w-5 h-5 text-gray-400" />
                            </a>
                            <a href="#" className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <FileText className="w-5 h-5 text-gray-400" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-white mb-6">{category}</h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-gray-500">
                        © 2026 CasperFlow. Built for Casper Hackathon 2026.
                    </div>
                    <div className="flex items-center gap-8 text-gray-500">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
