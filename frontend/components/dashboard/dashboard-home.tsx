"use client";

import { useProfileStore, useAuthStore } from "@/lib/store";
import {
    GraduationCap,
    Briefcase,
    Code,
    FolderKanban,
    Award,
    ArrowRight,
    Cloud,
    HardDrive,
    Sparkles,
} from "lucide-react";
import Link from "next/link";

export function DashboardHome() {
    const { profile } = useProfileStore();
    const { user, isGuest } = useAuthStore();

    const stats = [
        {
            label: "Education",
            count: profile?.education?.length || 0,
            icon: GraduationCap,
            href: "/dashboard/education",
        },
        {
            label: "Experience",
            count: profile?.experience?.length || 0,
            icon: Briefcase,
            href: "/dashboard/experience",
        },
        {
            label: "Skills",
            count: profile?.skills?.length || 0,
            icon: Code,
            href: "/dashboard/skills",
        },
        {
            label: "Projects",
            count: profile?.projects?.length || 0,
            icon: FolderKanban,
            href: "/dashboard/projects",
        },
        {
            label: "Certifications",
            count: profile?.certifications?.length || 0,
            icon: Award,
            href: "/dashboard/certifications",
        },
    ];

    const completionPercentage = Math.min(
        100,
        Math.round(
            ((profile?.bio ? 1 : 0) +
                (profile?.education?.length ? 1 : 0) +
                (profile?.experience?.length ? 1 : 0) +
                (profile?.skills?.length ? 1 : 0) +
                (profile?.projects?.length ? 1 : 0)) *
                20,
        ),
    );

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Welcome back, {profile?.firstName || user?.name || "User"}!
                    👋
                </h1>
                <p className="text-slate-400">
                    Manage your profile and generate platform-specific versions
                </p>
            </div>

            {/* Storage Info Banner */}
            {isGuest && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
                    <HardDrive className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-amber-200 font-medium">
                            Guest Mode Active
                        </p>
                        <p className="text-amber-200/70 text-sm">
                            Your data is stored locally. Sign in with Google to
                            sync across devices.
                        </p>
                    </div>
                </div>
            )}

            {/* Profile Completion */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">
                        Profile Completion
                    </h2>
                    <span className="text-2xl font-bold text-blue-400">
                        {completionPercentage}%
                    </span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
                {completionPercentage < 100 && (
                    <p className="text-slate-500 text-sm mt-3">
                        Add more details to improve your AI-generated profiles
                    </p>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="group p-4 lg:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300"
                    >
                        <stat.icon className="w-6 lg:w-8 h-6 lg:h-8 text-cyan-400 mb-3 lg:mb-4" />
                        <p className="text-2xl lg:text-3xl font-bold text-white mb-1">
                            {stat.count}
                        </p>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                        <div className="flex items-center gap-1 mt-2 lg:mt-3 text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Manage</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <Link
                    href="/dashboard/generate"
                    className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                                Generate Profile
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Create platform-specific versions with AI
                            </p>
                        </div>
                    </div>
                </Link>

                {isGuest && (
                    <Link
                        href="/"
                        className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                <Cloud className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    Sync to Cloud
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    Sign in with Google to save your data
                                </p>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}
