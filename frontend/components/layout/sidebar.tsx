"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useProfileStore } from "@/lib/store";
import {
    Layers,
    LayoutDashboard,
    User,
    GraduationCap,
    Briefcase,
    Code,
    FolderKanban,
    Award,
    Sparkles,
    LogOut,
    Cloud,
    HardDrive,
    Menu,
    X,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/personal", icon: User, label: "Personal Info" },
    { href: "/dashboard/education", icon: GraduationCap, label: "Education" },
    { href: "/dashboard/experience", icon: Briefcase, label: "Experience" },
    { href: "/dashboard/skills", icon: Code, label: "Skills" },
    { href: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
    { href: "/dashboard/certifications", icon: Award, label: "Certifications" },
    { href: "/dashboard/generate", icon: Sparkles, label: "AI Generate" },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isGuest, logout } = useAuthStore();
    const { clearProfile } = useProfileStore();

    const handleLogout = () => {
        logout();
        clearProfile();
        router.push("/");
    };

    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                        onClick={handleNavClick}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            ProfileStack
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 mx-4 mt-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium shadow-lg shadow-blue-500/20">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                                {user?.name || "User"}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                {isGuest ? (
                                    <>
                                        <HardDrive className="w-3 h-3" />
                                        <span>Local Storage</span>
                                    </>
                                ) : (
                                    <>
                                        <Cloud className="w-3 h-3 text-cyan-400" />
                                        <span className="text-cyan-400">
                                            Cloud Synced
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleNavClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

// Mobile header with hamburger
export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 flex items-center px-4 z-30 lg:hidden">
            <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
                <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 ml-4">
                <Layers className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-bold text-white">
                    ProfileStack
                </span>
            </div>
        </header>
    );
}
