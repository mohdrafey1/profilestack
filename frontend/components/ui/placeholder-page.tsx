"use client";

import { Construction } from "lucide-react";

interface PlaceholderPageProps {
    title: string;
    description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6">
                <Construction className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <p className="text-slate-400 max-w-md">{description}</p>
            <p className="text-sm text-slate-500 mt-4">Coming soon...</p>
        </div>
    );
}
