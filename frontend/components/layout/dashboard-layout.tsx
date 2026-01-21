"use client";

import { ReactNode, useState } from "react";
import { Sidebar, MobileHeader } from "./sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

            {/* Main content */}
            <main className="lg:ml-64 min-h-screen p-4 lg:p-8 pt-20 lg:pt-8">
                {children}
            </main>
        </div>
    );
}
