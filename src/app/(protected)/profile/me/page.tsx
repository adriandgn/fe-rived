"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AvatarManager } from "@/components/profile/avatar-manager";
import { ProfileForm } from "@/components/profile/profile-form";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
    const { user, logout, updateUser } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                <p>Unable to load user profile.</p>
                <Button variant="destructive" onClick={handleLogout}>
                    Reset Session
                </Button>
            </div>
        );
    }

    // Cast user to Profile for components, assuming they are compatible enough
    // Ideally we should use a proper adapter, but for now direct passing works
    // as Profile is a subset of User for display purposes, and we updated Profile type
    const profileUser = user as unknown as import("@/lib/types").Profile;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your public profile and account settings.
                    </p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                    Log out
                </Button>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Left Column: Avatar */}
                <div className="md:col-span-4 lg:col-span-3">
                    <AvatarManager
                        user={profileUser}
                        onUpdate={(updated) => updateUser(updated as any)}
                    />
                </div>

                {/* Right Column: Profile Form */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    <div>
                        <h2 className="text-lg font-medium">Public Profile</h2>
                        <p className="text-sm text-muted-foreground">
                            This information will be displayed publicly.
                        </p>
                    </div>
                    <Separator />

                    <ProfileForm
                        user={profileUser}
                        onUpdate={(updated) => updateUser(updated as any)}
                    />
                </div>
            </div>
        </div>
    );
}
