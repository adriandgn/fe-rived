"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, MessageSquare, Share2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/use-auth-store";
import { cn, getImageUrl } from "@/lib/utils";

import { apiClient } from "@/lib/api-client";
import { Design, Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CommentsSection } from "@/components/design/comments-section";
import { useViewTracker } from "@/hooks/use-view-tracker";
import { ImageGallery } from "@/components/design/image-gallery";
import { LikersDialog } from "@/components/design/likers-dialog";

async function fetchDesign(id: string) {
    const res = await apiClient.get<Design>(`/designs/${id}`);
    return res.data;
}

async function fetchProfile(userId: string) {
    const res = await apiClient.get<Profile>(`/profiles/${userId}/`); // Add trailing slash
    return res.data;
}

export default function DesignDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    // Track views with 2s delay
    useViewTracker(id as string | undefined);

    const { user, isAuthenticated } = useAuthStore();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const { data: design, isLoading, error } = useQuery({
        queryKey: ["design", id],
        queryFn: () => fetchDesign(id as string),
        enabled: !!id,
    });

    const { data: author, isError, error: authorError } = useQuery({
        queryKey: ["profile", design?.user_id],
        queryFn: () => fetchProfile(design!.user_id),
        enabled: !!design?.user_id,
        retry: false
    });

    useEffect(() => {
        if (design) {
            setIsLiked(design.stats?.is_liked_by_me || false);
            setLikesCount(design.stats?.likes || 0);
        }
    }, [design]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to like designs");
            return;
        }

        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev: number) => (newIsLiked ? prev + 1 : prev - 1));

        try {
            await apiClient.post(`/designs/${id}/like/`);
        } catch (error) {
            setIsLiked(!newIsLiked);
            setLikesCount((prev: number) => (newIsLiked ? prev - 1 : prev + 1));
            toast.error("Failed to update like");
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4 md:px-0 flex justify-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
            </div>
        );
    }

    if (error || !design) {
        return (
            <div className="container mx-auto py-10 px-4 flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">Design not found</h1>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleComment = () => {
        const section = document.getElementById('comments-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const displayAuthor = author || design.author;

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <Button variant="ghost" className="mb-6 -ml-4" onClick={() => router.push('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Feed
            </Button>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-4">
                    <ImageGallery images={design.images} title={design.title} />
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{design.title}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span>Posted {formatDistanceToNow(new Date(design.created_at), { addSuffix: true })}</span>
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{design.stats?.views || 0} views</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <Link href={`/designer/${displayAuthor?.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={displayAuthor?.avatar_url} />
                                <AvatarFallback>{displayAuthor?.username?.substring(0, 1).toUpperCase() || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold hover:underline decoration-primary">
                                    {displayAuthor?.full_name || displayAuthor?.username || "Unknown Creator"}
                                </p>
                                <p className="text-xs text-muted-foreground">{displayAuthor?.bio || "Creator"}</p>
                            </div>
                        </Link>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/designer/${displayAuthor?.username}`}>View Profile</Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            size="lg"
                            className={cn("flex-1 gap-2 transition-colors", isLiked && "text-red-500 hover:text-red-600")}
                            variant={isLiked ? "secondary" : "default"}
                            onClick={handleLike}
                        >
                            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                            {isLiked ? "Liked" : "Like"}
                        </Button>
                        <LikersDialog designId={id as string}>
                            <Button variant="ghost" className="hover:bg-transparent px-2">
                                <span className="underline cursor-pointer decoration-dotted underline-offset-4 text-muted-foreground hover:text-foreground">
                                    ({likesCount} likes)
                                </span>
                            </Button>
                        </LikersDialog>
                        <Button size="lg" variant="outline" className="flex-1 gap-2" onClick={handleComment}>
                            <MessageSquare className="h-5 w-5" /> Comment
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleShare}>
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {design.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Materials Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {design.materials.split(",").map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            <CommentsSection designId={id} />
        </div>
    );
}
