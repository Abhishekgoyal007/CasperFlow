"use client";

import { Zap } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`${sizeClasses[size]} border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin`} />
            {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading CasperFlow...</p>
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10" />
                <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-24 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-16" />
                </div>
            </div>
            <div className="h-8 bg-white/10 rounded w-20 mb-2" />
            <div className="h-3 bg-white/5 rounded w-32" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse">
            <div className="h-10 bg-white/5 rounded mb-2" />
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded mb-2" />
            ))}
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
