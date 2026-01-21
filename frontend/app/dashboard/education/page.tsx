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
import { Plus, GraduationCap, Calendar } from "lucide-react";
import type { Education } from "@/types";

const emptyEducation: Omit<Education, "id"> = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
};

export default function EducationPage() {
    const { isGuest, accessToken } = useAuthStore();
    const { profile, setProfile } = useProfileStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyEducation);
    const [isLoading, setIsLoading] = useState(false);

    const education = profile?.education || [];

    const openAddModal = () => {
        setForm(emptyEducation);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (edu: Education) => {
        setForm({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy || "",
            startDate: edu.startDate?.split("T")[0] || "",
            endDate: edu.endDate?.split("T")[0] || "",
            grade: edu.grade || "",
            description: edu.description || "",
        });
        setEditingId(edu.id);
        setIsModalOpen(true);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
                // Local storage update
                let newEducation: Education[];
                if (editingId) {
                    newEducation = education.map((e) =>
                        e.id === editingId ? { ...e, ...data } : e,
                    );
                } else {
                    newEducation = [
                        ...education,
                        { id: `local-${Date.now()}`, ...data } as Education,
                    ];
                }
                setProfile({ ...profile!, education: newEducation });
            } else {
                // API update
                api.setToken(accessToken);
                if (editingId) {
                    await api.updateEducation(editingId, data);
                } else {
                    await api.addEducation(data);
                }
                const res = await api.getProfile();
                setProfile(res.profile);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save education:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this education entry?"))
            return;

        try {
            if (isGuest) {
                setProfile({
                    ...profile!,
                    education: education.filter((e) => e.id !== id),
                });
            } else {
                api.setToken(accessToken);
                await api.deleteEducation(id);
                const res = await api.getProfile();
                setProfile(res.profile);
            }
        } catch (error) {
            console.error("Failed to delete education:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Education
                    </h1>
                    <p className="text-slate-400">
                        Add your educational background
                    </p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4" />
                    Add Education
                </Button>
            </div>

            {/* List */}
            {education.length === 0 ? (
                <EmptyState
                    icon={<GraduationCap className="w-8 h-8" />}
                    title="No education added"
                    description="Add your degrees, certifications, and courses to showcase your academic background."
                    action={
                        <Button onClick={openAddModal}>
                            <Plus className="w-4 h-4" />
                            Add Education
                        </Button>
                    }
                />
            ) : (
                <div className="space-y-4">
                    {education.map((edu) => (
                        <Card
                            key={edu.id}
                            onEdit={() => openEditModal(edu)}
                            onDelete={() => handleDelete(edu.id)}
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {edu.degree}
                            </h3>
                            <p className="text-cyan-400">{edu.institution}</p>
                            {edu.fieldOfStudy && (
                                <p className="text-slate-400 text-sm">
                                    {edu.fieldOfStudy}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                                <Calendar className="w-4 h-4" />
                                {edu.startDate?.split("T")[0]} –{" "}
                                {edu.endDate?.split("T")[0] || "Present"}
                                {edu.grade && (
                                    <span className="ml-4">
                                        Grade: {edu.grade}
                                    </span>
                                )}
                            </div>
                            {edu.description && (
                                <p className="text-slate-400 text-sm mt-2">
                                    {edu.description}
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
                title={editingId ? "Edit Education" : "Add Education"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Institution *"
                        name="institution"
                        value={form.institution}
                        onChange={handleChange}
                        placeholder="Harvard University"
                        required
                    />
                    <Input
                        label="Degree *"
                        name="degree"
                        value={form.degree}
                        onChange={handleChange}
                        placeholder="Bachelor of Science"
                        required
                    />
                    <Input
                        label="Field of Study"
                        name="fieldOfStudy"
                        value={form.fieldOfStudy}
                        onChange={handleChange}
                        placeholder="Computer Science"
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
                        />
                    </div>
                    <Input
                        label="Grade / GPA"
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        placeholder="3.8/4.0"
                    />
                    <Textarea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Activities, achievements, etc."
                    />
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            {editingId ? "Save Changes" : "Add Education"}
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
