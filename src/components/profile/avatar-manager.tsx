"use client";

import { useState, useRef } from "react";
import { Camera, Trash2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/use-auth-store";

interface AvatarManagerProps {
    user: Profile; // Or User form auth store, but Profile has all fields
    onUpdate: (updatedProfile: Profile) => void;
}

export function AvatarManager({ user, onUpdate }: AvatarManagerProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { updateUser } = useAuthStore(); // OPTIONAL: Sync global state if needed

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await apiClient.post<Profile>("/profiles/me/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Avatar updated");
            onUpdate(res.data);
            // Cast to User since we know its our own profile with extended details
            updateUser(res.data as unknown as import("@/lib/types").User);
        } catch (error) {
            console.error("Avatar upload failed:", error);
            toast.error("Failed to upload avatar");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to remove your profile picture?")) return;

        setIsUploading(true);
        try {
            await apiClient.delete("/profiles/me/avatar");
            toast.success("Avatar removed");

            // Optimistically update or refetch. 
            // Since DELETE returns 204, we manually clear the avatar in the local state object
            const updated = { ...user, avatar_url: undefined };
            onUpdate(updated as Profile);
        } catch (error) {
            console.error("Avatar delete failed:", error);
            toast.error("Failed to remove avatar");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6 border rounded-xl bg-card">
            <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                    <AvatarImage src={user.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-muted">
                        {user.username?.substring(0, 1).toUpperCase() || "?"}
                    </AvatarFallback>
                </Avatar>

                {/* Overlay loading state */}
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-20">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center gap-2">
                <h3 className="font-semibold text-lg">Profile Picture</h3>
                <p className="text-sm text-muted-foreground text-center max-w-[200px]">
                    JPG, PNG or GIF no larger than 5MB.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={handleFileSelect}
                />

                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="gap-2"
                >
                    <Upload className="h-4 w-4" />
                    Upload New
                </Button>

                {user.avatar_url && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        disabled={isUploading}
                        className="text-muted-foreground hover:text-destructive"
                        title="Remove photo"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
