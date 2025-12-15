"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, accessToken } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Basic check: if no token in store, we consider unauthenticated
        // In a real app we might validate the token with an API call here
        if (!isAuthenticated || !accessToken) {
            // preserve the intended destination
            const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
            router.replace(`/login?redirect=${returnUrl}`);
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, accessToken, router]);

    if (isChecking) {
        // Render a minimal loading state while checking auth
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
