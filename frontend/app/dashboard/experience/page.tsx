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
import { Plus, Briefcase, Calendar, MapPin } from "lucide-react";
import type { Experience } from "@/types";

const emptyExperience: Omit<Experience, "id"> = {
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
};

export default function ExperiencePage() {
    const { isGuest, accessToken } = useAuthStore();
    const { profile, setProfile } = useProfileStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyExperience);
    const [isLoading, setIsLoading] = useState(false);

    const experience = profile?.experience || [];

    const openAddModal = () => {
        setForm(emptyExperience);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (exp: Experience) => {
        setForm({
            company: exp.company,
            position: exp.position,
            location: exp.location || "",
            startDate: exp.startDate?.split("T")[0] || "",
            endDate: exp.endDate?.split("T")[0] || "",
            current: exp.current,
            description: exp.description || "",
        });
        setEditingId(exp.id);
        setIsModalOpen(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm({
                ...form,
                [name]: (e.target as HTMLInputElement).checked,
            });
        } else {
            setForm({ ...form, [name]: value });
        }
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
                endDate: form.current
                    ? undefined
                    : form.endDate
                      ? new Date(form.endDate).toISOString()
                      : undefined,
            };

            if (isGuest) {
                let newExperience: Experience[];
                if (editingId) {
                    newExperience = experience.map((e) =>
                        e.id === editingId ? { ...e, ...data } : e,
                    );
                } else {
                    newExperience = [
                        ...experience,
                        { id: `local-${Date.now()}`, ...data } as Experience,
                    ];
                }
                setProfile({ ...profile!, experience: newExperience });
            } else {
                api.setToken(accessToken);
                if (editingId) {
                    await api.updateExperience(editingId, data);
                } else {
                    await api.addExperience(data);
                }
                const res = await api.getProfile();
                setProfile(res.profile);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save experience:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this experience?"))
            return;

        try {
            if (isGuest) {
                setProfile({
                    ...profile!,
                    experience: experience.filter((e) => e.id !== id),
                });
            } else {
                api.setToken(accessToken);
                await api.deleteExperience(id);
                const res = await api.getProfile();
                setProfile(res.profile);
            }
        } catch (error) {
            console.error("Failed to delete experience:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Experience
                    </h1>
                    <p className="text-slate-400">Add your work experience</p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4" />
                    Add Experience
                </Button>
            </div>

            {/* List */}
            {experience.length === 0 ? (
                <EmptyState
                    icon={<Briefcase className="w-8 h-8" />}
                    title="No experience added"
                    description="Add your work history, internships, and freelance projects."
                    action={
                        <Button onClick={openAddModal}>
                            <Plus className="w-4 h-4" />
                            Add Experience
                        </Button>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {experience.map((exp) => (
                        <Card
                            key={exp.id}
                            onEdit={() => openEditModal(exp)}
                            onDelete={() => handleDelete(exp.id)}
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {exp.position}
                            </h3>
                            <p className="text-cyan-400">{exp.company}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {exp.startDate?.split("T")[0]} –{" "}
                                    {exp.current
                                        ? "Present"
                                        : exp.endDate?.split("T")[0]}
                                </span>
                                {exp.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {exp.location}
                                    </span>
                                )}
                            </div>
                            {exp.description && (
                                <p className="text-slate-400 text-sm mt-2">
                                    {exp.description}
                                </p>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Experience" : "Add Experience"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Company *"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Google"
                        required
                    />
                    <Input
                        label="Position *"
                        name="position"
                        value={form.position}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                        required
                    />
                    <Input
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Mountain View, CA"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={handleChange}
                        />
                        <Input
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={form.endDate}
                            onChange={handleChange}
                            disabled={form.current}
                        />
                    </div>
                    <label className="flex items-center gap-2 text-slate-300">
                        <input
                            type="checkbox"
                            name="current"
                            checked={form.current}
                            onChange={handleChange}
                            className="w-4 h-4 rounded bg-slate-800 border-slate-700"
                        />
                        I currently work here
                    </label>
                    <Textarea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your responsibilities and achievements..."
                    />
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            {editingId ? "Save Changes" : "Add Experience"}
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
