"use client";

import { useState, useEffect } from "react";
import { useAuthStore, useProfileStore } from "@/lib/store";
import { api } from "@/lib/api";
import { Input, Textarea, Button } from "@/components/ui";
import {
    Save,
    User,
    MapPin,
    Phone,
    Mail,
    Linkedin,
    Github,
    Globe,
} from "lucide-react";

export default function PersonalPage() {
    const { isGuest, accessToken } = useAuthStore();
    const { profile, updateProfile } = useProfileStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        linkedIn: "",
        github: "",
        portfolio: "",
    });

    useEffect(() => {
        if (profile) {
            setForm({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                phone: profile.phone || "",
                location: profile.location || "",
                bio: profile.bio || "",
                linkedIn: profile.linkedIn || "",
                github: profile.github || "",
                portfolio: profile.portfolio || "",
            });
        }
    }, [profile]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setIsSaved(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isGuest) {
                // Update local store only
                updateProfile(form);
            } else {
                // Update via API
                api.setToken(accessToken);
                await api.updateProfile(form);
                updateProfile(form);
            }
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Personal Information
                </h1>
                <p className="text-slate-400">
                    Update your basic details and social links
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-4 top-10 w-5 h-5 text-slate-500" />
                        <Input
                            label="First Name"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className="pl-12"
                        />
                    </div>
                    <Input
                        label="Last Name"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                    />
                </div>

                {/* Contact */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-10 w-5 h-5 text-slate-500" />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="pl-12"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-4 top-10 w-5 h-5 text-slate-500" />
                        <Input
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+1 234 567 8900"
                            className="pl-12"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="relative">
                    <MapPin className="absolute left-4 top-10 w-5 h-5 text-slate-500" />
                    <Input
                        label="Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="San Francisco, CA"
                        className="pl-12"
                    />
                </div>

                {/* Bio */}
                <Textarea
                    label="Bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                />

                {/* Social Links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">
                        Social Links
                    </h3>

                    <div className="relative">
                        <Linkedin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <Input
                            name="linkedIn"
                            value={form.linkedIn}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                            className="pl-12"
                        />
                    </div>

                    <div className="relative">
                        <Github className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <Input
                            name="github"
                            value={form.github}
                            onChange={handleChange}
                            placeholder="https://github.com/username"
                            className="pl-12"
                        />
                    </div>

                    <div className="relative">
                        <Globe className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                        <Input
                            name="portfolio"
                            value={form.portfolio}
                            onChange={handleChange}
                            placeholder="https://yourportfolio.com"
                            className="pl-12"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <Button type="submit" isLoading={isLoading}>
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                    {isSaved && (
                        <span className="text-green-400 text-sm">
                            ✓ Saved successfully
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
}
