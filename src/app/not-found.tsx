import Link from "next/link";
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
            <Ghost className="h-24 w-24 text-muted-foreground mb-6 opacity-20" />
            <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
            <h2 className="text-xl font-semibold text-muted-foreground mb-8">Page Not Found</h2>
            <p className="max-w-md text-muted-foreground mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/">
                <Button size="lg">Return Home</Button>
            </Link>
        </div>
    );
}
