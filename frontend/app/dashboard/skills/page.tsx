"use client";

import { useState } from "react";
import { useAuthStore, useProfileStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Modal, Input, Select, Button, EmptyState } from "@/components/ui";
import { Plus, Code, X } from "lucide-react";
import type { Skill } from "@/types";

const skillLevels = [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
    { value: "EXPERT", label: "Expert" },
];

const levelColors: Record<string, string> = {
    BEGINNER: "bg-slate-700 text-slate-300",
    INTERMEDIATE: "bg-blue-500/20 text-blue-400",
    ADVANCED: "bg-cyan-500/20 text-cyan-400",
    EXPERT: "bg-green-500/20 text-green-400",
};

export default function SkillsPage() {
    const { isGuest, accessToken } = useAuthStore();
    const { profile, setProfile } = useProfileStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        level: "INTERMEDIATE",
        category: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const skills = profile?.skills || [];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isGuest) {
                const newSkill: Skill = {
                    id: `local-${Date.now()}`,
                    name: form.name,
                    level: form.level as Skill["level"],
                    category: form.category || undefined,
                };
                setProfile({ ...profile!, skills: [...skills, newSkill] });
            } else {
                api.setToken(accessToken);
                await api.addSkill(form);
                const res = await api.getProfile();
                setProfile(res.profile);
            }

            setForm({ name: "", level: "INTERMEDIATE", category: "" });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to add skill:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            if (isGuest) {
                setProfile({
                    ...profile!,
                    skills: skills.filter((s) => s.id !== id),
                });
            } else {
                api.setToken(accessToken);
                await api.deleteSkill(id);
                const res = await api.getProfile();
                setProfile(res.profile);
            }
        } catch (error) {
            console.error("Failed to delete skill:", error);
        }
    };

    // Group skills by category
    const grouped = skills.reduce(
        (acc, skill) => {
            const cat = skill.category || "Other";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        },
        {} as Record<string, Skill[]>,
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Skills
                    </h1>
                    <p className="text-slate-400">
                        Add your technical and soft skills
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Add Skill
                </Button>
            </div>

            {/* Skills Grid */}
            {skills.length === 0 ? (
                <EmptyState
                    icon={<Code className="w-8 h-8" />}
                    title="No skills added"
                    description="Add your programming languages, frameworks, tools, and soft skills."
                    action={
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Add Skill
                        </Button>
                    }
                />
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(
                        ([category, categorySkills]) => (
                            <div key={category}>
                                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">
                                    {category}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {categorySkills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                                        >
                                            <span className="text-white">
                                                {skill.name}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs ${levelColors[skill.level]}`}
                                            >
                                                {skill.level}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleDelete(skill.id)
                                                }
                                                className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-all"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ),
                    )}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Skill"
                size="sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Skill Name *"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="React, Python, Leadership..."
                        required
                    />
                    <Select
                        label="Proficiency Level"
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                        options={skillLevels}
                    />
                    <Input
                        label="Category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Frontend, Backend, Soft Skills..."
                    />
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            Add Skill
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
