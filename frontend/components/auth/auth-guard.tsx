"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for hydration
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const publicPaths = ["/", "/login"];
        const isPublicPath = publicPaths.includes(pathname);

        if (!isAuthenticated && !isPublicPath) {
            router.push("/");
        }

        if (isAuthenticated && isPublicPath) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, pathname, router, isReady]);

    if (!isReady) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
