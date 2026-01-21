"use client";

import { useState, useEffect } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuthStore, useProfileStore } from "@/lib/store";
import { api } from "@/lib/api";
import { SyncConflictDialog } from "./sync-conflict-dialog";
import {
    User,
    Layers,
    ArrowRight,
    Sparkles,
    Cloud,
    Zap,
    Shield,
    RefreshCw,
    Globe,
    FileText,
    Linkedin,
    Github,
    Briefcase,
    ChevronDown,
} from "lucide-react";
import type { Profile } from "@/types";

export function AuthPage() {
    const [guestName, setGuestName] = useState("");
    const [showGuestInput, setShowGuestInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Sync conflict state
    const [showSyncDialog, setShowSyncDialog] = useState(false);
    const [localProfileData, setLocalProfileData] = useState<Profile | null>(
        null,
    );
    const [cloudProfileData, setCloudProfileData] = useState<Profile | null>(
        null,
    );
    const [pendingLoginData, setPendingLoginData] = useState<{
        user: any;
        token: string;
    } | null>(null);

    const { setUser, setGuestUser, isGuest } = useAuthStore();
    const { profile, setProfile, clearProfile } = useProfileStore();
    const router = useRouter();

    // Check if local profile has meaningful data
    const hasLocalData = (p: Profile | null) => {
        if (!p) return false;
        return (
            p.bio ||
            (p.education && p.education.length > 0) ||
            (p.experience && p.experience.length > 0) ||
            (p.skills && p.skills.length > 0) ||
            (p.projects && p.projects.length > 0) ||
            (p.certifications && p.certifications.length > 0)
        );
    };

    const hasCloudData = (p: Profile | null) => hasLocalData(p);

    const handleGoogleSuccess = async (
        credentialResponse: CredentialResponse,
    ) => {
        if (!credentialResponse.credential) {
            setError("Google login failed");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await api.googleLogin(
                credentialResponse.credential,
            );
            api.setToken(response.token);

            // Fetch cloud profile
            const cloudRes = await api.getProfile();
            const cloudProfile = cloudRes.profile;

            // Check if we have local guest data AND cloud has data - show conflict dialog
            const localData = isGuest && profile ? profile : null;

            if (hasLocalData(localData) && hasCloudData(cloudProfile)) {
                // Conflict - let user choose
                setLocalProfileData(localData);
                setCloudProfileData(cloudProfile);
                setPendingLoginData(response);
                setShowSyncDialog(true);
                setIsLoading(false);
                return;
            }

            // No conflict - proceed with appropriate data
            if (hasLocalData(localData) && !hasCloudData(cloudProfile)) {
                // Sync local to cloud
                await api.syncLocalProfile(localData);
                const syncedRes = await api.getProfile();
                setUser(response.user, response.token);
                setProfile(syncedRes.profile);
            } else {
                // Use cloud data (or empty)
                setUser(response.user, response.token);
                setProfile(cloudProfile);
            }

            router.push("/dashboard");
        } catch (err) {
            setError("Failed to login. Please try again.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChooseLocal = async () => {
        if (!pendingLoginData || !localProfileData) return;
        setIsLoading(true);

        try {
            api.setToken(pendingLoginData.token);
            await api.syncLocalProfile(localProfileData);
            const res = await api.getProfile();
            setUser(pendingLoginData.user, pendingLoginData.token);
            setProfile(res.profile);
            setShowSyncDialog(false);
            router.push("/dashboard");
        } catch (err) {
            setError("Failed to sync local data");
            console.error("Sync error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChooseCloud = async () => {
        if (!pendingLoginData || !cloudProfileData) return;
        setIsLoading(true);

        try {
            setUser(pendingLoginData.user, pendingLoginData.token);
            setProfile(cloudProfileData);
            setShowSyncDialog(false);
            router.push("/dashboard");
        } catch (err) {
            setError("Failed to load cloud data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google login failed. Please try again.");
    };

    const handleGuestContinue = () => {
        if (!guestName.trim()) {
            setError("Please enter your name");
            return;
        }

        setGuestUser(guestName.trim());

        setProfile({
            id: `local-${Date.now()}`,
            userId: `guest-${Date.now()}`,
            firstName: guestName.split(" ")[0],
            lastName: guestName.split(" ").slice(1).join(" "),
            education: [],
            experience: [],
            skills: [],
            projects: [],
            certifications: [],
        });

        router.push("/dashboard");
    };

    const scrollToFeatures = () => {
        document
            .getElementById("features")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const features = [
        {
            icon: Cloud,
            title: "Store Once",
            description:
                "Enter your profile information once and keep it securely stored in the cloud.",
        },
        {
            icon: Sparkles,
            title: "AI-Powered Customization",
            description:
                "Our AI adapts your profile for different platforms automatically.",
        },
        {
            icon: Zap,
            title: "One-Click Export",
            description:
                "Generate platform-specific versions instantly with a single click.",
        },
        {
            icon: Shield,
            title: "Always Up-to-Date",
            description:
                "Update once, sync everywhere. Keep consistent information.",
        },
        {
            icon: RefreshCw,
            title: "Smart Suggestions",
            description:
                "Get AI-powered suggestions for skills and profile optimization.",
        },
        {
            icon: Globe,
            title: "Use Everywhere",
            description:
                "Export to job portals, freelance platforms, and networks.",
        },
    ];

    const platforms = [
        { icon: Linkedin, name: "LinkedIn" },
        { icon: Github, name: "GitHub" },
        { icon: FileText, name: "Resume" },
        { icon: Briefcase, name: "Job Portals" },
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sync Conflict Dialog */}
            <SyncConflictDialog
                isOpen={showSyncDialog}
                localProfile={localProfileData}
                cloudProfile={cloudProfileData}
                onChooseLocal={handleChooseLocal}
                onChooseCloud={handleChooseCloud}
                isLoading={isLoading}
            />

            {/* Hero Section with Login */}
            <section className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
                </div>

                <div className="relative w-full max-w-md z-10">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 shadow-lg shadow-blue-500/25">
                            <Layers className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            ProfileStack
                        </h1>
                        <p className="text-xl text-slate-400">
                            One Profile, Everywhere
                        </p>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-8 shadow-2xl">
                        <div className="space-y-6">
                            {/* Quick Features */}
                            <div className="space-y-3 mb-6">
                                {[
                                    "Store your profile once",
                                    "AI-powered customization",
                                    "Use everywhere instantly",
                                ].map((feature, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 text-slate-300"
                                    >
                                        <Sparkles className="w-4 h-4 text-cyan-400" />
                                        <span className="text-sm">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Google Login */}
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    theme="filled_black"
                                    size="large"
                                    width="300"
                                    text="continue_with"
                                    shape="pill"
                                />
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-slate-700" />
                                <span className="text-slate-500 text-sm">
                                    or
                                </span>
                                <div className="flex-1 h-px bg-slate-700" />
                            </div>

                            {/* Guest Mode */}
                            {!showGuestInput ? (
                                <button
                                    onClick={() => setShowGuestInput(true)}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
                                >
                                    <User className="w-5 h-5" />
                                    <span>Continue as Guest</span>
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={guestName}
                                        onChange={(e) =>
                                            setGuestName(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            handleGuestContinue()
                                        }
                                        className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleGuestContinue}
                                        disabled={!guestName.trim()}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                                    >
                                        <span>Continue</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <p className="text-xs text-slate-500 text-center">
                                        Guest data is stored locally and won't
                                        sync across devices
                                    </p>
                                </div>
                            )}

                            {error && (
                                <p className="text-red-400 text-sm text-center">
                                    {error}
                                </p>
                            )}
                            {isLoading && (
                                <div className="flex justify-center">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <button
                        onClick={scrollToFeatures}
                        className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-colors animate-bounce"
                    >
                        <span className="text-sm">Learn more</span>
                        <ChevronDown className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Why ProfileStack?
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Stop wasting time filling the same information
                            everywhere. Let AI do the heavy lifting.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-blue-500/50 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platforms Section */}
            <section className="py-24 px-4 border-t border-slate-800 bg-slate-950">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Generate for Any Platform
                    </h2>
                    <p className="text-slate-400 text-lg mb-12">
                        One profile, optimized for every platform you need
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {platforms.map((platform, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:scale-105 hover:border-blue-500/50 transition-all"
                            >
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
                                    <platform.icon className="w-7 h-7 text-white" />
                                </div>
                                <p className="text-white font-medium">
                                    {platform.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4 border-t border-slate-800 bg-slate-950">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                        How It Works
                    </h2>

                    <div className="space-y-8">
                        {[
                            {
                                step: "01",
                                title: "Create Your Profile",
                                desc: "Enter your education, experience, skills, and projects once.",
                            },
                            {
                                step: "02",
                                title: "Choose Platform",
                                desc: "Select the platform you want to generate content for.",
                            },
                            {
                                step: "03",
                                title: "AI Generates",
                                desc: "Our AI customizes tone, format, and emphasis for your target platform.",
                            },
                            {
                                step: "04",
                                title: "Copy & Use",
                                desc: "Copy the generated content and paste it wherever you need.",
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                                    <span className="text-white font-bold text-lg">
                                        {item.step}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-400">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 border-t border-slate-800 bg-slate-950">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-slate-400 text-lg mb-8">
                        Join thousands of students and professionals who save
                        hours every week.
                    </p>
                    <button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                    >
                        <span>Start Now – It's Free</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-slate-800 bg-slate-950">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Layers className="w-6 h-6 text-cyan-400" />
                        <span className="text-white font-semibold">
                            ProfileStack
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © 2025 ProfileStack. Made with ❤️
                    </p>
                </div>
            </footer>
        </div>
    );
}
