import Link from "next/link";
import { Navbar } from "@/components/main/navbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    );
}
