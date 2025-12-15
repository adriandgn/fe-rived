import { LoginForm } from "@/components/auth/login-form";
import { Suspense } from "react";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-2 mb-4">
                <h1 className="text-3xl font-bold tracking-tighter">Rived</h1>
                <p className="text-muted-foreground">Upcycling Fashion Social Network</p>
            </div>
            <Suspense fallback={<div>Loading login...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
