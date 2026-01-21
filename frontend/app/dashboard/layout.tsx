import { DashboardLayout } from "@/components/layout";
import { AuthGuard } from "@/components/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
    );
}
