"use client";

import Link from "next/link";
import { LogOut, User as UserIcon, Plus, Album } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { Profile } from "@/lib/types";
import { useAuthStore } from "@/store/use-auth-store";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // No-op or just remove the interval logic
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-xl tracking-tight">Rived</Link>
                    <nav className="hidden md:flex gap-4 text-sm font-medium">
                        <Link href="/" className="hover:text-primary transition-colors">Explore</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link href="/create">
                                <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                                    <Plus className="h-4 w-4" /> Create
                                </Button>
                            </Link>

                            <NotificationBell />

                            <DropdownMenu>
                                <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.avatar_url} alt={user?.username} />
                                        <AvatarFallback>{user?.username?.substring(0, 1).toUpperCase() || "U"}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user?.username}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <Link href="/profile/designs">
                                        <DropdownMenuItem>
                                            <Album className="mr-2 h-4 w-4" />
                                            <span>My Designs</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/profile/me">
                                        <DropdownMenuItem>
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
