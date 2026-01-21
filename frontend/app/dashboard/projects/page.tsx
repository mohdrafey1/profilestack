"use client";

import { useState } from "react";
import { useAuthStore, useProfileStore } from "@/lib/store";
import { api } from "@/lib/api";
import {
    Modal,
    Input,
    Textarea,
    Button,
    Card,
    EmptyState,
} from "@/components/ui";
import { Plus, FolderKanban, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";

const emptyProject: Omit<Project, "id"> = {
    title: "",
    description: "",
    techStack: [],
    liveUrl: "",
    repoUrl: "",
    startDate: "",
    endDate: "",
};

export default function ProjectsPage() {
    const { isGuest, accessToken } = useAuthStore();
    const { profile, setProfile } = useProfileStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyProject);
    const [techInput, setTechInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const projects = profile?.projects || [];

    const openAddModal = () => {
        setForm(emptyProject);
        setTechInput("");
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setForm({
            title: project.title,
            description: project.description || "",
            techStack: project.techStack || [],
            liveUrl: project.liveUrl || "",
            repoUrl: project.repoUrl || "",
            startDate: project.startDate?.split("T")[0] || "",
            endDate: project.endDate?.split("T")[0] || "",
        });
        setTechInput("");
        setEditingId(project.id);
        setIsModalOpen(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addTech = () => {
        if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
            setForm({
                ...form,
                techStack: [...form.techStack, techInput.trim()],
            });
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        setForm({
            ...form,
            techStack: form.techStack.filter((t) => t !== tech),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                ...form,
                startDate: form.startDate
                    ? new Date(form.startDate).toISOString()
                    : undefined,
                endDate: form.endDate
                    ? new Date(form.endDate).toISOString()
                    : undefined,
            };

            if (isGuest) {
                let newProjects: Project[];
                if (editingId) {
                    newProjects = projects.map((p) =>
                        p.id === editingId ? { ...p, ...data } : p,
                    );
                } else {
                    newProjects = [
                        ...projects,
                        { id: `local-${Date.now()}`, ...data } as Project,
                    ];
                }
                setProfile({ ...profile!, projects: newProjects });
            } else {
                api.setToken(accessToken);
                if (editingId) {
                    await api.updateProject(editingId, data);
                } else {
                    await api.addProject(data);
                }
                const res = await api.getProfile();
                setProfile(res.profile);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            if (isGuest) {
                setProfile({
                    ...profile!,
                    projects: projects.filter((p) => p.id !== id),
                });
            } else {
                api.setToken(accessToken);
                await api.deleteProject(id);
                const res = await api.getProfile();
                setProfile(res.profile);
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Projects
                    </h1>
                    <p className="text-slate-400">
                        Showcase your personal and professional projects
                    </p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4" />
                    Add Project
                </Button>
            </div>

            {/* List */}
            {projects.length === 0 ? (
                <EmptyState
                    icon={<FolderKanban className="w-8 h-8" />}
                    title="No projects added"
                    description="Add your side projects, open source contributions, and portfolio pieces."
                    action={
                        <Button onClick={openAddModal}>
                            <Plus className="w-4 h-4" />
                            Add Project
                        </Button>
                    }
                />
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <Card
                            key={project.id}
                            onEdit={() => openEditModal(project)}
                            onDelete={() => handleDelete(project.id)}
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {project.title}
                            </h3>
                            {project.description && (
                                <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                                    {project.description}
                                </p>
                            )}
                            {project.techStack.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 text-xs rounded-md bg-slate-800 text-cyan-400"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-3 mt-3">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </a>
                                )}
                                {project.repoUrl && (
                                    <a
                                        href={project.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                                    >
                                        <Github className="w-4 h-4" />
                                        Code
                                    </a>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Project" : "Add Project"}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Project Title *"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="My Awesome Project"
                        required
                    />
                    <Textarea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="What does this project do? What problem does it solve?"
                    />

                    {/* Tech Stack */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Tech Stack
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    (e.preventDefault(), addTech())
                                }
                                placeholder="Add technology..."
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addTech}
                            >
                                Add
                            </Button>
                        </div>
                        {form.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {form.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-slate-800 text-cyan-400"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTech(tech)}
                                            className="hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Live URL"
                            name="liveUrl"
                            value={form.liveUrl}
                            onChange={handleChange}
                            placeholder="https://myproject.com"
                        />
                        <Input
                            label="Repository URL"
                            name="repoUrl"
                            value={form.repoUrl}
                            onChange={handleChange}
                            placeholder="https://github.com/..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            {editingId ? "Save Changes" : "Add Project"}
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
