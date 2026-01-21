"use client";

import { useState } from "react";
import { useAuthStore, useProfileStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Modal, Input, Button, Card, EmptyState } from "@/components/ui";
import { Plus, Award, Calendar, ExternalLink } from "lucide-react";
import type { Certification } from "@/types";

const emptyCertification: Omit<Certification, "id"> = {
    name: "",
    issuingOrg: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    credentialUrl: "",
};

export default function CertificationsPage() {
    const { isGuest, accessToken } = useAuthStore();
    const { profile, setProfile } = useProfileStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyCertification);
    const [isLoading, setIsLoading] = useState(false);

    const certifications = profile?.certifications || [];

    const openAddModal = () => {
        setForm(emptyCertification);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (cert: Certification) => {
        setForm({
            name: cert.name,
            issuingOrg: cert.issuingOrg,
            issueDate: cert.issueDate?.split("T")[0] || "",
            expiryDate: cert.expiryDate?.split("T")[0] || "",
            credentialId: cert.credentialId || "",
            credentialUrl: cert.credentialUrl || "",
        });
        setEditingId(cert.id);
        setIsModalOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                ...form,
                issueDate: form.issueDate
                    ? new Date(form.issueDate).toISOString()
                    : undefined,
                expiryDate: form.expiryDate
                    ? new Date(form.expiryDate).toISOString()
                    : undefined,
            };

            if (isGuest) {
                let newCertifications: Certification[];
                if (editingId) {
                    newCertifications = certifications.map((c) =>
                        c.id === editingId ? { ...c, ...data } : c,
                    );
                } else {
                    newCertifications = [
                        ...certifications,
                        { id: `local-${Date.now()}`, ...data } as Certification,
                    ];
                }
                setProfile({ ...profile!, certifications: newCertifications });
            } else {
                api.setToken(accessToken);
                await api.addCertification(data);
                const res = await api.getProfile();
                setProfile(res.profile);
            }

            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save certification:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certification?"))
            return;

        try {
            if (isGuest) {
                setProfile({
                    ...profile!,
                    certifications: certifications.filter((c) => c.id !== id),
                });
            } else {
                api.setToken(accessToken);
                // Placeholder - needs proper API
            }
        } catch (error) {
            console.error("Failed to delete certification:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Certifications
                    </h1>
                    <p className="text-slate-400">
                        Add your professional certifications and credentials
                    </p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="w-4 h-4" />
                    Add Certification
                </Button>
            </div>

            {/* List */}
            {certifications.length === 0 ? (
                <EmptyState
                    icon={<Award className="w-8 h-8" />}
                    title="No certifications added"
                    description="Add your professional certifications, licenses, and credentials."
                    action={
                        <Button onClick={openAddModal}>
                            <Plus className="w-4 h-4" />
                            Add Certification
                        </Button>
                    }
                />
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {certifications.map((cert) => (
                        <Card
                            key={cert.id}
                            onEdit={() => openEditModal(cert)}
                            onDelete={() => handleDelete(cert.id)}
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {cert.name}
                            </h3>
                            <p className="text-cyan-400">{cert.issuingOrg}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 text-sm">
                                {cert.issueDate && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Issued: {cert.issueDate.split("T")[0]}
                                    </span>
                                )}
                                {cert.credentialId && (
                                    <span>ID: {cert.credentialId}</span>
                                )}
                            </div>
                            {cert.credentialUrl && (
                                <a
                                    href={cert.credentialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-blue-400 hover:underline mt-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View Credential
                                </a>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? "Edit Certification" : "Add Certification"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Certification Name *"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="AWS Solutions Architect"
                        required
                    />
                    <Input
                        label="Issuing Organization *"
                        name="issuingOrg"
                        value={form.issuingOrg}
                        onChange={handleChange}
                        placeholder="Amazon Web Services"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Issue Date"
                            name="issueDate"
                            type="date"
                            value={form.issueDate}
                            onChange={handleChange}
                        />
                        <Input
                            label="Expiry Date"
                            name="expiryDate"
                            type="date"
                            value={form.expiryDate}
                            onChange={handleChange}
                        />
                    </div>
                    <Input
                        label="Credential ID"
                        name="credentialId"
                        value={form.credentialId}
                        onChange={handleChange}
                        placeholder="ABC123XYZ"
                    />
                    <Input
                        label="Credential URL"
                        name="credentialUrl"
                        value={form.credentialUrl}
                        onChange={handleChange}
                        placeholder="https://verify.credential.com/..."
                    />
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            {editingId ? "Save Changes" : "Add Certification"}
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
