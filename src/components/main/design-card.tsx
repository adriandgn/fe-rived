"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";
import { Design, Profile } from "@/lib/types";
import { cn, getImageUrl } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/use-auth-store";

interface DesignCardProps {
    design: Design;
}

async function fetchProfile(userId: string) {
    const res = await apiClient.get<Profile>(`/profiles/${userId}/`);
    return res.data;
}

export function DesignCard({ design }: DesignCardProps) {
    const { isAuthenticated } = useAuthStore();
    const [isLiked, setIsLiked] = useState(design.stats?.is_liked_by_me || false);
    const [likesCount, setLikesCount] = useState(design.stats?.likes || 0);

    const { data: author } = useQuery({
        queryKey: ["profile", design.user_id],
        queryFn: () => fetchProfile(design.user_id),
        enabled: !!design.user_id,
        staleTime: 60000 * 5, // Cache for 5 min to avoid hammer
        retry: false
    });

    const primaryImage = design.images.find(img => img.is_primary) || design.images[0];
    const displayAuthor = author || design.author;

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to like designs");
            return;
        }

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            // API Contract specifies POST for toggle like.
            await apiClient.post(`/designs/${design.id}/like`);
        } catch (error) {
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikesCount(prev => newIsLiked ? prev - 1 : prev + 1);
            toast.error("Failed to update like");
        }
    };

    return (
        <Link href={`/design/${design.id}`}>
            <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300 break-inside-avoid mb-4">
                <div className="relative aspect-auto w-full">
                    {primaryImage ? (
                        <Image
                            src={getImageUrl(primaryImage.url)}
                            alt={design.title}
                            width={500}
                            height={500} // Aspect ratio handled by Masonry usually, but width/height needed for NextImage. 
                            // Ideally we use a wrapper with styling or known aspect ratio.
                            className="w-full h-auto object-cover"
                        />
                    ) : (
                        <div className="w-full h-64 bg-muted flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full bg-white/80 hover:bg-white"
                            onClick={handleLike}
                        >
                            <Heart className={cn("h-5 w-5", isLiked ? "fill-red-500 text-red-500" : "text-gray-700")} />
                        </Button>
                    </div>
                </div>

                <CardHeader className="p-3">
                    <h3 className="font-semibold text-sm leading-tight truncate">{design.title}</h3>
                </CardHeader>

                <CardFooter className="p-3 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={displayAuthor?.avatar_url} />
                            <AvatarFallback>{displayAuthor?.username?.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[80px]">{displayAuthor?.username || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{design.stats?.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{likesCount}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
