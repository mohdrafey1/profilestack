"use client";

import { useState } from "react";
import { useAuthStore, useProfileStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Button, Input, Textarea } from "@/components/ui";
import {
    Linkedin,
    Github,
    FileText,
    Briefcase,
    Users,
    Mail,
    Sparkles,
    Copy,
    Check,
    AlertCircle,
} from "lucide-react";

type PlatformType =
    | "linkedin"
    | "github"
    | "resume"
    | "freelance"
    | "job_portal"
    | "cover_letter";

const platforms: {
    id: PlatformType;
    name: string;
    icon: React.ElementType;
    description: string;
}[] = [
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: Linkedin,
        description: "Professional profile summary",
    },
    {
        id: "github",
        name: "GitHub",
        icon: Github,
        description: "README profile in markdown",
    },
    {
        id: "resume",
        name: "Resume",
        icon: FileText,
        description: "Structured resume content",
    },
    {
        id: "freelance",
        name: "Freelance",
        icon: Users,
        description: "Upwork, Fiverr bio",
    },
    {
        id: "job_portal",
        name: "Job Portal",
        icon: Briefcase,
        description: "ATS-optimized profile",
    },
    {
        id: "cover_letter",
        name: "Cover Letter",
        icon: Mail,
        description: "Tailored cover letter",
    },
];

export default function GeneratePage() {
    const { isGuest, accessToken } = useAuthStore();
    const { profile } = useProfileStore();
    const [selectedPlatform, setSelectedPlatform] =
        useState<PlatformType | null>(null);
    const [generatedContent, setGeneratedContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    // Cover letter specific
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");

    const hasProfileData =
        profile &&
        (profile.bio ||
            (profile.education && profile.education.length > 0) ||
            (profile.experience && profile.experience.length > 0) ||
            (profile.skills && profile.skills.length > 0));

    const handleGenerate = async () => {
        if (!selectedPlatform) return;

        if (isGuest) {
            setError(
                "AI generation requires a logged-in account. Please sign in with Google.",
            );
            return;
        }

        if (!hasProfileData) {
            setError(
                "Please add some profile data first (bio, education, experience, or skills).",
            );
            return;
        }

        setIsLoading(true);
        setError("");
        setGeneratedContent("");

        try {
            api.setToken(accessToken);
            const response = await api.generateForPlatform(selectedPlatform, {
                jobTitle:
                    selectedPlatform === "cover_letter" ? jobTitle : undefined,
                company:
                    selectedPlatform === "cover_letter" ? company : undefined,
            });
            setGeneratedContent(response.content);
        } catch (err) {
            console.error("Generation error:", err);
            setError("Failed to generate content. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    AI Generate
                </h1>
                <p className="text-slate-400">
                    Generate platform-specific profile content using AI
                </p>
            </div>

            {/* Platform Selector */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {platforms.map((platform) => (
                    <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                            selectedPlatform === platform.id
                                ? "bg-blue-500/10 border-blue-500/50"
                                : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                    >
                        <platform.icon
                            className={`w-8 h-8 mb-3 ${
                                selectedPlatform === platform.id
                                    ? "text-blue-400"
                                    : "text-slate-400"
                            }`}
                        />
                        <h3 className="text-white font-semibold">
                            {platform.name}
                        </h3>
                        <p className="text-slate-500 text-sm">
                            {platform.description}
                        </p>
                    </button>
                ))}
            </div>

            {/* Cover Letter Extra Fields */}
            {selectedPlatform === "cover_letter" && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <h3 className="text-white font-semibold">
                        Cover Letter Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            label="Job Title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Software Engineer"
                        />
                        <Input
                            label="Company Name"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Google"
                        />
                    </div>
                </div>
            )}

            {/* Generate Button */}
            {selectedPlatform && (
                <Button
                    onClick={handleGenerate}
                    isLoading={isLoading}
                    className="w-full md:w-auto"
                    disabled={!hasProfileData && !isGuest}
                >
                    <Sparkles className="w-4 h-4" />
                    Generate{" "}
                    {
                        platforms.find((p) => p.id === selectedPlatform)?.name
                    }{" "}
                    Content
                </Button>
            )}

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300">{error}</p>
                </div>
            )}

            {/* No Profile Data Warning */}
            {!hasProfileData && selectedPlatform && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <p className="text-amber-300">
                        Add some profile data (bio, education, experience, or
                        skills) to generate meaningful content.
                    </p>
                </div>
            )}

            {/* Generated Content */}
            {generatedContent && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                            Generated Content
                        </h3>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                        <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-relaxed">
                            {generatedContent}
                        </pre>
                    </div>
                </div>
            )}

            {/* Guest Mode Notice */}
            {isGuest && (
                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                    <p className="text-slate-400 text-sm">
                        <strong className="text-white">Note:</strong> AI
                        generation requires a Google account. Sign in to use
                        this feature.
                    </p>
                </div>
            )}
        </div>
    );
}
