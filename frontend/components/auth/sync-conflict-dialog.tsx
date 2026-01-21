"use client";

import { Modal, Button } from "@/components/ui";
import { Cloud, HardDrive, AlertTriangle } from "lucide-react";
import type { Profile } from "@/types";

interface SyncConflictDialogProps {
    isOpen: boolean;
    localProfile: Profile | null;
    cloudProfile: Profile | null;
    onChooseLocal: () => void;
    onChooseCloud: () => void;
    isLoading?: boolean;
}

export function SyncConflictDialog({
    isOpen,
    localProfile,
    cloudProfile,
    onChooseLocal,
    onChooseCloud,
    isLoading,
}: SyncConflictDialogProps) {
    const countItems = (profile: Profile | null) => {
        if (!profile)
            return { education: 0, experience: 0, skills: 0, projects: 0 };
        return {
            education: profile.education?.length || 0,
            experience: profile.experience?.length || 0,
            skills: profile.skills?.length || 0,
            projects: profile.projects?.length || 0,
        };
    };

    const localCounts = countItems(localProfile);
    const cloudCounts = countItems(cloudProfile);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {}}
            title="Profile Data Conflict"
            size="lg"
        >
            <div className="space-y-6">
                {/* Warning */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <p className="text-amber-200 text-sm">
                        You have profile data stored locally AND in the cloud.
                        Choose which one to keep.
                    </p>
                </div>

                {/* Comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Local Option */}
                    <button
                        onClick={onChooseLocal}
                        disabled={isLoading}
                        className="p-6 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-blue-500/50 transition-all text-left group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <HardDrive className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">
                                    Use Local Data
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    From this browser
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">
                                    Education
                                </span>
                                <span className="text-white">
                                    {localCounts.education} entries
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">
                                    Experience
                                </span>
                                <span className="text-white">
                                    {localCounts.experience} entries
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Skills</span>
                                <span className="text-white">
                                    {localCounts.skills} entries
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Projects</span>
                                <span className="text-white">
                                    {localCounts.projects} entries
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            This will upload your local data to the cloud and
                            replace existing cloud data.
                        </p>
                    </button>

                    {/* Cloud Option */}
                    <button
                        onClick={onChooseCloud}
                        disabled={isLoading}
                        className="p-6 rounded-2xl bg-slate-800 border-2 border-slate-700 hover:border-cyan-500/50 transition-all text-left group"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                <Cloud className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">
                                    Use Cloud Data
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    From your account
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">
                                    Education
                                </span>
                                <span className="text-white">
                                    {cloudCounts.education} entries
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">
                                    Experience
                                </span>
                                <span className="text-white">
                                    {cloudCounts.experience} entries
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Skills</span>
                                <span className="text-white">
                                    {cloudCounts.skills} entries
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Projects</span>
                                <span className="text-white">
                                    {cloudCounts.projects} entries
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4">
                            This will discard your local data and use your
                            existing cloud profile.
                        </p>
                    </button>
                </div>

                {isLoading && (
                    <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </Modal>
    );
}
