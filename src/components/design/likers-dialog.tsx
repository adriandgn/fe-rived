"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Profile } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LikersDialogProps {
    designId: string;
    children: React.ReactNode;
}

async function fetchLikers(designId: string) {
    const res = await apiClient.get<Profile[]>(`/designs/${designId}/likes`);
    return res.data;
}

import { useState } from "react";
// ... existing imports

export function LikersDialog({ designId, children }: LikersDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const { data: likers, isLoading } = useQuery({
        queryKey: ["likers", designId],
        queryFn: () => fetchLikers(designId),
        enabled: isOpen,
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Likes</DialogTitle>
                    <DialogDescription>
                        List of users who liked this design.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[300px] w-full rounded-md p-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                </div>
                            ))}
                        </div>
                    ) : likers && likers.length > 0 ? (
                        <div className="space-y-4">
                            {likers.map((liker) => (
                                <div key={liker.id} className="flex items-center justify-between">
                                    <Link href={`/designer/${liker.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full">
                                        <Avatar>
                                            <AvatarImage src={liker.avatar_url} />
                                            <AvatarFallback>{liker.username.substring(0, 1).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{liker.full_name || liker.username}</span>
                                            <span className="text-xs text-muted-foreground">@{liker.username}</span>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            No likes yet. Be the first!
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
