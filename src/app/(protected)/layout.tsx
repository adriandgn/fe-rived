import { AuthGuard } from "@/components/auth/auth-guard";
import { Navbar } from "@/components/main/navbar";
import { Suspense } from "react";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
            <AuthGuard>
                <div className="min-h-screen bg-background">
                    {/* Navbar would go here */}
                    <Navbar />
                    <main className="container mx-auto px-4 pb-8">
                        {children}
                    </main>
                </div>
            </AuthGuard>
        </Suspense>
    );
}
