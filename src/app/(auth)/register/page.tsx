import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-2 mb-4">
                <h1 className="text-3xl font-bold tracking-tighter">Join Rived</h1>
                <p className="text-muted-foreground">Start your upcycling journey today</p>
            </div>
            <RegisterForm />
            <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                    Login here
                </Link>
            </div>
        </div>
    );
}
